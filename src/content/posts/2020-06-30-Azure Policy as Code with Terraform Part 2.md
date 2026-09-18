---
title: "Azure Policy as Code with Terraform Part 2"
excerpt: "Look under the hood of an example repository I created to deploy a set of custom Azure policies, initiatives, and assignments"
header:
    og_image: /assets/images/terraform5.png
    teaser: /assets/images/terraform5.png
date:   "2020-06-30"
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
This is Part 2 of the Azure Policy as Code with Terraform series. During [Part 1](https://jloudon.com/cloud/Azure-Policy-as-Code-with-Terraform-Part-1/) I introduced you to various patterns for adopting an Azure Policy as Code workflow and illustrated an example multi-environment architecture using Azure, Terraform Cloud, and GitHub.

In this blog we'll look under the hood of an example repository I created to deploy a set of custom Azure policies, initiatives, and assignments. I'll also demo the code and show you how to resolve an issue that may arise when recreating a policy which is a member of a policyset.

Later we'll also explore some Terraform coding patterns which can be reused for your own Terraform modules saving you time during the module authoring process.

# Example AzureRM Policy Modules

In case you missed Part 1, let's take a quick look again at my example repository comprising of 4 AzureRM modules:

![globalbao azurerm policy modules](/assets/images/terraform5.png "globalbao azurerm policy modules")

Each child module above manages only 1 resource type. For example /modules/policy-definitions manages AzureRM policy definitions. 

The parent module calls all child modules and it's where we set input variable values if required by the child modules. 

For example here's the parent module calling /modules/policy-assignments and setting values for 4 input variables.

```terraform
module "policy_assignments" {
  source = "./modules/policy-assignments"

  tag_governance_policyset_id             = "${module.policyset_definitions.tag_governance_policyset_id}"
  iam_governance_policyset_id             = "${module.policyset_definitions.iam_governance_policyset_id}"
  security_governance_policyset_id        = "${module.policyset_definitions.security_governance_policyset_id}"
  data_protection_governance_policyset_id = "${module.policyset_definitions.data_protection_governance_policyset_id}"
}
```

# Module Best-Practices

By the way, there's a few Terraform best-practices for module design that I've adhered to: 

* The root module and any nested modules should have README files.
* Main.tf should be the primary entrypoint and contain nested module calls.
* Variables.tf and Outputs.tf should contain declarations for variables and outputs respectively.
* Nested modules should exist under a modules/ subdirectory.
* Root module calls to nested modules should use releative paths like ./modules/policy-definitions.
* The module tree should be flat with only one level of child modules.

As there's always exceptions to best-practices I recommend evaluating each practice first, then adjusting to your own unique scenario/requirements.

# Module Demo

Now let's run through a quick demonstration of my example Terraform repo in action and see the outcome in Azure.

I have the following software installed locally:

* VSCode
* Terraform
* AzCLI

My demo Azure environment also currently has 0 custom policy definitions, policysets (initiatives), and assignments. This is as 'clean slate' as it gets!

![azure demo environment policy definitions](/assets/images/terraform7.png "azure demo environment policy definitions")

![azure demo environment policy assignments](/assets/images/terraform8.png "azure demo environment policy assignments")

![azure demo environment policy compliance](/assets/images/terraform6.png "azure demo environment policy compliance")

First, I've authenticated to Azure using az login from my terminal.

Next, running terraform init from the root module automatically downloads the module plugins.

Then, using terraform plan and terraform apply from the root module I see a message showing 24 resources to add.  And because I'm happy to proceed with the changes I've entered the word yes.

![terraform apply job result](/assets/images/terraform10.png "terraform apply job result")

After the apply job has completed we get a nice green summary. Green is usually a good sign :)

![terraform apply job result](/assets/images/terraform11.png "terraform apply job result")

Looking at my demo Azure environment, you can see the custom policies, policysets, and assignments have been deployed as per the code. Success!

