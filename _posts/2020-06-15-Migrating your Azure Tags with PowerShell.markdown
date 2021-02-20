---
title: "Migrating your Azure Tags with PowerShell"
excerpt: "How to migrate existing Azure tag values to new tag key/value pairs programmatically using PowerShell"
header:
    og_image: /assets/images/azuretags5.png
    teaser: /assets/images/azuretags5.png
date:   "2020-06-15"
categories: 
- "cloud"
tags: 
- "azure tags"
- "powershell"
- "migrating tags"
- "key value pairs"
- "update aztag"
---
Tags are important metadata elements attached to our Azure resources in the form of pairs of key/value strings.

We can take advantage of using tags to apply additional context to resources outside of the resource naming convention. For example; the tag key Environment and tag value Production attached to an Azure Resource Group would provide further context about the resources in that Resource Group and their environment affiliation.

Sometimes we also need to migrate our existing tag values to new tag key/value pairs. Completing this tag migration manually from the Azure Portal for hundreds of resources would be very time-consuming so in this blog let's examine how the migration can be done efficiently using PowerShell.

# Example Tag Migration Problem Statement

* You have a large Azure environment consisting of many tag key/value pairs
* You have existing tag values you want to retain and migrate to new tag key/value pairs
* You want to document and automate the tag migration programmatically 
* You want to backup existing tag keys and values prior to making any changes 

# Tag Migration Script

I created this script to handle the tag migration leg work based on the above example tag migration problem statement.

