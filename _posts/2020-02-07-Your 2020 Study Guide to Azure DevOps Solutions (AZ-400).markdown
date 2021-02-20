---
title:  "Your 2020 Study Guide to Azure DevOps Solutions (AZ-400)"
excerpt: "With Microsoft announcing sweeping changes to a few Azure exams later in March 2020 the time is ripe to blog about an exam I’ve had my eye on for a while: Azure DevOps Solutions (AZ-400)."
header:
    og_image: /assets/images/CERT-Expert-DevOps-Engineer-600x600.png
date:   "2020-02-07"
categories: 
- "exams"
tags: 
- "az400"
- "2020"
---
With Microsoft announcing sweeping changes to a few Azure exams later in March 2020 the time is ripe to blog about an exam I’ve had my eye on for a while: Azure DevOps Solutions (AZ-400). This is an advanced exam that targets professionals familiar with Azure administration and Azure development. I can see this exam providing value to engineers, consultants, and architects who are driving for increased adoption of Agile practices and Infrastructure as Code.

# Establish your Rhythm
After doing a few of these exams over the years you’ll find a rhythm that works for you. Here’s mine.

1. Go to https://docs.microsoft.com/en-us/learn/certifications/browse/
2. Search for and go to the relevant exam page (e.g. AZ-400)
3. Download the Exam Skills Outline ![AZ400ExamSkillsOutline](/assets/images/AZ400SkillsMeasured.png "AZ400 Exam Skills Outline")
4. Create a repository of study resources (docs, images, links, etc)
5. Book the Exam!
6. Absorb Content, Get Hands-On, Take Notes, Review Review Review!
7. Pass the Exam!
8. Celebrate!

# General Thoughts On Exams

* Book the exam early on after taking a look at the exam skills outline as you will need to estimate how much study time is needed. I generally book the exam in 1-2 months time.
* Being a ‘morning person’ I book exams about 10:00am and make sure to arrive at least 20 mins early to the test centre. I have a light breakfast and a quick review of my notes on the morning of the test.
* No coffee before an exam unless I’ve had a sleepless night as it can make me more nervous and jittery. BTW – nerves before exams are completely normal and I’ve learnt to embrace them as part of the experience.
* During the test I use the scratch pad to take notes on questions I have trouble with. Writing something, anything, down is also a tactic to reduce stress and maintain focus rather than just staring at the test question on the screen.
* Creating your own study guide helps with tracking progress as you will need to break your study time across days/weeks to suit your schedule.
* I try not to tackle every subject and dedicate sufficient time and energy to my weakest areas to ensure I have a broad understanding.
* After passing the exam – creating content and sharing it with the community is a great way to contribute and say “thanks” to those that helped you in your study journey.

# AZ-400 Helpful Resources
With so many resources available to aid you in your journey to AZ-400 certification here’s my top links you may find helpful (in order of importance!).

1. Sign up to [Visual Studio Dev Essentials][AZ400-URL1] for free Azure credit and access to Azure DevOps.
2. Get hands-on with [Azure DevOps Labs][AZ400-URL2] with step-by-step guides on various scenarios and use cases.
3. Complete an Azure DevOps course from online content providers like [Pluralsight][AZ400-URL3] and [Udemy][AZ400-URL4] 
4. Your main library of Azure DevOps resources should begin at the [Azure DevOps Documentation][AZ400-URL5] site
5. Review the [DevOps Checklist][AZ400-URL6] as a starting point in assessing DevOps culture and processes.
7. Take a look at how Microsoft do DevOps within their own organisation [DevOps at Microsoft][AZ400-URL7]. Very interesting stories relevant to their own transformation.
8. Subscribe to the [Azure DevOps Blog][AZ400-URL8] for the latest news and posts by people at the heart of DevOps at Microsoft.

# AZ-400 Exam Section Weighting
You can use this image as a guide when planning your study time for AZ-400. For example if you had to choose between dedicating study time on Design a DevOps Strategy vs Implement Continuous Feedback I would choose the former as the weighting is higher and there is likely to be more test questions on that section.

![AZ400overview](/assets/images/AZ400-overview.png)

# AZ-400 Exam Skills Outline

I’ve copied the exam skills outline from Microsoft and created simple imagery below to aid you with an overview of each section. Important to note that there is often duplication of subject areas across different exam sections so having a broad understanding of the content is important and also hands-on experience through labs.

## Design a DevOps Strategy
![AZ400DevOps1](/assets/images/DevOps1.png)