![azure demo environment policy definitions deployed](/assets/images/terraform13.png "azure demo environment policy definitions deployed")

![azure demo environment policy assignments deployed](/assets/images/terraform14.png "azure demo environment policy assignments deployed")

![azure demo environment policy compliance deployed status](/assets/images/terraform12.png "azure demo environment policy compliance deployed status")

Note: You might notice above that the compliance state for my newly deployed Azure policy assignments show as "Not started".

So if you don't want to wait for the Azure policy engine to start a compliance scan you can kick off a scan manually using `Start-AzPolicyComplianceScan` from the Az.PolicyInsights PowerShell module.

# Issues with recreating Policies that are in a PolicySet

When modifying variable values which are used for Terraform resource names (such as the case in my example repo code) you may encounter an issue with the Azure policy definition recreation not working because the policy is a member of a policyset. Here's how to fix that with terraform taint.

In this example I've modified the variable list value CostCentre, changing it to CostCenter.

![terraform variable list change example](/assets/images/terraform17.png "terraform variable list change example")

After running terraform plan/apply I receive one or more errors such as the below snippet:

```
Error: Error deleting Policy Definition "addTagToRG_CostCentre": policy.DefinitionsClient#Delete: Failure responding to request: StatusCode=400 -- Original Error: autorest/azure: Service returned an error. Status=400 Code="InvalidDeletePolicyDefinitionRequest" Message="The policy definition 'addTagToRG_CostCentre' cannot be deleted.  It is referenced by the policy set definition '/subscriptions/providers/Microsoft.Authorization/policySetDefinitions/tag_governance'. Please remove this policy definition from all policy set definitions that reference it."
```

The error above provides details that the policy definition resource cannot be recreated because the resource is referenced by a policyset resource. I expect Terraform to automatically handle the logic behind removal of the policy definition from the policyset if the policy is being recreated, however that is unfortunately not the case. Possibly because the policy definitions are defined as JSON within a HCL policyset resource block.

So to resolve this we need to use terraform taint to target the relevant policyset resource and force that to be recreated as part of the run.

![terraform taint policyset example](/assets/images/terraform18.png "terraform taint policyset example")

After tainting the relevant policyset and rerunning terraform plan/apply I get the following change summary:

![terraform apply output](/assets/images/terraform19.png "terraform apply output")

A successful completion shows my updated custom Azure policies in the portal. Boom!

![terraform apply job result](/assets/images/terraform20.png "terraform apply job result")

![azure custom policy post-change](/assets/images/terraform21.png "azure custom policy post-change")

# Terraform Coding Patterns

Now that you've seen the code in action through my module demo above, it's worth looking at some coding patterns which you can reuse for your own Terraform project.

Remembering back to when I was deploying just few Azure resources using Terraform the code logic was fairly rudimentary. As a result there was a large amount of code duplication.

The code duplication and simplicity of the logic became an ineffective development practice as the Azure deployment scaled up to cover more policies, policysets (initiatives), and assignments. So I adopted the following 3 patterns.

## Pattern #1 - Using count and count.index to create multiple custom azure policy definitions

This pattern creates a policy definition multiple times based on the count of tag keys from a variable list and references values from the same variable list for each policy definition.

**Implementation Steps**

1. Define a variable `list` containing your tag keys.
2. Use `count` to create a resource multiple times based on the length of your variable list.
3. Reference values from your variable list using `[count.index]`.

First, within your policy definition module, define a variable list containing your tag keys. For example:

``` terraform
variable "mandatory_tag_keys" {
  type        = list
  description = "List of mandatory tag keys used by policies 'addTagToRG','inheritTagFromRG','bulkAddTagsToRG','bulkInheritTagsFromRG'"
  default = [
    "Application",
    "CostCentre",
    "Environment",
    "ManagedBy",
    "OwnedBy",
    "SupportBy"
  ]
}
```

