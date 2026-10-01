---
title: "Awesome Azure Policy Chapter 1"
excerpt: "Highlighting the latest awesome Azure Policy content from across the community and official Microsoft sources"
header:
    og_image: /assets/images/AwesomeAzurePolicyChapter1Header.png
    teaser: /assets/images/AwesomeAzurePolicyChapter1Header.png
date: "2023-09-25"
categories:
- "cloud"
tags:
- "azure policy"
- "community"
- "awesome azure policy"
---
![Azure Policy Header](/assets/images/AwesomeAzurePolicyChapter1Header.png "Azure Policy Header")

Greetings folks and welcome to the first chapter of a new series focused on highlighting the latest awesome Azure Policy content from across the community and official Microsoft sources. There’s way too many amazing posts, videos, and repos to share so I’ve curated the list down to these few pickings for this chapter release.

## Azure Policy Exemptions Added to Resource Graph

![Azure Policy Exemptions Added to Resource Graph](/assets/images/AwesomeAzurePolicyExemptions.png "Azure Policy Exemptions Added to Resource Graph")

First up we have Billy York giving us a heads up that [Azure Policy exemptions](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/exemption-structure?WT.mc_id=AZ-MVP-5004598 "Azure Policy exemption structure") have made their way into the [Azure Resource Graph](https://learn.microsoft.com/en-us/azure/governance/resource-graph/overview?WT.mc_id=AZ-MVP-5004598 "What is Azure Resource Graph?") which is a native tool that allows you to search resources effectively at scale. Policy exemptions are commonly used to exclude certain resources and/or resources groups from a policy’s compliance check.

A classic problem can arise when you have a vast Azure infrastructure estate and related Azure Policy guardrails applied with multiple exemptions to keep tabs on. And in some cases you could find exemptions with no expiration date or documented reason for it’s creation — a potential red flag to follow-up on for the infra/security team.

So in summary, keeping track of what Azure Policy exemptions are existing and if any exemptions might be expiring soon is made even easier these days with a tool like Azure Resource Graph and thanks to [Billy’s post](https://www.cloudsma.com/2023/09/azure-policy-exemptions-resource-graph/ "Azure Policy Exemptions Added to Resource Graph") we are provided with what he calls ‘**The Beast**‘ — a KQL query that combines policy states with exemptions and importantly a timeframe in which an exemption will expire or if no expiry is set.

## Monitoring Azure Policy compliance across your Azure Managed Application deployments

![Monitoring Azure Policy compliance across your Azure Managed Application deployments](/assets/images/AwesomeAzurePolicyManagedApps.png "Monitoring Azure Policy compliance across your Azure Managed Application deployments")

My next highlighted content is a post by Polina Olemskaia (Microsoft) covering a solution named “**Policy States Collector**” which is designed to monitor Azure Policy compliance states across Azure Managed Application deployments. In case you’re wondering — [Managed Applications](https://learn.microsoft.com/en-us/partner-center/marketplace/plan-azure-app-managed-app?WT.mc_id=AZ-MVP-5004598) are packaged and published via the commercial marketplace and it’s recommended to apply [Azure Policies](https://learn.microsoft.com/en-us/partner-center/marketplace/plan-azure-app-managed-app#policy-settings?WT.mc_id=AZ-MVP-5004598) to ensure the deployed solution meets compliance requirements.

There’s a problem for the owners of Managed Applications that this “**Policy States Collector**” solution addresses and that is — how to securely and effectively monitor Azure Policy compliance states of the Apps deployed in your customer tenants.

Polina’s [post](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/monitoring-azure-policy-compliance-across-your-azure-managed/ba-p/3922113?WT.mc_id=AZ-MVP-5004598) covers the problem statement, design, implementation, and deployment nicely and I think it’s one of the better Microsoft articles I’ve come across with this subject matter in mind and certainly deserving of an ‘awesome’ tag. Bonus points because there’s a decent README in their [GitHub repository](https://github.com/Azure/azure-marketplace-management-extras/blob/main/README.md) and they’ve shared [GitHub actions workflows](https://github.com/Azure/azure-marketplace-management-extras/tree/main/.github/workflows) to automate the infra and function app deployment.

## The War of the Policies

![Episode 349 – The War of the Policies](/assets/images/AwesomeAzurePolicyPodcast.png "Episode 349 – The War of the Policies")

If you’ve been following the Azure Policy community for some time like I have you’ll know that podcasts covering the subject matter are few and far between — this baffles me slightly because I’m confident most infra/devops people working with Azure day-to-day would be aware of the Azure Policy tool/service and have some thoughts and opinions they would like to share about it’s usage (given how crucial a tool that applies guardrails is to any enterprise operating in the cloud).

Anyways I’m super excited to announce a recent podcast episode from Ben Stegink and Scott Hoag over at the Microsoft Cloud IT Pro Podcast. In this [episode 349 The War of the Policies](https://www.msclouditpropodcast.com/episode349/) Ben and Scott are focused on ‘from the field’ considerations and recommendations for enabling diagnostic settings at scale with Azure Policy.

I listened to the entire episode and found many of the problem statements, solutions and methods mentioned pretty spot on with my own experiences (especially the part on conflicting policies for configuring diagnostic settings to Log Analytics Workspaces!).

## Closing

Thanks for reading about the latest awesome Azure Policy content from across the industry.

In my view, Azure Policy continues to play a pivotal role in securing infrastructure against configuration and standards drift. Currently there’s no other native tool that provides the same capability which enteprises desperately need to govern their Azure resources at scale.

I hope you’ll join me for the next Awesome Azure Policy Chapter.

Until then,\
Jesse
