---
title: "OpenSource Blogging with Jekyll GitHub VSCode Part2"
excerpt: "Detailed walkthrough of everything you need to get started with your own blog site using Jekyll GitHub VSCode"
header:
    og_image: /assets/images/Part2deploymentplan.png
    teaser: /assets/images/Part2deploymentplan.png
date:   "2020-02-26"
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
In Part 1 of this series I introduced you to open source blogging using some awesome tools and platforms available today. I also shared my own setup so you can see what's involved end-to-end.

Shortly I'll provide a detailed walkthrough of everything you need to get started with your own blog site.

* [Part 1](https://jloudon.com/blogging/OpenSource-Blogging-with-Jekyll-GitHub-VSCode-Part1/) - Why I'm using open source and an overview of my blog setup
* [Part 2](https://jloudon.com/blogging/OpenSource-Blogging-with-Jekyll-GitHub-VSCode-Part2/) - Getting started with a step-by-step guide
* Part 3 - Securing your Content and Going Live with GitHub Pages
* Part 4 - Tips & Tricks with Jekyll and Markdown editing

## Local Blog Development

First we need to setup our local development environment for the blog site by installing a few dependencies. 

* As I'm running a Surface Book 2 these instructions are for the Windows 64-bit OS but can be modified to suit MacOS or Linux as needed.

![DevDeploymentPlan](/assets/images/Part2deploymentplan.png "Dev Deployment Plan")

## Coming Up...
>
1. We'll install VSCode
2. We'll install Git
3. We'll install Ruby and Jekyll
4. We'll clone a Jekyll Theme to a local folder and preview the site

<i> Already have Visual Studio Code or Git installed? --> Update to the latest release prior to continuing with this guide.

* VSCode - Go to `Help > Check for Updates` from your VSCode client to update to the latest release.
* Git - Use `git update` or `git update-git-for-windows` from your Git client to update to the latest release. 

### Install Visual Studio Code

1. Go to [https://code.visualstudio.com/download][VSCodeDownload]
2. Download & run the Windows (x64) installer ~ 57MB.
3. Accept all defaults during the installation wizard. Nothing exciting here!

### Install Git

1. Make your way to [https://git-scm.com/downloads][GitDownload]
2. Download & run the Windows (x64) installer ~ 44MB.
3. During the install wizard - make sure to choose `Visual Studio Code as Git's default editor` from the drop-down (shown below).
4. All other install defaults seem fine to leave as-is!

![GitInstall](/assets/images/GitInstall1.png "Git Install")

### Install Jekyll / Ruby

1. Head over to [https://rubyinstaller.org/downloads/][RubyInstaller]
2. Download & run the Ruby+Devkit 2.6.X (x64) installer ~ 132MB.
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

### Cloning a Jekyll Theme

We want to be blogging today-ish, not next week or a month later. So let's `clone` an existing Jekyll theme to our local dev environment. We can then modify it to suit our needs without reinventing the wheel!

> By the way! The default Jekyll theme is [Minima][Minima] and seems fine for a quick proof of concept. I don't recommend going live with it because of what it lacks when compared to other themes out there.
You can check it out by executing the following cmdlets from a VSCode Terminal:
``` bash
$ jekyll new my-awesome-site
$ cd my-awesome-site
$ bundle exec jekyll serve
```
After a successful serve - browsing to http://localhost:4000 will display a home page like this:
![Minimatheme](/assets/images/Minima-theme.png "Minima theme")

Currently I'm using [Minimal Mistakes][MmistakesGH] by Michael Rose because it suits my needs & because of Michael's helpful documentation available - for example check out [https://mmistakes.github.io/minimal-mistakes/docs/quick-start-guide/][Mmistakes]

The quickest way to get started with the Minimal Mistakes theme is to `git clone` one of the following GitHub repositories.

* [Minimal Mistakes Remote Theme Starter][MmistakesRemote]
* [Minimal Mistakes][MmistakesGH]

Let's look at how this works with the <b>Remote Theme</b>.

Try executing the following cmdlets from a VSCode Terminal:

``` bash
$ cd C:/
$ git clone https://github.com/mmistakes/mm-github-pages-starter
$ cd mm-github-pages-starter/
$ bundle exec jekyll serve
```

After a successful serve - browsing to http://localhost:4000 will display a home page like this:

![Jekylltheme1](/assets/images/Jekylltheme1.png "Jekyll theme")

Open the newly created folder `C:\mm-github-pages-starter` from VSCode to access the following site structure.

![Jekylltheme2](/assets/images/Jekylltheme2.png "Jekyll theme")

Here's a breakdown of what you see above. It's important to understand this structure as the majority of your changes will happen here.

* `_data` contains a .yml file which controls the site navigation links visible at the top of pages. Modify the navigation.yml file as you add/remove pages to your site.

* `_pages` contains .markdown files used by the site such as the 404 and About pages. Modify the existing pages in this folder or create new ones to suit your needs.

* `_posts` contains .markdown files that are published to the site as new posts. Place your new posts into this folder.

* `_site` is where Jekyll has built and stored the site before publishing it locally. You can ignore this folder.

* `assets\images` contains image files used by the site and pages/posts. Save your PNG/JPEG/BMP/GIF files into this folder and reference the path in your markdown.

* `_config.yml` is the main configuration file that Jekyll references to build the site after you have used `bundle exec jekyll serve`. Modify this file first to update key properties/variables and then rerun a jekyll serve to see the changes locally.

* `.gitignore` contains files or folders that you do not want syncing via Git to your GitHub repository. Modify this file if you add a _drafts folder later on for posts that you don't want sync'd into GitHub.

* `Gemfile` is used to define RubyGems that are loaded for the site. Modify this file as needed for changes to plugins.

* `Gemfile.lock` is a Jekyll autogenerated file that appears after you have used `bundle exec jekyll serve` - you can ignore it.

* `index.html` defines some YAML Front Matter for the site's home page. There's no need to modify this file.

* `README.md` is a helpful introduction to the Remote Theme written by the author Michael Rose.

<b> Next Steps </b>

- Review and update `Config.yml`
- Create a few blog posts into the `_posts` folder.
- Add your own images into the `assets\images` folder and reference them into posts using `![%ImageDescription%](/assets/images/%filename%)`.
- Create your own `About` page or update the existing `_pages/About.md`.
- Run `bundle exec jekyll serve` to see the results!

## Recap

We've completed installation of our open source blogging dependencies to our local dev environment and cloned/served a Jekyll theme.

![Part2DevComplete](/assets/images/Part2devcomplete.png "Part2 Dev Complete")

Congrats on getting this far!

Join me for `Part 3` of this series where we'll look at taking your blog live with [GitHub][GitHub] and [GitHub Pages][GitHubPages].

Cheers,
Jesse

[VSCodeDownload]:https://code.visualstudio.com/download
[GitDownload]:https://git-scm.com/downloads
[RubyInstaller]:https://rubyinstaller.org/downloads/
[Minima]:https://github.com/jekyll/minima
[Mmistakes]:https://mmistakes.github.io/minimal-mistakes/docs/quick-start-guide/
[MmistakesGH]:https://github.com/mmistakes/minimal-mistakes
[MmistakesRemote]:https://github.com/mmistakes/mm-github-pages-starter
[JekyllThemeLink1]:https://jekyllthemes.io/
[JekyllThemeLink2]:http://jekyllthemes.org/
[JekyllThemeLink3]:https://jamstackthemes.dev/ssg/jekyll/
[GitHubPages]:https://pages.github.com/
[GitHub]:https://github.com/