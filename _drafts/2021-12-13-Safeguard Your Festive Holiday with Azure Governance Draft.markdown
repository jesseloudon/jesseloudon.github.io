---
title: "Safeguard Your Festive Holiday with Azure Governance (draft)"
excerpt: ""
header:
    og_image: /assets/images/FestiveTechCalendar2021-BlogIntro.jpg
    teaser: /assets/images/FestiveTechCalendar2021-BlogIntro.jpg
date:   "2021-12-13"
categories: 
- "cloud"
tags: 
- "azure policy"
- "policy as code"
- "cloud governance"
- "festive tech calendar"
---
![SafeguardYourFestiveHolidayWithAzureGovernance](/assets/images/FestiveTechCalendar2021-BlogIntro.jpg "Safeguard Your Festive Holiday with Azure Governance")

Azure governance with a festive feeling. This blog post aims to explain the top 10+ methods to safeguard readers from a potentially stressful festive holiday, interrupted by security breaches and out of control resource costs.




Policies to restrict Azure resources to authorisation and authentication standards.



### 1 - Evaluate non-compliant resources by deploying the Azure Security Benchmark initiative

![SafeguardYourFestiveHolidayWithAzureGovernance](/assets/images/FestiveTechCalendar2021-BlogHeading1.jpg "Evaluate non-compliant resources by deploying the Azure Security Benchmark initiative")

Microsoft Defender for Cloud (Previously Azure Security Center)


```s
targetScope = 'subscription' // other valid options are 'managementGroup' or 'tenant'

resource policyAssignment 'Microsoft.Authorization/policyAssignments@2021-06-01' = {
  name: 'BaselineSecurityGovernance'
  location: 'AustraliaEast'
  properties: {
    displayName: 'Baseline Security Governance'
    description: 'Applies Baseline Security Governance via Azure Security Benchmark policy initiative'
    enforcementMode: 'Default' // use 'DoNotEnforce' to view non-compliance but not enforce it
    policyDefinitionId: '/providers/Microsoft.Authorization/policySetDefinitions/1f3afdf9-d0c9-4c3d-847f-89da613e70a8' // Azure Security Benchmark (builtin policyset)
  }
}
```



### 2 - Prevent unauthorized changes by deploying Resource Locks

```json
{
  "properties": {
    "displayName": "Audit resource locks",
    "policyType": "Custom",
    "mode": "All",
    "description": "This policy audits if a resource lock 'CanNotDelete' or 'ReadOnly' has been applied to the specified resource types.",
    "metadata": {
      "category": "Custom",
      "source": "github.com/globalbao/azure-policy-as-code",
      "version": "1.0.0"
    },
    "parameters": {
      "resourceTypes": {
        "type": "Array",
        "metadata": {
          "description": "Azure resource types to audit for locks e.g. 'microsoft.network/expressroutecircuits' and 'microsoft.network/expressroutegateways'",
          "displayName": "Resource types to audit for locks"
        }
      },
      "lockLevel": {
        "type": "Array",
        "metadata": {
          "description": "Resource lock level to audit for",
          "displayName": "Lock level"
        },
        "allowedValues": [
          "ReadOnly",
          "CanNotDelete"
        ],
        "defaultValue": [
          "ReadOnly",
          "CanNotDelete"
        ]
      },
      "effect": {
        "type": "String",
        "metadata": {
          "displayName": "Effect",
          "description": "Enable or disable the execution of the policy"
        },
        "allowedValues": [
          "AuditIfNotExists",
          "Disabled"
        ],
        "defaultValue": "AuditIfNotExists"
      }
    },
    "policyRule": {
      "if": {
        "field": "type",
        "in": "[parameters('resourceTypes')]"
      },
      "then": {
        "effect": "[parameters('effect')]",
        "details": {
          "type": "Microsoft.Authorization/locks",
          "existenceCondition": {
            "field": "Microsoft.Authorization/locks/level",
            "in": "[parameters('lockLevel')]"
          }
        }
      }
    }
  }
}
```


### 3 - Automate Tag governance by assigning tagging policies
Policies to attribute Azure resources back to a cost centre via tags and restrict resource costs!

