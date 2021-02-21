---
title: "OpenSource Blogging with Jekyll GitHub VSCode Part3"
excerpt: ""
date:   "2020-07-30"
categories: 
- "BLOGGING"
tags: 
- "OPEN SOURCE"
- "GITHUB PAGES"
- "GITHUB"
- "GIT"
- "JEKYLL"
- "VSCODE"
- "MARKDOWN"
---
Greetings and welcome to Part 3 of the OpenSource Blogging series.

In Part 2 I took you through setting up your local blog development environment. We also had our first look at using `bundle exec jekyll serve` to preview the site.

![Part2Complete](/assets/images/Part2devcomplete.png)

* Part 1 - Why I'm using open source and an overview of my blog setup
* Part 2 - Getting started with a step-by-step guide
* Part 3 - Securing your Content and Going Live with GitHub Pages - `you are here`
* Part 4 - Tips & Tricks with Jekyll and Markdown editing

## Coming Up...

>![Part3DeploymentPlan](/assets/images/Part3deploymentplan.png)

1. We'll setup GitHub & activate 2FA
2. We'll setup a GitHub Pages repository and sync our local blog
3. We'll review the live blog and commit local changes to GitHub

## (1) Setup And Secure Your GitHub Account

Firstly head over to <https://github.com/join> and setup your GitHub account if you don't have one already.

A crucial step in securing your GitHub account involves activating additional security controls available to you. For example:

* Enable two-factor authentication (2FA) using an Authenticator App, Security Keys, or SMS. <https://help.github.com/en/github/authenticating-to-github/securing-your-account-with-two-factor-authentication-2fa>
* Setting up 2FA ensures that if your GitHub username & password were ever compromised there is an additional layer of authentication into your account. Don't forget to setup additional Recovery Options as shown below to avoid locking yourself out :smile:

![GitHubSecurity2](/assets/images/GithubSecurity2.png)

* Set your GitHub personal email address to private and update Git to use the auto-generated no-reply email address. `git config --global user.email "email@example.com"` <https://help.github.com/en/github/setting-up-and-managing-your-github-user-account/setting-your-commit-email-address>

![GitHubSecurity1](/assets/images/GithubSecurity1.png)

* Additionally you shouldn't store or put transactions of sensitive information in GitHub Pages sites or GitHub repositories. Examples include Credit Card info or passwords.

## (2) Setup your GH Pages repo and sync our local blog

- Create a new Repository with your username "username.github.io"



![Part3Complete](/assets/images/Part3deploycomplete.png)


