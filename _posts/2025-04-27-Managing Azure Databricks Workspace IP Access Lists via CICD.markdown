---
title: "Managing Azure Databricks Workspace IP Access Lists via CICD"
excerpt: "How you can manage Azure Databricks (ADB) Workspace IP access lists via CICD and DevOps processes"
header:
  og_image: /assets/images/databricks-ip-access-list-flow.png
  teaser: /assets/images/databricks-ip-access-list-flow.png
date: "2025-04-27"
categories:
  - "cloud"
tags:
  - "azure databricks"
  - "workspace-ip-access"
  - "databricks devops"
render_with_liquid: false
---

Hey folks in this blog post I'm going to cover how you can manage Azure Databricks (ADB) Workspace IP access lists via CICD and DevOps processes. Hopefully this blog may save you time and potential headaches as I feel that, based on what I've experienced in the past, the available documentation and tooling support for this particular area has been limited.

# Intro To ADB IP Access Lists

Using ADB IP access lists allows us to control which networks can connect to our ADB account and workspaces - by default all connections from any IP address are allowed so most enterprises will want to further secure network access by configuring this feature either via CICD and DevOps processes or manually as a portal-driven change.

Currently ADB has two IP access list features:

- **IP access lists for the account console (currently Public Preview)** - IP access lists for the account console to allow users to connect to the account console UI and account-level REST APIs only through a set of approved IP addresses.
- **IP access lists for workspaces** - IP access lists for Azure Databricks workspaces to allow users to connect to the workspace or workspace-level APIs only through a set of approved IP addresses.

