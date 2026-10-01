---
name: blog-authoring
description: Draft and edit blog posts for Jesse Loudon's jloudon.com in the author's historically grounded voice, tone, tense, and Astro Markdown format. Use when asked to write, plan, revise, or review a blog post for this site.
---

# Blog authoring

Use this skill for blog posts intended for `jloudon.com`. The style below is based on the 32 published posts in `src/content/posts`, including technical tutorials, field notes, event write-ups, study advice, and personal retrospectives. Follow the patterns without copying old wording or carrying forward historical errors.

## Voice

- Write as an experienced practitioner sharing what worked, what did not, and what readers can apply. Prefer concrete first-hand observations over abstract claims.
- Use first person ("I") for personal experience, decisions, and recommendations. Use "we" only for a genuinely shared process or an inclusive explanation. Address the reader directly as "you" when giving context or guidance.
- Explain technical concepts plainly, then show how they apply through an example, sequence, diagram, or code. Make the reader's reason for continuing clear early.
- Be candid about assumptions, constraints, trade-offs, surprises, and lessons learned. Distinguish personal experience from general fact.
- Prefer Australian/British English spelling, such as "organise", "modernise", and "utilise". Keep spelling consistent and preserve official product names, quoted text, and source wording.

## Tone

- Conversational, welcoming, and technically credible. A light greeting such as "Hey folks" or "G'day" can fit, but is optional.
- Friendly and direct rather than formal, sales-oriented, or promotional. Use humour sparingly and only when it comes naturally to the subject.
- Confident about verified experience, measured about recommendations, and explicit when a detail is uncertain or specific to one environment.
- Avoid generic AI phrasing, inflated claims, forced jokes, repetitive greetings, and filler such as announcing what every section will do.
- A short closing that shares a takeaway or invites discussion is suitable. "Cheers, Jesse" is an optional sign-off, not a requirement.

## Tense and point of view

- Use present tense for current product behaviour, concepts, architecture, and instructions: "The policy checks the resource type." Use imperative or second person for procedural steps: "Set the variable, then run the plan."
- Use simple past for completed events, deployments, tests, and observed outcomes: "I deployed the policy to a test subscription."
- Use present perfect for relevant experience that connects past work to the current topic: "I've used this pattern across multiple environments."
- Use future tense only for a real planned action or a preview of what the article will cover. Do not use future tense to describe capabilities that already exist.
- Keep each statement anchored to its timeframe. For tutorials, explain the current method in present tense and reserve past tense for the author's own implementation or test. For event reports and retrospectives, narrate what happened in past tense and use present tense only for lasting observations.
- Do not invent first-hand experience, project details, results, customer context, quotations, or numbers. Ask for missing material facts or clearly mark a placeholder for the author.

## Structure

Choose a structure that suits the post rather than forcing every article into one template.

For technical how-to posts and field notes, a common progression is:

1. Open with the problem, scenario, or practical reason for the post.
2. State relevant assumptions, scope, and prerequisites.
3. Explain the approach and why it was chosen.
4. Walk through the implementation with descriptive headings, ordered steps, code, tables, or diagrams where useful.
5. Call out gotchas, validation, limitations, security implications, and trade-offs.
6. Close with the outcome, lessons, or useful next steps.

For event, learning, and retrospective posts, establish what happened and why it mattered, use first-hand past-tense detail, then share lessons or relevant resources. Keep announcements and link roundups concise. Use only sections that help the reader follow the subject; do not add filler headings.

## Technical accuracy

- Preserve the author's supplied implementation details. Do not silently change code, commands, configuration, or outcomes while editing prose.
- Never invent code output, test results, credentials, resource identifiers, customer information, or production impact. Use safe placeholders for sensitive or unavailable values.
- Verify version-sensitive claims and command syntax against supplied sources when possible. Link to authoritative documentation for important product behaviour, and make clear when a statement reflects a specific point in time or environment.
- Include prerequisites before steps that depend on them. Explain non-obvious parameters and consequential choices. Mention a development or test environment before potentially destructive operations.
- Use fenced code blocks with the correct language identifier. Keep code examples focused and complete enough to understand. Use Markdown links with descriptive link text and meaningful image alt text.
- Do not fabricate repository paths or image assets. Use diagrams, screenshots, and external embeds only when the author provides them or confirms they are available.

## Site format

Create posts under `src/content/posts/` using the existing `YYYY-MM-DD-Title.md` filename pattern. Use the actual publication date in both the filename and frontmatter.

The Astro collection requires `title` and `date`. `excerpt`, `categories`, `tags`, and `header` are supported; categories and tags default to empty arrays. Use this frontmatter shape and omit optional values that are unknown:

```yaml
---
title: "Post title"
excerpt: "A concise description of the problem, approach, or lesson."
date: "YYYY-MM-DD"
categories:
  - "cloud"
tags:
  - "relevant topic"
---
```

When the author supplies an image that exists in the site, `header` may include `og_image` and `teaser` paths, commonly pointing to the same image. Do not make up an image path. Use category and tag names consistent with related posts.

## Final review

Before returning a draft, check that:

- The opening quickly explains the subject and its practical relevance.
- The voice is personal where evidence supports it, and factual claims are not presented as personal experience.
- Tense follows the rules above and does not shift without a reason.
- The structure fits the post type and makes technical steps easy to follow.
- Code, links, terminology, spelling, and Markdown are consistent; no unsupported claims or invented details remain.
- The frontmatter is valid for `src/content.config.ts`, and the filename and frontmatter date agree.
