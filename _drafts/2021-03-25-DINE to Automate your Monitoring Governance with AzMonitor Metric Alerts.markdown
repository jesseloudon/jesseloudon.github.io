---
title:  "Azure Spring Clean: DINE to Automate your Monitoring Governance with Azure Monitor Metric Alerts"
excerpt: "Azure Spring Clean is an annual community-driven event, founded by Joe Carlyle & Thomas Thornton, to promote well managed Azure tenants"
header:
    og_image: /assets/images/azurespringclean2021.jpg
    teaser: /assets/images/azurespringclean2021.jpg
date:   "2021-01-28"
categories: 
- "cloud"
tags: 
- "azure spring clean
- "azure policy"
- "monitoring governance"
- "deployifnotexists"
- "dine"
- "azure monitor"
- "metric alerts"
---
# Foreword
Do you recall the film Inception where Cobb (Leonardo DiCaprio) uses dreams to extract and plant ideas or information?

Well Azure Policy's `DeployIfNotExists` effects are Microsoft's Inception masterpiece. 

> For the sake of brevity let's use the acronyom DINE for the rest of this post :)

DINE policies are essentially an ARM template within an Azure Policy definition; and you as the developer are the film director, deciding what conditions need to evaluate to true/false before the ARM template is applied to your Azure resources.

I use DINE policies for automating Azure governance standards, for example; deploy a dynamic metric alert to a standard Load Balancer if it does not exist and configure automated notifications to a mailbox.



Why, Who


# Introduction
What, When




# DINE examples
Where, How


### Finding existing DeployIfNotExists policies

Here's 3 methods you can use to find existing DINE policies either programmatically, via Microsoft Docs, or via the Azure Portal itself!

1. Az PowerShell - 
```powershell
Get-AzPolicyDefinition | where-object {$_.Properties.parameters.effect.allowedValues -contains "DeployIfNotExists"} | FT -autosize}
```
1. **Microsoft Docs** - Go to [https://docs.microsoft.com/en-us/azure/governance/policy/samples/built-in-policies](https://docs.microsoft.com/en-us/azure/governance/policy/samples/built-in-policies) then use CTRL + F in your browser to quickly find DINE policies.
2. **Azure Portal** - Go to [https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyMenuBlade/Definitions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyMenuBlade/Definitions) and using the provided search box with the keyword `deploy` you can narrow down results to *mostly* DINE policies.


### DeployIfNotExists policies for Azure Monitoring Governance

Here's 5 DINE policies I've picked out as examples specifically related to Azure Monitoring Governance. You can use/test these today in your environment, just note that any `Preview` policies have very limited support!

* **Deploy Diagnostic Settings for Network Security Groups** - [Portal](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc9c29499-c1d1-4195-99bd-2ec9e3a9dc89), [GitHub](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/DiagnosticSettingsForNSG_Deploy.json)
* **Preview: Deploy Log Analytics agent to Linux Azure Arc machines** - [Portal](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9d2b61b4-1d14-4a63-be30-d4498e7ad2cf), [GitHub](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/LogAnalyticsExtension_Linux_HybridVM_Deploy.json)
* **Preview: Deploy Dependency agent to Windows Azure Arc machines** - [Portal](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F91cb9edd-cd92-4d2f-b2f2-bdd8d065a3d4), [GitHub](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/DependencyAgentExtension_Windows_HybridVM_Deploy.json)
* **Deploy - Configure Log Analytics agent to be enabled on Windows virtual machine scale sets** - [Portal](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c1b3629-c8f8-4bf6-862c-037cb9094038), [GitHub](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/LogAnalyticsExtension_Windows_VMSS_Deploy.json)
* **Preview: Deploy - Configure Windows Azure Monitor agent to enable Azure Monitor assignments on Windows virtual machines** - [Portal](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fca817e41-e85a-4783-bc7f-dc532d36235e), [GitHub](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/AzureMonitoring_DeployExtensionWindows_Prerequisite.json)

# Policy as Code Workflows

As previously blogged about [here](https://jloudon.com/cloud/Azure-Policy-as-Code-with-Terraform-Part-1/) I believe there are 4 key elements of a policy as code workflow:

* Repeatable - documenting our Azure policies as code files which can be reused by another team
* Scalable - managing our Azure policies across multiple environments without dependencies on manual processes
* Automatable - deploying our Azure policies using DevOps/scripts/tooling which removes the element of human error
* Auditable - keeping an audit/paper trail for changes to Azure policies and deployments to our environments

## DINE with Terraform





## DINE with Bicep





# Conclusion
Next Steps


https://learn.hashicorp.com/collections/terraform/azure-get-started
https://docs.microsoft.com/en-us/learn/modules/build-cloud-governance-strategy-azure/8-control-audit-resources-azure-policy
https://github.com/globalbao/terraform-azurerm-policy
https://github.com/Azure/bicep