Next, within your policy definition resource block, you can reference your variable list using `count = length(var.variableName)`.

This will create your policy definition resource multiple times based on the length of your variable list. So for example, if you have 6 tag keys defined in your variable list, your policy definition resource will be created 6 times.

```terraform
resource "azurerm_policy_definition" "addTagToRG" {
  count = length(var.mandatory_tag_keys)
```

Finally, also within the policy definition resource block, you can reference your variable list values using `${var.variableName[count.index]}`.

Using `${var.variableName[count.index]} `means the index of tag keys contained in your variable list can be referenced for each policy definition resource created.

Specific variable index items can also be referenced using `${var.variableName[0]}`, `${var.variableName[1]}`, `${var.variableName[2]}`, etc.

```terraform
  name         = "addTagToRG_${var.mandatory_tag_keys[count.index]}"
  policy_type  = "Custom"
  mode         = "All"
  display_name = "Add tag ${var.mandatory_tag_keys[count.index]} to resource group"
  description  = "Adds the mandatory tag key ${var.mandatory_tag_keys[count.index]} when any resource group missing this tag is created or updated. \nExisting resource groups can be remediated by triggering a remediation task.\nIf the tag exists with a different value it will not be changed."
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
              "equals": "Microsoft.Resources/subscriptions/resourceGroups"
            },
            {
              "field": "[concat('tags[', parameters('tagName'), ']')]",
              "exists": "false"
            }
          ]
        },
        "then": {
          "effect": "modify",
          "details": {
            "roleDefinitionIds": [
              "/providers/microsoft.authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c"
            ],
            "operations": [
              {
                "operation": "add",
                "field": "[concat('tags[', parameters('tagName'), ']')]",
                "value": "[parameters('tagValue')]"
              }
            ]
          }
        }
  }
POLICY_RULE
  parameters = <<PARAMETERS
    {
        "tagName": {
          "type": "String",
          "metadata": {
            "displayName": "Mandatory Tag ${var.mandatory_tag_keys[count.index]}",
            "description": "Name of the tag, such as ${var.mandatory_tag_keys[count.index]}"
          },
          "defaultValue": "${var.mandatory_tag_keys[count.index]}"
        },
        "tagValue": {
          "type": "String",
          "metadata": {
            "displayName": "Tag Value '${var.mandatory_tag_value}'",
            "description": "Value of the tag, such as '${var.mandatory_tag_value}'"
          },
          "defaultValue": "'${var.mandatory_tag_value}'"
        }
  }
PARAMETERS
}
```

## Pattern #2 - Passing outputs between modules for custom policy definitions created using count

This pattern creates policysets (initiatives) using the custom policy definition ids from custom policy definitions created in our code and solves the problem of passing outputs between modules using output variables and input variables.

**Implementation Steps**

1. Define an output variable for policy definition ids.
2. Define input variables for each policy definition id which will be referenced in a policyset resource.
3. Reference each input variable in the policyset resource block.
4. Map the policy definition id input variable to the policy definition id output variable.

First, define an output variable for policy definitions.

```terraform
output "addTagToRG_policy_ids" {
  value       = "${azurerm_policy_definition.addTagToRG.*.id}"
  description = "The policy definition ids for addTagToRG policies"
}
```

All resources created by a resource block that uses `count = length(var.variableName)` can be referenced using `${resourceProvider.resourceType.resourceName.*.output}`.

This output variable should be defined in the same module where the policy definition resource is created.

Next, within your policyset module, define an input variable e.g. `addTagToRG_policy_id_0` for each policy definition resource created by the policy definition resource block that uses count.