<b>Recommend a migration and consolidation strategy for DevOps tools</b>
* analyze existing artifact (e.g, deployment packages, NuGet, Maven, npm) and container repositories
* analyze existing test management tools
* analyze existing work management tool
* recommend migration and integration strategies for artifact repositories, source control, test management, and work management

<b>Design and implement an Agile work management approach</b>
* identify and recommend project metrics, KPIs, and DevOps measurements (e.g., cycle time, lead time, WIP limit)
* implement tools and processes to support Agile work management
* mentor team members on Agile techniques and practices
* recommend an organization structure that supports scaling Agile practices
* recommend in-team and cross-team collaboration mechanisms

<b>Design a quality strategy</b>
* analyze existing quality environment
* identify and recommend quality metrics
* recommend a strategy for feature flag lifecycle
* recommend a strategy for measuring and managing technical debt
* recommend changes to team structure to optimize quality
* recommend performance testing strategy

<b>Design a secure development process</b>
* inspect and validate code base for compliance
* inspect and validate infrastructure for compliance
* recommend a secure development strategy
* recommend tools and practices to integrate code security validation (e.g., static code
analysis)
* recommend tools and practices to integrate infrastructure security validation

<b>Design a tool integration strategy</b>
* design a license management strategy (e.g., VSTS users, concurrent pipelines, test environments, open source software licensing, third-party DevOps tools and services, * package management licensing)
* design a strategy for end-to-end traceability from work items to working software
* design a strategy for integrating monitoring and feedback to development teams
* design an authentication and access strategy
* design a strategy for integrating on-premises and cloud resources
 
## Implement DevOps Development Processes
![AZ400DevOps2](/assets/images/DevOps2.png)

<b>Design a version control strategy</b>
* recommend branching models
* recommend version control systems
* recommend code flow strategy

<b>Implement and integrate source control</b>
* integrate external source control
* integrate source control into third-party continuous integration and continuous deployment (CI/CD) systems

<b>Implement and manage build infrastructure</b>
* implement private and hosted agents
* integrate third party build systems
* recommend strategy for concurrent pipelines
* manage Azure pipeline configuration (e.g., agent queues, service endpoints, pools, webhooks)

<b>Implement code flow</b>
* implement pull request strategies
* implement branch and fork strategies
* configure branch policies

<b>Implement a mobile DevOps strategy</b>
* manage mobile target device sets and distribution groups
* manage target UI test device sets
* provision tester devices for deployment
* create public and private distribution groups

<b>Managing application configuration and secrets</b>
* implement a secure and compliant development process
* implement general (non-secret) configuration data
* manage secrets, tokens, and certificates
* implement applications configurations (e.g., Web App, Azure Kubernetes Service, containers)
* implement secrets management (e.g., Web App, Azure Kubernetes Service, containers,
Azure Key Vault)
* implement tools for managing security and compliance in the pipeline


## Implement Continuous Integration
![AZ400DevOps3](/assets/images/DevOps3.png)

<b>Manage code quality and security policies</b>
* monitor code quality
* configure build to report on code coverage
* manage automated test quality
* manage test suites and categories
* monitor quality of tests
* integrate security analysis tools (e.g., SonarQube, White Source Bolt, Open Web Application Security Project)

<b>Implement a container build strategy</b>
* create deployable images (e.g., Docker, Hub, Azure Container Registry)
* analyze and integrate Docker multi-stage builds

<b>Implement a build strategy</b>
* design build triggers, tools, integrations, and workflow
* implement a hybrid build process
* implement multi-agent builds
* recommend build tools and configuration (e.g. Azure Pipelines, Jenkins)
* set up an automated build workflow

## Implement Continuous Delivery
![AZ400DevOps4](/assets/images/DevOps4.png)

<b>Design a release strategy</b>
* recommend release tools
* identify and recommend release approvals and gates
* recommend strategy for measuring quality of release and release process
* recommend strategy for release notes and documentation
* select appropriate deployment pattern

<b>Set up a release management workflow</b>
* automate inspection of health signals for release approvals by using release gates
* configure automated integration and functional test execution
* create a release pipeline (e.g., Azure Kubernetes Service, Service Fabric, WebApp)
* create multi-phase release pipelines
* integrate secrets with release pipeline
* provision and configure environments
* manage and modularize tasks and templates (e.g., task and variable groups)

