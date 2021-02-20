---
title: "Removing Unknown Azure RBAC Role Assignments with PowerShell"
excerpt: "How to programmatically find and remove 'Unknown' type Azure RBAC role assignments with PowerShell"
header:
    og_image: /assets/images/rbac1.png
    teaser: /assets/images/rbac1.png
date:   "2020-05-20"
categories: 
- "cloud"
tags: 
- "azure rbac"
- "rbac unknown identities"
- "powershell"
---
Ever wondered how to programmatically find and remove Azure RBAC role assignments of 'Unknown' ObjectType, at scale, in your Azure subscription?

In this blog I'll describe the problem using an example scenario and then show you a scripted solution using PowerShell.

# Unknown Role Assignments with Identity Not Found

![rbac identity not found](/assets/images/rbac1.png "rbac identity not found")

Looking at Access Control (IAM) role assignments within the Azure portal, you might've noticed that a security principal is listed as "Identity not found" with an "Unknown" type.

There's 2 possible [reasons](https://docs.microsoft.com/en-us/azure/role-based-access-control/troubleshooting#role-assignments-with-identity-not-found) this can occur:

* You recently invited a user when creating a role assignment
* You deleted a security principal that had a role assignment

Note - a security principal can be a:

* User
* Group
* Service Principal
* Managed Identity

# Example Scenario of How This Can Occur

Let's examine an example scenario for the 2nd possible reason listed above: You deleted a security principal that had a role assignment.

Imagine you're testing Azure policy definitions using 'deployIfNotExists' or 'modify' effects - a managed identity needs to be created because that's how Azure policy has the required permissions to action those effects specified in your policy definitions.

In the screenshot below you can see a managed identity will be created automatically as part of the task to assign a policy initiative. So far, so good!

![policy assignment managed identity](/assets/images/rbac2.png "policy assignment managed identity")

Now this new managed identity will also have a corresponding RBAC role assignment created on the scope defined by the policy assignment.

So if you are assigning your policy to the subscription scope a role assignment will be applied at the subscription level.

If, later on, you delete that policy assignment the managed identity will also automatically get deleted, which makes sense, because you might not need that managed identity ever again - but wait, for some reason the RBAC role assignment still exists for the deleted managed identity.

This leaves you with a security principal on the Access Control (IAM) role assignments page that displays as "Identity not found" with an "Unknown" type. Not harmful, I think, but also not a clean/tidy experience to encounter. 

My hope is that Microsoft identify this as a problem and resolve it - so I've reached out to the Azure Policy Program Managers via Twitter...

<blockquote class="twitter-tweet" data-theme="dark"><p lang="en" dir="ltr">TIL - via testing <a href="https://twitter.com/hashtag/AzurePolicy?src=hash&amp;ref_src=twsrc%5Etfw">#AzurePolicy</a> Assignments using DeployIfNotExists/Modify effects - a Managed Identity is created. <br><br>If I delete the <a href="https://twitter.com/hashtag/AzurePolicy?src=hash&amp;ref_src=twsrc%5Etfw">#AzurePolicy</a> Assignment the Managed Identity is also deleted - BUT the RBAC Role Assignment still exists for the Managed Identity. Oops :)</p>&mdash; Jesse Loudon (@coder_au) <a href="https://twitter.com/coder_au/status/1262532523558465536?ref_src=twsrc%5Etfw">May 18, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

# Finding Role Assignments of 'Unknown' ObjectType with PowerShell

There's no current method I know of to easily find and remove these 'Unknown' type role assignments via the Azure Portal without doing a bunch of clicking.

So to programmatically discover Azure RBAC role assignments of the 'Unknown' type we can use the [Get-AzRoleAssignment](https://docs.microsoft.com/en-us/powershell/module/az.resources/get-azroleassignment?view=azps-4.1.0) cmdlet:

``` powershell
$OBJTYPE = "Unknown"
Get-AzRoleAssignment | Where Object {$_.ObjectType.Equals($OBJTYPE)}
```

Above you can see we are searching on the ObjectType field matching the value 'Unknown'.

An example output of the above cmdlet is shown below.

```
RoleAssignmentId   : /subscriptions/xxxx-xxxx-xxxx-xxxx-xxxxx/providers/Microsoft.Authorization/roleAssignments/e4d6e646-b378-4fdc-9eda-08ebed262188

Scope              : /subscriptions/xxxx-xxxx-xxxx-xxxx-xxxxx

DisplayName        :

SignInName         :

RoleDefinitionName : Contributor

RoleDefinitionId   : b24988ac-6180-42a0-ab88-20f7382dd24c

ObjectId           : 47bfa834-e673-43e2-9d87-77f4c445dc5f

ObjectType         : Unknown

CanDelegate        : False
```

You may have noticed above that the values for DisplayName and SignInName are null (empty) and that ObjectType equals 'Unknown'. This is clear indication that you've found a role assignment where the corresponding security principal has either been deleted, or a security principal has been invited (while the role assignment was created) and has not yet replicated across regions.

# Removing Role Assignments of 'Unknown' ObjectType with PowerShell

To programmatically remove Azure RBAC role assignments of the 'Unknown' type we can use the [Remove-AzRoleAssignment](https://docs.microsoft.com/en-us/powershell/module/az.resources/remove-azroleassignment?view=azps-4.1.0) cmdlet.

Please note:

* When removing a role assignment you'll need to specify the ObjectID, RoleDefinitionName and Scope
* You'll also need Microsoft.Authorization/roleAssignments/delete permissions, such as [User Access Administrator](https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#user-access-administrator) or [Owner](https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#owner)
* Always test your scripts in a development environment first before using in production.

``` powershell
#AuthN
Connect-AzAccount

#Set Your Subscription ID
Set-AzContext -SubscriptionId "XXXXX-XXXXX-XXXXX-XXXXXX-XXXXXX"

#Common Variables
$FILEPATH = "C:\Temp"
$FILENAME = "AzureRoleAssignmentsToRemove.csv"
$SUBNAME = "SUBSCRIPTIONNAME"
$OBJTYPE = "Unknown"

#Find and Export-to-CSV Azure RBAC Role Assignments of 'Unknown' Type
$raunknown = Get-AzRoleAssignment | Where-Object {$_.ObjectType.Equals($OBJTYPE)} | Export-Csv "$FILEPATH\$SUBNAME-$FILENAME" -NoTypeInformation

#Import-from-CSV and Remove each Azure Role Assignment
$RASTOREMOVE = Import-CSV "$FILEPATH\$SUBNAME-$FILENAME"
$RASTOREMOVE|ForEach-Object {
$object = $_.ObjectId
$roledef = $_.RoleDefinitionName
$rolescope = $_.Scope
Remove-AzRoleAssignment -ObjectId $object -RoleDefinitionName $roledef -Scope $rolescope
}
```

The PowerShell script above does the following:

1. Finds all Azure role assignments in the subscription where ObjectType equals 'Unknown'
2. Exports the results to CSV where you can review/send off for ITSM approvals, etc
3. Imports the results from CSV and sets variables for the required fields needed to remove a role assignment (ObjectID, RoleDefinitionName and Scope)
4. Uses a for each loop to remove each role assignment specified from the imported CSV

# Closing Remarks

Finding and removing Azure RBAC role assignments might not be a common occurence for your team but I think it's important to share with the community how to complete a task like this programmatically.

I came across this problem during my testing of Azure policy assignments, which use a managed identity for certain effects, and would've never thought to look for these role assignments otherwise. 

If you don't look, you'll never find :)

Cheers,

Jesse