---
title:  "Passed AZ-400 Designing and Implementing Microsoft DevOps Solutions"
excerpt: "In this blog I'll cover a concept called 'Just Enough Study' and demonstrate a method to hunt Key Phrases with Azure Text Analytics"
header:
    og_image: /assets/images/CERT-Expert-DevOps-Engineer-600x600.png
date:   "2021-01-28"
categories: 
- "EXAMS"
tags: 
- "AZ-400"
- "AZURE TEXT ANALYTICS"
- "JUST ENOUGH STUDY"
---
Hey everyone. I've recently passed the AZ-400 exam for Microsoft Certified DevOps Engineer Expert after about a month of solid study and wanted to share my experience to help others achieve a pass. In this blog I'll cover a concept called **Just Enough Study** and demonstrate a method to hunt **Key Phrases** with **Azure Text Analytics**. Both methods have helped me achieve exam passes on many occasions over the years.

![AZ-400 cert badge](/assets/images/CERT-Expert-DevOps-Engineer-600x600.png)

> Candidates for this exam should have subject matter expertise working with people, processes, and technologies to continuously deliver business value. Responsibilities for this role include designing and implementing strategies for collaboration, code, infrastructure, source control, security, compliance, continuous integration, testing, delivery, monitoring, and feedback. A candidate for this exam must be familiar with both Azure administration and development and must be expert in at least one of these areas. Src: [Exam AZ-400: Designing and Implementing Microsoft DevOps Solutions](https://docs.microsoft.com/en-us/learn/certifications/exams/az-400)

# Just Enough Study (JES)

Microsoft technologies and Microsoft DevOps Solutions in particular are a gigantic ecosystem of continually evolving services and integration points. You know for a fact that [Github Actions](https://github.com/actions) is becoming hard to ignore and has already been introduced into the AZ-400 exam. The goal posts for what to study to pass an exam like AZ-400 are constantly shifting and if you wait 2-3 months prior to sitting the exam there's the risk that what you studied is no longer relevant.

I'm positive that the concept of studying just enough to pass is nothing new or innovative. This is a concept I've adopted as I juggle life/work/family commitments and try to stay on top of my certifications :smile:

**The principals behind Just-Enough-Study (JES) are simply --**

*Identify major gaps in your knowledge*
* Perform your own review of the AZ-400 exam skills outline.
* Look for key terms, terminology, and solutions that you are unfamiliar with. Take note of what you don't know and followup when you have time.
* If you are coming from the infrastructure side/background, focus on the developer aspects.

*Utilise study resources, practice tests, and labs to address major knowledge gaps*
* There's many AZ-400 study resources available online (mostly free) if you search, here's a few that I've found helpful in my journey to becoming a Microsoft Certified DevOps Engineer Expert.

1. **[Microsoft Learn - DevOps Engineer Learning Paths](https://docs.microsoft.com/en-us/learn/browse/?roles=devops-engineer&resource_type=learning%20path)** - *Free*
2. **[Pluralsight](https://app.pluralsight.com/search/?q=Continuous%20Delivery%20on%20Microsoft%20Azure%20for%20DevOps%20Engineers&type=conference%2Cvideo-course%2Cguide%2Cwebinar%2Cpath%2Cassessment&m_sort=relevance&query_id=2063a8f1-64ac-4a39-87bc-327383f3353b&source=user_typed)** - *Paid*
3. **[YouTube - search for recent AZ400 content](https://www.youtube.com/results?search_query=az400)** - *Free*
4. **[GitHub - Timothy Warner's AZ400 course](https://github.com/timothywarner/az400)** - *Free*
5. **[WhizLabs - AZ400 Practice Tests](https://shareasale.com/r.cfm?b=1378863&u=2696267&m=43514&urllink=&afftrack=0)** - *Paid*
6. **[Azure DevOps Labs](https://www.azuredevopslabs.com/)** - *Free*

*Avoid a deep-dive into xyz*
* Because you have a limited amount of time/energy to study effectively each day so your attention needs to be targeted to the major gaps in your knowledge.
* Learn the new concept at a high-level, take notes if you need to remember something, then move on quickly, later you can circle back to your notes to refresh your memory.
* Think of your limited study hours as 'sprints', you might only lock in 1-2 hours of daily study time so this needs to be targeted and purposeful.

# Hunting Key Phrases With Azure Text Analytics

I'm constantly looking for new ways to learn on the fly and more efficiently find gaps in my knowledge so I can quickly address those gaps with targeted study sprints.

Instead of taking the time to read every sentence of the AZ-400 skills outline and pick out key phrases I've used [Azure Text Analytics](https://docs.microsoft.com/en-us/azure/cognitive-services/text-analytics/) and the [Key Phrases API](https://docs.microsoft.com/en-us/azure/cognitive-services/text-analytics/how-tos/text-analytics-how-to-keyword-extraction) to rapidly analyse the entire AZ400 skills outline and output the main points.

> The Text Analytics API is a suite of text analytics web services built with best-in-class Microsoft machine learning algorithms. The API can be used to analyze unstructured text for tasks such as sentiment analysis, key phrase extraction and language detection. No training data is needed to use this API; just bring your text data. This API uses advanced natural language processing techniques to deliver best in class predictions. Src: Microsoft

**If you want to reproduce this method and/or are interested in applying this methodology to other exams; this is what worked for me.**

1. Download the AZ-400 skills outline and remove all bullet points and non-text formatting from the blocks of text. I used [Notepad++](https://notepad-plus-plus.org/) to do this easily. You should end up with an ugly/unformatted multi-line document with all the AZ-400 exam sections/sentences.
2. Deploy Azure Text Analytics to your subscription (`free tier`) and desired region e.g. `Australia East`
3. Copy your Azure Text Analytics API key
4. Hit the [Microsoft Text Analytics API portal](https://westus2.dev.cognitive.microsoft.com/docs/services/TextAnalytics-v3-0/operations/KeyPhrases)
5. Select your region where your Azure Text Analytics is deployed e.g. `Australia East`
6. Paste in your Azure Text Analytics API key into the `Headers / Ocp-Apim-Subscription-Key` value
7. Paste in your unformatted AZ-400 exam sections/sentences into the `Request Body / "text":` value. Use multiple ID blocks if necessary (see note below).
8. Hit Send
9. Copy the Response Content into a [JSON linter](https://jsonlint.online/) to easily reformat into a readable list of strings as shown below. After that you can paste the list into Notepad++ and easily sort alphabetically.

> Note: Your Document size must be 5,120 or fewer characters per document, and you can have up to 1,000 items (IDs) per collection. Src: [Microsoft](https://docs.microsoft.com/en-us/azure/cognitive-services/text-analytics/how-tos/text-analytics-how-to-keyword-extraction#preparation) - When I submitted the unformatted AZ400 skills outline there were 9806 characters total so I broke this up into two seperate request submissions using multiple ID blocks.

**AZ-400 Key Phrases: January 2021**

```json
{
  "documents": [
    {
      "id": "Develop an Instrumentation Strategy (5-10%)",
      "keyPhrases": [
        "access control",
        "App Center Crashes",
        "Application Insights funnels",
        "application performance indicators",
        "Azure Diagnostics extension",
        "Azure Monitor Application Insights",
        "Azure Platform Logs",
        "Azure storage",
        "container monitoring",
        "CPU",
        "crash analytics",
        "Crashlytics",
        "Design",
        "disk",
        "email",
        "Event Grid",
        "Google Analytics",
        "infrastructure performance indicators",
        "Instrumentation Strategy",
        "log aggregation",
        "Log Analytics agent",
        "log framework",
        "logging",
        "measure key metrics",
        "memory",
        "monitoring platform",
        "monitoring solutions",
        "monitoring tools",
        "Naggios",
        "New Relic",
        "Prometheus",
        "resource-centric",
        "SMS",
        "storage strategy",
        "Teams",
        "user analytics",
        "Visual Studio App Center",
        "webhooks",
        "workspace-centric"
      ],
      "warnings": []
    },
    {
      "id": "Develop a Site Reliability Engineering (SRE) strategy (5-10%)",
      "keyPhrases": [
        "actionable alerting strategy",
        "application health checks",
        "appropriate log messages",
        "appropriate metrics",
        "Azure Monitor",
        "base alerts",
        "behavior of system",
        "combinations of metrics",
        "communication mechanism",
        "compute environment",
        "design approach",
        "different types of health checks",
        "Dynamic thresholds",
        "failovers",
        "failure conditions",
        "failure prediction strategy",
        "healthy response timeouts",
        "leverage Application Insights Smart Detection",
        "liveness",
        "load",
        "measure baseline metrics",
        "partial health situations",
        "piecemeal recovery",
        "recovery time objective",
        "regards",
        "scaling",
        "self-healing activities",
        "shutdown",
        "Site Reliability Engineering",
        "SLO",
        "SRE",
        "startup",
        "system dependencies",
        "users of degraded systems",
        "various conditions"
      ],
      "warnings": []
    },
    {
      "id": "Develop a security and compliance plan (10-15%)",
      "keyPhrases": [
        "access solution",
        "authorization strategy",
        "Azure AD groups",
        "Azure AD Privileged Identity Management",
        "Azure Container Registry Tasks",
        "Azure Key Vault",
        "Azure policies",
        "compliance plan",
        "Conditional Access",
        "container scanning",
        "crypto mining",
        "Dependabot",
        "dependencies",
        "design break",
        "Design governance enforcement mechanisms",
        "Git hooks",
        "GitHub Code scanning",
        "GitHub secrets",
        "glass strategy",
        "GPL",
        "Hashicorp Vault",
        "KeyVault secrets",
        "licenses",
        "malware",
        "Managed Identity",
        "MIT",
        "PIM",
        "pipeline-based scans",
        "Pipelines secrets",
        "retrieval strategy",
        "secret files",
        "secrets storage",
        "security certificates",
        "security incidents",
        "sensitive information management strategy",
        "service connections",
        "Service Principals",
        "SonarQube",
        "source code compliance solution",
        "static scanning",
        "vault solution"
      ],
      "warnings": []
    },
    {
      "id": "Manage source control (10-15%)",
      "keyPhrases": [
        "Analytics",
        "approvals",
        "Azure AD",
        "Azure Repos",
        "branch merging restrictions",
        "branch policies",
        "branch protections",
        "branch strategy",
        "branching strategies",
        "code-quality consistency",
        "content recovery",
        "cross repository",
        "design approach",
        "design authentication strategies",
        "disparate source control systems",
        "efficient code reviews",
        "feature branch",
        "Git changelog",
        "Git LFS",
        "Git sub-modules",
        "git-tags",
        "GitHub code review assignments",
        "GitHub Codespaces",
        "GitHub flow",
        "guidelines",
        "handling oversized repositories",
        "human consumption",
        "identity management solutions",
        "large binary files",
        "manual",
        "modern source control strategy",
        "packages",
        "Plan",
        "PR workflow",
        "Pull Requests",
        "release branch",
        "repository states",
        "schedule reminders",
        "source code",
        "source control artifacts",
        "source control repository",
        "static code analysis",
        "trunk",
        "work item correlation",
        "workflow hooks"
      ],
      "warnings": []
    },
    {
      "id": "Facilitate communication and collaboration (10-15%)",
      "keyPhrases": [
        "alerts",
        "AZ DevOps",
        "Azure Boards",
        "Azure DevOps",
        "build",
        "business stakeholders",
        "communication platforms",
        "cost management communication strategy",
        "custom dashboards",
        "design onboarding process",
        "DevOps process documentation",
        "document artifacts",
        "document external dependencies",
        "Email",
        "GitHub",
        "integrations",
        "key metrics",
        "mobile apps",
        "new employees",
        "pipelines",
        "release information",
        "release notes",
        "release pipeline",
        "request approvals",
        "severity",
        "Slack",
        "SMS",
        "Teams",
        "version",
        "work item tracking"
      ],
      "warnings": []
    },
    {
      "id": "Define and implement continuous integration (20-25%)",
      "keyPhrases": [
        "API",
        "application infrastructure management strategy",
        "Automated Security Updates",
        "Automation Runbooks Gallery",
        "Azure Artifacts implementation",
        "Azure Pipeline",
        "build agent configuration",
        "build agent infrastructure",
        "build pipelines",
        "build process",
        "build strategy",
        "build trigger rules",
        "CI load",
        "code assets",
        "Code coverage",
        "complex build scenarios",
        "configuration management mechanism",
        "containerized agents",
        "continuous integration",
        "cost",
        "Dependency",
        "deployment artifacts",
        "Design build automation",
        "design build orchestration",
        "design versioning strategy",
        "desired state configuration",
        "duration",
        "external tools",
        "failure rate",
        "flaky tests",
        "fuzz",
        "GitHub Actions",
        "GitHub Packages",
        "GreenKeeper",
        "hybrid",
        "internationalization",
        "Jfrog",
        "licenses",
        "linked feeds",
        "multiple builds",
        "multiple tools",
        "Nuget",
        "NuKeeper",
        "package management strategy",
        "package management tools",
        "peer review",
        "performance",
        "pipeline health",
        "products",
        "reporting package dependencies",
        "reuseable build subsystems",
        "security scanning",
        "self-hosted build agents",
        "SemVer",
        "standardizing builds",
        "Task Groups",
        "testing strategy",
        "time",
        "tool selection"
        "Variable Groups",
        "VM templates",
        "YAML templates",
      ],
      "warnings": []
    },
    {
      "id": "Define and implement a continuous delivery and release management strategy (10-15%)",
      "keyPhrases": [
        "App Center",
        "application deployment process",
        "appropriate desired state solution",
        "approval processes",
        "ARM",
        "Azure App Configuration",
        "Azure IoT Edge",
        "Azure Pipelines",
        "Azure Stack",
        "Azure Traffic Manager",
        "binary",
        "blue",
        "canary",
        "CDN",
        "Chef",
        "complex deployments",
        "configuration management",
        "container",
        "continuous delivery",
        "data movement",
        "database deployment process",
        "deployment environment strategy",
        "deployment scripts",
        "deployment slots",
        "deployment solution",
        "design",
        "downtime",
        "DR",
        "feature toggle",
        "GitHub Actions",
        "green",
        "high priority code fixes",
        "hotfix path plan",
        "Infrastructure",
        "Jenkins",
        "load balancer configurations",
        "migrations",
        "multiregion",
        "orchestration automation solution",
        "PowerShell DSC",
        "release deliverable",
        "release gates",
        "release management strategy",
        "release pipeline",
        "release process",
        "release strategy",
        "release targets",
        "reliable order of dependency deployments",
        "shared release configurations",
        "sovereign cloud",
        "variable groups"
        "VIP Swap",
        "YAML templates",
      ],
      "warnings": []
    }
  ],
  "errors": [],
  "modelVersion": "2020-07-01"
}
```

# Closing Remarks

> The more you know, the more you know you don't know ― Aristotle

Passing an exam like AZ-400 cannot be my final destination, it's simply part of an extensive journey as I discover what I don't know.

I hope you've found this blog insightful and helpful in your journey; and good luck with AZ-400!

Cheers,

Jesse