<b>Implement an appropriate deployment pattern</b>
* implement blue-green deployments
* implement canary deployments
* implement progressive exposure deployments
* scale a release pipeline to deploy to multiple endpoints (e.g., deployment groups, Azure Kubernetes Service, Service Fabric)

## Implement Dependency Management
![AZ400DevOps5](/assets/images/DevOps5.png)

<b>Design a dependency management strategy</b>
* recommend artifact management tools and practices (Azure Artifacts, npm, Maven, Nuget)
* abstract common packages to enable sharing and reuse
* inspect codebase to identify code dependencies that can be converted to packages
* identify and recommend standardized package types and versions across the solution
* refactor existing build pipelines to implement version strategy that publishes packages

<b>Manage security and compliance</b>
* inspect open source software packages for security and license compliance to align with corporate standards (e.g., GPLv3)
* configure build pipeline to access package security and license rating (e.g., Black Duck, White Source)
* configure secure access to package feeds


## Implement Application Infrastructure
![AZ400DevOps6](/assets/images/DevOps6.png)

<b>Design an infrastructure and configuration management strategy</b>
* analyze existing and future hosting infrastructure
* analyze existing Infrastructure as Code (IaC) technologies
* design a strategy for managing technical debt on templates
* design a strategy for using transient infrastructure for parts of a delivery lifecycle
* design a strategy to mitigate infrastructure state drift

<b>Implement Infrastructure as Code (IaC)</b>
* create nested resource templates
* manage secrets in resource templates
* provision Azure resources
* recommend an Infrastructure as Code (IaC) strategy
* recommend appropriate technologies for configuration management (e.g., ARM Templates, Terraform, Chef, Puppet, Ansible)

<b>Manage Azure Kubernetes Service infrastructure</b>
* provision Azure Kubernetes Service (e.g., using ARM templates, CLI)
* create deployment file for publishing to Azure Kubernetes Service (e.g., kubectl, Helm)
* develop a scaling plan

<b>Implement infrastructure compliance and security</b>
* implement compliance and security scanning
* prevent drift by using configuration management tools
* automate configuration management by using PowerShell Desired State Configuration
(DSC)
* automate configuration management by using a VM Agent with custom script extensions
set up an automated pipeline to inspect security and compliance

## Implement Continuous Feedback
![AZ400DevOps7](/assets/images/DevOps7.png)

<b>Recommend and design system feedback mechanisms</b>
* design practices to measure end-user satisfaction (e.g., Send a Smile, app analytics)
* design processes to capture and analyze user feedback from external sources (e.g.,Twitter, Reddit, Help Desk)
* design routing for client application crash report data
* recommend monitoring tools and technologies
* recommend system and feature usage tracking tools

<b>Implement process for routing system feedback to development teams</b>
* configure crash report integration for client applications
* develop monitoring and status dashboards
* implement routing for client application crash report data
* implement tools to track system usage, feature usage, and flow
* integrate and configure ticketing systems with development team’s work management system (e.g., IT Service Management connector, ServiceNow Cloud Management, App Insights work items)

<b>Optimize feedback mechanisms</b>
* analyze alerts to establish a baseline
* analyze telemetry to establish a baseline
* perform live site reviews and capture feedback for system outages
* perform ongoing tuning to reduce meaningless or non-actionable alerts

## Closing Remarks
I hope you found this guide useful and wish you the best of luck in your exam journey 🙂
Look out for another post after I pass the exam `/confidence`

> Update Jan 2021: Read about how I passed AZ400 here: [https://jloudon.com/exams/Passed-AZ-400-Microsoft-Certified-DevOps-Engineer/](https://jloudon.com/exams/Passed-AZ-400-Microsoft-Certified-DevOps-Engineer/)

Cheers,
Jesse

[AZ400-URL1]:https://visualstudio.microsoft.com/dev-essentials/
[AZ400-URL2]:https://www.azuredevopslabs.com/
[AZ400-URL3]:https://www.pluralsight.com/search?q=DevOps
[AZ400-URL4]:https://www.udemy.com/topic/microsoft-azure-devops/
[AZ400-URL5]:https://docs.microsoft.com/en-us/azure/devops/?view=azure-devops
[AZ400-URL6]:https://docs.microsoft.com/en-us/azure/architecture/checklist/dev-ops
[AZ400-URL7]:https://docs.microsoft.com/en-us/azure/devops/learn/devops-at-microsoft/
[AZ400-URL8]:https://devblogs.microsoft.com/devops/