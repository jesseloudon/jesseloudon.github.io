---
title:  "Quick Intro to Azure Backup Explorer"
excerpt: "All you need to know about Azure Backup Explorer released in preview Feb 2020"
header:
    og_image: /assets/images/BackupExplorer.png
date:   "2020-02-10"
categories: 
- "cloud"
tags: 
- "azure"
- "backup explorer"
- "backup governance"
---
Here's what you need to know about Azure Backup Explorer which has been released in [public preview][BackupExplorerPreview] as of 5th Feb 2020.

# What is Azure Backup Explorer?
- It's currently available for use with Azure Virtual Machines
- A <b>single pane of glass for monitoring backups</b> of your Azure Virtual Machines
- Removes complexity and manpower associated with monitoring backups using Azure Log Analytics Workspaces

# How do I access it?
`TLDR` = Azure Portal > any RSV > Overview > Backup Explorer

1. Login to [https://portal.azure.com][AzPortal]
2. Open any `Recovery Services Vault` in your `Subscription`
3. From the `Overview` page select the `Backup Explorer` link

![AzureBackupExplorer](/assets/images/BackupExplorer.png)


# What I like about it
- It's integrated into the Azure Portal which is perfect for most managed services teams to utilise.
- It contains built-in Search and Query functionality.
- The Summary dashboard allows you to quickly identify issues such as Virtual Machines not backed up.
- Backup Explorer contains portal links to Recovery Services Vaults and Virtual Machines for seamless changes so you don't need to open new browser windows.
- You have the ability to Export to Excel

![AzureBackupExplorerExportToExcel](/assets/images/BackupExportToExcel.png)

# What can you do?
The <b>`Summary`</b> page gives you a quick overview of the status of backups across all RSVs and all Subscriptions. You can also filter by;
- Subscriptions
- Vault Location
- Vault
- Time Range

![AzureBackupExplorerSummary](/assets/images/BackupSummary.png)

The <b>`Backup Items`</b> page shows your Virtual Machine protection status and you can search/filter by;
- Backup Item or Resource Group
- Vault
- Protection State - `Actively Protected`, `Protection Stopped`, `Initial Backup Pending`
- Resource State - `VM Active`, `VM Not Found`
- Health Check Status - `Passed`, `ActionRequired`, `ActionSuggested`

![AzureBackupExplorerItems](/assets/images/BackupItems.png)

The <b>`Jobs`</b> page shows the status of backup jobs for Virtual Machines added to your RSVs and you can search/filter by;
- Backup Item or Resource Group
- Operation - `Backup`, `Restore`, `ConfigureBackup`, `DeleteBackupData`
- Status - `Completed`, `CompletedWithWarnings`, `Failed`, `Cancelled`, `InProgress`
- Error

![AzureBackupExplorerJobs](/assets/images/BackupJobs.png)

The <b>`Alerts`</b> page shows alerts for Virtual Machines added to your RSVs and you can search/filter by;
- Backup Item or Resource Group
- Alert Type - `Backup Failure`, `Restore Failure`, `Delete Backup Data`
- Status
- Severity - `Critical`, `Warning`, `Info`

The <b>`Policies`</b> page shows an overview of RSV policies and you can search/filter by;
- Vault or Policy
- Has Protected Items? - `Yes`, `No`
- Schedule Frequency - `Daily`, `Weekly`
- Retention Type - `Daily`, `Weekly`, `Monthly`, `Yearly`
- Snapshot Retention - `0-5`

![AzureBackupExplorerPolicies](/assets/images/BackupPolicies.png)

The <b>`Backup Not Enabled`</b> page shows a list of Virtual Machines with no backup configured and you can search by;
- Machine Name
- Tags

![AzureBackupExplorerNotEnabled](/assets/images/BackupNotEnabled.png)

# Improvements I'd like to see
- Add a new page for "Backup Storage" showing GB usage across Recovery Services Vaults.
- Integration with Azure PowerBI for;
    - Reporting templates such as:
        - Successful/Failed Backups for Week/Month/Year
        - Latest Recovery Point per VM
    - Ability to subscribe to Critical Alerts & Events

[AzPortal]:https://portal.azure.com

# Closing Remarks
[Azure Backup Explorer][AzureBackupExplorer] makes it easier to monitor backups across multiple Azure Subscriptions from the Azure Portal and quickly identify gaps/issues.

Cheers,
Jesse

<!--more-->

[AzPortal]:https://portal.azure.com
[AzureBackupExplorer]:https://docs.microsoft.com/en-gb/azure/backup/monitor-azure-backup-with-backup-explorer
[BackupExplorerPreview]:https://azure.microsoft.com/en-gb/blog/backup-explorer-now-available-in-preview/