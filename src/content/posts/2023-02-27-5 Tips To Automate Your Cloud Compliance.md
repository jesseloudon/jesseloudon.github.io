---
title: "5 Tips To Automate Your Cloud Compliance"
excerpt: "Key inputs to planning and structuring your policy coverage to take full advantage of Azure Policy’s automatic remediation capabilities."
header:
    og_image: /assets/images/FiveTipsCloudCompliance.png
    teaser: /assets/images/FiveTipsCloudCompliance.png
date: "2023-02-27"
categories:
- "cloud"
tags:
- "azure policy"
- "cloud compliance"
- "governance"
- "automation"
---
![5 tips to automate your cloud compliance](/assets/images/FiveTipsCloudCompliance.png "5 tips to automate your cloud compliance")

Azure Policy has huge potential to completely automate your Azure infrastructure configuration and compliance management at scale. This quick blog post aims to shed light on the key inputs to planning and structuring your policy coverage to take full advantage of Azure Policy’s automatic remediation capabilities.

When looking at using Azure Policy, often the initial difficult decision is going to be about which policies you want to implement and what level of enforcement is suitable for your environments.

Environments such as production often have a greater need for regulatory compliance and strict enforcement of **baseline governance standards** for example:

* applying network access restrictions to endpoints and interfaces
* configuring log forwarding for services to a central Log Analytics Workspace
* creating private endpoints and private DNS records
* installing monitoring agents to Virtual Machines
* associating Virtual Machines to Recovery Service Vault policies
* controlling approved Container Registries for Azure Kubernetes Clusters
* restricting authentication methods to services
* applying mandatory tags to resources

Lower level environments such as sandbox and development don’t often warrant strict compliance guardrails to be applied and maintained however you may still want to control costs and maintain isolation from higher level environments across access, network, DNS, and data.

These baseline governance standards can be automatically remediated by policies which contain ‘**modify**‘ or ‘**deployIfNotExists**‘ effects. Automatic remediation means that when a resource, which is in scope of the policy assignment, is created or changed by anyone (or anything) the policy desired configuration will be applied without manual intervention by you. This is perfect for high security, regulated environments.

It’s worth knowing the difference between the two remediation effects available for use with Azure Policy. The ‘**modify**‘ effect interacts with Azure Resource Manager APIs to change resource configuration to match the desired compliance state. This happens quickly and is a fast remediation operation at the time of Azure Resource Manager evaluating the API request.

The ‘**deployIfNotExists**‘ effect can take a bit longer (up to 10mins) to initiate, because of the nature of the change being made to the related resource, so Azure Resource Manager will delay the remediation operation to ensure the initial API request has finished.

Now when planning your cloud remediation strategy, I have 5 tips that can help you:

#### Tip #1

Build your baseline list of built-in and custom policies that contain ‘modify’ or ‘deployIfNotExists’ effects – a search tool such as [AzAdvertizer.net](https://www.azadvertizer.net/) makes this easy. You can maintain your baseline list of policies in a private shared GitHub or Azure DevOps repository for maximum reusability across many projects and environments.

Since the start of 2023 there have been over 100 new built-in policies released by Microsoft focused on automatic remediation of Azure Virtual Desktop, Azure Web PubSub, Azure Arc-enabled servers, Defender for DNS, and resource logging to Storage Accounts and Event Hub.

#### Tip #2

Group similar policies into initiatives – this makes it easier to manage remediation at scale and report on compliance status. There’s no harm in mixing You can use categories such as below to help with grouping:

* Monitoring and Logging
* Security
* Tagging
* Identity and Access Management
* Data Protection
* Cost Control

#### Tip #3

Assign your initiatives to management groups as standard, and subscriptions only when exceptions to the standard are needed – not only does this make it easier to manage remediation at scale and report on compliance status but when assigning initiatives to management groups any new subscriptions created in the future under those management groups will automatically inherit your governance standards.

#### Tip #4

Create role assignments for assignments and follow least privilege guidelines – this is important, no role assignments mean no automatic remediation! You can use built-in RBAC roles your role assignments such as Network Contributor, Log Analytics Contributor, or Security Admin depending on the access requirements of the underlying policy definition!

#### Tip #5

Enable enforcement on assignments – this is also very important, no enforcement means no automatic remediation! By default enforcement is enabled for any new policy assignments so this is not typically a problem however it’s worth double-checking that your existing policy assignments containing remediation effects are enforced because someone may have disabled it in the past as a test or as part of risk mitigation.

_Helpful links:_

[AzAdvertizer.net](https://www.azadvertizer.net/)

[Remediate non-compliant resources with Azure Policy](https://learn.microsoft.com/en-us/azure/governance/policy/how-to/remediate-resources?tabs=azure-portal)

[Azure Policy pattern: deploy resources](https://learn.microsoft.com/en-us/azure/governance/policy/samples/pattern-deploy-resources)

[DeployIfNotExists (effect)](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/effects#deployifnotexists)

[Modify (effect)](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/effects#modify)

Hopefully this post has shed light on the key inputs to planning and structuring your policy coverage to take full advantage of Azure Policy’s automatic remediation capabilities.

I wish you luck in your governance journey!

Jesse
