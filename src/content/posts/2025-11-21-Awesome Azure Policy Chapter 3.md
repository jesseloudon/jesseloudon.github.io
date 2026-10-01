---
title: "Awesome Azure Policy Chapter 3"
excerpt: "Highlighting the latest awesome content from across the community and official Microsoft sources"
header:
    og_image: /assets/images/AwesomeAzurePolicyChapter3Header.png
    teaser: /assets/images/AwesomeAzurePolicyChapter3Header.png
date: "2025-11-21"
categories:
- "cloud"
tags:
- "azure policy"
- "community"
- "awesome azure policy"
---
![Azure-Policy-Header](/assets/images/AwesomeAzurePolicyChapter3Header.png "Azure-Policy-Header")

Greetings folks and welcome to the third chapter of Awesome Azure Policy, a blog series focused on highlighting the latest awesome content from across the community and official Microsoft sources. As there’s an abundance of posts, videos, and repos to share since my second post I’ve curated a large feed of content down to a few select pickings for this chapter.

## EPAC Official YouTube Launch

[![EPAC YouTube Channel Launch](/assets/images/AwesomeAzurePolicyEPACYouTube.png)](https://www.youtube.com/@EnterprisePolicyAsCode)

The [Enterprise Policy as Code (EPAC)](https://azure.github.io/enterprise-azure-policy-as-code/) project from Microsoft continues to grow from strength to strength with a recent launch of their official channel **[@EnterprisePolicyAsCode](https://www.youtube.com/@EnterprisePolicyAsCode)**already filled with awesome content to support the project’s existing detailed [documentation wiki](https://azure.github.io/enterprise-azure-policy-as-code/).

With regular updates to the official repo from maintainers and the community translating to a healthy pipeline of content for this EPAC channel I’m excited to see the project continue to mature and innovate in the Azure policy as code space.

## Getting Started with Enterprise Policy As Code

[![Getting Started with Enterprise Policy As Code - Azure Policy](/assets/images/AwesomeAzurePolicyGettingStartedEPAC.png)](https://youtu.be/rhc5T8caBWo?si=QgDXvyLH5gIm2a0-)

Continuing on with the awesome EPAC theme of this post – Sunny aka [@SomeoneElsesCloud](https://www.youtube.com/@SomeoneElsesCloud) has just released new high-quality content covering how to get started with EPAC. I’ve shared the timestamps below so you can get a sense of the breadth and depth of what Sunny dives into. Great work!

[00:00](https://www.youtube.com/watch?v=rhc5T8caBWo) Intro

[00:13](https://www.youtube.com/watch?v=rhc5T8caBWo&t=13s) What is EPAC?

[00:41](https://www.youtube.com/watch?v=rhc5T8caBWo&t=41s) Azure Policy Benefits

[01:56](https://www.youtube.com/watch?v=rhc5T8caBWo&t=116s) Policy Definitions, Initiatives & Assignments

[04:56](https://www.youtube.com/watch?v=rhc5T8caBWo&t=296s) Software Requirements

[05:25](https://www.youtube.com/watch?v=rhc5T8caBWo&t=325s) Azure RBAC Requirements

[06:05](https://www.youtube.com/watch?v=rhc5T8caBWo&t=365s) EPAC Folder Structure Explained

[07:15](https://www.youtube.com/watch?v=rhc5T8caBWo&t=435s) Global Settings Configuration File Explained

[12:06](https://www.youtube.com/watch?v=rhc5T8caBWo&t=726s) Deployment Scripts

[14:00](https://www.youtube.com/watch?v=rhc5T8caBWo&t=840s) EPAC Documentation + GitHub Repo

[15:05](https://www.youtube.com/watch?v=rhc5T8caBWo&t=905s) Demo Walkthrough

[27:20](https://www.youtube.com/watch?v=rhc5T8caBWo&t=1640s) Azure DevOps Pipeline + Repo Governance and Controls

[30:31](https://www.youtube.com/watch?v=rhc5T8caBWo&t=1831s) EPAC Tools – AzAdvertizer + AzGovViz

[33:13](https://www.youtube.com/watch?v=rhc5T8caBWo&t=1993s) Wrap Up

## Azure Policy Agents – Automated Testing Framework

![](/assets/images/AwesomeAzurePolicyAgents.png)

Microsoft have recently made public a new concept for automating testing of Azure Policies leveraging Microsoft Foundry and Agent based testing. Architecture-wise the solution is fairly simple – agents hosted in Microsoft Foundry have custom instructions on testing policies – a single GitHub Action workflow uses PowerShell scripts to validate and detected changed policies in the branch before handing off the policy testing to the Agent which evaluates what’s needed to test the policy before creating and executing a PowerShell script to test the policy’s effect end to end (including creation of non-compliant resources).

At the time of writing Microsoft’s project [AzurePolicyAgents](https://github.com/Azure/AzurePolicyAgents) only supports policies with Deny and Audit effects driven by GitHub Actions and there are backlog items to address these gaps. As part of a recent Arinco hackathon my team took on the challenge of forking and uplifting the project to support more policy effects and enhance the scalability and automation overall. Based on this recent experience I am quite happy with how the concept works overall given we were able to achieve a repeatable policy testing process for new/changed policies and I could see there were time savings with this approach vs other approaches I’ve seen out there in the wild. Watch this space!

## Closing

Thanks again for reading about the latest awesome Azure Policy content from across the industry.

In my view, Azure Policy engines and deployment/management of policy objects is pretty much a ‘solved problem’ now with projects like EPAC. The largest gap to address now is testing of Azure policies in an automated scalable manner which has a level of accuracy and test coverage to ensure that compliance and business objectives are still maintained to the highest standards.

I hope you’ll join me for the next Awesome Azure Policy Chapter.

Until then,\
Jesse