```terraform
variable "addTagToRG_policy_id_0" {
  type        = string
  description = "The policy definition id '0' from the 'addTagToRG_policy_ids' output"
}

variable "addTagToRG_policy_id_1" {
  type        = string
  description = "The policy definition id '1' from the 'addTagToRG_policy_ids' output"
}

variable "addTagToRG_policy_id_2" {
  type        = string
  description = "The policy definition id '2' from the 'addTagToRG_policy_ids' output"
}

variable "addTagToRG_policy_id_3" {
  type        = string
  description = "The policy definition id '3' from the 'addTagToRG_policy_ids' output"
}

variable "addTagToRG_policy_id_4" {
  type        = string
  description = "The policy definition id '4' from the 'addTagToRG_policy_ids' output"
}

variable "addTagToRG_policy_id_5" {
  type        = string
  description = "The policy definition id '5' from the 'addTagToRG_policy_ids' output"
}
```

Then, within your policyset resource block, for each policy definition id reference each input variable created above using ${var.variableName}.

``` terraform
resource "azurerm_policy_set_definition" "tag_governance" {
  name         = "tag_governance"
  policy_type  = "Custom"
  display_name = "Tag Governance"
  description  = "Contains common Tag Governance policies"
  metadata = <<METADATA
    {
    "category": "${var.policyset_definition_category}"
    }
METADATA
  policy_definitions = <<POLICY_DEFINITIONS
    [
        {
            "policyDefinitionId": "${var.addTagToRG_policy_id_0}"
        },
        {
            "policyDefinitionId": "${var.addTagToRG_policy_id_1}"
        },
        {
            "policyDefinitionId": "${var.addTagToRG_policy_id_2}"
        },     
        {
            "policyDefinitionId": "${var.addTagToRG_policy_id_3}"
        },
        {
            "policyDefinitionId": "${var.addTagToRG_policy_id_4}"
        },
        {
            "policyDefinitionId": "${var.addTagToRG_policy_id_5}"
        }
    ]
POLICY_DEFINITIONS
}
```

Finally, from the parent module file which calls the child modules, map each input variable to the output variable using `inputVariableName` = `"${module.moduleName.outputVariableName[X]}"`.

```terraform
module "policyset_definitions" {
  source = "./modules/policyset-definitions"

  addTagToRG_policy_id_0 = "${module.policy_definitions.addTagToRG_policy_ids[0]}"
  addTagToRG_policy_id_1 = "${module.policy_definitions.addTagToRG_policy_ids[1]}"
  addTagToRG_policy_id_2 = "${module.policy_definitions.addTagToRG_policy_ids[2]}"
  addTagToRG_policy_id_3 = "${module.policy_definitions.addTagToRG_policy_ids[3]}"
  addTagToRG_policy_id_4 = "${module.policy_definitions.addTagToRG_policy_ids[4]}"
  addTagToRG_policy_id_5 = "${module.policy_definitions.addTagToRG_policy_ids[5]}"
}
```

## Pattern #3 - Using a data source to lookup built-in policy definition ids based on a variable list of display names

This pattern creates a policyset (initiative) and avoids hard-coding built-in policy definition ids into our code by using a data source to query the ids based on the variable list containing our built-in policy definition display names.

**Implementation Steps**

1. Define a variable `list` containing the display names of built-in policy definitions.
2. Define a `data source` to `azurerm_policy_definition `referencing the variable list.
3. Reference each data source value within the policyset `policy_definitions` resource block.

First, define a variable list containing the display names of existing built-in policy definitions that you want to include in a policyset.

```terraform
variable "security_policyset_definitions" {
  type        = list
  description = "List of policy definitions (display names) for the security_governance policyset"
  default = [
    "Internet-facing virtual machines should be protected with network security groups",
    "Subnets should be associated with a Network Security Group",
    "Gateway subnets should not be configured with a network security group",
    "Storage accounts should restrict network access",
    "Secure transfer to storage accounts should be enabled",
    "Access through Internet facing endpoint should be restricted",
    "Storage accounts should allow access from trusted Microsoft services",
    "RDP access from the Internet should be blocked",
    "SSH access from the Internet should be blocked",
    "Disk encryption should be applied on virtual machines",
    "Automation account variables should be encrypted",
    "Azure subscriptions should have a log profile for Activity Log",
    "Email notification to subscription owner for high severity alerts should be enabled",
    "A security contact email address should be provided for your subscription",
    "Enable Azure Security Center on your subscription"
  ]
}
```