```json
{
  "properties": {
    "displayName": "Add mandatory tag to resource group",
    "policyType": "Custom",
    "mode": "All",
    "description": "Adds the mandatory tag key when any resource group missing this tag is created or updated. If the tag exists with a different value it will not be changed.",
    "metadata": {
      "category": "Custom",
      "source": "github.com/globalbao/azure-policy-as-code",
      "version": "1.0.0"
    },
    "parameters": {
      "tagName": {
        "type": "String",
        "metadata": {
          "displayName": "Tag name",
          "description": "Name of the tag, such as 'CostCenter'"
        }
      },
      "tagValue": {
        "type": "String",
        "metadata": {
          "displayName": "Tag value",
          "description": "Value of the tag e.g. '12345'"
        }
      },
      "effect": {
        "type": "String",
        "metadata": {
          "displayName": "Effect",
          "description": "Enable or disable the execution of the policy"
        },
        "allowedValues": [
          "Audit",
          "Modify",
          "Disabled"
        ],
        "defaultValue": "Modify"
      }
    },
    "policyRule": {
      "if": {
        "allOf": [
          {
            "field": "type",
            "equals": "Microsoft.Resources/subscriptions/resourceGroups"
          },
          {
            "field": "[concat('tags[', parameters('tagName'), ']')]",
            "exists": "false"
          }
        ]
      },
      "then": {
        "effect": "[parameters('effect')]",
        "details": {
          "roleDefinitionIds": [
            "/providers/microsoft.authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c"
          ],
          "operations": [
            {
              "operation": "add",
              "field": "[concat('tags[', parameters('tagName'), ']')]",
              "value": "[parameters('tagValue')]"
            }
          ]
        }
      }
    }
  }
}
```

### Inherit all tags from the resource group


```json
{
  "properties": {
    "displayName": "Inherit all tags from the resource group",
    "policyType": "Custom",
    "mode": "Indexed",
    "description": "Adds all tags with its value from the parent resource group when any resource missing these tags is created or updated. If the tag exists with a different value it will not be changed.",
    "metadata": {
      "category": "Custom",
      "source": "github.com/globalbao/azure-policy-as-code",
      "version": "1.0.0"
    },
    "parameters": {
      "effect": {
        "type": "String",
        "metadata": {
          "displayName": "Effect",
          "description": "Enable or disable the execution of the policy"
        },
        "allowedValues": [
          "Audit",
          "Modify",
          "Disabled"
        ],
        "defaultValue": "Modify"
      }
    },
    "policyRule": {
      "if": {
        "allOf": [
          {
            "field": "tags",
            "exists": "false"
          },
          {
            "value": "[resourceGroup().tags]",
            "notEquals": ""
          }
        ]
      },
      "then": {
        "effect": "[parameters('effect')]",
        "details": {
          "roleDefinitionIds": [
            "/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c"
          ],
          "operations": [
            {
              "operation": "add",
              "field": "tags",
              "value": "[resourceGroup().tags]"
            }
          ]
        }
      }
    }
  }
}
```




### Inherit mandatory tag from the resource group


```json
{
  "properties": {
    "displayName": "Inherit mandatory tag from the resource group",
    "policyType": "Custom",
    "mode": "Indexed",
    "description": "Adds the specified mandatory tag with its value from the parent resource group when any resource missing this tag is created or updated. If the tag exists with a different value it will not be changed.",
    "metadata": {
      "category": "Custom",
      "source": "github.com/globalbao/azure-policy-as-code",
      "version": "1.0.0"
    },
    "parameters": {
      "tagName": {
        "type": "String",
        "metadata": {
          "displayName": "Tag name",
          "description": "Name of the tag, such as 'CostCenter'"
        }
      },
      "effect": {
        "type": "String",
        "metadata": {
          "displayName": "Effect",
          "description": "Enable or disable the execution of the policy"
        },
        "allowedValues": [
          "Audit",
          "Modify",
          "Disabled"
        ],
        "defaultValue": "Modify"
      }
    },
    "policyRule": {
      "if": {
        "allOf": [
          {
            "field": "[concat('tags[', parameters('tagName'), ']')]",
            "exists": "false"
          },
          {
            "value": "[resourceGroup().tags[parameters('tagName')]]",
            "notEquals": ""
          }
        ]
      },
      "then": {
        "effect": "[parameters('effect')]",
        "details": {
          "roleDefinitionIds": [
            "/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c"
          ],
          "operations": [
            {
              "operation": "add",
              "field": "[concat('tags[', parameters('tagName'), ']')]",
              "value": "[resourceGroup().tags[parameters('tagName')]]"
            }
          ]
        }
      }
    }
  }
}
```

### Inherit mandatory tag from the resource group and overwrite existing


