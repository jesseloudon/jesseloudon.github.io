---
title:  "Azure Building Blocks - The Forgotten IaC Tool"
excerpt: "Putting Azure Building Blocks to the test with a simple Hub & Spoke VNET deployment"
header:
    og_image: /assets/images/AZBBlogo.png
    teaser: /assets/images/AZBBlogo.png
date:   "2020-03-04"
categories: 
- "cloud"
tags:
- "infrastructure as code"
- "iac"
- "azure building blocks"
- "azbb"
- "arm templates"
---
Whilst researching Infrastructure as Code alternatives to Azure Resource Manager templates I stumbled across the [Azure Building Blocks][AZBB] (AZBB) tool. It's not widely adopted and you'll see why later on this in blog.

Because I'm not keen on authoring large JSON files (aka ARM templates) for IaC I'm going to put Azure Building Blocks to the test with a simple Hub & Spoke VNET deployment. Later on I'll also demonstrate the same deployment using an AzureCLI script - my current preferred alternative to ARM Templates - so you'll see the differences. 

FYI - AZBB currently supports the following resource types:

* Virtual Networks
* Virtual Machines (including load balancers)
* Virtual Machine Extensions
* Route Tables
* Network Security Groups
* Virtual Network Gateways
* Virtual Network Connection

<i>Note: Before writing this blog I also tested deploying VMs to Azure using the AZBB tool and ran into an issue which turned out to be a blocker for further tests. You can view open/closed AZBB project issues [here][azbb-issues].</i>

## What is AZBB?
![AzBBlogo](/assets/images/AZBBlogo.png "azbb logo")

> The Azure Building Blocks project is a command line tool and set of Azure Resource Manager templates designed to simplify deployment of Azure resources. Users author a set of simplified parameters to specify settings for Azure resources, and the command line tool merges these parameters with best practice defaults to produce a set of final parameter files that can be deployed with the Azure Resource Manager templates - source: [Microsoft][AZBBWiki]

![AzBBOverview](/assets/images/azbb-overview.png "azbb Overview")

Based on the above description - a key advantage behind using Azure Building Blocks is to save you time by merging your JSON parameter files with it's pre-defined ARM templates as part of it's deployment flow to Azure. 

These pre-defined ARM templates also apply some best-practice defaults such as:

* Enables diagnostics on all VMs
* Deploys the VMs in an availability set
* All VM disks are managed
* OS is latest Windows Server 2016 image
* Public IP created for each VM

