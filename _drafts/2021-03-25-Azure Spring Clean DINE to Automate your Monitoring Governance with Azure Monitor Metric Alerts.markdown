---
title: "Azure Spring Clean: DINE to Automate your Monitoring Governance with Azure Monitor Metric Alerts"
excerpt: "Azure Spring Clean is an annual community-driven event, founded by Joe Carlyle & Thomas Thornton, to promote well managed Azure tenants"
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
- "azure monitor"
- "metric alerts"
---
![AzureSpringClean2021](/assets/images/azspringclean-dine-blog-image.png "Azure Spring Clean 2021")

Azure Spring Clean is an annual community-driven event founded by Joe Carlyle & Thomas Thornton to promote well managed Azure tenants. Today I'm excited to share with you a pattern for leveraging DeployIfNotExists (DINE) policies to automate your Azure Monitoring Governance with Azure Monitor Metric Alerts.

This blog post aims to give you a *general* overview of what you need to know with splashings of *advanced* technical details from the field. 

## Executive Summary
* Azure Policy can automate your governance standards using the DINE effect
* Azure Monitor Metric Alerts are just one example of a use case for the above automation
* Policy-as-Code workflows are important to ensure a repeatible, scalable, automated, and auditable policy management process.

## What is a DINE policy?
Firstly let me introduce DINE policies to you! Do you recall the film Inception where Cobb (Leonardo DiCaprio) uses dreams to extract information from, or plant ideas on, his targets?

![Inception2010](/assets/images/azspringclean-dine-blog-image2.jpg "Source: Inception (2010)")

Well Azure Policy's DeployIfNotExists effect IS Microsoft's Inception masterpiece! 

They are essentially an Azure Resource Manager (ARM) template nested within an Azure Policy definition; and you as the developer are the film director, deciding what conditions need to evaluate to true/false before the ARM template is applied to your non-compliant Azure resource. 

Just have a look at this simplified breakdown of a DINE policy where I've removed some details to show you the overall framework for usage. How cool is this!

![DeployIfNotExistsOverview](/assets/images/azspringclean-dine-blog-image3.png "Azure Policy DeployIfNotExists Overview - Source: jloudon.com")

With DINE policies you can apply compliance, at scale, to your Management Groups and Subscriptions and use Azure Policy's compliance conditions to evaluate nearly any type of resource. The possibilities for DINE policies are quite staggering if you think about it!

In the context of this blog post we'll leverge the magic and majesty of DINE policies to automate delivery of our desired Azure Monitoring Governance standard as defined below.

> Azure Monitoring Governance standard: Provision a *Metric Alert (v2) with Dynamic Threshold* to a *Standard Load Balancer* if it does not exist and configure automated alert *email notification* to a mailbox.

## Machine Learning and Dynamic Thresholds
Before we continue I think it's worth giving a shoutout to the Microsoft team for giving us Dynamic Thresholds for use with Azure Monitor Metric Alerts (v2).

I think it's extremely-super-cool that we have the option to use either Static or Dynamic Thresholds (Machine Learning) for Metric Alerts because with more configuration choice comes greater use-cases for consumers. And we're also less constrained when designing our Azure Monitoring Governance patterns.

> Metric Alert with Dynamic Thresholds detection leverages advanced machine learning (ML) to learn metrics' historical behavior, identify patterns and anomalies that indicate possible service issues. It provides support of both a simple UI and operations at scale by allowing users to configure alert rules through the Azure Resource Manager API, in a fully automated manner.
Once an alert rule is created, it will fire only when the monitored metric doesn’t behave as expected, based on its tailored thresholds. Src: Microsoft

![AzureMonitorMetricAlertsDynamicThresholds](/assets/images/azspringclean-dine-blog-image4.png "Azure Monitor Metric Alerts using Dynamic Thresholds - Source: Microsoft")

## Designing a DINE Policy
Before we build, we must design.

**Key Questions To Ask Yourself**

* What condition(s) should evaluate to true/false before we evaluate a resource for the DINE deployment?
* What resource type are we evaluating for the DINE deployment?
* What condition(s) should evaluate to true/false before we mark a resource as non-compliant/complaint?
* What resource(s) need to be created via the ARM template?

**Responses in relation to our Monitoring Governance Standard**

| Question | Response
:-----|:------
What condition(s) should evaluate to true/false before we evaluate a resource for the DINE effect? | Microsoft.Network/loadBalancers = true, Microsoft.Network/loadBalancers/sku.name = Standard
What resource type are we evaluating for the DINE deployment? | Microsoft.Insights/metricAlerts
What condition(s) should evaluate to true/false before we mark a resource as non-compliant/complaint? | metricNamespace = Microsoft.Network/loadBalancers, metricName = DipAvailability, scope = resourceID
What resource(s) need to be created via the ARM template?  | 1x Metric Alert v2 using Dynamic Threshold for Microsoft.Network/loadBalancers DipAvailability deployed to the resource's existing RG