```json
{
  "properties": {
    "displayName": "Inherit mandatory tag from the resource group and overwrite existing",
    "policyType": "Custom",
    "mode": "Indexed",
    "description": "Overwrites the specified mandatory tag and existing value using the RG's tag value. Applicable when any Resource containing the mandatory tag is created or updated. Ignores scenarios where tag values are the same for both Resource and RG, or when the RG's tag value is one of the parameters('tagValuesToIgnore').",
    "metadata": {
      "category": "Custom",
      "source": "github.com/globalbao/azure-policy-as-code",
      "version": "1.0.0"
    },
    "parameters": {
      "tagName": {
        "type": "String",
        "metadata": {
          "displayName": "Tag name",
          "description": "Name of the tag, such as 'CostCenter'"
        }
      },
      "tagValuesToIgnore": {
        "type": "Array",
        "metadata": {
          "displayName": "Tag values to ignore for inheritance",
          "description": "A list of tag values to ignore when evaluating tag inheritance from the RG"
        }
      },
      "effect": {
        "type": "String",
        "metadata": {
          "displayName": "Effect",
          "description": "Enable or disable the execution of the policy"
        },
        "allowedValues": [
          "Audit",
          "Modify",
          "Disabled"
        ],
        "defaultValue": "Modify"
      }
    },
    "policyRule": {
      "if": {
        "allOf": [
          {
            "field": "[concat('tags[', parameters('tagName'), ']')]",
            "exists": "true"
          },
          {
            "value": "[resourceGroup().tags[parameters('tagName')]]",
            "notEquals": ""
          },
          {
            "field": "[concat('tags[', parameters('tagName'), ']')]",
            "notEquals": "[resourceGroup().tags[parameters('tagName')]]"
          },
          {
            "value": "[resourceGroup().tags[parameters('tagName')]]",
            "notIn": "[parameters('tagValuesToIgnore')]"
          }
        ]
      },
      "then": {
        "effect": "[parameters('effect')]",
        "details": {
          "operations": [
            {
              "field": "[concat('tags[', parameters('tagName'), ']')]",
              "operation": "addOrReplace",
              "value": "[resourceGroup().tags[parameters('tagName')]]"
            }
          ],
          "roleDefinitionIds": [
            "/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c"
          ]
        }
      }
    }
  }
}
```



### Allowed virtual machine size SKUs

https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fcccc23c7-8427-4f53-ad12-b6a63eb452b3
https://www.azadvertizer.net/azpolicyadvertizer/cccc23c7-8427-4f53-ad12-b6a63eb452b3.html

```json
{
    "displayName": "Allowed virtual machine size SKUs",
    "policyType": "BuiltIn",
    "mode": "Indexed",
    "description": "This policy enables you to specify a set of virtual machine size SKUs that your organization can deploy.",
    "metadata": {
        "version": "1.0.1",
        "category": "Compute"
    },
    "parameters": {
        "listOfAllowedSKUs": {
            "type": "Array",
            "metadata": {
                "description": "The list of size SKUs that can be specified for virtual machines.",
                "displayName": "Allowed Size SKUs",
                "strongType": "VMSKUs"
            }
        }
    },
    "policyRule": {
        "if": {
            "allOf": [
                {
                    "field": "type",
                    "equals": "Microsoft.Compute/virtualMachines"
                },
                {
                    "not": {
                        "field": "Microsoft.Compute/virtualMachines/sku.name",
                        "in": "[parameters('listOfAllowedSKUs')]"
                    }
                }
            ]
        },
        "then": {
            "effect": "Deny"
        }
    }
}
```


### Storage accounts should be limited by allowed SKUs

https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7433c107-6db4-4ad1-b57a-a76dce0154a1
https://www.azadvertizer.net/azpolicyadvertizer/7433c107-6db4-4ad1-b57a-a76dce0154a1.html

```json
{
    "displayName": "Storage accounts should be limited by allowed SKUs",
    "policyType": "BuiltIn",
    "mode": "Indexed",
    "description": "Restrict the set of storage account SKUs that your organization can deploy.",
    "metadata": {
        "version": "1.1.0",
        "category": "Storage"
    },
    "parameters": {
        "effect": {
            "type": "String",
            "metadata": {
                "displayName": "Effect",
                "description": "Enable or disable the execution of the audit policy"
            },
            "allowedValues": [
                "Audit",
                "Deny",
                "Disabled"
            ],
            "defaultValue": "Deny"
        },
        "listOfAllowedSKUs": {
            "type": "Array",
            "metadata": {
                "description": "The list of SKUs that can be specified for storage accounts.",
                "displayName": "Allowed SKUs",
                "strongType": "StorageSKUs"
            }
        }
    },
    "policyRule": {
        "if": {
            "allOf": [
                {
                    "field": "type",
                    "equals": "Microsoft.Storage/storageAccounts"
                },
                {
                    "not": {
                        "field": "Microsoft.Storage/storageAccounts/sku.name",
                        "in": "[parameters('listOfAllowedSKUs')]"
                    }
                }
            ]
        },
        "then": {
            "effect": "[parameters('effect')]"
        }
    }
}
```