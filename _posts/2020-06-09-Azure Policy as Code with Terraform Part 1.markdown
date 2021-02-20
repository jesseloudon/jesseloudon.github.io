---
title: "Azure Policy as Code with Terraform Part 1"
excerpt: "Discover patterns for usage of Azure Policy as Code with Terraform and examine deployment methodologies, module structures, Azure policy best-practices, and Terraform best-practices"
header:
    og_image: /assets/images/terraform1.png
    teaser: /assets/images/terraform1.png
date:   "2020-06-09"
categories: 
- "cloud"
tags: 
- "azure policy"
- "terraform"
- "policy as code"
- "terraform azurerm policy"
- "azure governance"
- "json"
---
During my last blog series [Cloud Governance with Azure Policy](https://jloudon.com/cloud/Cloud-Governance-with-Azure-Policy-Part-1/) I introduced some common use cases for Azure Policy and demonstrated how to author a custom policy definition using the Azure Policy extension for VSCode. This blog series is still related to cloud governance but, because it focuses more on managing an Azure policy as code workflow using Terraform, it deserves a new heading.

Coming up I’ll show you some usage patterns for deploying Azure policies using Terraform modules for these resource types:

* Policy Definitions
* Policy Set Definitions
* Policy Assignments

We'll also examine the following multi-environment architecture using Azure, Terraform Cloud, GitHub, and VSCode. I've included this diagram early on because helps to have an end-goal in mind whilst reading this blog and I believe many Azure consumers utilise separate environments for Dev, Test, and Prod.

![Terraform Azure Multi-Environment Pattern](/assets/images/terraform1.png "Terraform Azure Multi-Environment Pattern")

# What is Policy as Code?

I believe there are 4 key elements of a policy as code workflow:

* **Repeatable** - documenting our Azure policies as code files which can be reused by another team
* **Scalable** - managing our Azure policies across multiple environments without dependencies on manual processes
* **Automatable** - deploying our Azure policies using DevOps/scripts/tooling which removes the element of human error
* **Auditable** - keeping an audit/paper trail for changes to Azure policies and deployments to our environments

# The JSON+X pattern

Before we start looking at Terraform patterns, let’s examine the existing Azure Policy as Code pattern from Microsoft. Here’s the Microsoft example of a folder structure for your policy source code repo. 

![Microsoft policy as code folder structure](/assets/images/terraform2.png "Microsoft policy as code folder structure")

After defining your Azure policies as JSON files you need to decide which of the following three common languages to use for deployment:

* ARMClient
* Azure PowerShell
* Azure CLI

For example, the below three cmdlets all create a single policy definition named "Audit Storage Accounts Open to Public Networks".


**ARMClient**
```
armclient PUT "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/policyDefinitions/AuditStorageAccounts?api-version=2019-09-01" @<path to policy definition JSON file>
```

**Azure PowerShell**
```powershell
New-AzPolicyDefinition -Name 'AuditStorageAccounts' -DisplayName 'Audit Storage Accounts Open to Public Networks' -Policy 'AuditStorageAccounts.json'
```

**Azure CLI**
``` bash
az policy definition create --name 'audit-storage-accounts-open-to-public-networks' --display-name 'Audit Storage Accounts Open to Public Networks' --description 'This policy ensures that storage accounts with exposures to public networks are audited.' --rules '<path to json file>' --mode All
```

And once you start using scripts to deploy your policies to Azure the end result will be that you’re managing a source code repository consisting of two sets of programming languages:

1. Azure Policy definition files (JSON)
2. Deployment scripts (PowerShell or others)

This experience led me to look at using Terraform as an opportunity to combine the policy source code (JSON) with the deployment script code HashiCorp Configuration Language (HCL) in a single set of files, or modules in Terraform terminology.

# Getting started with using Terraform to deploy Azure Policies

If you’re new to using Terraform I recommend starting with a simple deployment of an Azure policy definition and expanding your knowledge from there.

A quick proof of concept will give you valuable experience with key Terraform concepts such as the tfstate file and cmdlets like init, plan, and apply.

![Terraform to Azure proof of concept](/assets/images/terraform3.png "Terraform to Azure proof of concept")

Three key elements of the above proof of concept are:

* Terraform modules, variables, and state are stored locally and run from VSCode.
* A single Azure subscription/environment is targeted.
* This is a low-code, low-effort proof of concept to demonstrate a basic Terraform deployment of a custom Azure policy.

## Example Procedure

1. Download/Install [Terraform](https://learn.hashicorp.com/terraform/getting-started/install.html) and [VSCode](https://code.visualstudio.com/download)
2. Create your Terraform files (a single main.tf) will suffice, or use the below example TF file.
3. Authenticate to Azure and run Terraform cmdlets

``` bash
az login
az account list
az account set --subscription="XXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXX"
```
``` terraform
Terraform fmt -recursive
Terraform validate
Terraform init
Terraform plan
Terraform apply
Terraform destroy
```

## Example Terraform file

The below file defines 1 variable, deploys 1 resource (a custom policy definition), and outputs 1 resource ID.

You may notice that the standard JSON (metadata, policyrule, parameters) used by Azure policies is embedded in the file along with HashiCorp Configuration Language (HCL).

Note: Integration between the two languages appears seamless and I've been able to simply copy+paste Azure Policy JSON from a repository directly into a Terraform file without modifying any of the original code. That's convenient!

``` terraform
provider "azurerm" {
  features {}
}

variable "policy_definition_category" {
  type        = string
  description = "The category to use for all Policy Definitions"
  default     = "Custom"
}

resource "azurerm_policy_definition" "auditRoleAssignmentType_user" {
  name         = "auditRoleAssignmentType_user"
  policy_type  = "Custom"
  mode         = "All"
  display_name = "Audit user role assignments"
  description  = "This policy checks for any Role Assignments of Type [User] - useful to catch individual IAM assignments to resources/RGs which are out of compliance with the RBAC standards e.g. using Groups for RBAC."

  metadata = <<METADATA
    {
    "category": "${var.policy_definition_category}",
    "version" : "1.0.0"
    }
METADATA


  policy_rule = <<POLICY_RULE
    {
    "if": {
      "allOf": [
        {
          "field": "type",
          "equals": "Microsoft.Authorization/roleAssignments"
        },
        {
          "field": "Microsoft.Authorization/roleAssignments/principalType",
          "equals": "[parameters('principalType')]"
        }
      ]
    },
    "then": {
      "effect": "audit"
    }
  }
POLICY_RULE


  parameters = <<PARAMETERS
    {
    "principalType": {
      "type": "String",
      "metadata": {
        "displayName": "principalType",
        "description": "Which principalType to audit against e.g. 'User'"
      },
      "allowedValues": [
        "User",
        "Group",
        "ServicePrincipal"
      ],
      "defaultValue": "User"
    }
  }
PARAMETERS

}

output "auditRoleAssignmentType_user_policy_id" {
  value       = "${azurerm_policy_definition.auditRoleAssignmentType_user.id}"
  description = "The policy definition id for auditRoleAssignmentType_user"
}
```

The above custom policy definition audits the field `Microsoft.Authorization/roleAssignments/principalType` for a `User` value and is useful to detect "RBAC drift" where users are being assigned directly to ACLs of Azure resources outside of a security group. If you're interested in reading more about this I've blogged about the creation process [here](https://jloudon.com/cloud/Cloud-Governance-with-Azure-Policy-Part-2/).

# Governance at Scale with Terraform Cloud and Azure Policies

For more advanced usage of Terraform with Azure Policy I recommend using Terraform Cloud/Enterprise workspaces and storage of your policy modules in at least 1 GitHub repository.

Through the utilisation of Terraform workspaces you can create a 1-to-many mapping for your modules stored in a single repository to many Azure environments, for example:

* Repo -> Dev TF Workspace -> Dev AZ Subscription
* Repo -> Test TF Workspace -> Test AZ Management Group
* Repo -> Prod TF Workspace -> Prod AZ Management Group

![Terraform Azure Multi-environment Pattern](/assets/images/terraform1.png "Terraform Azure Multi-environment Pattern")

There are five key elements of this architecture pattern. These are the ability to:

1. Stage your Azure policy deployments so they follow a natural progression from low-risk (dev) to high-risk (prod).
2. Enable manual-apply on workspaces and integrate team member reviews of Terraform plans stored in each workspace as part of your deployment pipeline. Or enable auto-apply on workspaces if a review is not required.
3. Maintain a consistent and controlled pipeline for your Azure policy deployments to multiple Azure environments based off the same source code repo giving you a single source of truth for Azure policy as code.
4. Remotely store and separate Terraform state files within each respective workspace providing a single source of truth for environment state.
5. Remotely store sensitive and non-sensitive variables within each respective workspace allowing you to manage variations in Azure Policy deployments as required. For example, you may want to use the deny effect for some policies in prod but in test/dev you deploy the same policies with an audit effect. 

Terraform usage can be a single main.tf file or a module consisting of main.tf, outputs.tf, and variables.tf. This is fine for a small-scale Azure Policy deployment of a few policies, policysets, and assignments but once you need to deploy more than 5 of any resource you'll notice the management of a single Terraform module can become unscalable.

So to make your policy as code repo repeatable and scalable for consumption across multiple teams and environments you can break up the resources into child modules and use a single parent module to call them as shown below.

![Terraform parent child module pattern](/assets/images/terraform4.png "Terraform parent child module pattern")

Note: Terraform [AzureRM provider](https://www.terraform.io/docs/providers/azurerm/index.html) resource types can be:

* [Policy Definitions](https://www.terraform.io/docs/providers/azurerm/r/policy_definition.html)
* [Policy Set Definitions](https://www.terraform.io/docs/providers/azurerm/r/policy_set_definition.html)
* [Policy Assignments](https://www.terraform.io/docs/providers/azurerm/r/policy_assignment.html)
* [Policy Remediations](https://www.terraform.io/docs/providers/azurerm/r/policy_remediation.html)

For example, here's a high level diagram of an example [AzureRM policy modules repo](https://github.com/globalbao/terraform-azurerm-policy) I've created for managing Azure Policy with Terraform.

![GlobalBao AzureRM Policy Module diagram](/assets/images/terraform5.png "GlobalBao AzureRM Policy Module diagram")

Using parent/child modules is more complex than a single module where all resources are created from the same set of files, however, some advantages are:

* Logical isolation of resource types to their respective child modules allowing for code reusability and easier troubleshooting if required.
* Flexibility for future changes if resources are added/removed to the code.

# Closing Remarks

There are multiple patterns available to manage Azure policies as code across your Azure environments including the JSON+X pattern as explained earlier.

Terraform brings some additional elements to a policy as code workflow to make it more repeatable, scalable, automatable, and auditable.

In [Part 2](https://jloudon.com/cloud/Azure-Policy-as-Code-with-Terraform-Part-2/) of this series I'll walk through how my example [AzureRM policy modules repo](https://github.com/globalbao/terraform-azurerm-policy) works under the hood, demo the code, show you how to resolve an issue that may arise when recreating a policy which is a member of a policyset, and we'll explore some Terraform coding patterns which can be reused for your own Terraform modules saving you time during the module authoring process.

Happy coding,

Jesse
