---
title: "Awesome Azure Policy Chapter 4"
excerpt: "Highlighting the latest awesome content from across the community and official Microsoft sources"
header:
    og_image: /assets/images/AwesomeAzurePolicyChapter3Header.png
    teaser: /assets/images/AwesomeAzurePolicyChapter3Header.png
    image_alt: "Azure logo, red heart, and policy icon over snow-covered mountains."
date: "2026-11-11"
categories:
- "cloud"
tags:
- "azure policy"
- "community"
- "awesome azure policy"
---

Greetings folks and welcome to the fourth chapter of Awesome Azure Policy, a blog series focused on highlighting useful content from across the community and official Microsoft sources. As there’s an abundance of posts, videos, and repos to share since my second post I’ve curated a large feed of content down to a few select pickings for this chapter.

> [Download the latest Awesome Azure Policy PDF](/assets/pdfs/Awesome-Azure-Policy-11-2026.pdf) for easy sharing to your community!

## Open Sourcing the Azure Policy Linter

[![Microsoft's Azure Policy Linter demonstration showing diagnostic findings for a policy definition](/assets/images/AwesomeAzurePolicyLinterDemo.png)](https://github.com/Azure/azure-policy-linter)

First up is Steven Bucher's [announcement of the open-source Azure Policy Linter](https://techcommunity.microsoft.com/blog/azuregovernanceandmanagementblog/open-sourcing-the-azure-policy-linter/4547577).

This is Microsoft's command-line tool that checks policy definitions for known issues and best practices before you assign them to your environment. The idea is you would have this policy linter execute as part of your CI and PR checks to catch issues early (shift left) prior to merging definitions to main and pushing to your Azure tenant.

At my last count there are 57 rules tests providing a wide scope of checks. Just by digging into some of these rules shown below I learnt a few new tricks/tips.

<ul style="overflow-wrap: anywhere;">
<li>AllParameterReferencesMustResolveTests.cs</li>
<li>AppServiceConfigFieldAliasTests.cs</li>
<li>ArrayComparedAsScalarTests.cs</li>
<li>ArrayOrObjectParameterInEqualityOperatorTests.cs</li>
<li>BlockingEffectOnRoleAssignmentsTests.cs</li>
<li>BroadTypeMatchingOperatorTests.cs</li>
<li>ConditionalFieldAliasTests.cs</li>
<li>CountLessThanArrayLengthTests.cs</li>
<li>DeeplyNestedFieldAliasTests.cs</li>
<li>DescriptionDuplicatesDisplayNameTests.cs</li>
<li>EffectAllowedValuesShouldNotMixIncompatibleEffectsTests.cs</li>
<li>EffectParameterMissingAllowedValuesTests.cs</li>
<li>EffectParameterMissingDefaultValueTests.cs</li>
<li>FieldAliasUnavailableInAnyApiVersionTests.cs</li>
<li>FieldAliasUnavailableInLatestApiVersionTests.cs</li>
<li>FieldAliasUnavailableInOldApiVersionsTests.cs</li>
<li>FieldFunctionOnCountedArrayAliasTests.cs</li>
<li>HardCodedPolicyEnforcementEffectTests.cs</li>
<li>ImplicitArrayEnumerationTests.cs</li>
<li>ImplicitResourceTypeTargetingTests.cs</li>
<li>InvalidEffectParameterValueTests.cs</li>
<li>LengthFunctionOnArrayAliasTests.cs</li>
<li>LikeNotLikeWithoutWildcardsTests.cs</li>
<li>LiteralAsteriskInMatchOperatorTests.cs</li>
<li>LogicalFunctionsInValueConditionsTests.cs</li>
<li>MatchWithoutWildcardsTests.cs</li>
<li>MissingAuditEffectCounterpartTests.cs</li>
<li>MissingPolicyDefinitionDescriptionTests.cs</li>
<li>MissingPolicyDefinitionDisplayNameTests.cs</li>
<li>NestedNotConditionTests.cs</li>
<li>NestedSameTypeQuantifiersShouldBeFlattenedTests.cs</li>
<li>NsgSecurityRuleChildOnlyEnforcementTests.cs</li>
<li>NsgSecurityRuleParentOnlyEnforcementTests.cs</li>
<li>NumericFieldOrValueInEqualityOperatorTests.cs</li>
<li>NumericParameterInEqualityOperatorTests.cs</li>
<li>ObjectComparedAsScalarTests.cs</li>
<li>OptionalFieldAliasTests.cs</li>
<li>OrderingOperatorOnIncompatibleFieldTypeInOldApiVersionsTests.cs</li>
<li>OrderingOperatorOnIncompatibleFieldTypeTests.cs</li>
<li>ParameterMissingDescriptionTests.cs</li>
<li>ParameterMissingDisplayNameTests.cs</li>
<li>PolicyRuleReferencesMultipleResourceTypesTests.cs</li>
<li>ReadOnlyFieldAliasTests.cs</li>
<li>RequestContextIdentityIsEnforcementOnlyTests.cs</li>
<li>ResourceTypeNotEvaluatedByPolicyTests.cs</li>
<li>ResourceTypesNotSupportedByIndexedModeTests.cs</li>
<li>RiskyEffectParameterDefaultValueTests.cs</li>
<li>SimplifyMultipleEqualsToInTests.cs</li>
<li>SimplifyMultipleNotEqualsToNotInTests.cs</li>
<li>TryGetUseWithNullCoercingOperatorTests.cs</li>
<li>TypeConditionFirstInAllOfTests.cs</li>
<li>TypeOnlyIfConditionTests.cs</li>
<li>UnguardedRequestContextIdentityAccessTests.cs</li>
<li>UnguardedSubstringFunctionTests.cs</li>
<li>UnguardedTryGetOperatorValueTests.cs</li>
<li>UnnecessaryQuantifierWrapperTests.cs</li>
<li>VmOsTypeFieldAliasTests.cs</li>
</ul>

Having been working with Azure Policy for years on the frontlines I think this linter tool is amazing value to include for all your customer's policy-as-code and platform operation repos. 

On the agentic front, given we're now doing more with agents and AI, having this linter execute as a pre-merge check is another method we should leverage to maintain a high standard of quality for the work our agents are doing.

Kudos to Steven Bucher and the Microsoft team for making this knowledge available as a public tool. You can fork/clone it from GitHub here [github.com/azure/azure-policy-linter](https://github.com/Azure/azure-policy-linter) and start testing and customising it for your own usecases.

## Custom Policy Versioning in Public Preview

Back in [Chapter 2](/cloud/awesome-azure-policy-chapter-2/) I highlighted built-in policy versioning. Steven Bucher's [custom policy versioning announcement](https://techcommunity.microsoft.com/blog/AzureGovernanceandManagementBlog/public-preview-annoucement-azure-policy-custom-policy-versioning/4556461) extends that model to custom definitions and initiatives.

The practical benefit is being able to keep multiple versions under one definition ID and move assignments between version tracks allowing your teams a way to pilot a change at one scope while another stays on an earlier major version. We all love more flexibility for safe deployments in production!

There are a few details worth reading before you change your deployment process.

- This is currently **public preview** so exercise judgement and caution before deciding to use in production.
- The announcement describes `properties.version` as the version Azure Policy acts on, rather than a version string in `metadata.version`.
- An assignment using `definitionVersion: "1.*.*"` automatically takes minor and patch updates within major version 1; `"1.1.*"` stays within minor version 1. **Exact patch pinning isn't supported.**
- Limit of four versions per custom definition or initiative
- Support for `All` and `Indexed` modes, and no custom version overrides on assignments.

For many enterprise customers, using custom Azure Policies is a must to plug governance gaps and meet their organizational standards which often cannot solely rely on the built-in policies.

Having the flexibility to control policy changes across multiple assignment scopes and policy objects makes custom policy versioning a feature to start getting serious about once it goes GA.

## Seeing What's Underneath a Policy Exemption

Another notable mention is Steven Bucher's [compliance substate announcement for Azure Policy exemptions](https://techcommunity.microsoft.com/blog/azuregovernanceandmanagementblog/introducing-compliance-substate-for-azure-policy-exemptions/4541703).

This new data point (substate) makes it easier for us to review existing Policy Exemptions giving you a much better starting point for reviewing whether that exemption still needs to exist.

The additional substate tells you whether its underlying result is Compliant or Non-compliant. Steven's article shows how to add the column to an assignment's compliance report and query it through Azure Resource Graph. 

> Look for `complianceSubState` within `properties.stateDetails`.

Here's the provided starting KQL query to list every exempted resource and its substate:

```kql
policyresources
| where type == "microsoft.policyinsights/policystates"
| extend complianceState = tostring(properties.complianceState)
| extend complianceSubState = tostring(properties.stateDetails.complianceSubState),
         resourceId = tostring(properties.resourceId),
         policyAssignmentId = tostring(properties.policyAssignmentId)
| where complianceState == "Exempt"
| project resourceId, policyAssignmentId, complianceState, complianceSubState
```

I'd use the substate to prioritise a review with the resource owner, alongside the exemption's reason and expiry date, rather than treating a green result as an instruction to automatically delete the exemption.

## Azure Policy and APIM: Different Layers of AI Governance

My final pick is Thomas Thornton's [From Azure Policy to APIM: Implementing Azure AI Guardrails](https://thomasthornton.cloud/from-azure-policy-to-apim-implementing-azure-ai-guardrails/).

[![Thomas Thornton's diagram of Azure Policy and API Management AI governance layers](https://raw.githubusercontent.com/thomast1906/thomasthorntoncloud-examples/master/AZure-APIM-AI-guardrails-policy/drawings/two-layer-ai-governance-model.jpg)](https://github.com/thomast1906/thomasthorntoncloud-examples/blob/master/AZure-APIM-AI-guardrails-policy/drawings/two-layer-ai-governance-model.jpg)

The above image from Thomas sums it up perfectly showing the two governance layers regarding resource governance and runtime governance in an example architecture:

- Azure Policy (resource governance) - controls what can be deployed and how resources are configured
- API Management (runtime governance) - controls what happens when applications consume those resources

Having worked on customer projects recently involving both Microsoft Foundry and API Management - Thomas's blog post reaffirms my own design/implementation experience and gives me another perspective I had not yet considered!

Great write-up Thomas!

## Closing

Thanks again for reading about the latest awesome Azure Policy content from across the industry.

In the era of AI and agents, sadly Azure Policy does not get much attention or headline news but I can tell you that it's more important than ever to consider how we are **governing and securing our Azure tenants and the resources** within them because changes that impact resource compliance and security posture are now **happening at speeds we've never seen before**.

Today, Azure Policy remains a steadfast control in our cloud governance toolbox.

Until next time,
Jesse
