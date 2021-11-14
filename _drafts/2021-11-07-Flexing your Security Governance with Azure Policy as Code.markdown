---
title: "Flexing your Security Governance with Azure Policy as Code"
excerpt: ""
header:
    og_image: /assets/images/.png
    teaser: /assets/images/.png
date:   "2021-11-07"
categories: 
- "cloud"
tags: 
- "bicep"
- "security governance"
- "azure policy"
- "policy as code"
- "melbourne azure security meetup"
---



# Key Vaults

Policy Name: Deploy - Configure diagnostic settings for Azure Key Vault to Log Analytics workspace
Policy Description:"Deploys the diagnostic settings for Azure Key Vault to stream resource logs to a Log Analytics workspace when any Key Vault which is missing this diagnostic settings is created or updated."

```json
"parameters": {
"diagnosticsSettingNameToUse": {
"type": "String",
"metadata": {
    "displayName": "Setting name",
    "description": "Name of the diagnostic settings."
},
"defaultValue": "AzureKeyVaultDiagnosticsLogsToWorkspace"
},
"logAnalytics": {
"type": "String",
"metadata": {
    "displayName": "Log Analytics workspace",
    "description": "Specify the Log Analytics workspace the Key Vault should be connected to.",
    "strongType": "omsWorkspace",
    "assignPermissions": true
}
},
"AuditEventEnabled": {
"type": "String",
"metadata": {
    "displayName": "AuditEvent - Enabled",
    "description": "Whether to stream AuditEvent logs to the Log Analytics workspace - True or False"
},
"allowedValues": [
    "True",
    "False"
],
"defaultValue": "True"
},
"AllMetricsEnabled": {
"type": "String",
"metadata": {
    "displayName": "AllMetrics - Enabled",
    "description": "Whether to stream AllMetrics logs to the Log Analytics workspace - True or False"
},
"allowedValues": [
    "True",
    "False"
],
"defaultValue": "True"
}
}
```


# Certificates

Policy Name: Certificates should be issued by the specified integrated certificate authority 
Policy Description: "Manage your organizational compliance requirements by specifying the Azure integrated certificate authorities that can issue certificates in your key vault such as Digicert or GlobalSign."

```json
"parameters": {
"allowedCAs": {
"type": "Array",
"metadata": {
    "displayName": "Allowed Azure Key Vault Supported CAs",
    "description": "The list of allowed certificate authorities supported by Azure Key Vault."
},
"allowedValues": [
    "DigiCert",
    "GlobalSign"
],
"defaultValue": [
    "DigiCert",
    "GlobalSign"
]
}
}
```

Policy Name: Certificates should use allowed key types   
Policy Description: "Manage your organizational compliance requirements by restricting the key types allowed for certificates"

```json
"parameters": {
"allowedKeyTypes": {
"type": "Array",
"metadata": {
    "displayName": "Allowed key types",
    "description": "The list of allowed certificate key types."
},
"allowedValues": [
    "RSA",
    "RSA-HSM",
    "EC",
    "EC-HSM"
],
"defaultValue": [
    "RSA",
    "RSA-HSM"
]
}
}
```


# Keys

Policy Name: Keys should be the specified cryptographic type RSA or EC
Policy Description: Some applications require the use of keys backed by a specific cryptographic type. Enforce a particular cryptographic key type, RSA or EC, in your environment.

```json
"parameters": {
"allowedKeyTypes": {
"type": "Array",
"metadata": {
    "displayName": "Allowed key types",
    "description": "The list of allowed key types"
},
"allowedValues": [
    "RSA",
    "RSA-HSM",
    "EC",
    "EC-HSM"
],
"defaultValue": [
    "RSA",
    "RSA-HSM",
    "EC",
    "EC-HSM"
]
}
}
```

Policy Name: Keys should have more than the specified number of days before expiration
Policy Description: If a key is too close to expiration, an organizational delay to rotate the key may result in an outage. Keys should be rotated at a specified number of days prior to expiration to provide sufficient time to react to a failure.

```json
"parameters": {
"minimumDaysBeforeExpiration": {
"type": "Integer",
"metadata": {
    "displayName": "The minimum days before expiration",
    "description": "Specify the minimum number of days that a key should remain usable prior to expiration."
}
}
}
```

Policy Name: Keys should have the specified maximum validity period
Policy Description: Manage your organizational compliance requirements by specifying the maximum amount of time in days that a key can be valid within your key vault.

```json
"parameters": {
"maximumValidityInDays": {
"type": "Integer",
"metadata": {
    "displayName": "The maximum validity period in days",
    "description": "Specify the maximum number of days a key can be valid for. Keys should be ephemeral. Using a key with a long validity period is not recommended."
}
}
}
```

Policy Name: Keys should not be active for longer than the specified number of days
Policy Description: Specify the number of days that a key should be active. Keys that are used for an extended period of time increase the probability that an attacker could compromise the key. As a good security practice, make sure that your keys have not been active longer than two years.

```json
"parameters": {
"maximumValidityInDays": {
"type": "Integer",
"metadata": {
    "displayName": "The maximum validity period in days",
    "description": "Specify the maximum number of days a key can be valid for after activation."
}
}
}
```


Policy Name: Keys using RSA cryptography should have a specified minimum key size
Policy Description: Set the minimum allowed key size for use with your key vaults. Use of RSA keys with small key sizes is not a secure practice and doesn't meet many industry certification requirements.

```json
"parameters": {
"minimumRSAKeySize": {
"type": "Integer",
"metadata": {
    "displayName": "Minimum RSA key size",
    "description": "The minimum key size for RSA keys."
},
"allowedValues": [
    2048,
    3072,
    4096
]
}
}
```


# Secrets


