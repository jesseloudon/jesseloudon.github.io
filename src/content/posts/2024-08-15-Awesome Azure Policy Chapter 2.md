---
title: "Awesome Azure Policy Chapter 2"
excerpt: "Highlighting the latest awesome content from across the community and official Microsoft sources"
header:
    og_image: /assets/images/AwesomeAzurePolicyChapter2Header.png
    teaser: /assets/images/AwesomeAzurePolicyChapter2Header.png
date: "2024-08-15"
categories:
- "cloud"
tags:
- "azure policy"
- "community"
- "awesome azure policy"
---
![Azure-Policy-Header](/assets/images/AwesomeAzurePolicyChapter2Header.png "Azure-Policy-Header")

Greetings folks and welcome to the belated second chapter of Awesome Azure Policy, a blog series focused on highlighting the latest awesome content from across the community and official Microsoft sources. As there’s an abundance of posts, videos, and repos to share since my initial post I’ve curated a large feed of content down to a few select pickings for this chapter.

## Elevating Privileges Through Azure Policy

![](/assets/images/AwesomeAzurePolicyPrivileges.png)

Security topics and conversations about maintaining high security have been popping up frequently on my radar and I can’t help thinking Azure Policy, being as powerful a service as it is, could somehow be used to escalate privileges to a level that was unintended or undesirable from a least privileged standpoint. This [article](https://medium.com/@vladimir.tul/elevating-privileges-through-azure-policy-872298cf673f) by Vladimir Tulcinsky talks about a particular scenario where one privileged role assignment (Resource Policy Contributor) and an Azure Policy using the DeployIfNotExists effect can snowball into a bad situation where a user/identity can have more privileges than needed.

I think this also raises the important step for us as consultants to guide our customers in ensuring such privileged role assignments are also restricted by [conditions](https://learn.microsoft.com/en-us/azure/role-based-access-control/delegate-role-assignments-portal?tabs=template#step-3-add-a-condition) to only be able to assign other roles which are acceptable from a risk perspective. Thanks to Vladimir for this write-up!

## Identify and prevent abuse of Managed Identities with Federated Credentials from unauthorized entities

![](/assets/images/AwesomeAzurePolicyFederatedCredentials.png)

Continuing on the security track, I want to highlight this [article](https://www.cloud-architekt.net/identify-prevent-abuse-uami-fedcreds/) by Thomas Naunheim which delves into attack scenarios for User Assigned Managed Identities (UAMIs) configured with Federated Credentials and how to monitor/detect/prevent such scenarios from occuring and thus snowballing into a bad situation. Thomas summarises it nicely with a set recommended actions and steps including implementation of several [builtin Azure Policies](https://www.azadvertizer.net/azpolicyinitiativesadvertizer/5e4ee281-95a3-442a-bb2a-5ef68cf5181a.html) currently in public preview.

Having used and recommended usage of Federated Credentials in Service Principals (SPNs) for DevOps pipelines and workflows as an alternative to managing secrets — it’s great to see the investment from Microsoft in releasing and testing Policy Aliases that allow evaluation and control of UAMIs at scale! Thanks to Thomas for this great article!

## Public Preview Announcement: Azure Policy Built-in Versioning

![](/assets/images/AwesomeAzurePolicyVersioning.png)

After many years of storing Azure Policy objects in source control platforms and pushing policy definitions and assignments via policy-as-code workflows to customers, I’m extremely excited to see versioning for builtin Azure Policies becoming more of a reality with [Microsoft’s announcement](https://techcommunity.microsoft.com/t5/azure-governance-and-management/public-preview-announcement-azure-policy-built-in-versioning/ba-p/4186105?WT.mc_id=AZ-MVP-5004598).

This new capability has many benefits for customers wanting more control, easier management, and overall fewer surprises to do with their usage of builtin Azure Policies, similar to what many consultants have been achieving already for many years using policy-as-code methods.

## Enterprise Policy as Code with Azure DevOps

![](/assets/images/AwesomeAzurePolicyEPAC.png)

Microsoft’s [Enterprise Policy as Code](https://azure.github.io/enterprise-azure-policy-as-code/) (EPAC) public project was officially announced back in Sept 2022 and since then has gone through numerous improvements as a maturing solution catering to a large set of use-cases and requirements for managing and maintaining Azure Policies programmatically at scale. It’s been difficult to keep up with the changes but that’s a good problem to have as it shows there is strong demand and a healthy community behind the scenes. At the time of writing there’s been over 170 releases and over 40 individual contributors to this public project!

I want to highlight Luke Murray’s [article](https://luke.geek.nz/azure/enterprise-policy-code-azure-devops/) which gives us a comprehensive overview of usage of EPAC within an Azure DevOps context – I found Luke’s article to be easy to read and understand and gave good insights into the technical implementation of EPAC for Luke’s environment which already contains a range of custom and builtin Azure Policies – this would be a fairly common scenario for customers. Thanks again Luke for the awesome read!

## Infrastructure as Code Testing with Azure Policy

![](/assets/images/AwesomeAzurePolicyIaCTesting.png)

Since Azure Policy first went GA there’s been a few ‘attempts’ at providing a solution to test and validate your IaC templates against deployed Azure Policies during a DevOps pipeline stage. I’ve been discouraged in the past by trialing these solutions but I also acknowledge the problem is not an easy one to solve in a ‘seamless’ fashion.

Anthony Watherston’s excellent [article](https://techcommunity.microsoft.com/t5/core-infrastructure-and-security/infrastructure-as-code-testing-with-azure-policy/ba-p/3921765?WT.mc_id=AZ-MVP-5004598) shows us a potential solution to this problem by leveraging PSRule for Azure and Enterprise Policy as Code (EPAC) to shift-left with testing IaC templates as part of an ‘integration’ test of sorts in a DevOps pipeline which can highlight non-compliance and save you from potential rework or opening up infrastructure security risk post-deployment. EPAC’s PowerShell scripts give us the capability to easily export existing policy objects from our environments, we can then convert those objects to PSRule Rules and then test our IaC templates against those created Rules. Very cool. Kudos Anthony for the awesome walkthrough!

## Closing

Thanks again for reading about the latest awesome Azure Policy content from across the industry.

In my view, Azure Policy continues to play a pivotal role in securing infrastructure against configuration and standards drift. Currently there’s no other native tool that provides the same capability which enteprises desperately need to govern their Azure resources at scale.

I hope you’ll join me for the next Awesome Azure Policy Chapter.

Until then,\
Jesse