So for implementation of our Azure Monitoring Governance standard mentioned prior I'm showcasing two example policy-as-code workflows:

1. Bicep (Microsoft)
2. Terraform (HashiCorp)

> You can also create and test all examples shown in this blog post directly via the Azure Portal!

## Policy As Code with Bicep
Prior to writing this blog post I dived into Bicep v0.3.1 and converted one of my previous DINE policies written in Terraform (.tf) into a Bicep (.bicep) format. The end result was these 4 files below. 

| File | Purpose
:-----|:------
main.bicep | Root module/file to pass in parameter values to other modules and run the deployment
policyDefinition.bicep | Creates the DeployIfNotExists Policy Definition and Initiative
policyAssignment.bicep | Creates the Policy Assignment for the Initiative
actionGroup.bicep | Creates the Azure Monitor Action Group used by the DINE Policy

For the sake of keeping this blog post under 20 minutes reading time I'm going to break out the key sections of only the `policyDefinition.bicep` file and `main.bicep` file.

**Firstly we should define condition(s) for policy evaluation**

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

**Secondly we need to use the DINE effect, set a resource type to evaluate, and define condition(s) for DINE evaluation**

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

**Finally we can define resource(s) to create with an ARM template**

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

**Key parameter values we're passing in from main.bicep**

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


You can find the full Bicep example from above here: [deployifnotexists-policy-with-initiative-and-assignment](https://github.com/Azure/bicep/tree/main/docs/examples/301/deployifnotexists-policy-with-initiative-and-assignment)

To deploy this example with Bicep make sure you have at least [azure-cli](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) version 2.20.0 which comes with Bicep integration.

```
az login
az bicep build -f ./main.bicep
az deployment sub create -f ./main.bicep -l australiaeast
```

## Policy As Code with Terraform









## Finding existing DeployIfNotExists policies

Here's several methods you can use to find existing DINE policies either programmatically, via Microsoft Docs, or via the Azure Portal itself!

1. AzPowerShell - 
```powershell
Get-AzPolicyDefinition | where-object {$_.Properties.parameters.effect.allowedValues -contains "DeployIfNotExists"} | FT -autosize}
```
2. AzCLI -
```bash
az policy definition list --query [?parameters.effect.allowedValues=='DeployIfNotExists']
```
3. **Microsoft Docs** - Go to [https://docs.microsoft.com/en-us/azure/governance/policy/samples/built-in-policies](https://docs.microsoft.com/en-us/azure/governance/policy/samples/built-in-policies) then use CTRL + F in your browser to quickly find DINE policies.
4. **Azure Portal** - Go to [https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyMenuBlade/Definitions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyMenuBlade/Definitions) and using the provided search box with the keyword `deploy` you can narrow down results to *mostly* DINE policies.


### Example DeployIfNotExists policies for Azure Monitoring Governance

Here's 5 DINE policies I've picked out as examples specifically related to Azure Monitoring Governance. You can freely test these policies today in your environment!

* **Deploy Diagnostic Settings for Network Security Groups** - [Portal](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc9c29499-c1d1-4195-99bd-2ec9e3a9dc89), [GitHub](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/DiagnosticSettingsForNSG_Deploy.json)
* **Preview: Deploy Log Analytics agent to Linux Azure Arc machines** - [Portal](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9d2b61b4-1d14-4a63-be30-d4498e7ad2cf), [GitHub](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/LogAnalyticsExtension_Linux_HybridVM_Deploy.json)
* **Preview: Deploy Dependency agent to Windows Azure Arc machines** - [Portal](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F91cb9edd-cd92-4d2f-b2f2-bdd8d065a3d4), [GitHub](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/DependencyAgentExtension_Windows_HybridVM_Deploy.json)
* **Deploy - Configure Log Analytics agent to be enabled on Windows virtual machine scale sets** - [Portal](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c1b3629-c8f8-4bf6-862c-037cb9094038), [GitHub](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/LogAnalyticsExtension_Windows_VMSS_Deploy.json)
* **Preview: Deploy - Configure Windows Azure Monitor agent to enable Azure Monitor assignments on Windows virtual machines** - [Portal](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fca817e41-e85a-4783-bc7f-dc532d36235e), [GitHub](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/AzureMonitoring_DeployExtensionWindows_Prerequisite.json)



# Conclusion
Next Steps


https://learn.hashicorp.com/collections/terraform/azure-get-started
https://docs.microsoft.com/en-us/learn/modules/build-cloud-governance-strategy-azure/8-control-audit-resources-azure-policy
https://github.com/Azure/bicep