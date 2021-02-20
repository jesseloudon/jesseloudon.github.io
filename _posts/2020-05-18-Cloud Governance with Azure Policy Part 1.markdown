---
title: "Cloud Governance with Azure Policy Part 1"
excerpt: "Introduction to the audit vs deny debate, native tooling, and governance at scale"
date:   "2020-05-18"
header:
    og_image: /assets/images/azurepolicy7.png
categories: 
- "cloud"
tags: 
- "azure policy"
- "azure governance"
- "policy as code"
- "policy audit vs deny effects"
---
I'd like to start this blog series with a discussion about balancing priorities because governance over your Azure tenants and subscriptions can be a tricky path to navigate. 

Tricky navigation of priorities can often be seen in larger Azure customers where development and operational teams might operate across multiple geographies along with separate reporting lines.

# The Audit vs Deny Debate

For example when we begin to think about how to apply governance in Azure there's often multiple teams of stakeholders with competing priorities:

* App Dev need to rapidly deploy, test, and ship their code securely
* Ops need to manage service requests, alerts, backups, and network security
* Managers need to control costs and budget, manage risk, and ensure SLAs are met

Every stakeholder above has valid underlying reasons for their priorities and so there's an essential need to strike a balance between an audit vs deny effect when it comes to how you apply governance in the Azure ecosystem.

Some examples of audit vs deny decisions you may face:

* A resource group is created without the minimum tags (e.g. costcentre) - `audit` or `deny`?
* A virtual machine is created without any backup configured - `audit` or `deny`?
* A storage account is created and allows firewall access from all networks - `audit` or `deny`?
* A subnet is created without any network security group association - `audit` or `deny`?
* A network security group inbound rule is created allowing RDP/3389 from any source - `audit` or `deny`?
* A network security group is applied to a gateway subnet - `audit` or `deny`?
* An external guest user is assigned owner-level access to your Azure subscription - `audit` or `deny`?

Another way to think of this debate can be to look at how you apply governance as either proactive or reactive measures.

An example of a proactive measure could be to deny resource group creation if the minimum tags are missing, this helps prevent a future remediation task to add the missing tags. A reactive measure for the same scenario would be to audit resource groups where the tags are missing and then remediate later.

# Native Tooling for Cloud Governance

This brings me to [Azure Policy](https://docs.microsoft.com/en-us/azure/governance/policy/overview) which is a native tool that allows you to apply governance decisions by specifying policy effects such as:

* Append
* Audit
* AuditIfNotExists
* Deny
* DeployIfNotExists
* Disabled
* Modify

It's also a tool which appears to grow in value, almost in lockstep, with your monthly Azure invoices. How cool is that?

Today, there's nearly 300 built-in policy definitions across 32 categories for you to start using. That's not a small number and demonstrates a significant effort by Microsoft to cover a wide range of use cases for Azure Policy.

Here’s some of my favourite Azure policy definitions:

* [Automation account variables should be encrypted](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3657f5a0-770e-44a3-b44e-9431ba1e9735) [(GitHub)](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automation/Automation_AuditUnencryptedVars_Audit.json)
* [Azure Backup should be enabled for Virtual Machines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F013e242c-8828-4970-87b3-ab247555486d) [(GitHub)](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Backup/VirtualMachines_EnableAzureBackup_Audit.json)
* [Configure backup on VMs of a location to an existing central Vault in the same location](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F09ce66bc-1220-4153-8104-e3f51c936913) [(GitHub)](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Backup/VirtualMachineBackup_Backup_DeployIfNotExists.json)
* [Audit virtual machines without disaster recovery configured](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0015ea4d-51ff-4ce3-8d8c-f3f8f0179a56) [(GitHub)](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Compute/RecoveryServices_DisasterRecovery_Audit.json)
* [Allowed locations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe56962a6-4747-49cd-b67b-bf8b01975c4c) [(GitHub)](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/General/AllowedLocations_Deny.json)
* [Key vault should have purge protection enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0b60c0b2-2dc2-4e1c-b5c9-abbed971de53) [(GitHub)](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Key%20Vault/KeyVault_Recoverable_Audit.json)
* [Manage certificates that are within a specified number of days of expiration](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff772fb64-8e40-40ad-87bc-7706e1949427) [(GitHub)](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Key%20Vault/Certificates_Expiry_ByDays.json)
* [Gateway subnets should not be configured with a network security group](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F35f9c03a-cc27-418e-9c0c-539ff999d010) [(GitHub)](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Network/NetworkSecurityGroupOnGatewaySubnet_Deny.json)
* [RDP access from the Internet should be blocked](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe372f825-a257-4fb8-9175-797a8a8627d6) [(GitHub)](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Network/NetworkSecurityGroup_RDPAccess_Audit.json)
* [Network interfaces should not have public IPs](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F83a86a26-fd1f-447c-b59d-e51f44264114) [(GitHub)](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Network/NetworkPublicIPNic_Deny.json)
* [Add or replace a tag on resource groups](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd157c373-a6c4-483d-aaad-570756956268) [(GitHub)](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Tags/AddOrReplaceTag_ResourceGroup_Modify.json)
* [Inherit a tag from the resource group if missing](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fea3f2387-9b95-492a-a190-fcdc54f7b070) [(GitHub)](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Tags/InheritTag_Add_Modify.json)

# Cloud Governance at Scale

When managing multiple Azure tenants and subscriptions there's an increasing need for governance at scale because you often need to do more (governance) with less (people).

Azure Policy provides that governance at scale by giving you the ability to:

* Define your governance rules and effects through policy definitions (.JSON format) which are either built-in or custom.
* Create your custom policy definitions at the management group scope.
* Assign your policies to management groups, subscriptions, and resource groups and, if you wish, exclude certain resources and resource groups.
* Specify your policy assignments using blueprints.
* Evaluate compliance of your policies and kick-off remediation tasks for non-compliant resources.
* Access Azure Policy via the Azure Portal, CLI, PowerShell, REST, SDKs, and ARM templates.
* Having multiple access points into Azure Policy gives you more choice on deployment tooling when executing a policy as code workflow.

Governance at scale can be achieved by moving away from manually managing policies in the Azure Portal to having a repeatable process for policy authoring, testing, and deployment across multiple Azure tenants and subscriptions.

At the time of writing (May 2020), the Microsoft pattern for a [policy as code workflow](https://docs.microsoft.com/en-us/azure/governance/policy/concepts/policy-as-code) provides high-level guidance on:

* Creating and updating policy definitions
* Creating and updating initiative definitions
* Testing and validating the updated definitions
* Enabling remediation tasks
* Updating to enforced assignments
* Processing integrated evaluations

# Closing Remarks

Balancing priorities in the audit vs deny debate can be a comparison of reactive vs proactive measures and choosing which path to take on each.

Governance at scale is possible through adoption of a policy as code workflow and using an IaC/DevOps mindset to integrate repeatable processes for consumption of Azure Policy.  

In [Part 2](https://jloudon.com/cloud/Cloud-Governance-with-Azure-Policy-Part-2/) of this series I’ll deep dive into using the Azure Policy extension for Visual Studio Code and show you a real-world example of using it to author a custom policy definition by finding resource property aliases.

Cheers,

Jesse