Access is checked according to this flow below. Image Source: [Microsoft Docs](https://learn.microsoft.com/en-us/azure/databricks/security/network/front-end/ip-access-list#details)

![AzureDatabricksIPAccessListFLow](/assets/images/databricks-ip-access-list-flow.png "Azure Databricks IP access list flow")

# Problem Statement and Rabbit Holes

When working on a project to deploy and manage multiple ADB workspaces via code, I had already deployed the workspaces using Terraform AzureRM and I briefly explored the option of managing the workspace IP access configuration using the available [Terraform Databricks IP Access List](https://registry.terraform.io/providers/databricks/databricks/latest/docs/resources/ip_access_list) resource. Ultimately I didn't go down the path of using the Terraform Databricks provider for various reasons specific to that project but I am interested in getting hands-on with that provider in future if there was the right opportunity.

So I still needed to manage the ADB workspace IP access lists via CICD and the next best option was to leverage the latest [Databricks CLI](https://learn.microsoft.com/en-us/azure/databricks/dev-tools/cli/commands) (currently Public Preview). This first led me down a bit of a rabbit hole of various Databricks CLI authentication options until I finally figured out that 'magic' set of environment variables to use for OAuth machine-to-machine (M2M) authetication to successfully work to the workspaces. If you're interested in knowing more about Databricks CLI authentication, I have some high level details in my [repo's README](https://github.com/globalbao/azure-databricks-cicd?tab=readme-ov-file#databricks-workspace-authentication).

The second rabbit hole was related to Databricks CLI itself. During this project I often found myself confused about what the actual supported cmdlets and inputs were for the CLI. I'll try not to bore you too much with the details but in general I found the [Databricks CLI commands documentation](https://learn.microsoft.com/en-us/azure/databricks/dev-tools/cli/commands) to be a bit incomplete in terms of available/supported commands that map to the REST APIs. This was further validated when I discovered various `//TODO` comments in the CLI's .go files for the `workspace/ip-access-lists` command as shown [here](https://github.com/databricks/cli/blob/ee55316007810446e975b2bd5173ab3daeaa3ff4/cmd/workspace/ip-access-lists/ip-access-lists.go#L86). With Databricks saying the CLI is still in public preview I'm hoping these doco gaps are fleshed out and completed prior to it going GA.

# Managing Azure Databricks Workspace IP Access Lists via CICD

So now let's dig into how exactly I managed ADB IP access lists via CICD.

As part of my Azure DevOps build and release pipeline templates I needed to install the Databricks CLI to my Ubuntu agent pool. This was fairly easy following the [available doco](https://learn.microsoft.com/en-us/azure/databricks/dev-tools/cli/install#curl-install).

```bash
curl -fsSL https://raw.githubusercontent.com/databricks/setup-cli/main/install.sh | sh
```

I then added a single step in my build and release pipeline template to:

1. echo the existing IP access lists to the logs (this is also how we can see the `ip_access_list_id` which is needed for `update` and `delete` operations)
2. enable or disable the IP access lists based on a [parameter input](https://github.com/globalbao/azure-databricks-cicd/blob/main/devops/templates/ado-release-template.yml#L12) from the calling pipeline
3. echo the IP access list enablement status to the logs

The below cmdlets gave me an easy way to toggle enablement or disablement of the workspace IP access lists via the Azure DevOps release pipeline.

```bash
echo "Listing existing Databricks Workspace IP Access Lists"
databricks ip-access-lists list -o json -t ${{ parameters.BUNDLE_TARGET }} --log-level ${{ parameters.DATABRICKS_LOG_LEVEL }}

echo "Enabling Databricks Workspace IP Access Lists if pipeline parameter is true"
databricks workspace-conf set-status enableIpAccessLists --json '{"enableIpAccessLists": "${{ parameters.ADB_ENABLE_IP_ACCESS_LISTS }}"}' -t ${{ parameters.BUNDLE_TARGET }} --log-level ${{ parameters.DATABRICKS_LOG_LEVEL }}

echo "Checking Databricks Workspace IP Access Lists enablement status"
databricks workspace-conf get-status enableIpAccessLists -t ${{ parameters.BUNDLE_TARGET }} --log-level ${{ parameters.DATABRICKS_LOG_LEVEL }}
```

Now onto the fun bit -- standing up the capability to trigger create, update, and delete operations within the IP access list.

Noticing that the Databricks CLI currently only supports JSON inputs for IP access list changes I chose to store the workspace IP ACLs in dedicated .JSON files per environment within a single folder in my repo e.g. `./workspace-ip-access-lists` with each JSON object aligning to the below inputs as [shown here](https://github.com/globalbao/azure-databricks-cicd/blob/main/workspace-ip-access-lists/dev.json).

| Input name        | Type   | required                                 | example                                    |
| ----------------- | ------ | ---------------------------------------- | ------------------------------------------ |
| label             | string | yes for `Create` and `Update` operations | `"ALLOW_AZURE_DATABRICKS_PRODFIX_SUBNETS"` |
| list_type         | string | yes for `Create` and `Update` operations | `"ALLOW"` or `"BLOCK"`                     |
| ip_addresses      | array  | yes for `Create` and `Update` operations | `["10.0.0.0/25","10.0.100.0/25"]`          |
| ip_access_list_id | string | yes for `Update` and `Delete` operations | `"a559572d-1730-4ce4-203z-75506242f04h"`   |
| operation         | string | yes always                               | `"CREATE"` or `"UPDATE"` or `"DELETE"`     |

Now that I had the IP ACLs defined in .JSON files within the repo I then added a single step in my release pipeline template which:

1. iterates over JSON objects: The `jq -c '.[]' "$json_file"` command extracts each object from the JSON file ($json_file) as a compact, single-line JSON string. The while loop reads each of these JSON objects one by one into the variable `json_object_creation`
2. extracts the operation field: For each JSON object, the script uses `jq -r '.operation'` to extract the value of the operation field. This value is stored in the operation variable. The -r flag ensures that the extracted value is output as a raw string, without quotes
3. checks for "Create" operations: The script converts the operation value to lowercase using `${operation,,}` and checks if it starts with the word `"create"`. This is done using the `if [[ ${operation,,} == "create"* ]]; then` condition. If the condition is true, the script proceeds to execute the block of code inside the if statement
4. creates Databricks IP Access Lists: If the operation is a `"create"` operation, the script logs a message to the console indicating that it is creating a new Databricks IP Access List. It then invokes the databricks ip-access-lists create command, passing the JSON object `($json_object_creation)` as input using the --json flag. The command also
5. uses two parameters, BUNDLE_TARGET and DATABRICKS_LOG_LEVEL, which are dynamically substituted from the pipeline's parameters (`${{ parameters.BUNDLE_TARGET }}` and `${{ parameters.DATABRICKS_LOG_LEVEL }}`)
6. uses `|| true` at the end of the databricks command ensuring that the script does not fail if the command encounters an error

This is the full pipeline step to create a new ADB IP access list:

```bash
json_file="workspace-ip-access-lists/${{ parameters.BUNDLE_TARGET }}.json"

jq -c '.[]' "$json_file" | while IFS= read -r json_object_creation; do
    operation=$(echo $json_object_creation | jq -r '.operation')
    if [[ ${operation,,} == "create"* ]]; then
        echo "Creating new specified Databricks IP Access List: $json_object_creation"
        databricks ip-access-lists create --json "$json_object_creation" -t "${{ parameters.BUNDLE_TARGET }}" --log-level "${{ parameters.DATABRICKS_LOG_LEVEL }}" || true
    fi
done
```

An example of a valid JSON object block which would be read and used by the above pipeline step is below.

```json
[
  {
    "label": "ALLOW_EXAMPLE_CORP_NETWORK1",
    "list_type": "ALLOW",
    "ip_addresses": ["192.168.0.0/23"],
    "operation": "CREATE"
  }
]
```

To support the `'update'` operation I repeated the above pipeline step logic as above, but added additional input and logic to support extracting and passing in the `ip_access_list_id` which is required.

```bash
json_file="workspace-ip-access-lists/${{ parameters.BUNDLE_TARGET }}.json"

jq -c '.[]' "$json_file" | while IFS= read -r json_object_update; do
    operation=$(echo $json_object_update | jq -r '.operation')
    ip_access_list_id=$(echo $json_object_update | jq -r '.ip_access_list_id')
    if [[ ${operation,,} == "update"* ]]; then
        echo "Updating existing specified Databricks IP Access List: $json_object_update"
        databricks ip-access-lists update "$ip_access_list_id" --json "$json_object_update" -t "${{ parameters.BUNDLE_TARGET }}" --log-level "${{ parameters.DATABRICKS_LOG_LEVEL }}" || true
    fi
done
```

An example of a valid JSON object block which would be read and used by the above pipeline step is below. Note the `ip_access_list_id` value and `operation` value.

```json
[
  {
    "label": "ALLOW_EXAMPLE_CORP_NETWORK1",
    "list_type": "ALLOW",
    "ip_addresses": ["192.168.0.0/23", "192.168.100.0/23"],
    "ip_access_list_id": "a559572d-1730-4ce4-203z-75506242f04h",
    "operation": "UPDATE"
  }
]
```

The `'delete'` operation shown below follows a similar implementation logic as the 'update' operation to handle `ip_access_list_id` which is required.

```bash
json_file="workspace-ip-access-lists/${{ parameters.BUNDLE_TARGET }}.json"

jq -c '.[]' "$json_file" | while IFS= read -r json_object_delete; do
    operation=$(echo $json_object_delete | jq -r '.operation')
    ip_access_list_id=$(echo $json_object_delete | jq -r '.ip_access_list_id')
    if [[ ${operation,,} == "delete"* ]]; then
        echo "Deleting specified Databricks IP Access List: $json_object_delete"
        databricks ip-access-lists delete "$ip_access_list_id" -t "${{ parameters.BUNDLE_TARGET }}" --log-level "${{ parameters.DATABRICKS_LOG_LEVEL }}" || true
    fi
done
```

An example of a valid JSON object block which would be read and used by the above pipeline step is below. Note the `ip_access_list_id` value and `operation` value.

```json
[
  {
    "label": "ALLOW_EXAMPLE_CORP_NETWORK1",
    "list_type": "ALLOW",
    "ip_addresses": ["192.168.0.0/23", "192.168.100.0/23"],
    "ip_access_list_id": "a559572d-1730-4ce4-203z-75506242f04h",
    "operation": "DELETE"
  }
]
```

Now that I had the basic foundations to manage this all from a pipeline and repo, a typical DevOps flow to operationally consume the above capability would be to:

1. create a new branch of the [github.com/globalbao/azure-databricks-cicd](https://github.com/globalbao/azure-databricks-cicd) repo
2. update an existing .JSON file within `./workspace-ip-access-lists` with the desired ADB IP access list operation (create, update, delete)
3. optionally, update the `'ADB_ENABLE_IP_ACCESS_LISTS'` parameter value to `true` or `false` from the [calling pipeline](https://github.com/globalbao/azure-databricks-cicd/blob/main/devops/ado-databricks-cicd.yml#L59)
4. pull request and merge the new branch to main
5. approve the latest pipeline run from main to deploy the IP access list changes

![AzureDatabricksDevOpsPipeline](/assets/images/databricks-devops-pipeline.png "Azure Databricks DevOps Pipeline")

# Final Thoughts

Some improvements I can think of if I were to get a chance at this again:

1. add JSON input validation as part of the build pipeline step to catch typos and errors early on before a PR/merge to main
2. add capability to manage ADB Account IP Access Lists as it appears to be supported through Databricks CLI
3. add logic for finding and mapping the `ip_access_list_id` from created IP access lists to any 'update' and 'delete' operations so you don't need to manually input that value into the .JSON files.
4. experiment using the Terraform Databricks provider as an alternative to Databricks CLI (assuming both Workspace and Account IP Access Lists are supported)

The past project, and this related blog post, were both fun and engaging pieces for me personally. I felt that I've been able to leverage past skills and experience in the DevOps space to prototype something fairly quickly and navigate through several rabbit holes that appeared.

I hope you enjoyed reading, looking forward to your thoughts below.

Cheers,
Jesse
