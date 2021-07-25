---
title: "How To Win vs Azure Policy Non-Compliance"
excerpt: "Fixing a design flaw with the existenceCondition for builtin policies"
header:
    og_image: /assets/images/policy-noncompliance.jpg
    teaser: /assets/images/policy-noncompliance.jpg
date:   "2021-07-25"
categories: 
- "cloud"
tags: 
- "azure policy"
- "troubleshooting"
- "deployifnotexists"
- "non-compliance"
- "existenceCondition"
---

Hey folks in this blog post I'm going to share with you how to win the battle versus Azure Policy non-compliance.

I had a scope requirement for a recent customer engagement to implement diagnostic settings for several resource types - one of which was Azure Kubernetes Service (AKS) clusters. 

These diagnostic settings needed to be customised per the design document and ultimately logs were to be forwarded to a log analytics workspace -- perfect fit for leveraging policy-as-code and deployIfNotExists policies!

The following builtin policy seemed to fit my requirements above perfectly so I set about testing it in my development subscription.

```json
  "properties": {
    "displayName": "Deploy - Configure diagnostic settings for Azure Kubernetes Service to Log Analytics workspace",
    "policyType": "BuiltIn",
    "mode": "Indexed",
    "description": "Deploys the diagnostic settings for Azure Kubernetes Service to stream resource logs to a Log Analytics workspace.",
    "metadata": {
      "version": "1.0.0",
      "category": "Kubernetes"
    },
```

> When testing deployIfNotExists policies you should verify (1) the ARM template deployment for your non-compliant resources was successful, and (2) the resource is marked as compliant post-remediation task.

Here's a simple image illustrating my flow when troubleshooting and resolving the root cause of this non-compliant policy:

![AzurePolicyNonCompliance](/assets/images/policy-noncompliance0.svg "How to Win vs Azure Policy Non-Compliance")

# Fighting The Enemy

Screenshot #1 (or SS #1) shows a non-compliant AKS cluster. This evaluation result is AFTER a remediation task had successfully configured the diagnostic settings per my requirements on the resource. Initially I was puzzled to see this non-compliant result but it became clear why this was was happening as I investigated the policy's existenceCondition.

SS #2 shows the reason for non-compliance is because **target value** and **current value** for the **evaluated field** is **not matching**. The path for the evaluated field is also an array "properties.logs[*].enabled" which basically means there's more than one element to evaluate. 

> I was able to view the reason for non-compliance by clicking into the *Details* link under the Compliance reason column -- a crucial piece of evidence for troubleshooting -- in the future I hope we'll be able to query this exact data programmatically.

SS #3 shows my verification of the successful remediation task on the resource. This confirms the policy's nested Azure Resource Manager (ARM) template deployment was a SUCCESS.

SS #4 shows our root cause issue with one of the existenceCondition blocks where the alias "Microsoft.Insights/diagnosticSettings/logs.enabled" needs to equal to "True" for the resource to be marked as compliant.

> Again, based on the fact that this alias maps to an array (as seen in SS #2) this condition is basically saying that every element in the array needs equal to "True" for the resource to be marked as compliant after an evaluation scan. A bit of an 'opps' moment here :smile:

# Winning The Battle

SS #5 and SS #6 show how I resolved this issue by:
1. changing the condition from "**equals**" to "**in**"
2. referencing each AKS log parameter name in the array aka "**[parameters('kube-apiserver')]**" etc

> These parameter names also need to be in the right order. And as the original policy was a builtin type, I duplicated the JSON into a custom policy and modified the existenceCondition as shown in SS #5.

After checking numerous builtin policies for configuring diagnostic settings I can confirm Microsoft have paramaterised the individual logs/metrics so you can specify during your policy assignment which logs/metrics you want to configure (by default they are all set to "True"). 

This is great, as it allows developers/admins to be flexible with the policy's settings without having to change/duplicate the policy definition JSON to get a desired result. **However I believe most of these builtin policies have the same design flaw with the existenceCondition as outlined in this blog post.**

# Battle Report

I found that the builtin policy's existenceCondition shown below only 100% works if the logs/metric parameter default values do not change e.g. from "True" to "False". 

By "100% works" I'm referring a deployIfNotExists policy which successfully deploys the policy's nested ARM template to your non-compliant resource and then marks the resource as compliant after an evaluation scan.

```json
"existenceCondition": {
    "allOf": [
    {
        "field": "Microsoft.Insights/diagnosticSettings/logs.enabled",
        "equals": "True"
    },
    {
        "field": "Microsoft.Insights/diagnosticSettings/metrics.enabled",
        "equals": "True"
    },
    {
        "field": "Microsoft.Insights/diagnosticSettings/workspaceId",
        "equals": "[parameters('logAnalytics')]"
    }
  ]
},
```

For my use-case I needed to set a few of these parameters to "False" per below example.

```json
parameter_values = {
    "AllMetrics" : { value = "False" }
    "kube-apiserver" : { value = "False" }
    "kube-controller-manager" : { value = "False" }
    "kube-scheduler" : { value = "False" }
    "cluster-autoscaler" : { value = "False" }
    }
```

Because the builtin policy's existenceCondition shown above expected all values in the array alias for "**Microsoft.Insights/diagnosticSettings/logs.enabled**" to equal to "**True**" I was never going to get a compliant resource. The remediation tasks would be successful but the policy was only really 50% working 'out-of-the-box'. Not cool!

> This is good example of incomplete policy authoring and why testing new policies against a proven methodology and framework can surface the issues as described in this blog post, particularly when the policy's parameter values are changing.

The new existenceCondition shown below 100% works even if the logs/metric parameter default values have changed e.g. from "True" to "False". This is what we need to aim for across all diagnostic settings policies using the deployIfNotExists effect.

```json
"existenceCondition" : {
    "allOf" : [
    {
        "field" : "Microsoft.Insights/diagnosticSettings/logs.enabled",
        "in" : [
            "[parameters('kube-apiserver')]", 
            "[parameters('kube-audit')]", 
            "[parameters('kube-controller-manager')]", 
            "[parameters('kube-scheduler')]", 
            "[parameters('cluster-autoscaler')]", 
            "[parameters('kube-audit-admin')]", 
            "[parameters('guard')]"
            ]
    },
    {
        "field" : "Microsoft.Insights/diagnosticSettings/metrics.enabled",
        "equals" : "[parameters('AllMetrics')]"
    },
    {
        "field" : "Microsoft.Insights/diagnosticSettings/workspaceId",
        "equals" : "[parameters('logAnalytics')]"
    }
  ]
},
```

You can read more about Azure Kubernetes Service (AKS) logs [here](https://docs.microsoft.com/en-us/azure/aks/view-control-plane-logs)

If you're interested in authoring policies which evaluate array aliases I recommend reading [this](https://docs.microsoft.com/en-us/azure/governance/policy/how-to/author-policies-for-arrays#in-and-notin)

For a breakdown of available policy evaluation conditions check out this [link](https://docs.microsoft.com/en-us/azure/governance/policy/concepts/definition-structure#conditions)

Keep fighting the good fight!

Jesse