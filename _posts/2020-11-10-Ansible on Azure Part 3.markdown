---
title: "Ansible on Azure Part 3"
excerpt: "Discover Ansible role development patterns on Azure using the Molecule-Azure driver"
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
- "molecule"
---
This is Part 3 of the Ansible on Azure series. In this blog you'll discover Ansible role development patterns on Azure using the Molecule-Azure driver through methodologies you can follow and YAML examples.

During my own discovery and testing solution examples of the Molecule-Azure driver were scarce to find so I'm hoping to aggregate my learnings in this blog.

* [Part 1](https://jloudon.com/cloud/Ansible-on-Azure-Part-1/) covers the birds-eye solution overview and introduces you to key components.
* [Part 2](https://jloudon.com/cloud/Ansible-on-Azure-Part-2/) showcases the Terraform module used to automate deployment of an Ansible control host into Azure.
* [Part 3](https://jloudon.com/cloud/Ansible-on-Azure-Part-3/) dives into using the Molecule-Azure driver to rapidly develop Ansible playbook tasks on Azure instances.

## Development Ecosystem Mapping

In terms of our development ecosystem described in [Part 1](https://jloudon.com/cloud/Ansible-on-Azure-Part-1/), and shown below, this blog covers **stages 4-7**.

![ansible configuration management ecosystem](/assets/images/ansibleonazure01.png "ansible configuration management ecosystem")

## Ansible Role Development Methodology

Let's examine two possible scenarios you may encounter with Ansible role development and the methodology you should adopt for each.

**Creating a new Ansible role**:

1. Run `molecule init role ansible-role-exampleApp -d azure` to initialize a new Ansible role that uses the Molecule-Azure driver
2. Modify the default Molecule scenario files to suit your test requirements e.g. `/Molecule/default/*.yml`
3. Create your Ansible tasks e.g. `/Tasks/*.yml`
4. Run `az login` to authenticate to Azure
5. Run `molecule create` to test the Molecule scenario's resource deployment
6. Run `molecule converge` to test your Ansible tasks against the Molecule scenario resources
7. Run `molecule destroy` to remove the Molecule scenario resources
8. Run `molecule test` to fully test (dependency, lint, cleanup, destroy, syntax, create, prepare, converge, idempotence, side_effect, verify, cleanup, destroy)
9. Push your new role into source control via Git

**Modifying an existing Ansible role**:

1. Pull the existing role from source control via Git
2. Run `molecule init scenario rhel8 -d azure` to initialize a new Molecule scenario that uses the Molecule-Azure driver
3. Modify the new Molecule scenario files to suit your test requirements e.g. `/Molecule/rhel8/*.yml` 
4. Update the Ansible tasks as required e.g. `/Tasks/*.yml`
5. Run `az login` to authenticate to Azure
6. Run `molecule create -s rhel8` to test the new Molecule scenario's resource deployment
7. Run `molecule converge -s rhel8` to test your Ansible tasks against the Molecule scenario resources
8. Run `molecule destroy -s rhel8` to remove the Molecule scenario resources
9. Run `molecule test -s rhel8` to fully test (dependency, lint, cleanup, destroy, syntax, create, prepare, converge, idempotence, side_effect, verify, cleanup, destroy)
10. Push your changes into source control via Git

## Role/Scenario Init Examples

Here's some quick code snippets to get you started with generating new roles and scenarios.

```bash
# Initialise a new Ansible role that uses the Molecule-Azure driver
molecule init role ansible-role-exampleApp -d azure
```

![new ansible role files](/assets/images/ansibleonazure03.png "new ansible role files")

```bash
# Initialise new Molecule scenario that uses the Molecule-Azure driver
molecule init scenario rhel8 -d azure

# List all Molecule scenarios
molecule list
```

![new ansible scenario files](/assets/images/ansibleonazure04.png "new ansible scenario files")

> If the concept of roles/scenarios is completely new I recommend checking out the [Molecule docs](https://molecule.readthedocs.io/en/latest/getting-started.html#creating-a-new-role) for a more detailed explanation.

## Molecule-Azure YAML Examples

You should modify the Molecule scenario YAML files to suit your development requirements.

Below you’ll find examples which can be used as a foundation for testing Ansible roles on Linux or Windows instances in Azure.

### Scenario #1 - RHEL8

* **[rhel8/create.yml](https://github.com/globalbao/terraform-azurerm-ansible-linux-vm/tree/master/examples/molecule/rhel8)**

The significant parts of my modification to the default create.yml are:
* removed tasks which created a virtual network and subnet as I'm deploying my Molecule scenario instance into an existing VNET/Subnet
* added parameters to the `azure_rm_virtualmachine` resource to target an existing VNET/Subnet
* changed `public_ip_allocation_method` to disabled

If you're following along from [Part 2](https://jloudon.com/cloud/Ansible-on-Azure-Part-2/) of this blog series - remember to update `virtual_network_resource_group_name` and `virtual_network_name` variables with the relevant Terraform output values.

<script src="https://gist.github.com/jesseloudon/0b07fc5ab17bf5985a17d7c9564fe73d.js"></script>

A completed run using `molecule create -s rhel8` shows the following.

![rhel8 molecule create](/assets/images/ansibleonazure05.png)

![rhel8 molecule create deployed resources](/assets/images/ansibleonazure06.png)

* **[rhel8/molecule.yml](https://github.com/globalbao/terraform-azurerm-ansible-linux-vm/tree/master/examples/molecule/rhel8)**

<script src="https://gist.github.com/jesseloudon/26fd4d0bd6d90c4538456d34936bb16d.js"></script>

* **[rhel8/prepare.yml](https://github.com/globalbao/terraform-azurerm-ansible-linux-vm/tree/master/examples/molecule/rhel8)**

<script src="https://gist.github.com/jesseloudon/da51964d2dd434ac4e46af0a703b415a.js"></script>

* **[rhel8/destroy.yml](https://github.com/globalbao/terraform-azurerm-ansible-linux-vm/tree/master/examples/molecule/rhel8)**

<script src="https://gist.github.com/jesseloudon/7653318f842569119989328e76c151b7.js"></script>

### Scenario #2 - WIN2019

* **[win2019/create.yml](https://github.com/globalbao/terraform-azurerm-ansible-linux-vm/tree/master/examples/molecule/win2019)**

The significant parts of my modification to the default create.yml are:
* added the `azure_rm_virtualmachineextension` resource which is used to run a PowerShell script that enables WinRM on the Win2019 instance
* ensured the Win2019 instance's `private IP` is passed to the Molecule instance config dict so it can be used as the WinRM target address
* removed the task which creates a key pair as I'm using a username/password to connect over WinRM to the Win2019 instance
* removed tasks which created a virtual network and subnet as I'm deploying my Molecule scenario instances into an existing VNET/Subnet
* added parameters to the `azure_rm_virtualmachine` resource to target an existing VNET/Subnet
* changed `public_ip_allocation_method` to disabled

If you're following along from [Part 2](https://jloudon.com/cloud/Ansible-on-Azure-Part-2/) of this blog series - remember to update `virtual_network_resource_group_name` and `virtual_network_name` variables with the relevant Terraform output values.

<script src="https://gist.github.com/jesseloudon/12ed89147e7ca7d753b3cbc1bd954b9b.js"></script>

A completed run using `molecule create -s win2019` shows the following.

![win2019 molecule create](/assets/images/ansibleonazure07.png)

![win2019 molecule create deployed resources](/assets/images/ansibleonazure08.png)

* **[win2019/molecule.yml](https://github.com/globalbao/terraform-azurerm-ansible-linux-vm/tree/master/examples/molecule/win2019)**

The significant parts of my modification to the default molecule.yml are:
* added `win_rm` arguments to `provisioner.connection_options` to allow connectivity to the Windows 2019 instance

<script src="https://gist.github.com/jesseloudon/14210412395a357a378e0573cd0133e3.js"></script>

* **[win2019/prepare.yml](https://github.com/globalbao/terraform-azurerm-ansible-linux-vm/tree/master/examples/molecule/win2019)**

<script src="https://gist.github.com/jesseloudon/e106f3c50f3446c7be2389012b287a4c.js"></script>

* **[win2019/destroy.yml](https://github.com/globalbao/terraform-azurerm-ansible-linux-vm/tree/master/examples/molecule/win2019)**

<script src="https://gist.github.com/jesseloudon/7029756cf2aef6fdf8c9351bd51dbc29.js"></script>

## Closing Remarks

In this blog I shared an overview of two possible scenarios (creating a new Ansible role / modifying an existing) for Ansible role development and the methodology to address each.

I also shared YAML examples for two Molecule scenarios (Rhel/Windows) for use with the Molecule-Azure driver. Including examples of the following resource types:

* [azure_rm_resourcegroup](https://docs.ansible.com/ansible/latest/collections/azure/azcollection/azure_rm_resourcegroup_module.html)
* [azure_rm_virtualmachine](https://docs.ansible.com/ansible/latest/collections/azure/azcollection/azure_rm_virtualmachine_module.html#ansible-collections-azure-azcollection-azure-rm-virtualmachine-module)
* [azure_rm_virtualmachineextension](https://docs.ansible.com/ansible/latest/collections/azure/azcollection/azure_rm_virtualmachineextension_module.html#ansible-collections-azure-azcollection-azure-rm-virtualmachineextension-module)
* [azure_rm_networkinterface_info](https://docs.ansible.com/ansible/latest/collections/azure/azcollection/azure_rm_networkinterface_info_module.html#ansible-collections-azure-azcollection-azure-rm-networkinterface-info-module)

In a future blog I hope to onboard my Ansible roles to GitHub Actions and enable CI so roles are tested with Molecule against various OS distribitions without admin/user interaction.

Cheers,

Jesse