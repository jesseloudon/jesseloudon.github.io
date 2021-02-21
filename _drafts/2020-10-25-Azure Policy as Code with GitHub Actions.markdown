---
title: "Azure Policy as Code with GitHub Actions"
excerpt: ""
date:   "2020-10-25"
categories: 
- "CLOUD"
tags: 
- "AZURE POLICY"
- "POLICY AS CODE"
- "GITHUB ACTIONS"
---
Azure Policy's integration with GitHub is ramping up with Microsoft's latest pre-release actions on the marketplace:

* [Azure-Policy-Compliance-Scan](https://github.com/marketplace/actions/azure-policy-compliance-scan)
* [Manage-Azure-Policy](https://github.com/marketplace/actions/manage-azure-policy)

Today I'm checking out two elements of Microsoft's latest policy-as-code workflow:

* The `Export to GitHub` (preview) option in the Azure Policy console.
* The `Manage Azure Policy` (pre-release) GitHub Action (GHA).

Having worked with `policy as code` workflows outside of GHA I'm interested to test the potential of any new integration.

You may also know that Microsoft quietly enabled a new Export to GitHub option within the Azure Policy console. This is an important step forward 

![manage azure policy github action](/assets/images/azurepolicywithgha1.png)

My test environment is a single Azure subscription containing over 40 custom policies grouped into 5 initiatives and 5 initiative assignments to the subscription scope. These resources were deployed into Azure using Terraform.

![manage azure policy github action](/assets/images/azurepolicywithgha2.png)









https://github.com/marketplace/actions/manage-azure-policy

https://docs.microsoft.com/en-us/azure/governance/policy/tutorials/policy-as-code-github

https://docs.microsoft.com/en-us/azure/governance/policy/how-to/export-resources




Just getting started with Azure Policy? Check out my [Cloud Governance with Azure Policy](https://jloudon.com/cloud/Cloud-Governance-with-Azure-Policy-Part-1/) series.

Looking to use Terraform to manage Azure Policy? Check out my [Azure Policy as Code with Terraform](https://jloudon.com/cloud/Azure-Policy-as-Code-with-Terraform-Part-1/) series.

Want to use GitHub Actions to deploy your Terraform code? Check out my [Using GitHub Actions and Terraform for IaC Automation](https://jloudon.com/cloud/Using-GitHub-Actions-and-Terraform-for-IaC-Automation/) post.

How about a working example of Azure Policy as Code using Terraform? Check out my [globalbao/terraform-azurerm-policy](https://github.com/globalbao/terraform-azurerm-policy) repo.