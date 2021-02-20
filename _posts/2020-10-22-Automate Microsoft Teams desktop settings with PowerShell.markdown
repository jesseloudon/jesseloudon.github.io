---
title: "Automate Microsoft Teams desktop settings with PowerShell"
excerpt: "How to manage Teams desktop client settings automatically with PowerShell"
header:
    og_image: /assets/images/teamspowershell1.png
    teaser: /assets/images/teamspowershell1png
date:   "2020-10-22"
categories: 
- "m365"
tags: 
- "microsoft teams automation"
- "powershell"
- "teams client desktop settings"
- "json"
---
The Microsoft Teams desktop client has many configurable settings one of which is `App language` within the General tab > Language. So in this blog I'll show you how to manage Teams desktop client settings automatically with PowerShell.

![microsoft teams desktop settings](/assets/images/teamspowershell1.png "microsoft teams desktop settings")

If you're looking for a GPO/ADMX that provides easy control over Teams desktop client settings, at the time of writing you're out of luck.

Instead, we can configure the desired settings by modifying the `desktop-config.json` file which exists at the path `$env:userprofile\\AppData\Roaming\Microsoft\Teams\`.

Here's what a `desktop-config.json` file looks like in VSCode after I've run it through a JSON linter.

![microsoft teams desktop config file](/assets/images/teamspowershell2.png "microsoft teams desktop config file")

Note above that I've highlighted `"currentWebLanguage":"en-us"`. This is the relevant key and value which aligns to the `App language` setting I mentioned at the start of this blog.

So to modify the desired Teams desktop client setting `App language` we can run the below PowerShell script through a GPO targeting your AD users.

Please note:

* Parameter defaults are set but can be overriden.
* If Teams is not installed no action is taken.
* If the Teams desktop config file already contains the desired parameter value no action is taken.
* The Teams desktop process will be stopped (if running) to allow changes to be made.
* The Teams cookie file will be deleted (if exists) to allow changes to take effect on next Teams startup.
* The below script is idemptotent so multiple runs will not change the result or cause an error.
* Always test new scripts on test/dev environments first prior to running in production.

```powershell
param(
# Define parameters and values
[string]$newWebLanguage="en-au",
[string]$desktopConfigFile=“$env:userprofile\\AppData\Roaming\Microsoft\Teams\desktop-config.json”,
[string]$cookieFile="$env:userprofile\\AppData\Roaming\Microsoft\teams\Cookies",
[string]$registryPath="HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall",
[string]$registryDisplayName="Microsoft Teams",
[string]$processName="Teams"
)

#Check if Teams is installed
$registryPathCheck = Get-ChildItem -Path $registryPath -Recurse | Get-ItemProperty | Where-Object {$_.DisplayName -eq $registryDisplayName } -ErrorAction SilentlyContinue
#Check if Teams process is running
$processCheck = Get-Process $processName -ErrorAction SilentlyContinue
#Read the Teams desktop config file and convert from JSON
$config = (Get-Content -Path $desktopConfigFile | ConvertFrom-Json -ErrorAction SilentlyContinue)
#Check if required parameter value is already set within Teams desktop config file
$configCheck = $config | where {$_.currentWebLanguage -ne $newWebLanguage} -ErrorAction SilentlyContinue
#Check if Teams cookie file exists
$cookieFileCheck = Get-Item -path $cookieFile -ErrorAction SilentlyContinue

#1-If Teams is installed ($registryPathCheck not null)
#2-If Teams desktop config settings current value doesn't match parameter value ($configCheck not null)
#3-If Teams process is running ($processCheck not null)
#4-Then terminate the Teams process and wait 5 seconds
if ($registryPathCheck -and $configCheck -and $processCheck)
{
Get-Process $processName | Stop-Process -Force
Start-Sleep 5
}

#Check if Teams process is stopped
$processCheckFinal = Get-Process $processName -ErrorAction SilentlyContinue

