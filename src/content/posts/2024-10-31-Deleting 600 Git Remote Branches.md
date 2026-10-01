---
title: "Deleting 600 Git Remote Branches"
excerpt: "An audit-before-delete approach to cleaning up hundreds of stale Git remote branches."
header:
    og_image: /assets/images/DeletingGitRemoteBranchesHeader.jpg
    teaser: /assets/images/DeletingGitRemoteBranchesHeader.jpg
date: "2024-10-31"
categories:
- "devops"
tags:
- "git"
- "github"
- "automation"
- "scripting"
---
![code view](/assets/images/DeletingGitRemoteBranchesHeader.jpg "code view")

Greetings folks. Have you ever needed to mass delete hundreds of stale git remote branches? Does your developer team have a standard/policy to ensure that merged and stale branches are deleted to cleanup the branch history?

My recent problem statement included both aspects above so I wanted to share my story and how I went about solving the problem using an scripted “**audit before delete**” approach made slightly easier with the help of GitHub Copilot for the script generation.

> Don’t forget folks, always test test test and never push a large change without having a level of confidence about minimising risk and potential impact.

Let me describe the background context briefly so you have an understanding on what I was working with. I was migrating several repositories from BitBucket Server to GitHub Enterprise Cloud which is made easier through GitHub’s BBS2GH extension. After auditing the in-scope repos to be migrated I came across **100s of stale remote branches in those repos dating back to 2020**, a large number of which had already been merged via PR to the main branch and the rest were stale branches not modified in months/years.

I also noticed that BitBucket Server’s setting/policy which automatically deletes merged branches was still set to the default mode of ‘off’ – this is also the same default configuration in GitHub Enterprise Cloud so no surprises there.

![bitbucket server setting branch delete on merge](/assets/images/GitBranchDeletionSetting.png "BitBucket Server’s default setting")

Now as part of the repo migration to GitHub I didn’t feel there was a great benefit from retaining that many stale remote branches, particularly if they have been merged already. After a brief dicussion with the repo owners it was agreed that I could delete any remote branch that had been created prior to 1st July 2024.

I did briefly investigate the possibility of mass deleting these old remote branches through an existing tool or addon compatible with BitBucket Server however that didn’t surface anything viable.

So the next best thing to save me a heap of time was to pass in several prompts to GitHub Copilot Chat such as:

> “create a bash script to query and export to CSV all remote branches that are older than a specified date”
>
> “update the script to include debugging and progress updates to the console”
>
> “add the repo name to the exported CSV filename”

The outcome of this GitHub Copilot Chat conversation was something like the below. GitHub Copilot generated 99% of this script for me with the prompts I gave it including the comments describing each step. I’ve then added in some of my own comments at the top of the script to help **future me** remember what this is for and how to use it.

```bash
#!/bin/bash
# This script is used to query and export a CSV of remote branches that are older than the specified date.
# After running this script you should modify the CSV to remove specific branches which you don't want to delete using git-delete-remote-branches.sh.
# Branches to remove from the generated CSV include: origin, master, main, develop, etc

# Fetch all remote branches
git fetch --all

# Get the repository name
repo_name=$(basename -s .git `git config --get remote.origin.url`)

# Get all remote branches with their creation dates, sorted by creatordate in descending order
branches=$(git for-each-ref --sort=-creatordate --format '%(refname:short),%(creatordate:iso8601)' refs/remotes/)

# Debug: Print branches to verify output
echo "Branches and creation dates:"
echo "$branches"

# Filter branches created before 1st July 2024 and output to a CSV file
echo "Branch,Creation Date" > "${repo_name}_branches_created_before_2024-07-01.csv"
while IFS=, read -r branch date; do
  # Debug: Print each branch and date being processed
  echo "Processing branch: $branch with creation date: $date"

  # Extract just the date part (YYYY-MM-DD) for comparison
  date_only=$(echo $date | cut -d' ' -f1)

  if [[ "$date_only" < "2024-07-01" ]]; then
    echo "$branch,$date" >> "${repo_name}_branches_created_before_2024-07-01.csv"
  fi
done <<< "$branches"
```

The generated CSV shown below is pretty simple and contains the remote branch name and a creation date. It’s a quick and easy way to audit what is existing and then decide if you want to delete that in the next script to follow.

With this generated CSV in hand listing hundreds of remote branches that were stale I made a copy of it named “reponame\_branches\_to\_delete\_before\_2024-07-01.csv”, then manually removed lines mentioning branches that should not be deleted such as origin/master, origin/main, and other long-lived feature or development branches – **this is a hugely important step** and could probably also be automated with some additional scripting development.

![viewing/modifying the generated CSV named reponame_branches_to_delete_before_2024-07-01.csv](/assets/images/GitBranchesCSVReview.png "viewing/modifying the generated CSV named reponame_branches_to_delete_before_2024-07-01.csv")

The beautiful thing about GitHub Copilot Chat is that based on the context from the previous chat history I did not need to give it as much instructions when generating the below deletion script. My only prompt to Copilot was:

> “create a bash script to delete all remote branches specified in a CSV”

The outcome of this was something like the below. Again, GitHub Copilot generated 99% of this script for me with the prompt I gave it including the comments describing each step and the debug messages as well based on what I wanted earlier for the auditing script. And again, I’ve then added in some of my own comments at the top of the script to help **future me** remember what this is for and how to use it.

```bash
#!/bin/bash
# This script is used to bulk delete remote git branches to cleanup old branches which have been merged or old branches which can be deleted.
# Before using this script you should use the git-query-remote-branches.sh script first to generate a CSV with branches older than a specified date.
# WARNING1 - this is a potentially dangerous script which is not intended for use outside of specific purposes.
# WARNING2 - you should validate and test this script on a low-risk repo first to ensure you understand the delete operation.

# Input CSV file
input_csv="update-with-csv-name.csv"

# Echo the CSV data
echo "CSV Data:"
cat "$input_csv"

# Read the CSV file and delete the remote branches
while IFS=, read -r branch date; do
  # Skip the header line
  if [[ "$branch" == "Branch" ]]; then
    continue
  fi

  # Debug: Print each branch and creation date being processed
  echo "Processing branch: $branch with creation date: $date"

  # Debug: Print each branch being deleted
  echo "Deleting branch: $branch"

  # Delete the remote branch
  git push origin --delete "${branch#origin/}"
done < "$input_csv"
```

At this stage I had a working audit script that outputs a CSV of all git remote branches older than the specified date and deletion script that takes a CSV input to mass delete git remote branches. I repressed my **cowboy nature** and tested both scripts on a low-risk BitBucket Server repo first to ensure the outcome was as expected.

Based on that test I had a level of confidence that this is what I wanted and ran my scripts against the repos I really wanted to cleanup. End to end it took about 30 minutes to develop and test the script with GitHub Copilot’s help, and about 30 minutes to run the scripts against my repos taking a mini break inbetween repos to validate everything was still as expected on the BitBucket Server side.

![Running the mass delete script on git remote branches](/assets/images/GitRemoteBranchDeletion.png "Running the mass delete script on git remote branches")

In closing, my recommendations for effective management of old/stale/merged branches in GitHub are:

* Turn on automatic deletion of branches from the repo's settings. [See this link for guidance.](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-the-automatic-deletion-of-branches)
* Educate your developer teams on how to restore a deleted branch if they need to. [See this link for guidance.](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-branches-in-your-repository/deleting-and-restoring-branches-in-a-pull-request#restoring-a-deleted-branch)

Thanks for making it this far if you’re still with me. Funny enough I think it took me more time to write this blog post than it did to technically solve the problem statement I had 🙂

Cheers,

Jesse
