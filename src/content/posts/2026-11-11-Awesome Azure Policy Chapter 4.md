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

- All<wbr>Parameter<wbr>References<wbr>Must<wbr>Resolve<wbr>Tests.cs
- App<wbr>Service<wbr>Config<wbr>Field<wbr>Alias<wbr>Tests.cs
- Array<wbr>Compared<wbr>As<wbr>Scalar<wbr>Tests.cs
- Array<wbr>Or<wbr>Object<wbr>Parameter<wbr>In<wbr>Equality<wbr>Operator<wbr>Tests.cs
- Blocking<wbr>Effect<wbr>On<wbr>Role<wbr>Assignments<wbr>Tests.cs
- Broad<wbr>Type<wbr>Matching<wbr>Operator<wbr>Tests.cs
- Conditional<wbr>Field<wbr>Alias<wbr>Tests.cs
- Count<wbr>Less<wbr>Than<wbr>Array<wbr>Length<wbr>Tests.cs
- Deeply<wbr>Nested<wbr>Field<wbr>Alias<wbr>Tests.cs
- Description<wbr>Duplicates<wbr>Display<wbr>Name<wbr>Tests.cs
- Effect<wbr>Allowed<wbr>Values<wbr>Should<wbr>Not<wbr>Mix<wbr>Incompatible<wbr>Effects<wbr>Tests.cs
- Effect<wbr>Parameter<wbr>Missing<wbr>Allowed<wbr>Values<wbr>Tests.cs
- Effect<wbr>Parameter<wbr>Missing<wbr>Default<wbr>Value<wbr>Tests.cs
- Field<wbr>Alias<wbr>Unavailable<wbr>In<wbr>Any<wbr>Api<wbr>Version<wbr>Tests.cs
- Field<wbr>Alias<wbr>Unavailable<wbr>In<wbr>Latest<wbr>Api<wbr>Version<wbr>Tests.cs
- Field<wbr>Alias<wbr>Unavailable<wbr>In<wbr>Old<wbr>Api<wbr>Versions<wbr>Tests.cs
- Field<wbr>Function<wbr>On<wbr>Counted<wbr>Array<wbr>Alias<wbr>Tests.cs
- Hard<wbr>Coded<wbr>Policy<wbr>Enforcement<wbr>Effect<wbr>Tests.cs
- Implicit<wbr>Array<wbr>Enumeration<wbr>Tests.cs
- Implicit<wbr>Resource<wbr>Type<wbr>Targeting<wbr>Tests.cs
- Invalid<wbr>Effect<wbr>Parameter<wbr>Value<wbr>Tests.cs
- Length<wbr>Function<wbr>On<wbr>Array<wbr>Alias<wbr>Tests.cs
- Like<wbr>Not<wbr>Like<wbr>Without<wbr>Wildcards<wbr>Tests.cs
- Literal<wbr>Asterisk<wbr>In<wbr>Match<wbr>Operator<wbr>Tests.cs
- Logical<wbr>Functions<wbr>In<wbr>Value<wbr>Conditions<wbr>Tests.cs
- Match<wbr>Without<wbr>Wildcards<wbr>Tests.cs
- Missing<wbr>Audit<wbr>Effect<wbr>Counterpart<wbr>Tests.cs
- Missing<wbr>Policy<wbr>Definition<wbr>Description<wbr>Tests.cs
- Missing<wbr>Policy<wbr>Definition<wbr>Display<wbr>Name<wbr>Tests.cs
- Nested<wbr>Not<wbr>Condition<wbr>Tests.cs
- Nested<wbr>Same<wbr>Type<wbr>Quantifiers<wbr>Should<wbr>Be<wbr>Flattened<wbr>Tests.cs
- Nsg<wbr>Security<wbr>Rule<wbr>Child<wbr>Only<wbr>Enforcement<wbr>Tests.cs
- Nsg<wbr>Security<wbr>Rule<wbr>Parent<wbr>Only<wbr>Enforcement<wbr>Tests.cs
- Numeric<wbr>Field<wbr>Or<wbr>Value<wbr>In<wbr>Equality<wbr>Operator<wbr>Tests.cs
- Numeric<wbr>Parameter<wbr>In<wbr>Equality<wbr>Operator<wbr>Tests.cs
- Object<wbr>Compared<wbr>As<wbr>Scalar<wbr>Tests.cs
- Optional<wbr>Field<wbr>Alias<wbr>Tests.cs
- Ordering<wbr>Operator<wbr>On<wbr>Incompatible<wbr>Field<wbr>Type<wbr>In<wbr>Old<wbr>Api<wbr>Versions<wbr>Tests.cs
- Ordering<wbr>Operator<wbr>On<wbr>Incompatible<wbr>Field<wbr>Type<wbr>Tests.cs
- Parameter<wbr>Missing<wbr>Description<wbr>Tests.cs
- Parameter<wbr>Missing<wbr>Display<wbr>Name<wbr>Tests.cs
- Policy<wbr>Rule<wbr>References<wbr>Multiple<wbr>Resource<wbr>Types<wbr>Tests.cs
- Read<wbr>Only<wbr>Field<wbr>Alias<wbr>Tests.cs
- Request<wbr>Context<wbr>Identity<wbr>Is<wbr>Enforcement<wbr>Only<wbr>Tests.cs
- Resource<wbr>Type<wbr>Not<wbr>Evaluated<wbr>By<wbr>Policy<wbr>Tests.cs
- Resource<wbr>Types<wbr>Not<wbr>Supported<wbr>By<wbr>Indexed<wbr>Mode<wbr>Tests.cs
- Risky<wbr>Effect<wbr>Parameter<wbr>Default<wbr>Value<wbr>Tests.cs
- Simplify<wbr>Multiple<wbr>Equals<wbr>To<wbr>In<wbr>Tests.cs
- Simplify<wbr>Multiple<wbr>Not<wbr>Equals<wbr>To<wbr>Not<wbr>In<wbr>Tests.cs
- Try<wbr>Get<wbr>Use<wbr>With<wbr>Null<wbr>Coercing<wbr>Operator<wbr>Tests.cs
- Type<wbr>Condition<wbr>First<wbr>In<wbr>All<wbr>Of<wbr>Tests.cs
- Type<wbr>Only<wbr>If<wbr>Condition<wbr>Tests.cs
- Unguarded<wbr>Request<wbr>Context<wbr>Identity<wbr>Access<wbr>Tests.cs
- Unguarded<wbr>Substring<wbr>Function<wbr>Tests.cs
- Unguarded<wbr>Try<wbr>Get<wbr>Operator<wbr>Value<wbr>Tests.cs
- Unnecessary<wbr>Quantifier<wbr>Wrapper<wbr>Tests.cs
- Vm<wbr>Os<wbr>Type<wbr>Field<wbr>Alias<wbr>Tests.cs