Next, define a data source to azurerm_policy_definition and use `count = length(var.variableName) `to iterate the data source lookup based on the number of values in your variable list.

Then, use `display_name` = `var.variableName[count.index]` to lookup policy definitions based on the display names definined in your variable list.

``` terraform
data "azurerm_policy_definition" "security_policyset_definitions" {
  count        = length(var.security_policyset_definitions)
  display_name = var.security_policyset_definitions[count.index]
}
```

Finally, within the policyset resource block, reference each `policydefinitionId `from the data source using `${data.dataSource.dataSourceName.*.id[X]}`.

The example below is for if you have 15 policy definitions contained in your variable list.

```terraform
resource "azurerm_policy_set_definition" "security_governance" {

  name         = "security_governance"
  policy_type  = "Custom"
  display_name = "Security Governance"
  description  = "Contains common Security Governance policies"

  metadata = <<METADATA
    {
    "category": "${var.policyset_definition_category}"
    }
METADATA

  policy_definitions = <<POLICY_DEFINITIONS
    [
        {
            "policyDefinitionId": "${data.azurerm_policy_definition.security_policyset_definitions.*.id[0]}"
        },
        {
            "policyDefinitionId": "${data.azurerm_policy_definition.security_policyset_definitions.*.id[1]}"
        },
        {
            "policyDefinitionId": "${data.azurerm_policy_definition.security_policyset_definitions.*.id[2]}"
        },
        {
            "policyDefinitionId": "${data.azurerm_policy_definition.security_policyset_definitions.*.id[3]}"
        },
        {
            "policyDefinitionId": "${data.azurerm_policy_definition.security_policyset_definitions.*.id[4]}"
        },
        {
            "policyDefinitionId": "${data.azurerm_policy_definition.security_policyset_definitions.*.id[5]}"
        },
        {
            "policyDefinitionId": "${data.azurerm_policy_definition.security_policyset_definitions.*.id[6]}"
        },
        {
            "policyDefinitionId": "${data.azurerm_policy_definition.security_policyset_definitions.*.id[7]}"
        },
        {
            "policyDefinitionId": "${data.azurerm_policy_definition.security_policyset_definitions.*.id[8]}"
        },
        {
            "policyDefinitionId": "${data.azurerm_policy_definition.security_policyset_definitions.*.id[9]}"
        },
        {
            "policyDefinitionId": "${data.azurerm_policy_definition.security_policyset_definitions.*.id[10]}"
        },
        {
            "policyDefinitionId": "${data.azurerm_policy_definition.security_policyset_definitions.*.id[11]}"
        },
        {
            "policyDefinitionId": "${data.azurerm_policy_definition.security_policyset_definitions.*.id[12]}"
        },
        {
            "policyDefinitionId": "${data.azurerm_policy_definition.security_policyset_definitions.*.id[13]}"
        },
        {
            "policyDefinitionId": "${data.azurerm_policy_definition.security_policyset_definitions.*.id[14]}"
        }
    ]
POLICY_DEFINITIONS
}
```

# Closing Remarks

Authoring my own AzureRM policy modules provided me with maximum control over the HCL code and freedom to experiment with various coding patterns. 

A month ago, when I was testing Azure Policy deployments with Terraform, there wasn't any AzureRM Policy module available from Microsoft on the Terraform Registry. 

Today there are 22 Azure-related modules publicly available and we've just scratched the surface of what's possible with Azure Policy as Code with Terraform so watch this space for future developments as the HashiCorp/Microsoft partnership ramps up!

Happy coding

Jesse