#1-If Teams is installed ($registryPathCheck not null)
#2-If Teams desktop config settings current value doesn't match parameter value ($configCheck not null)
#3-Then update Teams desktop config file with new parameter value
if ($registryPathCheck -and $configCheck)
{
$config.currentWebLanguage=$newWebLanguage
$config | ConvertTo-Json -Compress | Set-Content -Path $desktopConfigFile -Force

#1-If Teams process is stopped ($processCheckFinal is null)
#2-If Teams cookie file exists ($cookieFileCheck not null)
#3-Then delete cookies file
if (!$processCheckFinal -and $cookieFileCheck)
    {
        Remove-Item -path $cookieFile -Force
    }
}
```
> The full script above can be found [here](https://gist.github.com/jesseloudon/e723b5f81b52daed41caba5c572566f5)

The above PowerShell script can be modified to cater for situations where you have multiple settings to manage - for example:

* General > Auto-start application
* General > Application > Disable GPU hardware acceleration
* General > Register Teams as the chat app for Office

In the example below I've updated the above PowerShell script to also modify the `Disable GPU hardware acceleration` setting which aligns to the `disableGpu` key/value within the Teams `desktop-config.json` file.

```powershell
param(
# Define parameters and values
[string]$newWebLanguage="en-au",
[bool]$newDisableGpu=$true,
[string]$desktopConfigFile=“$env:userprofile\\AppData\Roaming\Microsoft\Teams\desktop-config.json”,
[string]$cookieFile="$env:userprofile\\AppData\Roaming\Microsoft\teams\Cookies",
[string]$registryPath="HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall",
[string]$registryDisplayName="Microsoft Teams",
[string]$processName="Teams"
)

#Check if Teams is installed
$registryPathCheck = Get-ChildItem -Path $registryPath -Recurse | Get-ItemProperty | Where-Object {$_.DisplayName -eq $registryDisplayName } -ErrorAction SilentlyContinue
#Check if Teams process is running
$processCheck = Get-Process $processName -ErrorAction SilentlyContinue
#Read the Teams desktop config file and convert from JSON
$config = (Get-Content -Path $desktopConfigFile | ConvertFrom-Json -ErrorAction SilentlyContinue)
#Check if required parameter value is already set within Teams desktop config file
$configCheck = $config | where {($_.currentWebLanguage -ne $newWebLanguage) -or ($_.appPreferenceSettings.disableGpu -ne $newDisableGpu)} -ErrorAction SilentlyContinue
#Check if Teams cookie file exists
$cookieFileCheck = Get-Item -path $cookieFile -ErrorAction SilentlyContinue

#1-If Teams is installed ($registryPathCheck not null)
#2-If Teams desktop config settings current value doesn't match parameter value ($configCheck not null)
#3-If Teams process is running ($processCheck not null)
#4-Then terminate the Teams process and wait 5 seconds
if ($registryPathCheck -and $configCheck -and $processCheck)
{
    Get-Process $processName | Stop-Process -Force
    Start-Sleep 5
}

#Check if Teams process is stopped
$processCheckFinal = Get-Process $processName -ErrorAction SilentlyContinue

#1-If Teams is installed ($registryPathCheck not null)
#2-If Teams desktop config settings current value doesn't match parameter value ($configCheck not null)
#3-Then update Teams desktop config file with new parameter value
if ($registryPathCheck -and $configCheck)
{
    $config.currentWebLanguage=$newWebLanguage
    $config.appPreferenceSettings.disableGpu=$newDisableGpu
    $config | ConvertTo-Json -Compress | Set-Content -Path $desktopConfigFile -Force

#1-If Teams process is stopped ($processCheckFinal is null)
#2-If Teams cookie file exists ($cookieFileCheck not null)
#3-Then delete cookies file

    if (!$processCheckFinal -and $cookieFileCheck)
    {
        Remove-Item -path $cookieFile -Force
    }
}
```
> The full script above can be found [here](https://gist.github.com/jesseloudon/e3e9dc838cff1b4a8085edc35acd0bb0)

In the future I hope there'll be an GPO/ADMX for configuring these settings easily at scale, for now I'm happy to continue managing these settings with PowerShell.

Cheers,

Jesse