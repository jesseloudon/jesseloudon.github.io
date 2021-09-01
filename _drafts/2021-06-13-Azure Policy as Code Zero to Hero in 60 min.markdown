---
title: "Azure Policy as Code: Zero to Hero in 60min"
excerpt: ""
header:
    og_image: /assets/images/.png
    teaser: /assets/images/.png
date:   "2021-06-13"
categories: 
- "cloud"
tags: 
- "bicep"
- "azure policy"
- "policy as code"
- "azure sydney user group"
---

# Introduction

- Policy EcoSystem (DIAGRAM)
    policy portal
    policy management
    policy evaluation
    policy effects
    policy remediation
    policy as code





- Understand the SCALE (src: AzAdvertizer)
    1353 GA policy definitions
    89 Preview policy definitions
    22 GA policysets
    11 Preview policysets
    38704 policy aliases
        98 namespaces
        17362 aliases just for microsoft.network!




- How it works (DIAGRAM)
    Azure Policy evaluates payloads before ARM
    Put requests (if statements)
    Patch requests (auditifnotexists, deployifnotexists)
    - System Assigned Managed Identities for modify/deployIfNotExists effects
        - Role Assignments needed

- SPN permissions
    resource policy contributor https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#resource-policy-contributor
    user access administrator   https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#user-access-administrator
- 




# Key Messages


Policy as Code

- RAPID development iteration (Show High Level diagram here of policy development cycle)

    Is there an existing built-in policy?
	Does the policy meet our design requirements?
	Has the policy been tested (code deployment, target resource compliance)
	Are there any changes we need to do to the built-in policy as code to enhance it?
	Has a custom policy been created + tested (if required).

- Your code is SELF-documenting
- 


# Key Questions Answered



## Why Azure Policy

- Azure Policy is a free built-in service with no costs associated (yet!)
- There are no setup requirements to start using Azure Policy from the Azure Portal and it's ready go out of the box.
- Scalable across management groups and subscriptions in the same tenant. Meaning you can re-use the same policy many times over leveraging policy parameters for environmental differences and by changing the scope of the policy assignment.
- Dynamically onboarding new resources to your defined governance standards.
- Frequent updates from Azure Governance with new policies and resource aliases released monthly
- Official GitHub Actions from Microsoft via [Policy Compliance Scan](https://github.com/Azure/policy-compliance-scan) and [Manage Azure Policy](https://github.com/Azure/manage-azure-policy)


## Why Policy as Code

- Repeatable - documenting our Azure policies as code files which can be reused by another team
- Scalable - managing our Azure policies across multiple environments without dependencies on manual processes
- Automatable - deploying our Azure policies using DevOps/scripts/tooling which removes the element of human error. Do more with less.
- Auditable - keeping an audit/paper trail for changes to Azure policies and deployments to our environments

## Hello World Moments

- Created custom policy to audit RBAC role assignments showing RBAC-drift where users were assigned directly to ACLs
- Created custom policy to automate tag inheritence from resource groups


## Usage Patterns



## Anti Patterns
- Assigning policies to resource groups instead of assigning to subscription or management group scope
- Using the append effect for applying resource tags instead of modify effect
- Checking static values in ExistenceConditions instead of parameter values
- Not using policysets/initiatives to group common policies
- Using policies with active effects in production without testing them first (deny, modify, deployifnotexists)


## Demos




## Trusted Sources of Information

Azure Governance Team / monthly call
microsoft docs - Azure Policy
github - Azure/Azure Policy
github -Azure/Community Policy
https://www.azadvertizer.net/