Having been working with Azure Policy for years on the frontlines I think this linter tool is amazing value to include for all your customer's policy-as-code and platform operation repos. On the agentic front, given we're now doing more with agents and AI, having this linter execute as a pre-merge check is another method we can maintain a high standard of quality for the work our agents are doing.

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

Another Microsoft addition is Steven Bucher's [compliance substate announcement for Azure Policy exemptions](https://techcommunity.microsoft.com/blog/azuregovernanceandmanagementblog/introducing-compliance-substate-for-azure-policy-exemptions/4541703).

An exempt resource still shows as Exempt, but the additional substate tells you whether its underlying result is Compliant or Non-compliant. The article shows how to add the column to an assignment's compliance report and query it through Azure Resource Graph. Look for `complianceSubState` within `properties.stateDetails`.

This follows nicely from the exemption reporting covered in [Chapter 1](/cloud/awesome-azure-policy-chapter-1/). Knowing an exemption exists is useful; knowing that the resource now meets the policy gives you a much better starting point for reviewing whether that exemption still needs to exist.

I'd use the substate to prioritise a review with the resource owner, alongside the exemption's reason and expiry date, rather than treating a green result as an instruction to automatically delete the exemption.

## Azure Policy and APIM: Different Layers of AI Governance

My final pick is Thomas Thornton's [From Azure Policy to APIM: Implementing Azure AI Guardrails](https://thomasthornton.cloud/from-azure-policy-to-apim-implementing-azure-ai-guardrails/), published on 17 August 2026.

Thomas makes a useful distinction: **Azure Policy governs resource deployment and configuration; API Management policies govern requests flowing through the gateway.** They aren't interchangeable policy engines.

The article connects network access, authentication, diagnostics, and approved-model controls at the resource layer with token limits, content safety, and usage telemetry at the runtime layer. I think that separation is worth keeping visible when discussing what an AI platform's guardrails actually cover.

Thomas also highlights the operational side of applying controls to an existing estate. Disabling public access or local authentication can affect consumers that already depend on those paths. Start with visibility where immediate enforcement could disrupt workloads, understand the dependencies, and check the linked policy references and APIM tier support before adopting the examples.

Great write-up Thomas!

## Closing

Thanks again for reading about the latest awesome Azure Policy content from across the industry.

In the era of AI and agents, sadly Azure Policy does not get much attention or headline news but I can tell you that it's more important than ever to consider how we are governing and securing our Azure tenants and the resources within them because changes that impact resource compliance and security posture are now happening at speeds we've never seen before. Today, Azure Policy remains a steadfast control in our cloud governance toolbox.

<details>
<summary>Microsoft linter image attribution and licence</summary>
<pre style="white-space: pre-wrap; overflow-wrap: anywhere;">Copyright (c) Microsoft Corporation.

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.</pre>
<p>Source: <a href="https://github.com/Azure/azure-policy-linter/blob/4a153e9cf10911dab1276287cd89652d4d2cf682/LICENSE">Microsoft Azure Policy Linter MIT licence</a>. The screenshot above is reproduced from that project at the linked snapshot.</p>
</details>

Until next time,\
Jesse
