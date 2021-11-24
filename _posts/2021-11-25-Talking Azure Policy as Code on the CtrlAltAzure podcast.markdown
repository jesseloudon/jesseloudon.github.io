---
title: "Talking Azure Policy as Code on CtrlAltAzure podcast"
excerpt: "Appearing as a guest on the Ctrl+Alt+Azure podcast to talk Azure Policy as Code with hosts Tobias Zimmergren and Jussi Roine"
header:
    og_image: /assets/images/JesseLoudonTeamsBackground.png
    teaser: /assets/images/JesseLoudonTeamsBackground.png
    image_description: "Talking Azure Policy as Code on CtrlAltAzure podcast"
    caption: "Photo credit: [**Roberto Nickson**](https://unsplash.com/@rpnickson?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)"
date:   "2021-11-25"
categories: 
- "cloud"
tags: 
- "azure policy"
- "policy as code"
- "azure governance"
- "bicep"
- "iac"
- "devops"
- "ctrlaltazure podcast"
---
Hey folks! I recently featured as a guest on the **Ctrl+Alt+Azure** podcast for episode 109 to talk **Azure Policy as Code** with hosts **Tobias Zimmergren** and **Jussi Roine**.

> The Ctrl+Alt+Azure podcast was launched back in October 2019 by Microsoft Azure MVPs [Tobias Zimmergren](https://twitter.com/zimmergren) and [Jussi Roine](https://twitter.com/jussiroine).

Tobias had reached out to me over twitter to check my availability and interest in contributing to an upcoming episode dedicated to Azure Policy as Code. 

Admittedly I was surprised by Tobias's message, and other community events were already on my calendar, but the fact of the matter is that having actively advocated on this exact subject matter over the past 12+ months **I would not be passing up such a wonderful opportunity!**

:studio_microphone: **You can tune into the episode at [https://ctrlaltazure.com/episodes/109-azure-policy-as-code](https://ctrlaltazure.com/episodes/109-azure-policy-as-code).** There you'll also find helpful links to various tools and resources mentioned during our talk.

> Starting from ground zero with Azure Policy? Check out episode 25 of the Ctrl+Alt+Azure podcast [Azure Policies - the how, the what, and the why?](https://ctrlaltazure.com/episodes/025-azure-policies-the-how-the-what-and-the-why)

# Azure Policy as Code - Episode 109 - Session Abstract

:bulb: Don't have 40 mins to listen to the entire episode but want to know what's discussed? **I've got you covered!** 

Here's **13** points of **Azure Policy as Code goodness** covered during episode 109! :muscle:

1. Brief introduction to [Azure Policy](https://docs.microsoft.com/en-us/azure/governance/policy/overview?WT.mc_id=AZ-MVP-5004598) and [Policy as Code](https://docs.microsoft.com/en-us/azure/governance/policy/concepts/policy-as-code?WT.mc_id=AZ-MVP-5004598) using [Bicep](https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/overview?WT.mc_id=AZ-MVP-5004598) language - Microsoft's Domain Specific Language for transpiling into ARM Templates.
2. At what point might you decide to move from managing your Azure Policies via the Azure Portal (click-ops) to a Policy as Code workflow based on Infrastructure as Code and DevOps methodologies?
3. Using Bicep's [loadtextcontext](https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/bicep-functions-files#loadtextcontent?WT.mc_id=AZ-MVP-5004598) function to quickly onboard new policies to your Bicep modules.
4. Is there a difference in capability for developers when managing your Azure Policies from the Azure Portal versus managing them as code via say Bicep/ARM templates?
5. What are some key concepts to know about when working with Azure Policy as Code workflows?
6. Designing your Service Principal [RBAC roles](https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles?WT.mc_id=AZ-MVP-5004598) adhering to the principle of least privilege.
7. How to approach testing methdologies for new custom Azure Policies before deploying them to prod.
8. Programmatically triggering an Azure Policy [on-demand compliance scan](https://docs.microsoft.com/en-us/azure/governance/policy/how-to/get-compliance-data#on-demand-evaluation-scan) at your desired scope.
9. Recommended tools for getting started with Azure Policy as Code workflows using Bicep language.
10. Available options for [migrating](https://docs.microsoft.com/en-us/azure/governance/policy/how-to/export-resources?WT.mc_id=AZ-MVP-5004598) your Azure Policies from the Azure Portal to a code-driven workflow.
11. Free community tools which can assist with your Azure Policy as Code journey.
12. Infrastructure as Code tooling comparison.
13. A surprise question to Jesse.

> :studio_microphone: **Now that I've piqued your curiousity :smile: tune into the episode at [https://ctrlaltazure.com/episodes/109-azure-policy-as-code](https://ctrlaltazure.com/episodes/109-azure-policy-as-code).**

# The Ctrl+Alt+Azure podcast journey

My own research of the Ctrl+Alt+Azure podcast's early beginnings and it's **journey from episode 1 to episode 52** (late last year) has yielded many insightful blog posts from both Tobias and Jussi. 

I highly recommend checking them out! For example I found a couple **beautiful gems in their documented journey** some of which include:

* Choosing a podcast name. *(one of my favourites!)*
* Finding time to record an episode.
* Staying flexible with scheduling.
* Leveraging peer pressure to collaborate.
* Finding their audience via distribution.
* Technology and tooling choices.

**Launch annoucements**
* [Announcing a new podcast Ctrl Alt Azure](https://zimmergren.net/announcing-a-new-podcast-ctrl-alt-azure/) - Tobias Zimmergren
* [Announcing our new podcast Ctrl Alt Azure the first episode is out now](https://jussiroine.com/2019/10/announcing-our-new-podcast-ctrlaltazure-the-first-episode-is-out-now/) - Jussi Roine

**Getting started blog posts**
* [How we planned and launched a podcast the technical story](https://zimmergren.net/how-we-planned-and-launched-a-podcast-the-technical-story/) - Tobias Zimmergren
* [Getting started with a podcast the equipment setup and logistics](https://jussiroine.com/2019/12/getting-started-with-a-podcast-the-equipment-setup-and-logistics/) - Jussi Roine

**Podcast anniversaries**
*  [The first anniversary of the Ctrl Alt Azure podcast]([https://jussiroine.com/2020/11/the-first-anniversary-of-the-ctrlaltazure-podcast/) - Jussi Roine

# Conclusion

It was an amazing opportunity to talk **Azure Policy as Code** with **Tobias Zimmergren** and **Jussi Roine**. I personally learned much from the discussions. Also very grateful for the wide scope of questions from Tobias and Jussi related to the topic and hope we were inclusive towards various perspectives, scenarios, and skillsets!

As to my own experience with contributing to a podcast episode let's just say I now have a great appreciation for the amount of effort required to **plan, setup, and record** just one of these episodes! :smile:

Thanks for tuning in folks. I hope you found the episode interesting, informative, and helpful; as always I welcome your feedback and comments.

Cheers,

Jesse
