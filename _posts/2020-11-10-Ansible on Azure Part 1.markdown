---
title: "Ansible on Azure Part 1"
excerpt: "Discover the Ansible on Azure development ecosystem, key advantages/disadvantages, and how to get started"
header:
    og_image: /assets/images/ansibleonazure01.png
    teaser: /assets/images/ansibleonazure01.png
date:   "2020-11-10"
categories: 
- "cloud"
tags: 
- "azure"
- "ansible"
- "terraform"
- "molecule azure driver"
- "ansible on azure"
---
Greetings fellow Azure enthusiasts. This is a 3-part series I've really enjoyed writing and hope you find use in my content. In this blog you'll discover the Ansible on Azure development ecosystem, key advantages/disadvantages, and how to get started.

* [Part 1](https://jloudon.com/cloud/Ansible-on-Azure-Part-1/) covers the birds-eye solution overview and introduces you to key components.
* [Part 2](https://jloudon.com/cloud/Ansible-on-Azure-Part-2/) showcases the Terraform module used to automate deployment of an Ansible control host into Azure.
* [Part 3](https://jloudon.com/cloud/Ansible-on-Azure-Part-3/) dives into using the Molecule-Azure driver to rapidly develop Ansible playbook tasks on Azure instances.

Key solutions used in this series:

* [Ansible](https://github.com/ansible/ansible) – configuration management and software deployments at scale.
* [Ansible Collections Azure](https://github.com/ansible-collections/azure) – plugins to enable interaction with Azure.
* [Molecule](https://github.com/ansible-community/molecule) – aids in development and testing of Ansible roles.
* [Molecule-Azure](https://github.com/ansible-community/molecule-azure) – plugin that enables use of Azure for provisioning test resources.
* [Terraform](https://www.terraform.io/downloads.html) – infrastructure as code via HashiCorp Language (HCL) files.
* [Azure](https://azure.microsoft.com/en-us/free/) – public cloud provider.
* [GitHub](https://github.com/join) - source control repositories.

## Quick Background
I'm not experienced with *nix and when an opportunity arose to develop new Ansible roles I tried, and failed spectacularly, with having my development environment solely on my Win10 SurfaceBook2 coupled with WSL1 and Ubuntu 18.04 distro. The root cause stemmed from a lack of available RAM to host numerous VMs locally. Also because WSL2 isn't available for my specific OS build I was stuck with WSL1 so ran into various integration issues. After many hours were dropped into troubleshooting issues between Docker, Vagrant, and WSL1 on my local environment it was time to let it go. In summary, I shelved WSL and the local-only dev dream until I can test out WSL2 on a beefier host.

## Ansible on Azure: Development Ecosystem and Flow
The ecosystem I settled on below is a cloud-only solution. I've used this to rapidly develop Ansible roles on Azure via the Azure-Molecule driver YAML files -all from the comfort of my local machine and the familiarity of VSCode.

![ansible configuration management ecosystem overview](/assets/images/ansibleonazure01.png "ansible configuration management ecosystem overview")

So let's step through a typical development flow of events as shown above.

1. Git clone [terraform-azurerm-ansible-linux-vm](https://github.com/globalbao/terraform-azurerm-ansible-linux-vm) and open the repo in VSCode.
2. Authenticate via AzureCLI then use Terraform to deploy the Ansible control host to Azure.
3. Connect to the Ansible host via VSCode's Remote SSH extension.
4. Create and configure a new Ansible role and configure Molecule scenarios with the Azure driver.
5. Use Molecule `converge` and `test` cmdlets to develop the new Ansible role targetting Windows/Linux instances.
6. Git `commit` the new Ansible role to GitHub.
7. Git `pull` the latest Ansible repo changes from GitHub for further development in Azure.

### Key Advantages of Ansible on Azure
Why might we choose to develop Ansible roles on Azure infrastructure?

* **The deployment & destruction process is repeatable**. Having a Terraform module that automates deployment of the Ansible control host and all software package requirements ensures we remove the element of human error and can achieve a similiar developer experience across many deployments. Additionally, we can easily create/destroy the test resources on demand with the Molecule-Azure driver.
* **Costs are minimised**. We are leveraging Azure to host the Ansible control host and test instances for role development. This is all designed to be a throwaway development sandbox. Shutting down the Ansible control host on a daily schedule also saves on compute costs.
* **Developer convenience is maintained**. The ability to use your own local VSCode to connect to the Ansible host cannot be understated. We're able to consume existing VSCode environment settings and extensions by developing on the Ansible host via VSCode's Remote SSH extension.
* **Network security is upheld**. SSH access to the Ansible host is restricted to only allow your local network's public IP via an NSG inbound rule. Network connectivity within Azure remains isolated because test instances and the Ansible host are deployed to the same VNET that contains no peering connections or gateway devices.
* **Access to unique Ansible facts**. When developing Ansible roles on Azure instances we can access Ansible facts that are unique to Azure infrastructure and use those facts with Ansible tasks such as conditionals.

### Key Disadvantages of Ansible on Azure
And why might we choose to avoid developing Ansible roles on Azure infrastructure?

* **Network interruptions**. Network connectivity between your local machine and the Ansible host in Azure must be stable. Packet loss and latency spikes will impact the experience.
* **Azure region/service stability**. The Azure region you deploy into must remain online/accessible for the duration of your Ansible development. Although if this happens as a workaround you can deploy into an available Azure region from the Terraform module.
* **Plugin dependencies**. Developing Ansible roles with Azure has a dependency on about 35~ individual Python plugins (most are called out in Part 2 of this series) which, when new versions are released, require integration testing with your Molecule scenarios.

## Getting Started
To help you get started I've made this Terraform module publicly available [terraform-azurerm-ansible-linux-vm](https://github.com/globalbao/terraform-azurerm-ansible-linux-vm)

Usage of the module automates the creation of the following Ansible development environment:

![ansible configuration management ecosystem resources](/assets/images/ansibleonazure02.png "ansible configuration management ecosystem resources")

Resource Type | Count | Notes
-------------:|:-----:|:------
Resource Group | 1 |Logical container for all below resources
Virtual Network | 1 |Provides network connectivity between the Ansible host & test instances
SSH Key| 1 |Your key authentication into the Ansible host (stored within the TF state file)
Linux Virtual Machine| 1 |Ubuntu server setup as the Ansible host
Public IP | 1|Allows remote connectivity into the Ansible host
Network Security Group| 1 |Restricts network access over SSH to the Ansible host from your defined Public IP
Virtual Machine Shutdown Schedule | 1 |Automatically shuts down the Ansible host on a daily schedule to save costs
Virtual Machine Extension | 1 |Automatically runs a shell script (located in the repo) to setup software requirements on the Ansible host

If you're keen to get started first install these pre-requisities on your local machine:

* [Terraform > 0.13.0](https://www.terraform.io/downloads.html)
* [Git](https://git-scm.com/downloads)
* [VSCode](https://code.visualstudio.com/download)
* [VSCode (extension) Remote Development](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack)
* [AzureCLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)

Then follow the development flow listed in steps 1-7 above and/or check out [Part 2](https://jloudon.com/cloud/Ansible-on-Azure-Part-2/) and [Part 3](https://jloudon.com/cloud/Ansible-on-Azure-Part-3/) of this series for in-depth guidance.

## Closing Remarks

In this blog we covered the birds-eye solution overview of Ansible on Azure, introduced key components that can be used, looked at an example development flow, compared key advantages/disadvantages in deciding if this is the right solution, and kicked off your journey with some startup instructions.

Join me for [Part 2](https://jloudon.com/cloud/Ansible-on-Azure-Part-2/) where I'll showcase the Terraform module used to automate deployment of an Ansible control host into Azure.

Cheers,

Jesse