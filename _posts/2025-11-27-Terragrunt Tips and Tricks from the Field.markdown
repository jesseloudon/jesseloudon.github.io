---
title: "Terragrunt Tips and Tricks From The Field"
excerpt: "Discover three distinct Terragrunt file patterns for managing your Terraform at scale."
header:
    og_image: /assets/images/terragrunt.png
    teaser: /assets/images/terragrunt.png
date: "2025-11-27"
categories: 
- "cloud"
tags: 
- "terragrunt"
- "terraform"
- "infrastructure as code"
---
Hey folks in this blog post I'll be describing three distinct Terragrunt file patterns for orchestrating your Terraform codebase at scale. These Terragrunt tips and tricks will help you through tricky situations should your Terraform inputs rise in complexity and scale.

> Terragrunt is an orchestrator for Terraform/OpenTofu and is designed for scalable deployments across multiple environments (e.g. DEV, TEST, UAT, PROD)

The three patterns we'll explore:

| Pattern | When You Need It |
|---------|------------------|
| **Simple Input Mapping** |  Multi-team configuration with simple data |
| **TFVars Generation for Large Datasets** |  Large datasets hitting CLI argument limits |
| **Advanced Input Aggregation** |  Multi-service architectures with varying schemas |

## Pattern 1: Simple Input Mapping

**Example scenario**: You're managing platform resources across multiple business units, and each team wants to maintain their own configuration without stepping on each other's toes.

This is the pattern I typically recommend when you're starting your [Terragrunt](https://terragrunt.gruntwork.io/docs/getting-started/quick-start/) journey or when you have simple data that needs to be aggregated from multiple sources.

The traditional approach would be one massive configuration file that becomes a bottleneck for changes. Not ideal!

Here's how the simple input mapping pattern might solve this problem. This approach allows different teams to maintain their own configuration files independently. Each business unit can modify their settings without creating merge conflicts or requiring coordination with other teams.

> For context I used this pattern to manage GitHub repositories and teams across 9 business units with approximately 150+ repositories and 50+ teams.

First we define each source environment file separately to pull in all HCL data from them into our Terragrunt deployment.

```hcl
locals {
  # Read each file separately
  business_unit1_env = read_terragrunt_config("business-unit1-env.hcl")
  business_unit2_env = read_terragrunt_config("business-unit2-env.hcl")
  business_unit3_env = read_terragrunt_config("business-unit3-env.hcl")
  business_unit4_env = read_terragrunt_config("business-unit4-env.hcl")
  business_unit5_env = read_terragrunt_config("business-unit5-env.hcl")
  business_unit6_env = read_terragrunt_config("business-unit6-env.hcl")
  business_unit7_env = read_terragrunt_config("business-unit7-env.hcl")
  business_unit8_env = read_terragrunt_config("business-unit8-env.hcl")
  business_unit9_env = read_terragrunt_config("business-unit9-env.hcl")
}
```