Unfortunately these best-practice defaults are not easily found - so to discover what defaults are applied (and to override them when needed) have a look at the reference wiki for each supported resource e.g. [https://github.com/mspnp/template-building-blocks/wiki/Virtual-Machines][azbb-vmwiki]

## Demo Deployment
For this demo I'm deploying a basic HUB/SPOKE Virtual Network architecture common with production Azure environments where the Hub VNET may contain shared services such as a Firewall, Domain Controllers, JumpBoxes, and an ExpressRoute Gateway. 

![azbbdemo](/assets/images/azbb-demodeployment.png "azbb demo deployment")

<i>This deployment is sourced from premade AZBB parameter files publicly available here: [https://github.com/mspnp/template-building-blocks/tree/master/scenarios][AZBBScenarios]</i>

## Step 1 - Install NPM/Node.js
To run the AZBB tool locally we first need to install NPM/Nodejs so on my local machine I downloaded/ran the Windows x64 client installer from [https://www.npmjs.com/get-npm][GETNPM].

Then I ran `npm install` from a VSCode terminal to setup Azure Building Blocks and then `azbb` to test the tool was installed correctly.

```javascript
npm install -g @mspnp/azure-building-blocks
azbb
```

Seeing this screen is a good sign :)

![azbbshell](/assets/images/azbb-shell.png "azbb shell")

## Step 2 - Generate/Copy a .JSON parameter file
Before we can deploy into Azure we either need to create a new parameter file or use a premade one. To save time I cloned the AZBB repo from GitHub and referenced a premade parameter file matching the demo deployment details e.g. VNETs, TAGS, PEERINGS, DNS SERVERS.

```
cd c:\temp
git clone https://github.com/mspnp/template-building-blocks
```

The parameter file we are using (below) is at `\template-building-blocks\scenarios\multi-tier\vnet-complete.json`. If you are already familiar with using ARM templates you'll quickly pickup on using AZBB parameter files.

```json
{
    "$schema": "https://raw.githubusercontent.com/mspnp/template-building-blocks/master/schemas/buildingBlocks.json",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "buildingBlocks": {
            "value": [
                {
                    "type": "VirtualNetwork",
                    "settings": [
                        {
                            "name": "msft-hub-vnet",
                            "addressPrefixes": [
                                "10.0.0.0/16"
                            ],
                            "subnets": [
                                {
                                    "name": "firewall",
                                    "addressPrefix": "10.0.1.0/24"
                                },
                                {
                                    "name": "ad",
                                    "addressPrefix": "10.0.2.0/24"
                                },
                                {
                                    "name": "mgmt",
                                    "addressPrefix": "10.0.3.0/24"
                                },                                
                                {
                                    "name": "GatewaySubnet",
                                    "addressPrefix": "10.0.0.0/27"
                                }
                            ],
                            "dnsServers": [
                                "10.0.2.4",
                                "10.0.2.5",
                                "168.63.129.16"
                            ],
                            "virtualNetworkPeerings": [
                                {
                                    "remoteVirtualNetwork": {
                                        "name": "msft-spoke1-vnet"
                                    },
                                    "allowForwardedTraffic": true,
                                    "allowGatewayTransit": true,
                                    "useRemoteGateways": false
                                }
                            ],
                            "tags": {
                                "department": "Central IT",
                                "managedBy": "Admins"
                            }
                        },
                        {
                            "name": "msft-spoke1-vnet",
                            "addressPrefixes": [
                                "10.1.0.0/16"
                            ],
                            "subnets": [
                                {
                                    "name": "web",
                                    "addressPrefix": "10.1.1.0/24"
                                },
                                {
                                    "name": "biz",
                                    "addressPrefix": "10.1.2.0/24"
                                },
                                {
                                    "name": "data",
                                    "addressPrefix": "10.1.3.0/24"
                                }                                
                            ],
                            "dnsServers": [
                                "10.0.2.4",
                                "10.0.2.5",
                                "168.63.129.16"
                            ],
                            "virtualNetworkPeerings": [
                                {
                                    "remoteVirtualNetwork": {
                                        "name": "msft-hub-vnet"
                                    },
                                    "allowForwardedTraffic": true,
                                    "allowGatewayTransit": false,
                                    "useRemoteGateways": false
                                }
                            ],
                            "tags": {
                                "department": "HR",
                                "managedBy": "DevOps"
                            }                            
                        }
                    ]
                }
            ]
        }
    }
}
```

## Step 3 - Deploy with Azure Building Blocks
From my VSCode terminal I authenticated into Azure then noted my Subscription ID which I'll need soon.

```
# AuthN to Azure
az login

# Note Subscription ID
az account show
```

Next I ran `azbb` to kickoff the deployment of the demo deployment referencing the existing .JSON parameter file which we cloned earlier.

```javascript
azbb -g "VNET-AZBB-RG" -s "your-subscription-id" -l "your-azure-region" -p "C:\Temp\template-building-blocks\scenarios\multi-tier\vnet-complete.json" --deploy
```

After azbb completed running I could see the deployment tasks had succeeded from the Azure Portal > Resource Group > Deployments tab.

![AZBBportalstatus](/assets/images/AZBB-portaldeployments.png "azbb post-deployment portal status")

> `azbb` switches you should be aware of:
* -g is the resource group you are deploying to
* -s is your subscription id
* -l is the Azure region your are deploying to
* -p is the parameter file (.JSON) which contains deployment details
* --deploy is required to initiate the deployment to Azure

3x deployment artefacts are also generated which you can use for redeployment/troubleshooting/documentation:

![azbb-output](/assets/images/azbb-output.png "azbb output")

## Deploy with AzCLI
To demonstrate the difference with JSON vs azcli I've included the exact same VNET architecture deployed above and transferred it to .azcli format so you can see the differences in structure. I can deploy this script directly from a VSCode terminal using the AzureCLI extension for VSCode [https://github.com/microsoft/vscode-azurecli][azcliextension].

I find azcli scripting very compact in terms of structure/layout on your screen, making to simplier to deploy multiple Azure resources from the same script. Azcli has also been easier for me to learn/adopt because of the built-in help snippets provided and Microsoft's wiki.

```bash
#AuthN
az login

#Create RG
az group create -n "VNET-AZCLI-RG" -l "Australia East"

#Create Hub VNET
az network vnet create -n "msft-hub-vnet" --address-prefix "10.0.0.0/16" --subnet-name "firewall" --subnet-prefix "10.0.1.0/24" --dns-servers "10.0.2.4" "10.0.2.5" "168.63.129.16" --tags department="Central IT" managedBy="Admins" -g "VNET-AZCLI-RG"
az network vnet subnet create -n "ad" --address-prefix "10.0.2.0/24" --vnet-name "msft-hub-vnet" -g "VNET-AZCLI-RG" 
az network vnet subnet create -n "mgmt" --address-prefix "10.0.3.0/24" --vnet-name "msft-hub-vnet" -g "VNET-AZCLI-RG" 
az network vnet subnet create -n "GatewaySubnet" --address-prefix "10.0.0.0/27" --vnet-name "msft-hub-vnet" -g "VNET-AZCLI-RG" 

#Create Spoke VNET
az network vnet create -n "msft-spoke1-vnet" --address-prefix "10.1.0.0/16" --subnet-name "web" --subnet-prefix "10.1.1.0/24" --dns-servers "10.0.2.4" "10.0.2.5" "168.63.129.16" --tags department="HR" managedBy="DevOps" -g "VNET-AZCLI-RG"
az network vnet subnet create -n "biz" --address-prefix "10.1.2.0/24" --vnet-name "msft-spoke1-vnet" -g "VNET-AZCLI-RG" 
az network vnet subnet create -n "data" --address-prefix "10.1.3.0/24" --vnet-name "msft-spoke1-vnet" -g "VNET-AZCLI-RG" 

#Create VNET Peerings
az network vnet peering create -g "VNET-AZCLI-RG" -n "msft-hub-vnet-to-msft-spoke1-vnet" --vnet-name "msft-hub-vnet" --remote-vnet "msft-spoke1-vnet" --allow-vnet-access --allow-forwarded-traffic --allow-gateway-transit
az network vnet peering create -g "VNET-AZCLI-RG" -n "msft-spoke1-vnet-to-msft-hub-vnet" --vnet-name "msft-spoke1-vnet" --remote-vnet "msft-hub-vnet" --allow-vnet-access --allow-forwarded-traffic
```
## Conclusion

Azure Building Blocks showed potential as an alternative to ARM templates but I've been disappointed by a lack of further development and some ongoing issues with deploying VMs using the tool. The best-practice defaults that are applied as part of the pre-defined ARM templates are a necessary inclusion but we all know Azure is moving faster than the speed at which these best-practice defaults are updated in the templates - which leads you to situations where you'll need to override these defaults and that's where things can get painful.

For now I'm sticking with AzureCLI as my IaC tool for deployments. 

Would be interesting to hear your thoughts on this in the comments below!

Cheers,
Jesse

[azbb-vmwiki]:https://github.com/mspnp/template-building-blocks/wiki/Virtual-Machines
[azbb-issues]:https://github.com/mspnp/template-building-blocks/issues
[AZBB]:https://github.com/mspnp/template-building-blocks
[AZBBWiki]:https://github.com/mspnp/template-building-blocks/wiki
[GETNPM]:https://www.npmjs.com/get-npm
[AZBBScenarios]:https://github.com/mspnp/template-building-blocks/tree/master/scenarios
[azcliextension]:https://github.com/microsoft/vscode-azurecli