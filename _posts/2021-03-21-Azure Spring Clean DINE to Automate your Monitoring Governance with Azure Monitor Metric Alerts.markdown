---
title: "Azure Spring Clean: DINE to Automate your Monitoring Governance with Azure Monitor Metric Alerts"
excerpt: "Discover patterns for leveraging DeployIfNotExists (DINE) policies to automate your Azure Monitoring Governance with Azure Monitor Metric Alerts"
header:
    og_image: /assets/images/azspringclean-dine-blog-image.png
    teaser: /assets/images/azspringclean-dine-blog-image.png
date:   "2021-03-21"
categories: 
- "cloud"
tags: 
- "azure spring clean"
- "azure policy"
- "monitoring governance"
- "deployifnotexists"
- "dine"
- "policy as code"
---
![AzureSpringClean2021](/assets/images/azspringclean-dine-blog-image.png "Azure Spring Clean 2021")

Azure Spring Clean is an annual global community-driven event founded/run by [Joe Carlyle](https://twitter.com/wedoazure) and [Thomas Thornton](https://twitter.com/tamstar1234) with the aim of promoting well managed Azure tenants. Over 5 days in March expert-level content from contributors around the globe will be shared via [AzureSpringClean.com](https://www.azurespringclean.com/). 

Today I'm excited to share with you patterns for leveraging DeployIfNotExists (DINE) policies to automate your Azure Monitoring Governance with Azure Monitor Metric Alerts. This blog post aims to give you a *general* overview of what you need to know with splashings of *advanced* technical details from the field. 

## Executive Summary
* Azure Policy's DeployIfNotExists effect provides automation capability via nested Azure Resource Manager (ARM) templates
* Azure Monitor Metric Alerts are just one example use-case for DINE policy automation
* Policy-as-Code workflows ensure a repeatable, scalable, automated, and auditable process

Example deployment of 2x Metric Alerts using our example DINE policy:

![DINEPolicyDeployment1](/assets/images/azspringclean-dine-blog-image5.png "DINE policy example deployment 2x metric alerts - Source: jloudon.com")

![DINEPolicyDeployment2](/assets/images/azspringclean-dine-blog-image6.png "DINE policy example deployment 2x metric alerts - Source: jloudon.com")

## Wait, what's a DINE policy?
Firstly let me introduce DINE policies to you! Do you recall the film Inception where Cobb (Leonardo DiCaprio) uses dreams to extract information from, or plant ideas on, his targets?

![Inception2010](/assets/images/azspringclean-dine-blog-image2.jpg "Source: Inception (2010)")

Well Azure Policy's DeployIfNotExists effect IS Microsoft's Inception :japanese_castle: masterpiece!

DINE policies are essentially an Azure Resource Manager (ARM) template nested within an Azure Policy definition; and you as the developer are the film :clapper: director, deciding what conditions need to evaluate to true/false before the ARM template is applied to your non-compliant Azure resource. 

Just have a look at this simplified breakdown of a DINE policy where I've removed some details to show you the overall framework for usage. How cool is this! :rocket:

![DeployIfNotExistsOverview](/assets/images/azspringclean-dine-blog-image3.png "Azure Policy DeployIfNotExists Overview - Source: jloudon.com")

With DINE policies you can apply compliance, at scale, to your Management Groups and Subscriptions and use Azure Policy's compliance conditions to evaluate nearly any type of resource. The possibilities for DINE policies are quite staggering if you think about it!

## Designing your DINE inception
> Before we build, we must have a vision.

**Key Questions To Ask Yourself**

Key questions which help set the vision for your DINE policy include:

![DINEPolicyDesignKeyQuestions](/assets/images/azspringclean-dine-blog-image7.png "DINE Policy Design Key Questions - Image Source: LAB3")

**Example Responses**

And here's some example responses to these key questions based on the below Azure Monitoring Governance Standard:

> Ensure all production Load Balancers have a baseline metric alert provisioned for DipAvailability (health probe status).

![DINEPolicyDesignKeyQuestionResponses](/assets/images/azspringclean-dine-blog-image8.png "DINE Policy Design Key Question Responses - Image Source: LAB3")

## Implementing DINE with Bicep
Now that we've completed an initial design, let's look at implementation of our Azure Monitoring Governance Standard. 

Today I'm showcasing two example policy-as-code workflows -

1. Bicep (Microsoft)
2. Terraform (HashiCorp)

> For a comparison of Bicep v Terraform check out [Bicep vs Terraform - A fair and balanced comparison - Jon Gallant](https://youtu.be/3lTrIgTJ9yc) and [Azure Bicep vs Terraform Overview - AzureTar](https://youtu.be/exk1QIRwAhU)

Prior to writing this blog post I dived into [Bicep v0.3.1](https://github.com/Azure/bicep/releases/tag/v0.3.1) and manually converted one of my previous DINE policies written in Terraform (.tf) into a Bicep (.bicep) format. The end result was these 4 files below. 

| File | Purpose
:-----|:------
main.bicep | Root module and creates 1x Resource Group for the AzMonitor Action Group
policyDefinition.bicep | Creates 1x DeployIfNotExists Policy Definition and 1x Initiative (policyset)
policyAssignment.bicep | Creates 1x Policy Assignment for the Initiative and 1x Role Assignment
actionGroup.bicep | Creates 1x AzMonitor Action Group used by the DINE Policy

The structure/layout of the .bicep files (illustrated below) ensures that as your Bicep deployment grows in complexity/size you can keep resource types organised in a modular fashion. I've carried this pattern across from past experience managing large Terraform deployments.

![DINEPolicyBicepModules](/assets/images/azspringclean-dine-blog-image9.png "Implementing DINE policies with Bicep Modules - Source: jloudon.com") 

Now for the sake of keeping this blog post under 30 minutes reading time (no, not kidding!) I'm going to focus only on key sections of the above .bicep files.

> Pssst...You can also create and test all examples shown in this blog post directly via the Azure Portal!

**Firstly, we should define condition(s) for policy evaluation**
* Our target resource type is Microsoft.Network/loadBalancers
* Only Load Balancers with Standard SKU support Metric Alerts

*:arrow_down: policyDefinition.bicep*
```s
policyRule: {
    if: {
        allOf: [
            {
                field: 'type'
                equals: metricAlertResourceNamespace
            }
            {
                field: 'Microsoft.Network/loadBalancers/sku.name'
                equals: 'Standard'
            }
        ]
    }
```

**Here we'll use the DINE effect, set a resource type to evaluate, and define condition(s) for DINE evaluation**
* Contributor RBAC role needed for the ARM template to deploy a Metric Alert
* Microsoft.Insights/metricAlerts is our resource type to evaluate during the DINE policy operation
* 3x existenceCondition rules determine whether our resource is compliant or non-compliant (*note: these rules purposefully have broad requirements*)
* The Bicep escape sequence e.g. `\'/resourceGroups/\'` used in our 3rd existenceCondition rule is interesting - read more about it [here](https://github.com/Azure/bicep/blob/main/docs/spec/bicep.md#strings)

*:arrow_down: policyDefinition.bicep*
```s
then: {
    effect: 'deployIfNotExists'
    details: {
        roleDefinitionIds: [
            '/providers/microsoft.authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c' // contributor RBAC role for deployIfNotExists effect
        ]
        type: 'Microsoft.Insights/metricAlerts'
        existenceCondition: {
            allOf: [
                {
                    field: 'Microsoft.Insights/metricAlerts/criteria.Microsoft.Azure.Monitor.MultipleResourceMultipleMetricCriteria.allOf[*].metricNamespace'
                    equals: metricAlertResourceNamespace
                }
                {
                    field: 'Microsoft.Insights/metricAlerts/criteria.Microsoft.Azure.Monitor.MultipleResourceMultipleMetricCriteria.allOf[*].metricName'
                    equals: metricAlertName
                }
                {
                    field: 'Microsoft.Insights/metricalerts/scopes[*]'
                    equals: '[concat(subscription().id, \'/resourceGroups/\', resourceGroup().name, \'/providers/${metricAlertResourceNamespace}/\', field(\'fullName\'))]'
                }
            ]
        }
```

**Here we'll define resource(s) to create with the ARM template**
* Template parameters `resourceName`, `resourceId`, and `resourceLocation` are used to pass in field() values accessible during template runtime
* Template parameters `actionGroupName`, `actionGroupRG`, and `actionGroupID` are used to pass in values from the actionGroup.bicep file
* Note the Bicep escaping required for `odata.type`
* 1x Metric Alert v2 resource is created within the target Load Balancer's resource group
* 3x Metric Alert Dimensions provide additional monitoring capability across multiple data fields e.g. `ProtocolType`, `FrontendIPAddress`, and `BackendIPAddress`

*:arrow_down: policyDefinition.bicep*
```s
deployment: {
    properties: {
        mode: 'incremental'
        template: {
            '$schema': 'https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#'
            contentVersion: '1.0.0.0'
            parameters: {
                resourceName: {
                    type: 'String'
                    metadata: {
                        displayName: 'resourceName'
                        description: 'Name of the resource'
                    }
                }
                resourceId: {
                    type: 'String'
                    metadata: {
                        displayName: 'resourceId'
                        description: 'Resource ID of the resource emitting the metric that will be used for the comparison'
                    }
                }
                resourceLocation: {
                    type: 'String'
                    metadata: {
                        displayName: 'resourceLocation'
                        description: 'Location of the resource'
                    }
                }
                actionGroupName: {
                    type: 'String'
                    metadata: {
                        displayName: 'actionGroupName'
                        description: 'Name of the Action Group'
                    }
                }
                actionGroupRG: {
                    type: 'String'
                    metadata: {
                        displayName: 'actionGroupRG'
                        description: 'Resource Group containing the Action Group'
                    }
                }
                actionGroupId: {
                    type: 'String'
                    metadata: {
                        displayName: 'actionGroupId'
                        description: 'The ID of the action group that is triggered when the alert is activated or deactivated'
                    }
                }
            }
            variables: {}
            resources: [
                {
                    type: 'Microsoft.Insights/metricAlerts'
                    apiVersion: '2018-03-01'
                    name: '[concat(parameters(\'resourceName\'), \'-${metricAlertName}\')]'
                    location: 'global'
                    properties: {
                        description: metricAlertDescription
                        severity: metricAlertSeverity
                        enabled: metricAlertEnabled
                        scopes: [
                            '[parameters(\'resourceId\')]'
                        ]
                        evaluationFrequency: metricAlertEvaluationFrequency
                        windowSize: metricAlertWindowSize
                        criteria: {
                            allOf: [
                                {
                                    alertSensitivity: metricAlertSensitivity
                                    failingPeriods: {
                                        numberOfEvaluationPeriods: '2'
                                        minFailingPeriodsToAlert: '1'
                                    }
                                    name: 'Metric1'
                                    metricNamespace: metricAlertResourceNamespace
                                    metricName: metricAlertName
                                    dimensions: [
                                        {
                                            name: metricAlertDimension1
                                            operator: 'Include'
                                            values: [
                                                '*'
                                            ]
                                        }
                                        {
                                            name: metricAlertDimension2
                                            operator: 'Include'
                                            values: [
                                                '*'
                                            ]
                                        }
                                        {
                                            name: metricAlertDimension3
                                            operator: 'Include'
                                            values: [
                                                '*'
                                            ]
                                        }
                                    ]
                                    operator: metricAlertOperator
                                    timeAggregation: metricAlertTimeAggregation
                                    criterionType: metricAlertCriterionType
                                }
                            ]
                            'odata.type': 'Microsoft.Azure.Monitor.MultipleResourceMultipleMetricCriteria'
                        }
                        autoMitigate: metricAlertAutoMitigate
                        targetResourceType: metricAlertResourceNamespace
                        targetResourceRegion: '[parameters(\'resourceLocation\')]'
                        actions: [
                            {
                                actionGroupId: actionGroupId
                                webHookProperties: {}
                            }
                        ]
                    }
                }
            ]
        }
        parameters: {
            resourceName: {
                value: '[field(\'name\')]'
            }
            resourceId: {
                value: '[field(\'id\')]'
            }
            resourceLocation: {
                value: '[field(\'location\')]'
            }
            actionGroupName: {
                value: actionGroupName
            }
            actionGroupRG: {
                value: actionGroupRG
            }
            actionGroupID: {
                value: actionGroupId
            }
        }
    }
}
```

**And here's the all-important parameter default values we're passing in**

*:arrow_down: main.bicep*
```s
param resourceGroupName string = 'BicepExampleRG'
param resourceGrouplocation string = 'australiaeast'
param actionGroupName string = 'BicepExampleAG'
param actionGroupEnabled bool = true
param actionGroupShortName string = 'bicepag'
param actionGroupEmailName string = 'jloudon'
param actionGroupEmail string = 'jesse.loudon@lab3.com.au'
param actionGroupAlertSchema bool = true
param metricAlertResourceNamespace string = 'Microsoft.Network/loadBalancers'
param metricAlertName string = 'DipAvailability'
param metricAlertDimension1 string = 'ProtocolType'
param metricAlertDimension2 string = 'FrontendIPAddress'
param metricAlertDimension3 string = 'BackendIPAddress'
param metricAlertDescription string = 'Average Load Balancer health probe status per time duration'
param metricAlertSeverity string = '2'
param metricAlertEnabled string = 'true'
param metricAlertEvaluationFrequency string = 'PT15M'
param metricAlertWindowSize string = 'PT1H'
param metricAlertSensitivity string = 'Medium'
param metricAlertOperator string = 'LessThan'
param metricAlertTimeAggregation string = 'Average'
param metricAlertCriterionType string = 'DynamicThresholdCriterion'
param metricAlertAutoMitigate string = 'true'
param assignmentEnforcementMode string = 'Default'
```

> :wave: If the metricAlert inputs above aren't making much sense I recommend parsing Microsoft's ARM template reference for [Metric Alerts](https://docs.microsoft.com/en-us/azure/templates/microsoft.insights/metricalerts?tabs=json)

**Finally we're creating an RBAC role assignment**
* This step is needed because Azure policy assignments don't automatically create an RBAC role assignment for the generated identity which means our DINE policy won't have the required permissions to create a metric alert at the target's resource group
* Above finding may be a bug/defect with policy assignments and I hope it's looked at by Microsoft support in due course :smile:

*:arrow_down: policyAssignment.bicep*
```s
resource roleAssignment 'Microsoft.Authorization/roleAssignments@2020-04-01-preview' = {
  name: guid(bicepExampleAssignment.name, bicepExampleAssignment.type, subscription().subscriptionId)
  properties: {
    principalId: bicepExampleAssignment.identity.principalId
    roleDefinitionId: '/providers/microsoft.authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c' // contributor RBAC role for deployIfNotExists effect
  }
}
```

Ok folks, that was a ton of code to process so congrats if you're still with me! :clap:

> You can find the full Bicep example from above here: [deployifnotexists-policy-with-initiative-and-assignment](https://github.com/globalbao/bicep-policy-examples/tree/main/deployifnotexists-policy-with-initiative-and-assignment)

### Implementation/Testing Flow
To deploy this example with Bicep ensure you have at least [azure-cli](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) version 2.20.0 which comes with Bicep integration (nice!). I also recommend grabbing the [Bicep VSCode extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep) to benefit from validation and intellisense for your .bicep files.

* **1 - Deploy your DINE policy using Bicep via below cli steps**

```bash
#(required) Authenticate to Azure
az login

#(optional) Set your Azure Subscription context
az subscription set -s xxxxx-xxxxx-xxxxx-xxxxx-xxxxx

#(optional) Build/Validate the main.bicep file into .json
az bicep build -f ./main.bicep

#(required) Deploy main.bicep to Subscription scope at Australia East region
az deployment sub create -f ./main.bicep -l australiaeast

#(optional) Trigger a Subscription scope policy compliance scan
az policy state trigger-scan
```

* **2 - Deploy a new Load Balancer**
* **3 - Wait about 11 minutes** (*this is how long it took in my environment before the DINE policy automatically deployed the metric alert*)
* **4 - Verify the DINE policy deployed 1x metric alert to your Load Balancer's resource group** (*tip: toggle **Show Hidden Types** in the portal*)

![DINEPolicyDeploymentResult1](/assets/images/azspringclean-dine-blog-image5.png "DINE policy example deployment 2x metric alerts - Source: jloudon.com")

![DINEPolicyDeploymentResult2](/assets/images/azspringclean-dine-blog-image6.png "DINE policy example deployment 2x metric alerts - Source: jloudon.com")

* **5 - For existing Load Balancers run a remediation task from the Azure Policy blade and repeat step 4 above**

> If you want to get really DevOps-y and shift your policy testing to the left within your deployment pipeline check out Fabian Wohlschläger's [azure-policy-testing](https://github.com/fawohlsc/azure-policy-testing) project!

## Implementing DINE with Terraform

Last year (2020) was a huge year of Terraform for me and I had the wonderful opportunity to design and deploy about 38 Azure Monitoring Governance DINE policies for a large customer. 

These 38 DINE policies are designed to provide baseline Monitoring Governance for production workloads where no existing metric alerts are deployed. 

> Note: There's flexibility provided by the DINE policy via their `existenceCondition` rules. For example - if metric alerts are deployed to the target resources e.g. Load Balancer, SQL Database, etc and they match the existenceCondition rules set within the policy JSON then these DINE policies will not overwrite, deny, or replace these alerts.

My Terraform modules are organised as per the following diagram ensuring the same resource types are located and managed together.

![DINEPolicyTerraformModules](/assets/images/terraform5.png "Implementing DINE policies with Terraform Modules - Source: jloudon.com")

And here's a summary of the 38x Monitoring Governance DINE policies, 1x Initiative, and 1x Assignment:

|Module                  | Resource Type                 | Resource name                          | Deployment Count
|:-----------------------|:------------------------------|:---------------------------------------|:-----
| policy_definitions     | azurerm_policy_definition     | appGateway_{metricName}                | 6
| policy_definitions     | azurerm_policy_definition     | azureFirewall_{metricName}             | 1
| policy_definitions     | azurerm_policy_definition     | sqlManagedInstances_{metricName}       | 2
| policy_definitions     | azurerm_policy_definition     | sqlServerDB_{metricName}               | 5
| policy_definitions     | azurerm_policy_definition     | loadBalancer_{metricName}              | 2
| policy_definitions     | azurerm_policy_definition     | websvrfarm_{metricName}                | 2
| policy_definitions     | azurerm_policy_definition     | website_{metricName}                   | 6
| policy_definitions     | azurerm_policy_definition     | websiteSlot_{metricName}               | 6
| policy_definitions     | azurerm_policy_definition     | expressRoute_{metricName}              | 8
| policyset_definitions  | azurerm_policy_set_definition | monitoring_governance                  | 1
| policy_assignments     | azurerm_policy_assignment     | monitoring_governance                  | 1

> There's plenty of detailed README action within this project so I'm hesitant to duplicate the Terraform code here as the JSON pattern is nearly identical to what I've shown above with Bicep. You can find the full repo at [terraform-azurerm-policy](https://github.com/globalbao/terraform-azurerm-policy)

### Implementation/Testing Flow
To deploy/test this example with Terraform ensure you have at least [hashicorp-terraform](https://releases.hashicorp.com/terraform/0.13.6/) version 0.13.6. I also recommend grabbing the [HashiCorp Terraform VSCode extension](https://marketplace.visualstudio.com/items?itemName=HashiCorp.terraform) to benefit from syntax highlighting and other awesome editing features for your .tf files.

* **1 - Deploy your DINE policy using Terraform via below cli steps**

```bash
#(required) Authenticate to Azure
az login

#(optional) Set your Azure Subscription context
az subscription set -s xxxxx-xxxxx-xxxxx-xxxxx-xxxxx

#(required) Initialize the Terraform modules
terraform init

#(optional, recommended) Verify Terraform files
terraform validate

#(optional, recommended) Verify/What-If your Terraform changes to Azure
terraform plan

#(required) Apply your Terraform changes to Azure
terraform apply

#(optional) Trigger a Subscription scope policy compliance scan
az policy state trigger-scan
```

* **2 - Steps 2-5 here are the same as described above within the 'DINE with Bicep > Implemention/Testing Flow' section**

## Machine Learning via Dynamic Thresholds
Before we continue on with this blog post it's worth giving a shoutout to the Microsoft team that brought us dynamic thresholds for use with Azure monitor metric alerts (v2) :+1:

I think it's ultra-cool that we have the option to use either static or dynamic thresholds (machine learning) because with more configuration choice comes greater use-cases for consumers. And we're also less constrained when designing our Azure Monitoring Governance patterns.

> Metric Alert with Dynamic Thresholds detection leverages advanced machine learning (ML) to learn metrics' historical behavior, identify patterns and anomalies that indicate possible service issues. It provides support of both a simple UI and operations at scale by allowing users to configure alert rules through the Azure Resource Manager API, in a fully automated manner. Once an alert rule is created, it will fire only when the monitored metric doesn’t behave as expected, based on its tailored thresholds. Src: Microsoft

![AzureMonitorMetricAlertsDynamicThresholds](/assets/images/azspringclean-dine-blog-image4.png "Azure Monitor Metric Alerts using Dynamic Thresholds - Source: Microsoft")

Historically I've preferred leveraging dynamic thresholds over static thresholds because:

* As resource usage patterns change seasonally, or due to other predictable events, only sigificant / out of the ordinary alerts are raised for resources resulting in reduced 'alert noise' for the service desk to respond to
* I'm also an advocate of data-driven monitoring where buckets of data are analyzed by machine learning for trends/patterns and alerts raised only if they meet our dynamic threshold specifications

> The big caveat to using Dynamic Thresholds is that without enough metric data ([3 days and at least 30 samples](https://docs.microsoft.com/en-us/azure/azure-monitor/alerts/alerts-dynamic-thresholds#how-much-data-is-needed-to-trigger-an-alert)) to parse and learn from you won't have any alerts raised by Azure Monitor. This doesn't impact existing resources that have enough historical metric data to provide, but does impact our ability to effectively monitor newly provisioned resources. To combat this caveat you can look to deploy metric alerts using static thresholds to your new resources and then remove them after a period of time. 

What are your thoughts on static vs dynamic thresholds? Let me know in the comments below! :loudspeaker:

## Finding Existing Built-In Examples of DINE policies

When designing your own DeployIfNotExists policies you'll want to seek inspiration and also not reinvent the wheel!

So here's several methods you can use to find existing DINE policies either programmatically, via Microsoft Docs, or via the Azure Portal itself!

**AzPowerShell - thanks to [Stefan Ivemo](https://twitter.com/StefanIvemo) :star:**

```powershell
$allPolicies = Get-AzPolicyDefinition

$policies = [System.Collections.ArrayList]::new()
foreach ($policy in $allPolicies) {
    if ('DeployIfNotExists' -in $policy.Properties.Parameters.effect.allowedValues) {
        $policyInfo = [PSCustomObject]@{
            Name               = $policy.Name
            DisplayName        = $policy.Properties.DisplayName
            PolicyDefinitionId = $policy.PolicyDefinitionId
        }
        $null = $policies.Add($policyInfo)
    }
}
$policies
```

**AzCLI - thanks to [Jon Gallant](https://twitter.com/jongallant) :star:**

```bash
az policy definition list --query [?parameters.effect.allowedValues=='DeployIfNotExists']
```

**AzCLI + AzPowerShell - thanks to [Casey Mullineaux](https://twitter.com/Nurfballs) :star:**

```powershell
az policy definition list |  ConvertFrom-Json | Where-Object { $_.parameters.effect.allowedValues -like 'DeployIfNotExists' }
```

**Microsoft Docs**

Microsoft Doc enthusiasts can go to [built-in-policies](https://docs.microsoft.com/en-us/azure/governance/policy/samples/built-in-policies) and use CTRL + F in your browser with the keyword `deploy` to quickly find DINE policies.

**Azure Portal**

Portal vanguards can go to [azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyMenuBlade/Definitions) then using the provided search box with the keyword `deploy` you can narrow down results to DINE policies.

### 5 Example Built-In Azure Monitoring Governance DINE policies

If searching using the above methods isn't your thing and you're time poor here's 5 DINE policies I've picked out as examples specifically related to Azure Monitoring Governance. 

You can freely test these policies today in your environment!

* **Deploy Diagnostic Settings for Network Security Groups** - [Portal](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc9c29499-c1d1-4195-99bd-2ec9e3a9dc89), [GitHub](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/DiagnosticSettingsForNSG_Deploy.json)
* **Preview: Deploy Log Analytics agent to Linux Azure Arc machines** - [Portal](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9d2b61b4-1d14-4a63-be30-d4498e7ad2cf), [GitHub](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/LogAnalyticsExtension_Linux_HybridVM_Deploy.json)
* **Preview: Deploy Dependency agent to Windows Azure Arc machines** - [Portal](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F91cb9edd-cd92-4d2f-b2f2-bdd8d065a3d4), [GitHub](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/DependencyAgentExtension_Windows_HybridVM_Deploy.json)
* **Deploy - Configure Log Analytics agent to be enabled on Windows virtual machine scale sets** - [Portal](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c1b3629-c8f8-4bf6-862c-037cb9094038), [GitHub](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/LogAnalyticsExtension_Windows_VMSS_Deploy.json)
* **Preview: Deploy - Configure Windows Azure Monitor agent to enable Azure Monitor assignments on Windows virtual machines** - [Portal](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fca817e41-e85a-4783-bc7f-dc532d36235e), [GitHub](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/AzureMonitoring_DeployExtensionWindows_Prerequisite.json)

# Conclusion

I'm going to have to end this blog post here although I've many more ideas and thoughts to include about the why, where, what, when, and who of Azure Policy and it's automation capability via the DeployIfNotExists effect. 

Many hours of sleep have been lost but it's been worth every cycle to share knowledge and learnings with the Azure community :heart:

Huge thanks to [Joe Carlyle](https://twitter.com/wedoazure) and [Thomas Thornton](https://twitter.com/tamstar1234) for the opportunity to contribute to this year's #AzureSpringClean - make sure to check out expert-level content from contributors around the globe via [AzureSpringClean.com](https://www.azurespringclean.com/) :rocket:

I hope this blog post has inspired you to do more with Azure Policy, Azure Monitor Metric Alerts, and adopt a policy-as-code workflow for your well managed Azure Tenants. 

Your comments/questions/suggestions are most welcome, cheers!

Jesse