> [`read_terragrunt_config()`](https://terragrunt.gruntwork.io/docs/reference/built-in-functions/#read_terragrunt_config) as shown above allows each team to manage their own config file. The Business Unit 2 team might manage `business-unit2-env.hcl` without affecting other team configurations.

Here's where we combine the data from the multiple sources above while handling missing or malformed files gracefully. The [`concat()`](https://developer.hashicorp.com/terraform/language/functions/concat) function safely combines lists from multiple sources. The [`try()`](https://developer.hashicorp.com/terraform/language/functions/try) function here can be essential for handling missing config files that might cause deployment failures.

```hcl
# Concatenate the lists from all files into the single variable
repositories = concat( #concat used for combining lists/arrays. Use merge for combining maps/objects.
  try(local.business_unit1_env.locals.repositories, []),
  try(local.business_unit2_env.locals.repositories, []),
  try(local.business_unit3_env.locals.repositories, []),
  try(local.business_unit4_env.locals.repositories, []),
  try(local.business_unit5_env.locals.repositories, []),
  try(local.business_unit6_env.locals.repositories, []),
  try(local.business_unit7_env.locals.repositories, []),
  try(local.business_unit8_env.locals.repositories, []),
  try(local.business_unit9_env.locals.repositories, [])
)

# Concatenate the lists from all files into the single variable
teams = concat( #concat used for combining lists/arrays. Use merge for combining maps/objects.
  try(local.business_unit1_env.locals.teams, []),
  try(local.business_unit2_env.locals.teams, []),
  try(local.business_unit3_env.locals.teams, []),
  try(local.business_unit4_env.locals.teams, []),
  try(local.business_unit5_env.locals.teams, []),
  try(local.business_unit6_env.locals.teams, []),
  try(local.business_unit7_env.locals.teams, []),
  try(local.business_unit8_env.locals.teams, []),
  try(local.business_unit9_env.locals.teams, [])
)
```

The final step is straightforward - we pass our aggregated and processed data as inputs to the Terraform module. This keeps the interface clean and predictable.

```hcl
inputs = {
  # Map module variables to local variables
  repositories = local.repositories
  teams        = local.teams
}
```

### Pattern 1: Complete Example

```hcl
# terragrunt.hcl - GitHub Platform Onboarding
# Pattern 1: Simple Input Mapping

# Include the root configuration
include {
  path = find_in_parent_folders("root-terragrunt.hcl")
}

# Set Terraform stack source location
terraform {
  source = "${get_repo_root()}/stacks/onboarding"
}

locals {
  # Read each file separately
  business_unit1_env = read_terragrunt_config("business-unit1-env.hcl")
  business_unit2_env = read_terragrunt_config("business-unit2-env.hcl")
  business_unit3_env = read_terragrunt_config("business-unit3-env.hcl")
  business_unit4_env = read_terragrunt_config("business-unit4-env.hcl")
  business_unit5_env = read_terragrunt_config("business-unit5-env.hcl")
  business_unit6_env = read_terragrunt_config("business-unit6-env.hcl")
  business_unit7_env = read_terragrunt_config("business-unit7-env.hcl")
  business_unit8_env = read_terragrunt_config("business-unit8-env.hcl")
  business_unit9_env = read_terragrunt_config("business-unit9-env.hcl")

  # Concatenate the lists from all files into the single variable
  repositories = concat( #concat used for combining lists/arrays. Use merge for combining maps/objects.
    try(local.business_unit1_env.locals.repositories, []),
    try(local.business_unit2_env.locals.repositories, []),
    try(local.business_unit3_env.locals.repositories, []),
    try(local.business_unit4_env.locals.repositories, []),
    try(local.business_unit5_env.locals.repositories, []),
    try(local.business_unit6_env.locals.repositories, []),
    try(local.business_unit7_env.locals.repositories, []),
    try(local.business_unit8_env.locals.repositories, []),
    try(local.business_unit9_env.locals.repositories, [])
  )

  # Concatenate the lists from all files into the single variable
  teams = concat( #concat used for combining lists/arrays. Use merge for combining maps/objects.
    try(local.business_unit1_env.locals.teams, []),
    try(local.business_unit2_env.locals.teams, []),
    try(local.business_unit3_env.locals.teams, []),
    try(local.business_unit4_env.locals.teams, []),
    try(local.business_unit5_env.locals.teams, []),
    try(local.business_unit6_env.locals.teams, []),
    try(local.business_unit7_env.locals.teams, []),
    try(local.business_unit8_env.locals.teams, []),
    try(local.business_unit9_env.locals.teams, [])
  )
}

inputs = {
  # Map module variables to local variables
  repositories = local.repositories
  teams        = local.teams
}

remote_state {
  backend = "azurerm"
  generate = {
    path      = "_backend.tf"
    if_exists = "overwrite_terragrunt"
  }
  config = {
    subscription_id      = "__TFSTATE_SUBSCRIPTION_ID__"
    tenant_id            = "__AZURE_TENANT_ID__"
    client_id            = "__AZURE_CLIENT_ID__"
    use_azuread_auth     = true
    use_oidc             = true
    resource_group_name  = "__TFSTATE_RESOURCE_GROUP_NAME__"
    storage_account_name = "__TFSTATE_STORAGE_ACCOUNT_NAME__"
    container_name       = "__TFSTATE_AZURE_PLATFORM_CONTAINER__"
    key                  = "github/terraform.tfstate"
  }
}
```

## Pattern 2: TFVars Generation for Large Datasets

**Example scenario**: You're managing enterprise infrastructure with thousands of resources and assignments, and your CI/CD workflows keep failing with "argument list too long" errors.

This pattern addresses enterprise scale implementations where CLI argument length limits become a constraint. It provides a practical approach for managing large datasets effectively. When you pass large datasets through Terragrunt inputs, they get converted to command-line arguments for the underlying Terraform execution. And there are limits! 

> I used this pattern to manage Azure RBAC across multiple Azure subscriptions with 2000+ role assignments, 500+ service principals, and 200+ Azure AD groups. But only after I started hitting the limits described above, and in hindsight we should have split up and managed the non-dependent resources separately instead of combining them.

First, we load configuration from multiple HCL environment inputs sources in the directory hierarchy. Using [`find_in_parent_folders()`](https://terragrunt.gruntwork.io/docs/reference/built-in-functions/#find_in_parent_folders) here is effective for certain folder hierarchies as it automatically discovers configuration files up the directory tree.

```hcl
locals {
  # Automatically load environment-level variables
  rbac_groups_azure_env_vars  = read_terragrunt_config(find_in_parent_folders("rbac-groups-azure-env.hcl"))
  rbac_groups_github_env_vars = read_terragrunt_config(find_in_parent_folders("rbac-groups-github-env.hcl"))
  rbac_spns_env_vars          = read_terragrunt_config(find_in_parent_folders("rbac-spns-env.hcl"))
  platform_kv_appreg_env_vars = read_terragrunt_config(find_in_parent_folders("platform-kv-appreg-env.hcl"))

  # Map local variables to environment variables
  subscription_id                             = local.rbac_groups_azure_env_vars.locals.subscription_id
  groups                                      = local.rbac_groups_azure_env_vars.locals.groups
  groups_github                               = local.rbac_groups_github_env_vars.locals.groups_github
  spn_app_registrations                       = local.rbac_spns_env_vars.locals.spn_app_registrations
  spn_role_assignments                        = local.rbac_spns_env_vars.locals.spn_role_assignments
  managed_identity_directory_role_assignments = local.rbac_spns_env_vars.locals.managed_identity_directory_role_assignments
}
```

This is the key insight - we handle small and large datasets differently. Small variables use normal Terragrunt inputs, while large datasets get written to auto-loaded files to avoid CLI limits. This demonstrates the core functionality of [Terragrunt's `generate` blocks](https://terragrunt.gruntwork.io/docs/reference/config-blocks-and-attributes/#generate). Small, simple variables might use the normal inputs mechanism, while large, complex datasets could be written to `.auto.tfvars.json` files that [Terraform automatically loads](https://developer.hashicorp.com/terraform/language/values/variables#variable-definitions-tfvars-files).

```hcl
# Generate a tfvars file with the large variable inputs to avoid command-line length limits 
# e.g. 'argument list too long' errors in GitHub workflow runs
# Terraform will automatically load *.auto.tfvars.json files
generate "large_vars" {
  path              = "large_vars.auto.tfvars.json"
  if_exists         = "overwrite"
  disable_signature = true
  contents  = jsonencode({
    spn_app_registrations                       = local.spn_app_registrations
    spn_role_assignments                        = local.spn_role_assignments
    managed_identity_directory_role_assignments = local.managed_identity_directory_role_assignments
    # add more large variables here as needed if you are seeing 'argument list too long' errors in the GitHub workflow runs.
  })
}

inputs = {
  # Map smaller variables via inputs (these are safe for command-line)
  subscription_id      = local.subscription_id
  groups               = local.groups
  groups_github        = local.groups_github
  app_reg_key_vault_id = local.platform_kv_appreg_env_vars.locals.app_reg_key_vault_id

  # Large variables (spn_app_registrations, spn_role_assignments, managed_identity_directory_role_assignments)
  # are written to .terraform/large_vars.auto.tfvars.json by the generate 'large_vars' block above.
  # Terraform will automatically load them from the file
}
```

### Pattern 2: Complete Example

```hcl
# terragrunt.hcl - Enterprise RBAC Management
# Pattern 2: TFVars Generation for Large Datasets

# Include the root configuration
include {
  path = find_in_parent_folders("root-terragrunt.hcl")
}

# Set Terraform stack source location
terraform {
  source = "${get_repo_root()}/stacks/rbac"
}

locals {
  # Automatically load environment-level variables
  rbac_groups_azure_env_vars  = read_terragrunt_config(find_in_parent_folders("rbac-groups-azure-env.hcl"))
  rbac_groups_github_env_vars = read_terragrunt_config(find_in_parent_folders("rbac-groups-github-env.hcl"))
  rbac_spns_env_vars          = read_terragrunt_config(find_in_parent_folders("rbac-spns-env.hcl"))
  platform_kv_appreg_env_vars = read_terragrunt_config(find_in_parent_folders("platform-kv-appreg-env.hcl"))

  # Map local variables to environment variables
  subscription_id                             = local.rbac_groups_azure_env_vars.locals.subscription_id
  groups                                      = local.rbac_groups_azure_env_vars.locals.groups
  groups_github                               = local.rbac_groups_github_env_vars.locals.groups_github
  spn_app_registrations                       = local.rbac_spns_env_vars.locals.spn_app_registrations
  spn_role_assignments                        = local.rbac_spns_env_vars.locals.spn_role_assignments
  managed_identity_directory_role_assignments = local.rbac_spns_env_vars.locals.managed_identity_directory_role_assignments
}

# Generate a tfvars file with the large variable inputs to avoid command-line length limits
# e.g. 'argument list too long' errors in GitHub workflow runs
# Terraform will automatically load *.auto.tfvars.json files
generate "large_vars" {
  path              = "large_vars.auto.tfvars.json"
  if_exists         = "overwrite"
  disable_signature = true
  contents  = jsonencode({
    spn_app_registrations                       = local.spn_app_registrations
    spn_role_assignments                        = local.spn_role_assignments
    managed_identity_directory_role_assignments = local.managed_identity_directory_role_assignments
    # add more large variables here as needed if you are seeing 'argument list too long' errors in the GitHub workflow runs.
  })
}

inputs = {
  # Map smaller variables via inputs (these are safe for command-line)
  subscription_id      = local.subscription_id
  groups               = local.groups
  groups_github        = local.groups_github
  app_reg_key_vault_id = local.platform_kv_appreg_env_vars.locals.app_reg_key_vault_id

  # Large variables (spn_app_registrations, spn_role_assignments, managed_identity_directory_role_assignments)
  # are written to .terraform/large_vars.auto.tfvars.json by the generate 'large_vars' block above.
  # Terraform will automatically load them from the file
}

# Generate an Azure provider block
generate "provider" {
  path      = "_provider.tf"
  if_exists = "overwrite" #overwriting root terragrunt file
  contents  = <<EOF
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = ">=4.41.0"
    }
    azuread = {
      source  = "hashicorp/azuread"
      version = "3.5.0"
    }
  }
}

provider "azurerm" {
  use_oidc                        = true
  resource_provider_registrations = "extended"
  storage_use_azuread             = true
  subscription_id                 = var.subscription_id
  features {}
}

provider "azuread" {
  tenant_id = "__AZURE_TENANT_ID__"
}

EOF
}
```

## Pattern 3: Advanced Input Aggregation

**Example scenario**: You're managing complex infrastructure configurations across multiple applications and services, each with different requirements and schemas.

This represents the most advanced pattern for managing complex, multi-service architectures. While this pattern requires careful consideration, it becomes essential for maintaining organised configurations at scale.

> I used this pattern to manage an Azure Application Gateway with 50+ backend pools, 30+ SSL certificates, 100+ routing rules across multiple applications, plus Azure Front Door with 20+ custom domains and 40+ origins

First we explicitly define which configuration files to process.

```hcl
locals {
  app_gateway_base = read_terragrunt_config("app-gateway-env.hcl") # Contains all the base level configuration for App Gateway
  frontdoor_base   = read_terragrunt_config("frontdoor-env.hcl")   # Contains all the base level configuration for Front Door

  # List of config files that have various app specific configs, such as Backend pools, HTTP listeners, SSL certs, etc. that need to be merged
  app_gateway_config_files = [
    "app-gateway-env.hcl",           // Base App Gateway Config
    "app-gateway-application1.hcl",  // Application1 specific config
    "app-gateway-application2.hcl",  // Application2 specific config
    "app-gateway-application3.hcl",  // Application3 specific config
    // Add other config files here as they are added
  ]

  # List of config files that have various frontdoor specific configs, such as Origins, Routes, Custom Domains, etc. that need to be merged
  frontdoor_config_files = [
    "frontdoor-env.hcl",           // Base Front Door Config
    "frontdoor-application1.hcl",  // Application1 specific config
    "frontdoor-application3.hcl",  // Application3 specific config
    // Add other config files here as they are added
  ]

  # Read in all the app gateway and frontdoor config files
  app_gateway_configs = [for file in local.app_gateway_config_files : read_terragrunt_config(file)] # Read in all the app gateway config files
  frontdoor_configs   = [for file in local.frontdoor_config_files : read_terragrunt_config(file)]   # Read in all the frontdoor config files
}
```

Rather than reading each file individually, we use for expressions to process all configuration files in a single operation. This reduces repetitive code and makes the pattern more maintainable. Using [`for` expressions](https://developer.hashicorp.com/terraform/language/expressions/for) allows you to process all configuration files efficiently rather than manually reading each one individually.

```hcl
# Read in all the app gateway and frontdoor config files
app_gateway_configs = [for file in local.app_gateway_config_files : read_terragrunt_config(file)]
frontdoor_configs   = [for file in local.frontdoor_config_files : read_terragrunt_config(file)]
```

This is where the real complexity lies - combining data from multiple sources while respecting data types and handling missing values. Each data type requires a specific approach.

Different data types require specific merging approaches:

- Lists get flattened with [`flatten()`](https://developer.hashicorp.com/terraform/language/functions/flatten)
- Maps get merged with [`merge()`](https://developer.hashicorp.com/terraform/language/functions/merge) and the spread operator
- Everything is wrapped with [`try()`](https://developer.hashicorp.com/terraform/language/functions/try) for safe access

```hcl
inputs = {
  # Map application gateway module variables to local variables
  subscription_id                       = local.app_gateway_base.locals.subscription_id
  name                                  = local.app_gateway_base.locals.name
  location                              = local.app_gateway_base.locals.location
  resource_group_name                   = local.app_gateway_base.locals.resource_group_name
  tags                                  = local.app_gateway_base.locals.tags
  
  # Complex merging strategies for different data types
  per_app_waf_policies                  = merge([for config in local.app_gateway_configs : try(config.locals.waf_policies, {})]...)
  backend_address_pools                 = flatten([for config in local.app_gateway_configs : try(config.locals.backend_address_pools, [])])
  backend_http_settings                 = flatten([for config in local.app_gateway_configs : try(config.locals.backend_http_settings, [])])
  ssl_certificates                      = flatten([for config in local.app_gateway_configs : try(config.locals.ssl_certificates, [])])
  http_listeners                        = flatten([for config in local.app_gateway_configs : try(config.locals.http_listeners, [])])
  request_routing_rules                 = flatten([for config in local.app_gateway_configs : try(config.locals.request_routing_rules, [])])
  
  # Map frontdoor module variables to local variables  
  frontdoor_custom_domains    = merge([for config in local.frontdoor_configs : try(config.locals.frontdoor_custom_domains, {})]...)
  origins                     = merge([for config in local.frontdoor_configs : try(config.locals.origins, {})]...)
  origin_group_configuration  = merge([for config in local.frontdoor_configs : try(config.locals.origin_group_configuration, {})]...)
  routes                      = merge([for config in local.frontdoor_configs : try(config.locals.routes, {})]...)
}
```

Some key callouts:

- **Data type compatibility**: Using `concat()` on maps or `merge()` on lists will cause errors
- **Spread operator usage**: `merge([map1, map2]...)` flattens the list of maps before merging

This pattern is appropriate when:

- Multiple services have different configuration schemas
- Adding new services requires touching multiple configuration areas
- Team members frequently need to locate specific configuration settings
- Configuration management overhead impacts development productivity

### Pattern 3: Complete Example

```hcl
# terragrunt.hcl - Application Connectivity (App Gateway + Front Door)
# Pattern 3: Advanced Input Aggregation

# Include the root configuration
include {
  path = find_in_parent_folders("root-terragrunt.hcl")
}

# Set Terraform stack source location
terraform {
  source = "${get_repo_root()}/stacks/app-connectivity"
}

locals {
  app_gateway_base = read_terragrunt_config("app-gateway-env.hcl") # Contains all the base level configuration for App Gateway
  frontdoor_base   = read_terragrunt_config("frontdoor-env.hcl")   # Contains all the base level configuration for Front Door

  # List of config files that have various app specific configs, such as Backend pools, HTTP listeners, SSL certs, etc. that need to be merged
  app_gateway_config_files = [
    "app-gateway-env.hcl",           // Base App Gateway Config
    "app-gateway-application1.hcl",  // Application1 specific config
    "app-gateway-application2.hcl",  // Application2 specific config
    "app-gateway-application3.hcl",  // Application3 specific config
    // Add other config files here as they are added
  ]

  # List of config files that have various frontdoor specific configs, such as Origins, Routes, Custom Domains, etc. that need to be merged
  frontdoor_config_files = [
    "frontdoor-env.hcl",           // Base Front Door Config
    "frontdoor-application1.hcl",  // Application1 specific config
    "frontdoor-application3.hcl",  // Application3 specific config
    // Add other config files here as they are added
  ]

  # Read in all the app gateway and frontdoor config files
  app_gateway_configs = [for file in local.app_gateway_config_files : read_terragrunt_config(file)] # Read in all the app gateway config files
  frontdoor_configs   = [for file in local.frontdoor_config_files : read_terragrunt_config(file)]   # Read in all the frontdoor config files
}

inputs = {
  # Map application gateway module variables to local variables
  subscription_id                       = local.app_gateway_base.locals.subscription_id
  name                                  = local.app_gateway_base.locals.name
  location                              = local.app_gateway_base.locals.location
  resource_group_name                   = local.app_gateway_base.locals.resource_group_name
  tags                                  = local.app_gateway_base.locals.tags
  sku                                   = local.app_gateway_base.locals.sku
  gateway_ip_configuration_name         = local.app_gateway_base.locals.gateway_ip_configuration_name
  gateway_ip_configuration_subnet_id    = local.app_gateway_base.locals.gateway_ip_configuration_subnet_id
  frontend_port_name                    = local.app_gateway_base.locals.frontend_port_name
  frontend_port_number                  = local.app_gateway_base.locals.frontend_port_number
  frontend_ip_configuration             = local.app_gateway_base.locals.frontend_ip_configuration
  private_link_configurations           = local.app_gateway_base.locals.private_link_configurations
  enable_diagnostics                    = local.app_gateway_base.locals.enable_diagnostics
  diagnostic_log_category_groups        = local.app_gateway_base.locals.diagnostic_log_category_groups
  diagnostic_metrics                    = local.app_gateway_base.locals.diagnostic_metrics
  diagnostic_log_analytics_workspace_id = local.app_gateway_base.locals.diagnostic_log_analytics_workspace_id
  alerts_resource_group_name            = local.app_gateway_base.locals.alerts_resource_group_name
  action_groups                         = local.app_gateway_base.locals.action_groups
  application_gateway_base_alert_config = local.app_gateway_base.locals.base_alert_config
  trusted_root_certificates             = local.app_gateway_base.locals.trusted_root_certificates
  zones                                 = local.app_gateway_base.locals.zones
  waf_policy                            = local.app_gateway_base.locals.waf_policy
  
  # Complex merging strategies for different data types
  per_app_waf_policies                  = merge([for config in local.app_gateway_configs : try(config.locals.waf_policies, {})]...)
  backend_address_pools                 = flatten([for config in local.app_gateway_configs : try(config.locals.backend_address_pools, [])])
  backend_http_settings                 = flatten([for config in local.app_gateway_configs : try(config.locals.backend_http_settings, [])])
  ssl_certificates                      = flatten([for config in local.app_gateway_configs : try(config.locals.ssl_certificates, [])])
  http_listeners                        = flatten([for config in local.app_gateway_configs : try(config.locals.http_listeners, [])])
  request_routing_rules                 = flatten([for config in local.app_gateway_configs : try(config.locals.request_routing_rules, [])])
  rewrite_rule_sets                     = flatten([for config in local.app_gateway_configs : try(config.locals.rewrite_rule_sets, [])])
  probes                                = flatten([for config in local.app_gateway_configs : try(config.locals.probes, [])])

  # Map frontdoor module variables to local variables
  deploy_frontdoor            = local.frontdoor_base.locals.deploy_frontdoor
  frontdoor_profile_name      = local.frontdoor_base.locals.frontdoor_profile_name
  frontdoor_sku               = local.frontdoor_base.locals.frontdoor_sku
  frontdoor_endpoints         = local.frontdoor_base.locals.frontdoor_endpoints
  enable_frontdoor_waf_policy = local.frontdoor_base.locals.enable_frontdoor_waf_policy
  frontdoor_base_alert_config = local.frontdoor_base.locals.base_alert_config
  frontdoor_custom_domains    = merge([for config in local.frontdoor_configs : try(config.locals.frontdoor_custom_domains, {})]...)
  origins                     = merge([for config in local.frontdoor_configs : try(config.locals.origins, {})]...)
  origin_group_configuration  = merge([for config in local.frontdoor_configs : try(config.locals.origin_group_configuration, {})]...)
  routes                      = merge([for config in local.frontdoor_configs : try(config.locals.routes, {})]...)
}

# Generate an Azure provider block
generate "provider" {
  path      = "_provider.tf"
  if_exists = "overwrite" #overwriting root terragrunt file
  contents  = <<EOF
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.35"
    }
    azuread = {
      source  = "hashicorp/azuread"
      version = "~> 3.4"
    }
  }
}

provider "azurerm" {
  subscription_id                 = var.subscription_id
  use_oidc                        = true
  resource_provider_registrations = "extended" #A larger set of resource providers that provides coverage for the most common supported resources. See this doco https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs#resource-provider-registrations
  resource_providers_to_register  = [] #Pass a list of strings here to register specific resource providers for example "Microsoft.AlertsManagement". See this list https://github.com/hashicorp/terraform-provider-azurerm/blob/main/internal/resourceproviders/required.go
  storage_use_azuread             = true
  features {}
}

provider "azuread" {
  tenant_id = "__AZURE_TENANT_ID__"
}

EOF
}
```

## Choosing the Right Pattern for Your Team

After implementing these patterns across different organisations and use cases, here's my decision framework:

### Start with Simple Input Mapping if you have

- Configuration that's relatively small (under 50 resources per environment)
- Data structure that's uniform across sources

### Move to TFVars Generation for Large Datasets when you encounter

- Large datasets that are hitting CLI limits (you'll know when it happens!)

### Use Advanced Input Aggregation when you're managing

- Multi-service architectures with varying configuration schemas
- Services that need flexible addition/removal capabilities
- Configuration complexity that varies significantly between components

## Conclusion

These three Terragrunt patterns shown above address common infrastructure management challenges at different scales. Each pattern emerged from practical requirements for managing Terraform configurations effectively.

[Terragrunt](https://terragrunt.gruntwork.io/) can provide flexibility to adapt configuration patterns as your Terraform/OpenTofu requirements grow.

Thanks for reading, looking forward to your thoughts below,

Jesse
