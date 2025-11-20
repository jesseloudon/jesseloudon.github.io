---
title: "Palo Alto Cloud NGFW SCM Deployment with Terraform"
excerpt: ""
header:
  og_image: /assets/images/pacloudngfw.png
  teaser: /assets/images/pacloudngfw.png
date: "2025-11-20"
categories:
  - "cloud"
tags:
  - "palo alto"
  - "cloud ngfw"
  - "strata cloud manager"
  - "terraform"
  - "azapi"
---

Hey folks in this blog post I'm going to cover how you can easily deploy the Palo Alto Cloud Next-Generation Firewall (NGFW) with Strata Cloud Manager integration using Terraform.

This blog will cover the IaC side of things and to keep this short and sweet I'm assuming you already have working knowledge of how to deploy your IaC via CICD workflows/pipelines.

Be sure to also checkout the [Palo Alto documentation on Cloud NGFW](https://docs.paloaltonetworks.com/cloud-ngfw-azure/getting-started/introducing-cloud-ngfw-for-azure) to fill in any gaps for the overall deployment prerequisities and configuration. One thing that caught me out early on was onboarding the Azure Tenant to the Strata Cloud Manager account and ensuring the required Azure resource providers were registered on the target subscription.

## Provider Config

These are the providers I pinned to for my Palo Alto deployment. Note that I am using AzAPI provider because at the time of writing AzureRM did not have a resource covering my usecase to deploy a Palo Alto NGFW with Strata Cloud Manager (SCM) integration.

```terraform
terraform {
  required_version = ">= 1.3"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = ">= 4.39.0"
    }
    azapi = {
      source  = "Azure/azapi"
      version = ">= 2.4"
    }
  }
}
```

## AzureRM Resources

Here I'm creating the Palo Alto virtual network appliance which I'm associating to my virtual WAN hub ID.

There's also 2 separate baseline public IPs resources to cover the Egress NAT traffic and standard traffic. Additional public IPs can be easily created by incrementing the related count variable value.

Finally there's a user assigned managed identity which is required by the Palo Alto NGFW as it didn't support a system managed identity.

```terraform
data "azurerm_client_config" "current" {}

resource "azurerm_palo_alto_virtual_network_appliance" "this" {
  name           = var.appliance_name
  virtual_hub_id = var.virtual_hub_id
}

resource "azurerm_public_ip" "egress_nat" {
  for_each            = { for i in range(var.egress_nat_ip_address_count) : i => i }
  name                = "${var.firewall_name}-egress-nat-pip-${each.key}"
  location            = var.location
  resource_group_name = var.resource_group_name
  sku                 = "Standard"
  allocation_method   = "Static"
  tags                = var.tags
}

resource "azurerm_public_ip" "this" {
  for_each            = { for i in range(var.public_ip_address_count) : i => i }
  name                = "${var.firewall_name}-pip-${each.key}"
  location            = var.location
  resource_group_name = var.resource_group_name
  sku                 = "Standard"
  allocation_method   = "Static"
  tags                = var.tags
}

resource "azurerm_user_assigned_identity" "this" {
  name                = "${var.firewall_name}-uami"
  location            = var.location
  resource_group_name = var.resource_group_name
  tags                = var.tags
}
```

## AzAPI Resources

The AzAPI resource here is fairly simple:

- set the parent_id to the RG
- pass through the user assiged identity ID
- configure the FW to use Strata Cloud Manager or Panorama based on a variable value (var.cloud_managed_type)
- pass through the Strata Cloud Manager config or Panorama config based on a variable value (var.cloud_managed_type)
- for each on the public IPs based on the count
- link the FW to the network virtual appliance and VWAN Hub

```terraform
resource "azapi_resource" "this" {
  type      = "PaloAltoNetworks.Cloudngfw/firewalls@2025-05-23"
  name      = var.firewall_name
  parent_id = "/subscriptions/${data.azurerm_client_config.current.subscription_id}/resourceGroups/${var.resource_group_name}"
  location  = var.location
  tags      = var.tags
  identity {
    type         = "UserAssigned" # Only user assigned identity is supported at this time
    identity_ids = [azurerm_user_assigned_identity.this.id]
  }
  body = {
    properties = {
      dnsSettings = {
        dnsServers = [
          for dns_server in var.dns_settings.dns_servers : {
            address    = dns_server.address
            resourceId = dns_server.resourceId
          }
        ]
        enabledDnsType = var.dns_settings.enabled_dns_type
        enableDnsProxy = var.dns_settings.enable_dns_proxy
      }
      isStrataCloudManaged = var.cloud_managed_type == "Strata" ? true : false
      isPanoramaManaged    = var.cloud_managed_type == "Panorama" ? true : false
      networkProfile = {
        egressNatIp = [
          for i in range(var.egress_nat_ip_address_count) : {
            address    = azurerm_public_ip.egress_nat[i].ip_address
            resourceId = azurerm_public_ip.egress_nat[i].id
          }
        ]
        enableEgressNat = var.enable_egress_nat
        networkType     = var.network_type
        publicIps = [
          for i in range(var.public_ip_address_count) : {
            address    = azurerm_public_ip.this[i].ip_address
            resourceId = azurerm_public_ip.this[i].id
          }
        ]
        trustedRanges = var.trusted_ranges
        vwanConfiguration = {
          networkVirtualApplianceId = azurerm_palo_alto_virtual_network_appliance.this.id
          vHub = {
            resourceId = var.virtual_hub_id
          }
        }
      }
      panoramaConfig = {
        configString = var.cloud_managed_type == "Panorama" ? var.panorama_config_string : ""
      }
      strataCloudManagerConfig = {
        cloudManagerName = var.cloud_managed_type == "Strata" ? var.strata_cloud_manager_name : ""
      }
      marketplaceDetails = {
        offerId     = var.marketplace_details.offer_id
        publisherId = var.marketplace_details.publisher_id
      }
      planData = {
        billingCycle = var.plan_data.billing_cycle
        planId       = var.plan_data.plan_id
      }
    }
  }
  depends_on = [azurerm_user_assigned_identity.this, azurerm_palo_alto_virtual_network_appliance.this, azurerm_public_ip.egress_nat, azurerm_public_ip.this]
}
```

## Variables

These variables below complete the full IaC codebase for the Palo Alto Cloud NGFW deployment and I used them to ensure the module for the deployment was repeatable and as generic as possible.

```terraform
variable "resource_group_name" {
  type        = string
  description = "The name of the Resource Group where the Palo Alto Cloud NGFW Firewall will be deployed."
}

variable "appliance_name" {
  type        = string
  description = "The name which should be used for this Palo Alto Local Network Virtual Appliance. Changing this forces a new Palo Alto Local Network Virtual Appliance to be created."
}

variable "virtual_hub_id" {
  type        = string
  description = "The ID of the Virtual Hub to deploy this appliance onto. Changing this forces a new Palo Alto Local Network Virtual Appliance to be created."
}

variable "firewall_name" {
  type        = string
  description = "The name of the Palo Alto Cloud NGFW Firewall."
}

variable "location" {
  type        = string
  description = "The Azure region where the Palo Alto Cloud NGFW Firewall will be deployed."
}

variable "tags" {
  type        = map(string)
  description = "A map of tags to assign to the Palo Alto Cloud NGFW Firewall."
  default     = {}
}

variable "network_type" {
  type = string
  description = "The type of network to deploy the Palo Alto Cloud NGFW Firewall onto. Allowed values: 'VWAN' or 'VNET'. Defaults to VWAN."
  default     = "VWAN"
  validation {
    condition     = contains(["VWAN", "VNET"], var.network_type)
    error_message = "network_type must be either 'VWAN' or 'VNET'."
  }
}

variable "enable_egress_nat" {
  type = string
  description = "Enable Egress NAT for the Palo Alto Cloud NGFW Firewall. Allowed values: 'ENABLED' or 'DISABLED'. Defaults to 'ENABLED'."
  default     = "ENABLED"
  validation {
    condition     = contains(["ENABLED", "DISABLED"], var.enable_egress_nat)
    error_message = "enable_egress_nat must be either 'ENABLED' or 'DISABLED'."
  }
}

variable "egress_nat_ip_address_count" {
  type        = number
  description = "The number of Egress NAT IP addresses to allocate for the firewall."
  default     = 1
}

variable "public_ip_address_count" {
  type        = number
  description = "The number of Public IP addresses to allocate for the firewall."
  default     = 1
}

variable "dns_settings" {
  type = object({
    dns_servers = list(object({
      address    = string
      resourceId = string
    }))
    enabled_dns_type = string
    enable_dns_proxy = string
  })
  description = "DNS settings for the Palo Alto Cloud NGFW Firewall."
}

variable "trusted_ranges" {
  type        = list(string)
  description = "List of NON-RFC 1918 trusted ranges for the Palo Alto Cloud NGFW Firewall."
}

variable "cloud_managed_type" {
  type = string
  description = "Is this appliance managed by Panorama or Strata Cloud Manager? Allowed values: 'Panorama' or 'Strata'."
  validation {
    condition     = contains(["Panorama", "Strata"], var.cloud_managed_type)
    error_message = "cloud_managed_type must be either 'Panorama' or 'Strata'."
  }
}

variable "panorama_config_string" {
  type        = string
  description = "Base64 encoded string representing Panorama parameters to be used by Firewall to connect to Panorama. This string is generated via azure plugin in Panorama"
  default     = ""
}

variable "strata_cloud_manager_name" {
  type        = string
  description = "The name of the Strata Cloud Manager which is intended to manage the policy for this firewall."
  default     = ""
}

variable "marketplace_details" {
  type = object({
    offer_id     = string
    publisher_id = string
  })
  description = "Marketplace details for the Palo Alto Cloud NGFW Firewall."
}

variable "plan_data" {
  type = object({
    billing_cycle = string
    plan_id       = string
  })
  description = "Plan data for the Palo Alto Cloud NGFW Firewall."
}
```

I hope you enjoyed reading, looking forward to your thoughts below.

Cheers,
Jesse
