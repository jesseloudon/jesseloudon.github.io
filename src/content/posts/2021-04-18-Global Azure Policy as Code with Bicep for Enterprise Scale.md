---
title: "Global Azure: Policy as Code with Bicep for Enterprise Scale"
excerpt: "Recently I've been diving into Microsoft's new DSL Bicep and as I'm passionate about Azure Policy I thought why not combine both aspects into a session?"
header:
    og_image: /assets/images/GlobalAzure2021PolicyAsCodeWithBicep.png
    teaser: /assets/images/GlobalAzure2021PolicyAsCodeWithBicep.png
date:   "2021-04-18"
categories: 
- "cloud"
tags: 
- "bicep"
- "global azure"
- "azure policy"
- "policy as code"
---
![GlobalAzure2021](/assets/images/globalazure2021-2.png "Global Azure 2021")

> [Global Azure](https://globalazure.net/) is a community event about the Microsoft Azure platform. On April 15-17 the Global Azure community goes online to share, learn, and have community Azure fun together. 

This year I was fortunate to have a session accepted for Global Azure 2021 titled: **Policy as Code with Bicep for Enterprise Scale**

Recently I've been diving into Microsoft's new DSL Bicep and as I'm passionate about Azure Policy I thought why not combine both aspects into a session?

Admittedly, I left my [sessionize submission](https://sessionize.com/JesseLoudon/) very late and probably just scraped in. Even so it was a wonderful surprise to see my session accepted followed by a frantic scramble to prepare my presentation (YT links below) and code which can be found here [https://github.com/globalbao/azure-policy-as-code](https://github.com/globalbao/azure-policy-as-code).

## Presentation Structure
I structured my presentation into 3x levels so that beginners could start with a small proof of concept deployment and then scale up in complexity and advanced logic as their comfort levels increased with Bicep and Azure Policy. 

More experienced users can jump straight to Level 3 and learn/adopt a Policy as Code workflow with Bicep.

Links to skip to specific content levels in the recorded session are included below!

### [Level 1](https://github.com/globalbao/azure-policy-as-code/tree/main/Bicep/Level1)

* Uses built-in policies
* Uses an initiative and assignment
* 1x main.bicep
* Manual CLI deployment

[YouTube Video Timestamp 16m 10s](https://www.youtube.com/watch?v=qpnMJXw6pIg&t=16m10s)

### [Level 2](https://github.com/globalbao/azure-policy-as-code/tree/main/Bicep/Level2)

* Uses built-in policies and custom policies
* Uses multiple initiatives and assignments
* 1x main.bicep
* Manual CLI deployment
* Targeting multiple Azure environments
* Uses parameter files for environment-specfic values passed during deployment

[YouTube Video Timestamp 50m 3s](https://www.youtube.com/watch?v=qpnMJXw6pIg&t=50m3s)

### [Level 3](https://github.com/globalbao/azure-policy-as-code/tree/main/Bicep/Level3)

* Uses built-in policies and custom policies
* Uses multiple initiatives and assignments
* Custom policyDefinitionReferenceId for initiatives
* Custom non-compliance msgs for assignments targeted to the policyDefinitionReferenceId
* Advanced modules organised per resource type
* CI/CD workflow automation with GitHub Actions YAML
* Targeting multiple Azure environments with authentication via GitHub secrets

[YouTube Video Timestamp 1h 11m 45s](https://www.youtube.com/watch?v=qpnMJXw6pIg&t=1h11m45s)

## Kudos

Finally, I'd like to thank [Rahul Nath](https://twitter.com/rahulpnath) for reaching out to me prior to the session and helping me out with YouTube streaming/gearing tips. Much appreciated Rahul!

This year's Global Azure event was the biggest yet with over 560 speakers and 530 sessions from across the world! So a big kudos to the organisers and session reviewers who contributed their time to make this happen!

Looking forward to next year's Global Azure!

Jesse

![GlobalAzure2021Sessions](/assets/images/globalazure2021sessions.png "Global Azure 2021 Sessions")