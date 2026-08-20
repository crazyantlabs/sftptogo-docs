---
name: technical-writer
description: Write or update SFTP To Go customer documentation in this Docusaurus site. Use when asked to document a feature, update docs for a change, add a docs page, or review docs wording.
---

# Writing SFTP To Go documentation

This is the **public** customer-facing docs site (`crazyantlabs/sftptogo-docs`, Docusaurus 3).
Everything written here is read by customers, indexed by search engines, and visible
on GitHub. Write for someone using the product, not someone building it.

## Before writing

1. **Read the neighbouring page first.** Match its voice, depth and structure rather
   than inventing a new shape. `docs/automation/automations.md` is a good reference
   for a long feature page.
2. **Check the behaviour in the code, don't assume it.** The docs are frequently the
   only description of a behaviour, so a guess becomes the specification. Confirm
   limits, defaults, error messages and field names against `api/` and `web-client/`.
3. **Confirm the UI labels verbatim.** Buttons and fields change often; a doc naming
   an old label is worse than one naming none.

## The rule that matters most: describe the product, not the plumbing

Never name the infrastructure behind a feature. Customers don't run it and can't see
it, and naming it dates the docs and leaks architecture.

- Write "runs on a schedule", not "an EventBridge Scheduler rule".
- Write "the automation retries a few times", not "Step Functions retry policy".
- Write "stored securely", not "in SSM Parameter Store".

The exception is where the product **deliberately exposes** the concept: the schedule
editor offers a cron expression field, so cron syntax is documented — because the
customer types it. Infrastructure that merely implements a feature stays unnamed.

## Conventions

These are enforced by review; follow them exactly.

- **Headings**: sentence case — "Setting up a custom SFTP server name".
- **Steps**: numbered lists for sequences, bullets for unordered sets.
- **UI elements**: bold — click **Add domain**.
- **Code, paths, CLI, field values**: backticks — `/incoming/`, `file.created`.
- **Voice**: imperative and concise — "Click", "Enter", "Select".
- **Links between docs**: relative — `[link](../security/audit-logs#automations)`.
- **Admonitions**: `:::info` for plan gating and important notes, `:::note` for tips,
  `:::warning` for things that can lose data or surprise.
- **Plan-gated features** get an `:::info` block linking to pricing:
  ```
  :::info
  This feature is only available with certain plans. Read more about our different plans [here](https://sftptogo.com/pricing)
  :::
  ```

### Page frontmatter

```
---
sidebar_label: 'Short name'
title: 'What the page is about'
sidebar_position: 1
---
```

The sidebar is generated from the directory tree. A new section needs a
`_category_.json` with `label` and `position`.

## Documenting a destructive or irreversible action

Say so plainly, in a `:::warning`, at the point the reader would act — not in a note
further down. Name what is lost and whether it can be recovered.

## Verifying

Always run the build before handing work over — it fails on broken links and bad
markdown, which is the most common defect in a docs change:

```bash
yarn build
```

Check any link you added actually resolves, including anchors — Docusaurus validates
paths but a wrong `#anchor` fails silently.

## Working in this repo

- The checkout is **shared with other agents**. Use a detached worktree under
  `sftptogo/.worktrees/` rather than switching branches in place.
- It is a **public repo**: pull request titles and bodies must contain no Claude or
  AI attribution, and no links to internal systems (Notion, GitLab issues). Describe
  the change on its own terms.

## Finishing

Say which pages changed and what a reader will now find that they couldn't before.
If you found the code and the existing docs disagree, say so — that's usually a bug
report, not a docs fix.
