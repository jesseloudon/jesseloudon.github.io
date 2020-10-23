---
title: "Cloud Governance with Azure Policy Part 2"
excerpt: "Intro to the Azure Policy extension for VSCode and authoring custom policy definitions by finding property aliases."
date:   "2020-05-18"
categories: 
- "CLOUD"
tags: 
- "AZURE POLICY"
---
This is Part 2 of a blog series on Azure Policy. In [Part 1](https://jloudon.com/cloud/Cloud-Governance-with-Azure-Policy-Part-1/) I introduced you to the audit vs deny debate, using the native tooling for Cloud governance, and governance at scale through policy as code workflows.

# Using the Azure Policy extension for VSCode

Azure is a growing ecosystem and, whilst ~300 built-in policy definitions cover a wide range of use cases, you may find yourself in a situation where you need to create your own custom policy definitions.

This is where the Azure Policy extension for Visual Studio Code comes into the picture.

Released in Nov’19 it adds great value to the authoring process and I urge you to check it out if you're serious about leveraging Azure Policy for governance at scale. It's particularly useful for looking up property aliases which can be used as fields for your custom policy definition rules. More on this soon.

To start with policy authoring I recommend you grab the following:

* Visual Studio Code
* Azure Account extension
* Azure Policy extension

![azure extensions vscode](/assets/images/azurepolicy1.png)

Side note: I’ve found VSCode to be one of the top tools for working on Azure, outside of the Portal, because of the wide range of extensions available. Since the release of PowerShell v7 I’ve completely replaced the Windows PowerShell ISE with the VSCode PowerShell extension.

The Azure policy extension comes with some default settings such as alias and resource filtering which provide an out-of-box performance benefit. With these settings enabled the extension won’t spend time loading something that doesn’t exist in your Azure subscription.

You can turn these settings off to see all resources, namespaces, and resource types just be aware that extension timeouts to management.azure.com and slow policy tree loading are more likely to occur.

![azure policy extension settings](/assets/images/azurepolicy2.png)

After extension installation, authenticate to Azure via the VSCode command palette (CTRL+SHIFT+P) > Azure Sign In 

![azure signin vscode](/assets/images/azurepolicy3.png)

Authentication is also possible via  Azure Policy Extension > Sign in to Azure 

![azure policy extension signin](/assets/images/azurepolicy4.png)

After authentication, if you have access to multiple subscriptions, you can add/remove Azure subscriptions from the policy extension using  CTRL+SHIFT+P > Azure: Select Subscriptions 

For optimal performance, I recommend having only 1 Azure subscription selected when using the policy extension.

![azure subscription select vscode](/assets/images/azurepolicy5.png)

Here’s a quick overview of the trees currently available in the Azure Policy extension:

![azure policy extension tree](/assets/images/azurepolicy6.png)

* Resources
  * Subscription
      * **Resource Providers** (resources are divided by resource provider such as 'Microsoft.Compute' or 'Microsoft.Network' that are registered to the selected subscription)
      * **Resource Groups** (tracked resources e.g. resources that are members of a resource group are shown here)

* Policies
  * Subscription
      * Assignments
      * **Built-In Definitions**
      * Custom Definitions
      * Initiatives

Above, I've highlighted Resources/Resource Providers and Resources/Resource Groups because this is where you can navigate the Azure ecosystem and discover property aliases that can be used as fields in your custom policy definitions. Super important and a powerful enabler!

Another useful tree is Policies/Built-in Definitions where you can access the existing built-in policies in your subscription and it’s a good place to start if you are new to Azure Policy and JSON format.

When you browse through the built-in policy definitions you’ll notice the JSON structure can be broken down into:

* mode
* parameters
* displayName
* description
* policy rule
* if (logical evaluation)
    * not
    * allOf
    * anyOf
* then (effect)
    * deny
    * audit
    * append
    * auditIfNotExists
    * deployIfNotExists
    * disabled


Here's a collapsed snippet of a policy definition in JSON.

![azure policy definition structure](/assets/images/azurepolicy9.png)

To best understand what a policy definition is doing I recommend you give extra attention to the following:  

* **if** (what rules will be used to evaluate non-compliance)
* **then** (what effects to apply if a resource is non-compliant)

# A Real-World Example of using the Azure Policy Extension

An example of how I used the Azure policy extension involved a customer’s governance standard which stated that Azure Role Based Access Control (RBAC) usage needed follow the pattern of using Active Directory (AD) Synced Groups or Azure Active Directory (AAD) Groups to assign access to Azure resources.

I had the idea that a possible use case where Azure Policy might help would be to audit users who’ve been assigned direct access to Azure resources outside of an AD/AAD group. The non-compliant results would be a good indication of where “RBAC drift” was occurring and provide the data that could be used to transition the direct user access to AD/AAD group access.

At the time this happened, there was no built-in policy definition that met my requirement and I didn’t know if there was any property alias I could use for my custom policy definition.

Inspiration would come by browsing to Policies/Built-in Definitions via the Azure policy extension where I found an existing built-in policy (Audit usage of custom RBAC rules) which did a similar job to my requirement.

![azure policy audit usage of custom rbac rules](/assets/images/azurepolicy7.png)

The "Audit usage of custom RBAC rules" policy has two rules under if > allOf

``` json
    "if": {

      "allOf": [

        {

          "field": "type",

          "equals": "Microsoft.Authorization/roleDefinitions"

        },

        {

          "field": "Microsoft.Authorization/roleDefinitions/type",

          "equals": "CustomRole"

        }

      ]

    }
```

You can see the policy above is evaluating against an exact match on the `CustomRole` value within the `Microsoft.Authorization/roleDefinitions/type` property alias.

At the time, this was a big hint for me because if we can match on `CustomRole` for a role definition how about a User assignment on a resource ACL?

After browsing through the `Resources/Resource Providers/Microsoft.Authorization` namespace I noticed that there’s a tree called `roleAssignments`. And within `properties.principalType` I could see a value of `User` for one of the role assignments. Boom!

Hovering my mouse pointer over `properties.principalType` the policy extension displayed the available property alias on screen - `Microsoft.Authorization/roleAssignments/principalType`

![azure policy extension roleassignments principaltype](/assets/images/azurepolicy8.png)

To verify my findings, I chased up the Resource Group and Principal ID specified in the Role Assignment above and found it matched to a User assigned directly to the access control list (IAM). This is exactly what I wanted my custom policy definition to look for.

![azure iam roleassignments](/assets/images/azurepolicy11.png)

So to meet my requirement of auditing users who’ve been assigned direct access to Azure resources outside of an AD/AAD group, my custom policy needed to be:

``` json
{
  "mode": "All",
  "policyRule": {
    "if": {
      "allOf": [
        {
          "field": "type",
          "equals": "Microsoft.Authorization/roleAssignments"
        },
        {
          "field": "Microsoft.Authorization/roleAssignments/principalType",
          "equals": "[parameters('principalType')]"
        }
      ]
    },
    "then": {
      "effect": "audit"
    }
  },
  "parameters": {
    "principalType": {
      "type": "String",
      "metadata": {
        "displayName": "principalType",
        "description": "Which principaltype to audit against e.g. 'User'"
      },
      "allowedValues": [
        "User",
        "Group",
        "ServicePrincipal"
      ],
      "defaultValue": "User"
    }
  }
}
```

You may notice above that I’m setting `principalType` into a parameter – this is so other possible values such as `Group` or `ServicePrincipal` can easily be used with the same custom policy definition.

Within `paramaters.principalType.defaultValue` I'm also setting it to `User` so the parameter value is automatically filled when you are creating/assigning the policy in Azure.

Running this custom policy definition in Azure against my subscription shows 4 out of 8 non-compliant resources. So that means there are 4 User role assignments out of 8 total role assignments in my subscription.

I now have a working policy which audits users who’ve been assigned direct access to Azure resources outside of an AD/AAD group. The non-compliant results are a good indication of where “RBAC drift” is occurring and provides data that could be used to transition the direct user access to AD/AAD group access.

![azure policy custom definition compliance status](/assets/images/azurepolicy16.png)

![azure policy custom definition compliance details](/assets/images/azurepolicy17.png)

# A Pattern for Custom Policy Authoring

Microsoft provide helpful guidance on creating your own custom policy which is a great place to start.

Below I've modified their steps slightly to suit my latest experience as above (new bits bolded):

* Identify your business requirements or operational needs
* Look at existing policy samples (built-in or community sourced)
* Map each requirement to an Azure resource property
* Map the property to an alias
* Determine which effect to use
* Compose the policy definition
* Test, test, test

Available methods for discovering the aliases for an Azure resource

There's more than 1 method currently available which you can use to discover an Azure resource property alias:

* Azure Policy extension for VS Code (demonstrated above)
* Azure CLI (example below)
* Azure PowerShell (example below)
* Azure Resource Graph (example below – but not specific to Microsoft.Authorization namespace)


**Azure CLI**
``` bash
az provider show --namespace "Microsoft.Authorization" --expand "resourceTypes/aliases" --query "resourceTypes[].aliases[].name"
```

**PowerShell**
``` powershell
Get-AzPolicyAlias -ResourceTypeMatch 'roleassignment' | fl
```

**Azure Resource Graph**
``` powershell
Search-AzGraph -Query "Resources | where type=~'microsoft.storage/storageaccounts' | limit 1 | project aliases"
```

# Closing Remarks

Using the Azure policy extension for Visual Studio Code to do your initial discovery of property aliases can be beneficial to your custom policy authoring because it shows actual live resource data from your Azure subscription. 

Seeing live resource data from your subscription helps to establish context around what to look for and the possible values a property alias might have.

Microsoft are further developing the Azure Policy extension for VSCode and I'm excited for what the future holds in that space.

What's coming...

* Policy structure syntax highlighting
* Policy and alias validation
* Policy compliance state testing

If you have any ideas, feature requests, or find any bugs with the Azure Policy extension you can email authorpolicy@microsoft.com

In Part 3 (WIP) of this series I’ll walkthrough managing the Azure Policy Lifecycle.

Cheers,

Jesse