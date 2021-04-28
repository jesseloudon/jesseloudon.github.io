---
title: "HashiTalks ANZ: DRY Coding with Terraform, CSVs, ForEach"
excerpt: "How combining Terraform with CSVs and ForEach we can deploy at scale from large datasets"
header:
    og_image: /assets/images/hashitalksanz2021.png
    teaser: /assets/images/hashitalksanz2021.png
date:   "2021-04-28"
categories: 
- "cloud"
tags: 
- "hashitalks"
- "terraform"
- "iac pattern"
- "csvs foreach"
---

The recent inaugural HashiTalks Australia & New Zealand event was an incredible opportunity to present a 30min session on how combining Terraform with CSVs and ForEach we can deploy at scale from large datasets and achieve a Don't Repeat Yourself (DRY) methodology.

Firstly, here's what you can expect from this article:
* further context not captured by the recorded session
* insights into pros and cons (very important to know these before diving in)
* another usage pattern for your Terraform infrastructure-as-code journey

> You can find my HashiTalk video link/slides at the end of this post

# Further Context + Pros/Cons

CSVs and ForEach are not a 'silver bullet' for all your IaC scaling problems. I'm absolutely not saying go out and use CSVs and ForEach for ALL your Terraform IaC initiatives. If you're reading this you're hopefully taking the time to do your research and testing to evaluate the pattern for yourself! 

There'll be situations where you should be using native HCL for your data/inputs to avoid complexity whilst adhering to the KISS principle. What I've learnt from deploying large datasets are that these situations are not as common as I would like. Particularly if you need to manage an application that is NOT cloud-native and requires a vast range of IaaS resources to operate in your cloud of choice e.g. Microsoft Azure.

An elephant in the room is the question of why use CSV when you have YAML? The short answer is that, having tried both data formats, I've found having my inputs/variables stored within CSVs makes management of large datasets easier at scale and helps achieve a DRY coding methodology.

What I've also learnt in the CSV vs YAML debate:

* When using YAML for IaC, the keys need to be duplicated for each new resource. Not very DRY. CSVs don't have this issue because each header column represents the unique key in the resulting map.
* YAML info is presented vertically to you, so if you have 100s to 1000s of resources to manage from a single YAML file this makes management at scale difficult and tiresome! I prefer having the info horizontally presented to me using a CSV/Excel file so I can scroll across rather than scroll down. I've leveraged my IDE's ctrl+find and fold/unfold options heavily with YAML datasets, but these shortcuts don't change the overall experience much when it comes to large datasets.
* With CSV datasets I can open the files using Excel to use all the wonderful native Excel functions and features to manage/manipulate my dataset e.g. concat strings, freeze panes, column filters, pivot tables, etc! To my knowledge this exact functionality isn't possible today with YAML datasets!
* With YAML it seems easier to spot extra spaces/rows in your datasets that shouldn't be there. When using CSVs I've leveraged the 'Edit CSV' vscode extension to assist me in this area with great success.

Take a look at these 2x NSG rules represented in two data formats. Then imagine managing 100s to 1000s of these NSG rules across multiple NSGs and multiple environments.

**YAML example**
```yaml
nsg1:
  - action: Allow
    description: Allow RDP from Corp
    destination_details: VirtualNetwork
    destination_port_ranges: "3389"
    destination_type: Tag
    direction: Inbound
    priority: 100
    protocol: TCP
    rule_name: AllowRDPfromCorp
    source_details: "10.10.0.0/24"
    source_port_ranges: "*"
    source_type: IP Address
  - action: Deny
    description: Deny RDP from Internet
    destination_details: VirtualNetwork
    destination_port_ranges: "3389"
    destination_type: Tag
    direction: Inbound
    priority: 200
    protocol: TCP
    rule_name: DenyRDPfromInternet
    source_details: Internet
    source_port_ranges: "*"
    source_type: Tag
```

**CSV example**
```csv
action,description,destination_details,destination_port_ranges,destination_type,direction,priority,protocol,rule_name,source_details,source_port_ranges,source_type
Allow,Allow RDP from Corp,VirtualNetwork,3389,Tag,Inbound,100,TCP,AllowRDPfromCorp,10.10.0.0/24,*,IP Address
Deny,Deny RDP from Internet,VirtualNetwork,3389,Tag,Inbound,200,TCP,DenyRDPfromInternet,Internet,*,Tag
```

Regardless of if you choose YAML or CSV watch out for these common IaC issues relating to:
* **Bad data** - this is where, due to the human-factor, you'll have incorrect/errorneous values to investigate and ultimately fix-up before your IaC workflow is healthy.
* **Multiple sources of truth** - working with customers to build environments as IaC often means working across teams of people who have their own process and habits for maintaining their IaC source of truth. This often differs from your own which leads to confusion/frustration.
* **Exceptions to your usage patterns** - there'll be times when the dataset and Terraform consumption pattern isn't fit-for-purpose to meet every use-case and you'll need to create an exception/ad-hoc implementation pattern.
* **Inconsistent naming** - this often happens organically for your Terraform modules as they grow in scale and has been the cause of many 'terraform state mv' cmdlets in my experience.
* **API timeouts and resource dependencies** - the larger your IaC implementation gets (I'm talking hundreds of resources as code in a single TFstate file) you'll need to manage your changes in a staggered fashion to avoid seeing API timeouts and errors relating to dependencies not being ready.
* **TF provider parity with ARM** - I've had a few cases where the AzureRM provider didn't support something I needed as IaC and needed to use ARM templates or AzureCLI or even click-ops to acheive the desired outcome!

## Session Slides:
![HashiTalksANZ2021](/assets/gifs/hashitalksanz2021.gif "HashiTalks ANZ: DRY Coding with Terraform, CSVs, ForEach")

## Recorded Session:
[HashiTalks: Australia / New Zealand - YouTube](https://www.youtube.com/watch?v=JuzBolDyGdg&t=976s)

## VSCode extensions:
[Edit csv](https://marketplace.visualstudio.com/items?itemName=janisdd.vscode-edit-csv)

[Rainbox CSV](https://marketplace.visualstudio.com/items?itemName=mechatroner.rainbow-csv)

## Additional Reading:
[Terraform + CSVs = Netflix](https://lucian.blog/terraform-csvs-netflix/)

[CSVDecode](https://www.terraform.io/docs/language/functions/csvdecode.html)

[ForEach](https://www.terraform.io/docs/language/meta-arguments/for_each.html)

Cheers,
Jesse