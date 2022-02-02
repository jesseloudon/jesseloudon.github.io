---
title: "Awesome Azure Policy: Ideation, Curation, Execution"
excerpt: ""
header:
    og_image: /assets/images/.png
    teaser: /assets/images/.png
date:   "2022-01-21"
categories: 
- "cloud"
tags: 
- "azure policy"
- "community"
- "awesome azure policy"
- "policy examples"
---
I've been reflecting on a few key events in my technology career and the preceding thoughts and eventual actions which might be of interest to the community. This article is not going to be a technical one showcasing how to achieve XYZ. This is a retrospective, a reflection, a decomposition of the past, the present, and what the future may hold.

My career in tech started with what I would describe as a hard-fought journey. Not because of the what I've been employed to do over the last 13 years but rather because I'm not a smart person who understands quickly or 'gets' things immediately.

My first experience with Azure Policy was mid-2020 engaged as a consultant for an enterprise client in the retail industry. They had been steadily growing their Microsoft Azure footprint since before the start of the COVID pandemic. Then there appeared to be somewhat of an explosion in projects to onboard and migrate applications and infrastructure into their Azure tenancies. Due to this explosion of growth there also happened to be what I would call 'governance drift'. Examples of which included:

* Tags - Missing completely, incorrect or outdated keys/values, no inheritence of tags from resource group to resources.
* Data Protection - Gaps in compliance for virtual machine backups and disk encryption.
* Monitoring - No baseline logging and alerting for infrastructure.
* Security - RBAC drift on resource groups, resource locks missing from some critical infrastructure such as ExpressRoute.

At the same I was learning HashiCorp Terraform for the first time in my life and being a complete novice (I still am!) I'm grateful for the help I received from Michael O'Leary (my colleague on the same project) and the Terraform community through their blogs and tutorials.

In the first week of January 2022 I was bouncing about the #TechTwitter space and was well down the rabbit hole with Open Policy Agent (OPA). My interest in OPA is largely thanks to having reviewed a couple chapters covering possible use cases and solutions with OPA. Courtesy of my role as a technical reviewer for PackT publishing which began in August 2021.

Long story short, if you're also interested in OPA you may have come across [github.com/anderseknert/awesome-opa](https://github.com/anderseknert/awesome-opa) by Anders Eknert. It's a curated list of OPA related tools, frameworks, and articles. So as a newcomer to OPA I found this public list of resources helpful and having followed Anders on Twitter I have come to trust that he is a good source of information on the subject matter.

There was inspiration from that list and it was a great starting point for what I had in mind for an Azure Policy list.

You may be wondering how to go about creating a list of something where no list exists? For me, because I've been actively engaged in the Microsoft Azure community for a few years, through various social media channels and I've come to know of people who are leaders in their field and publicly sharing their knowledge with the community.

Regardless of whether you are searching for docs, code repos, tools, blogs, or videos, I have a feeling that 99% of content out there has been created with the blood sweat and tears from real people. Yes there are exceptions, but for the majority of stuff out there people are the ones with the ideas and experiences and they are what drive community engagement and growth. Find your people and you'll find the community and the content you need to build your own list.

So here's where you should start:

* People
    * Blogs
    * Twitter
    * YouTube
    * LinkedIn
    * GitHub
* Events
    * Blogs
    * Twitter
    * YouTube
    * LinkedIn
    * GitHub


1. People - identify leaders in the community, stalk them (in a nice way), follow their announcements and content
2. Blogs - Search articles of content and look for links/references to other articles, tools, blogs, authors, etc.
3. Twitter - use keyword/hashtag searching for public content
4. GitHub - use keyword searching for public repositories
5. YouTube - use keyword searching for published videos
6. Events - use keyword searching of annual events run by the community for public content
7. Browser - maybe you have bookmarked some gems? :)

Guiding principles for organsing the README:

* List items sorted in alphabetical order
* Links cannot be behind a paywall / must be freely accessible to everyone
* Sentence case for Blogs, Videos, Docs, etc
* Lower case for GitHub repositories
* No duplicates of items in lists
* Official links placed at the top





