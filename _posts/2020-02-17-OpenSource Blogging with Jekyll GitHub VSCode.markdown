---
title: "OpenSource Blogging with Jekyll GitHub VSCode"
excerpt: "Introduction to getting setup with your own blog site using Jekyll GitHub VSCode"
header:
  og_image: /assets/images/OpenSourceBlogDiagram.png
  teaser: /assets/images/OpenSourceBlogDiagram.png
date: "2020-02-17"
categories:
  - "blogging"
tags:
  - "github pages"
  - "jekyll"
  - "open source blogging"
  - "oss blogging"
  - "vscode"
  - "markdown"
---

Kicking off the new year brought forward a renewed motivation to join the community of tech bloggers.

In this blog I'll share everything you need to know to get you setup with your own blog site, for free, using open source tooling such as Jekyll, GitHub, and Visual Studio Code.

To start off here's an overview of my blogging toolkit:

![OpenSourceBlogDependencies](/assets/images/OpenSourceBlogDependencies.png "Open Source Blog Dependencies")

## Why Open Source?

Firstly let's talk about why I'm using open source, some of which may be relevant to your own goals and requirements.

### Zero Traffic, Zero Cost

When creating a new blog site with almost nil content and `zero traffic` my instinct was to keep costs minimal. For a new site that generates zero income I cannot justify spending even $1.00 per month on hosting costs or software licensing. Currently my blog is `zero cost` to my hip pocket which makes me happy :)

### Maximum Control, Minimal Effort

Being in a technical role I tend to deep-dive into solutions and explore the possibilities, things may break but I'll learn the what and why in the process. For this to happen I needed `maximum control` over content and delivery which led me to consider static websites as a good fit. Because static websites are the most basic type of website it's also perfect for new tech bloggers which means overall `minimal effort` to maintain long term.

### Familiar Tooling

As part of my 9-5 job I'm already using open source tools such as [Visual Studio Code][VisualStudioCode] to write/test my .ps1 and .azcli scripts and [GitHub][GitHub] to store/share my code in the cloud and apply version control. So it made sense to continue using `familiar tooling` and this greatly helped to reduce the time needed to deploy and maintain my blog.

## Overview of Blog Setup

![OpenSourceBlogOverview](/assets/images/OpenSourceBlogDiagram.png "Open Source Blog Overview")

### Local Dependencies

On my laptop I have the following clients installed:

- [Ruby + DevKit](https://rubyinstaller.org/downloads/)
- [Jekyll](https://jekyllrb.com/docs/installation/windows/)
- [Visual Studio Code](https://code.visualstudio.com/download)
- [Git](https://git-scm.com/downloads)

### Creating content

I create and modify content using the Visual Studio Code client. It has native support for markdown editing and integration with Git. Maximum appreciation goes to VSCode's `preview window` which allows you to see your markdown content in it's published form.

![VSCodePreview](/assets/images/VSCode-Preview.png "VSCode Preview")

> Note: You can also use GitHub from a web browser to create content via their GUI however you cannot preview the entire site without publishing it. This is the main reason I use my Surface Book 2 as a local dev environment.

### Previewing the Site

After creating new content locally when I want to preview the entire site I'll run this cmdlet from VSCode's Terminal:

```
bundle exec jekyll serve
```

This will auto-build from my local Git repository & publish the site at http://127.0.0.1:4000

### Online Publishing

My GitHub account has a `single repository` and `master branch` setup for the blog. You can get a bit fancy with branches but I prefer to keep things simple for now.

> Note: In order for GitHub Pages to automatically build and serve your blog content your GitHub Repository name needs be a certain format: `username.github.io`

When I'm happy with the local preview of the blog site I use Git from the VSCode Terminal to commit my local changes and push them to my GitHub repo in the cloud.

Your typical flow of commands will look like this:

```
git pull
git commit -am "your commit message"
git push
```

The cool thing here is GitHub Pages automatically detects changes to my repo's master branch and using Jekyll integration auto-builds the site and publishes it live to the web.

As you can expect there are some usage limits associated with the GitHub Pages service such as a soft limit of 10 builds per hour. Being a new user to this service I've not run into these limits or felt the impacts as yet :smiley:

## Local Blog Development

First we need to setup our local development environment for the blog site by installing a few dependencies.

> At the time of writing I'm running a Surface Book 2 so these instructions are for the Windows 64-bit OS but can be modified to suit MacOS or Linux as needed. See [https://jekyllrb.com/docs/installation/](https://jekyllrb.com/docs/installation/) for more Jekyll installation guides.

![DevDeploymentPlan](/assets/images/Part2deploymentplan.png "Dev Deployment Plan")

### Install Visual Studio Code

1. Go to [https://code.visualstudio.com/download](https://code.visualstudio.com/download)
2. Download & run the Windows (x64) installer ~ 57MB.
3. Accept all defaults during the installation wizard. Nothing exciting here!

### Install Git

1. Make your way to [https://git-scm.com/downloads](https://git-scm.com/downloads)
2. Download & run the Windows (x64) installer ~ 44MB.
3. During the install wizard - make sure to choose `Visual Studio Code as Git's default editor` from the drop-down (shown below).
4. All other install defaults seem fine to leave as-is!

![GitInstall](/assets/images/GitInstall1.png "Git Install")

### Install Jekyll / Ruby

1. Head over to [https://rubyinstaller.org/downloads/](https://rubyinstaller.org/downloads/)
2. Download & run the Ruby+Devkit (x64) installer.
3. During the install wizard accept all defaults.
4. Click `Finish` at the completion of the install wizard.
5. After the install wizard a new cmd window will appear automatically and display 3x selections - Make sure to key in the number `1` before hitting `enter` to continue.
6. If all goes well you should see a screen saying MSYS2 is installed. Feel free to close it.
7. Now that's over, open your VSCode client & also a new Terminal ( ctrl+shift+` )
8. Next we need to install the `Jekyll` and `Bundler` RubyGems with following cmdlet:

```
$ gem install jekyll bundler
```

9. If you run into issues here try re-installing Ruby+Devkit starting from Step 2 above.

![RubyInstaller](/assets/images/RubyInstaller.png "Ruby Installer")

![RubyInstallWiz1](/assets/images/RubyInstallWiz1.png "Ruby Install Wizard p1")

![RubyInstallWiz2](/assets/images/RubyInstallWiz2.png "Ruby Install Wizard p2")

![RubyInstallWiz3](/assets/images/RubyInstallWiz3.png "Ruby Install Wizard p3")

![RubyInstallWiz4](/assets/images/RubyInstallWiz4.png "Ruby Install Wizard p4")

![RubyInstallWiz5](/assets/images/RubyInstallWiz5.png "Ruby Install Wizard p5")

![Jekyllinstall1](/assets/images/Jekyll_install1.png "Jekyll Install p1")

![Jekyllinstall2](/assets/images/Jekyll_install2.png "Jekyll Install p2")

### Cloning a remote Jekyll Theme

We want to be blogging today-ish, not next week or a month later. So let's `clone` an existing remote Jekyll theme to our local dev environment. We can then modify it to suit our needs without reinventing the wheel!

At the time of writing I'm using the Minimal Mistakes theme by Michael Rose because it suits my needs & because of Michael's helpful documentation available - for example check out [https://mmistakes.github.io/minimal-mistakes/docs/quick-start-guide/](https://mmistakes.github.io/minimal-mistakes/docs/quick-start-guide/).

The quickest way to get started with the Minimal Mistakes theme is to `git clone` one of the following GitHub repositories.

- [Minimal Mistakes Remote Theme Starter](https://github.com/mmistakes/mm-github-pages-starter)
- [Minimal Mistakes](https://github.com/mmistakes/minimal-mistakes)

Let's look at how this works with the **Remote Theme** (1st from the list above)

Try executing the following cmdlets from a VSCode Terminal:

```bash
$ cd C:/
$ git clone https://github.com/mmistakes/mm-github-pages-starter
$ cd mm-github-pages-starter/
$ bundle exec jekyll serve
```

> When running `bundle exec jekyll serve` - if you're seeing an error similar to 'cannot load such file -- webrick (LoadError)' use `bundle add webrick` [https://github.com/jekyll/jekyll/issues/8531](https://github.com/jekyll/jekyll/issues/8531)

After a successful serve - browsing to http://localhost:4000 will display a home page like this:

![Jekylltheme1](/assets/images/Jekylltheme1.png "Jekyll theme")

Open the newly created folder `C:\mm-github-pages-starter` from VSCode to access the following site structure.

![Jekylltheme2](/assets/images/Jekylltheme2.png "Jekyll theme")

### Understanding Jekyll

Here's a breakdown of what you see above. It's important to understand this structure as the majority of your changes will happen here.

#### \_data

- contains a .yml file which controls the site navigation links visible at the top of pages.
- modify the navigation.yml file as you add/remove pages to your site.

#### \_pages

- contains .markdown files used by the site such as the 404 and About pages
- modify the existing pages in this folder or create new ones to suit your needs

#### \_posts

- contains .markdown files that are published to the site as new posts
- place your new posts into this folder

#### \_site

- where Jekyll has built and stored the site before publishing it locally
- you can ignore this folder

#### assets\images

- contains image files used by the site and pages/posts
- save your PNG/JPEG/BMP/GIF files into this folder and reference the path in your markdown for example `![%ImageDescription%](/assets/images/%filename%)`.

#### \_config.yml

- the main configuration file that Jekyll references to build the site after you have used `bundle exec jekyll serve`
- modify this file first to update key properties/variables and then rerun a jekyll serve to see the changes locally

#### .gitignore

- contains files or folders that you do not want syncing via Git to your GitHub repository
- modify this file if you add a \_drafts folder later on for posts that you don't want sync'd into GitHub

#### Gemfile

- used to define RubyGems that are loaded for the site
- modify this file as needed for changes to plugins

#### Gemfile.lock

- a Jekyll autogenerated file that appears after you have used `bundle exec jekyll serve`
- you can ignore this file

#### index.html

- defines some YAML Front Matter for the site's home page
- there's no need to modify this file

#### README.md

- a helpful introduction to the Remote Theme written by the author Michael Rose

## Next Steps

1. Review and update `Config.yml`.
2. Create a few blog posts into the `_posts` folder.
3. Add your own images into the `assets\images` folder and reference them into posts using `![%ImageDescription%](/assets/images/%filename%)`.
4. Create your own `About` page or update the existing `_pages/About.md`.
5. Run `bundle exec jekyll serve` to see the results!

## Recap

We've completed installation of our open source blogging dependencies to our local dev environment and cloned/served a Jekyll theme.

![Part2DevComplete](/assets/images/Part2devcomplete.png "Part2 Dev Complete")

Congrats on getting this far! If you've followed this guide you should be armed with enough knowledge of Jekyll to be dangerous :-)

Cheers,
Jesse