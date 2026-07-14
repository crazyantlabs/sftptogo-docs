---
sidebar_label: 'Setting up virtual folders'
title: 'Setting up virtual folders'
sidebar_position: 16
---
TL;DR - what are virtual folders?
------

- Virtual folders let you map the folders a credential sees to real locations in your storage, under names you choose.
- One credential can reach several unrelated locations under friendly names, without granting access to a shared parent folder.
- They are an alternative to a single [home directory](./setting-up-user-home-dirs.md), configured per credential. The default is still a single home directory, and existing credentials are unaffected.

Introduction
-----

By default, each credential is bound to a single [home directory](./setting-up-user-home-dirs.md). This works well when everything a credential needs lives under one folder, but it forces you to choose a single point in your storage tree. To give a credential access to two unrelated folders, you would have to point its home directory at a common parent, exposing everything else beneath it.

Virtual folders solve this. Instead of one home directory, you define a set of folders that the credential sees after logging in, and you map each one to a real location in your storage. Each virtual folder has:

- A **path** — what the credential sees after logging in, for example `/invoices`.
- A **location** — the real folder in your storage that the path points to, for example `/finance/2026/invoices`.

The credential sees only the virtual folders you define and cannot navigate above them. Virtual folders work over SFTP, FTPS, and the web portal.

Configuring virtual folders
-----

When [creating or editing a credential](../getting-started/creating-and-modifying-users.md), choose virtual folders instead of a single home directory. For each virtual folder, set its **path** (the name the credential will see) and its **location** (the real folder in your storage). Add as many as you need.

The credential's permission (full access, read-only, write-only, and so on) applies to every virtual folder — there are no per-folder permissions.

Case 1 - Reaching unrelated locations
---------------------

An accounting partner needs the current invoices from your finance area and their own export folder from your analytics area. These live in completely different parts of your storage. With a single home directory you would have to expose a common parent. With virtual folders, you map exactly the two folders they need:

| Path | Location |
|------|----------|
| `/invoices` | `/finance/2026/invoices` |
| `/exports` | `/analytics/exports/acme` |

After logging in, the partner sees `/invoices` and `/exports` at the top level and nothing else. The rest of `/finance` and `/analytics` stays hidden.

Case 2 - Hiding deep or internal structure
---------------------

A machine integration only needs to drop files into one deeply nested folder. Rather than exposing the full path, give it a short, stable name:

| Path | Location |
|------|----------|
| `/upload` | `/warehouse/prod/customer-uploads/inbound` |

The integration writes to `/upload`, and you are free to reorganize the folders above `inbound` without changing the credential.

Case 3 - Grouping folders under friendly names
---------------------

A reporting credential needs read-only access to reports from two regions that are stored separately:

| Path | Location |
|------|----------|
| `/eu` | `/regions/eu-west-1/reports` |
| `/us` | `/regions/us-east-1/reports` |

Both virtual folders inherit the credential's read-only permission, so the credential can list and download reports from either region but cannot modify them.

Limitations
-----

- **Virtual folders cannot overlap.** One virtual folder's path cannot sit inside another's — you cannot have both `/reports` and `/reports/2026`. Paths that merely share a prefix are fine, such as `/reports` and `/reports-archive`.
- **Mapping the root.** If you map the root path `/`, it must be the only virtual folder.
- **One permission for all.** The credential's permission applies to every virtual folder. There are no per-folder permissions.
- **Maximum of 50.** A credential can have at most 50 virtual folders.
- **Not for the default credential.** The default credential of an organization cannot use virtual folders.
- **Absolute paths.** Both paths and locations must begin with `/`, and must not end with one — apart from the root `/` itself.

:::note
Virtual folders are an alternative to a single home directory. If you only need to bind a credential to one folder, see [setting up user home directories](./setting-up-user-home-dirs.md).
:::