It uses [Get-AzResourceGroup](https://docs.microsoft.com/en-us/powershell/module/az.resources/get-azresourcegroup?view=azps-4.2.0) and [Get-AzResource](https://docs.microsoft.com/en-us/powershell/module/az.resources/get-azresource?view=azps-4.2.0) to query Azure for RGs/resources matching our tag key object filters. The query results are also backed up to a local CSV file because we never want to modify anything without a backup!

Importantly the script uses [Update-AzTag](https://docs.microsoft.com/en-us/powershell/module/az.resources/update-aztag?view=azps-4.2.0) to merge the existing/old tag key values with our new tag keys. That's the migration part taken care of!

Update-AzTag is also leveraged to delete the old tag key after the new tag key has been created on the resource. Essentially a cleanup/housekeeping task.

Note: Always test new scripts in a test/dev environment first before using in production!

```powershell
#Auth
Login-AzAccount

#List Az subs
Get-AzSubscription

#Set Az context to subscription
Set-AzContext -Subscription XXXXX-XXXX-XXXX-XXXX-XXXXX

#Define old Tag key $oldkey and new Tag key $newKey
$oldKey = "costcenter"
$newKey = "costcentre"

#Find ResourceGroups with oldKey, backup findings to CSV, migrate existing oldKey value to newKey merging with existing tags, then delete oldKey.
$rgsOldKeyBackup = Get-AzResourceGroup | Where-Object {$_.Tags.Keys -match $oldKey}
$rgsOldKeyBackup.count
if ($rgsOldKeyBackup) {
    Get-AzResourceGroup | Where-Object {$_.Tags.Keys -match $oldKey} | Out-File "C:\temp\AzRGs-Tag-Backup-$oldkey.csv"
    $rgs = Get-AzResourceGroup | Where-Object {$_.Tags.Keys -match $oldKey}
    $rgs | ForEach-Object {
        $rgOldKeyValue = $_.Tags.$oldKey
        $rgNewTag = @{$newKey=$rgOldKeyValue}
        $rgOldTag = @{$oldKey=$rgOldKeyValue}
        $resourceID = $_.ResourceId
        Update-AzTag -ResourceId $resourceID -Tag $rgNewTag -Operation Merge
        $Check = Get-AzResourceGroup -Id $resourceID | Where-Object {$_.Tags.Keys -match $newKey}
        if ($Check) {
            Update-AzTag -ResourceId $resourceID -Tag $rgOldTag -Operation Delete
        }
    }   
}

#Find Resources with oldKey, backup findings to CSV, migrate existing oldKey value to newKey merging with existing tags, then delete oldKey.
$resourcesOldKeyBackup = Get-AzResource | Where-Object {$_.Tags.Keys -match $oldKey}
$resourcesOldKeyBackup.count
if ($resourcesOldKeyBackup) {
    Get-AzResource | Where-Object {$_.Tags.Keys -match $oldKey} | Out-File "C:\temp\AzResources-Tag-Backup-$oldkey.csv"
    $resources = Get-AzResource | Where-Object {$_.Tags.Keys -match $oldKey}
    $resources | ForEach-Object {
        $resourcesOldKeyValue = $_.Tags.$oldKey
        $resourcesNewTag = @{$newKey=$resourcesOldKeyValue}
        $resourcesOldTag = @{$oldKey=$resourcesOldKeyValue}
        $resourceID = $_.ResourceId
        Update-AzTag -ResourceId $resourceID -Tag $resourcesNewTag -Operation Merge
        $Check = Get-AzResource -ResourceId $resourceID | Where-Object {$_.Tags.Keys -match $newKey}
        if ($Check) {
            Update-AzTag -ResourceId $resourceID -Tag $resourcesOldTag -Operation Delete
        }
    }
}
```

The first 8 script lines shown above are pretty standard - Authenticate to Azure and set your Azure Context/Subscription if you have multiple Subscriptions.

In lines 11-12 below we're defining the old tag key costcenter in a variable $oldKey and the new tag key costcentre also in a variable $newKey. 

Note: You can change these variable values to anything you want of course. I've just provided them as an example for the context of this blog.

![tag migration script lines 10-12](/assets/images/azuretags1.png "tag migration script lines 10-12")

Next we're using the Get-AzResourceGroup cmdlet with an object filter matching Tags.Keys to $oldKey and then storing the results in a variable named $rgsOldKeyBackup and finally providing a count of the variable results.

![tag migration script lines 15-16](/assets/images/azuretags2.png "tag migration script lines 15-16")

In lines 17-18 we're running an if statement on the $rgsOldKeyBackup variable, so if the results are not empty then we'll again use the Get-AzResourceGroup cmdlet with the object filter and backup our results to a CSV for future reference if required.

![tag migration script lines 17-18](/assets/images/azuretags3.png "tag migration script lines 17-18")

Lines 19-29 below are where the heavy lifting happens, beginning with a new variable $rgs being used to store Get-AzResourceGroup cmdlet results before starting a ForEach-Object task to cycle through the query results.

In 21-23 we're retrieving the existing key value from the query results and storing them in a new variable $rgOldKeyValue. Then we use that variable to construct our $rgNewTag and $rgOldTag variables.

$rgNewTag will be called by Update-AzTag to merge the new tag key and existing tag key value into the resource group's tag hash table.

$rgOldTag will be called by Update-AzTag to delete the old tag key if the new tag key has been successfully created on the resource group.

![tag migration script lines 19-29](/assets/images/azuretags4.png "tag migration script lines 19-29")

Lines 33-49 are using the same script logic explained above, but we are querying resources (not resource groups) this time using Get-AzResource.

# Example Tag Migration Script Usage

Now I'll demonstrate using my tag migration script. 

The screenshot below shows my demo environment where I have a mix of resources and resource groups with the tag key costcenter and various tag values e.g. examplevalue1, examplevalue2, etc

![tag migration demo environment](/assets/images/azuretags5.png "tag migration demo environment")

In the tag migration script, I have

* $oldKey defined as costcenter
* $newKey defined as costcentre

Running the script from the terminal gives me a local CSV backup of all existing tag keys and values for resources and resource groups matching my object filter.

The screenshot below explains some of the return outputs I receive from my terminal window when running the tag migration script. This is specific to resource groups.

![tag migration demo environment script output for resource groups](/assets/images/azuretags6.png "tag migration demo environment script output for resource groups")

And here's a return output explanation specific to resources e.g. a Recovery Services Vault.

![tag migration demo environment script output for resources](/assets/images/azuretags7.png "tag migration demo environment script output for resources")

The end result after my tag migration script completes is that I have all old tag key values migrated to the new tag key and I have deleted the old tag key from Azure. Happy days!

![tag migration demo environment end result](/assets/images/azuretags8.png "tag migration demo environment end result")

# Closing Remarks

Migrating existing tag values to new tag key/value pairs can be a daunting task if done manually but with PowerShell cmdlets Get-AzResource, Get-AzResourceGroup, and Update-AzTag you can quickly automate the job as part of a repeatable process.

Happy coding,

Jesse