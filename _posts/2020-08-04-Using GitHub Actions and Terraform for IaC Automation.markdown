---
title:  "Using GitHub Actions and Terraform for IaC Automation"
excerpt: "Combine GitHub Actions and Terraform to achieve an automated Infrastructure as Code workflow."
date:   "2020-08-04"
categories: 
- "CLOUD"
tags: 
- "TERRAFORM"
- "GITHUB ACTIONS"
---
Using GitHub Actions and Terraform to achieve an automated ‘Infrastructure as Code’ (IaC) workflow helps to reduce the possibility of human error and ensures our deployment time is kept minimal.

Now overall there’s multiple solutions available to leverage when deploying your Terraform code to a cloud environment. For example, you can:

* Deploy locally via Terraform CLI
* Deploy using Terraform Cloud/Enterprise 
* Deploy using Azure DevOps
* Deploy using GitHub Actions

Which option you select above depends on many factors such as where your code is stored and the CI/CD platform features you might need.

In this blog I’m going to take you through the 4th option – deploy using GitHub Actions. If you’re interested in using Azure DevOps check out [Terraform with Azure DevOps](https://purple.telstra.com/blog/terraform-with-azure-devops-pipeline) by my colleague Santhosh Kumar.

Quick background - GitHub Actions (GHA) has continually evolved since it’s public beta in late 2018 to the workflow automation tool we know today. Back in 2018, HashiCorp’s Terraform team jumped onboard to release hashicorp/terraform-github-actions and as of May 2020 have released hashicorp/setup-terraform.

# Solution Architecture

So my example solution architecture for today’s blog looks like this:

* **Source control**: GitHub private repository
* **Workflow automation**: GitHub Actions and HashiCorp’s GitHub Action (setup-terraform)
* **Infrastructure as code**: Terraform
* **Terraform remote backend**: Terraform Cloud
* **Target cloud environment**: Microsoft Azure

Note: Although my solution above uses some specific platforms/products - they’re all interchangeable. The key underlying message I want to share is the concept of an automated ‘Infrastructure as Code’ workflow from any source control to any cloud and the benefits you gain.

Here’s a simple diagram that shows a bird’s eye view.
 
![hashicorp terraform github action solution](/assets/images/tf_gh_action0.png)

To implement this example solution architecture we’ll need to:

1. Configure Terraform Cloud.
2. Setup an Azure Service Principal.
3. Set the Service Principal connection details as environment variables in Terraform Cloud.
4. Update our Terraform main.tf file to use Terraform Cloud as the remote backend.
5. Create an API Token for Terraform Cloud.
6. Store the API Token as a secret in GitHub.
7. Create 2x GitHub Action YAML workflow files - 1 workflow will run Terraform Plan automatically on push/pull request events. 1 workflow will run Terraform Apply manually/on demand.

If you’re interested in testing this out yourself feel free to follow the upcoming steps.

Note: As part of the deployment walkthrough there’s an assumption your Terraform code already resides in a GitHub repository, and that you already have access to an Azure subscription.

# Solution Deployment

Ok so, Terraform Cloud will be used to store the state file and variables for our deployment but we can always use other cloud storage for the state file such as Azure Storage, GCP Bucket, Amazon S3. For a quick proof of concept I’ve preferred Terraform Cloud here.

To get started, let’s head over to [https://app.terraform.io/signup/account](https://app.terraform.io/signup/account) and create an account - don’t worry there’s a free tier!

Once we’ve logged into Terraform Cloud, we need to create a new Organization.
 
![terraform cloud new organization](/assets/images/tf_gh_action1.png)

Now let’s create a new Workspace and select ‘No VCS connection’. 

Note: This is to avoid duplicating/overlapping with the workflow automation already provided by GitHub Actions. 
 
![terraform cloud new workspace](/assets/images/tf_gh_action2.png)

Once we’ve finished creating a new Workspace – we should go to Settings > General Settings and set the Terraform version to match the version used by our Terraform code. Failing to match these two versions can result in some state file issues.

For example: Our Terraform code could be pinned to 0.12.0 but if the Workspace is set to 0.12.29 then the state file will also use 0.12.29. This will result in a versioning mismatch after we perform subsequent Terraform runs. Ouch!
 
![terraform cloud workspace settings](/assets/images/tf_gh_action3.png)

For this solution walkthrough we’re using Azure as the target environment. To deploy our Terraform code to Azure via GitHub Actions the best practice is to use an Azure Service Principal for authentication. 

We can use the AzureCLI example below to create a new Service Principal at the Subscription Scope and assign the ‘Resource Policy Contributor’ role assignment. 

Setting a role assignment such as `Resource Policy Contributor` ensures we adhere to the standard of assigning the least amount of privilege required.
 
<script src="https://gist.github.com/jesseloudon/1e6e8bff6237c51241f06a7b6ce3be61.js"></script>

Once we have our Azure Service Principal connection details we can store them as Terraform Cloud Workspace Environment Variables as shown below.

This ensures they are available during API calls to the Workspace regardless of whether the API calls originate from Github Actions, Azure DevOps, or local Terraform CLI.
 
![terraform cloud environment variable](/assets/images/tf_gh_action4.png)

One alternative to storing these variables in the Terraform Cloud Workspace would be to save them as GitHub Secrets. Then we can define them within our GitHub Actions YAML file, like below.
 
<script src="https://gist.github.com/jesseloudon/d42c200375a9f85f9abe75cb948b8727.js"></script>

Now for our GitHub Action workflow to authenticate to the Terraform Cloud Workspace we need to create a new API token. 

Let’s head over to Organization > Settings > Teams to create a new Team API token as shown below.
 
![terraform cloud api token](/assets/images/tf_gh_action5.png)

Note: We can also create a User API token from User Settings > Tokens.

Once we have an API token we need to store it as a GitHub Secret in the same repository where our GitHub Action workflow will run. This will allow our Action to make API calls to the Terraform Cloud Workspace during the workflow run.
 
![github secrets](/assets/images/tf_gh_action6.png)

Awesome - now that most of the prerequisites are completed, we need to ensure that our Terraform remote backend is using the new Terraform Cloud Organization/Workspace.

Here’s an example snippet of an updated main.tf file.

Note: Below I’m statically pointing to a Workspace using the ‘name’ key. If you choose to use the ‘prefix’ key here instead, you’ll also need to have a Terraform CLI step in your GitHub Action YAML to select the desired Workspace as part of the workflow run.
 
<script src="https://gist.github.com/jesseloudon/b8715fd9625c5e841573392611de48dc.js"></script>

We’re now closer than ever to achieving an automated ‘Infrastructure as Code’ workflow which will help reduce the possibility of human error and ensure our deployment time is kept minimal.

Here comes the fun part – setting up GitHub Actions. 

In this solution walkthrough we’re creating 2x GitHub Action YAML files in our repository as shown below.

![github action yaml workflows](/assets/images/tf_gh_action7.png)

The first GitHub Action YAML file we need to create/test in our repo under /.github/workflows is terraform_plan.yaml.
 
<script src="https://gist.github.com/jesseloudon/5ab369c1cfa7ca368d48ca5ad35b96d4.js"></script>

Key points:

* This workflow automatically runs on push/pull request events to the master branch.
* Ubuntu-latest is our virtual environment OS.
* Actions/checkout@v2 copies our Terraform code from the repo to the virtual environment / GitHub-hosted Runner.
* Hashicorp/setup-terraform@v1.1.0 installs Terraform CLI to the virtual environment and allows us to run common CLI cmdlets on our Terraform code.
* Our Terraform Cloud API token stored as a GitHub Secret is referenced using ${{ secrets.tf_token }}.
* Terraform version is pinned to 0.12.0.
* Terraform fmt, init, validate, and plan will be used to ensure our Terraform code is in a ‘ready’ state prior to an apply.

After committing to your master branch, your new terraform_plan.yaml will run automatically. Within the GitHub Actions workflow logs, a successful run will look like this.
 
![github action terraform plan](/assets/images/tf_gh_action8.png)

At this stage we have successfully implemented and tested the following core solution elements!
 
![hashicorp terraform github action solution](/assets/images/tf_gh_action9.png)

To complete the solution and deploy our Terraform code to the target environment Azure – we need to create/test the last YAML file terraform_apply.yaml as shown below.
 
<script src="https://gist.github.com/jesseloudon/a50975c2b6a190a97ebe59bd43e55353.js"></script>

Key points:

* This is using the new manual trigger ‘workflow_dispatch’ so that we can run this workflow on-demand. Knowing the power of Terraform, I’m hesitant to have Terraform Apply run using an automatic trigger.
* We’re using same steps/Actions previously shown in our terraform_plan.yaml but with the addition of Terraform Apply -auto-approve. The duplication of some tasks already covered by terraform_plan.yaml is simply to show the typical Terraform steps end-to-end.

After committing our terraform_apply.yaml file to our repo, we can find the `Terraform Apply` Action and kick off a run with `Run workflow` as shown below.
 
![github action manual trigger](/assets/images/tf_gh_action10.png)

Again, within the GitHub Actions workflow logs, a successful run of the above terraform_apply.yaml will look like this.
 
![github action terraform apply](/assets/images/tf_gh_action11.png)

Brilliant! Now that a Terraform Apply has completed from GitHub Actions we should now see our Azure resources deployed to our Azure Subscription – in the example below I’ve deployed custom Azure Policies and Initiatives.
 
![azure policy custom deployment](/assets/images/tf_gh_action12.png)

We can also view our latest Terraform state file within the Terraform Cloud Workspace as shown below.

![terraform cloud workspace state file](/assets/images/tf_gh_action13.png)

# Closing Remarks

In this blog we looked at using GitHub Actions and Terraform to achieve an automated ‘Infrastructure as Code’ workflow.

I expect further integration between HashiCorp’s Terraform and GitHub to continue as the IaC movement progresses from early adoption to mainstream usage.

What’s also exciting to follow is [GitHub’s public roadmap](https://github.com/github/roadmap/projects/1?card_filter_query=action) for GitHub Actions and see the investments they are making towards an improved tool.

Happy ‘Infrastructure as Coding’,

Jesse
