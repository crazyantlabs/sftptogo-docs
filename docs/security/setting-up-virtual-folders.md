---
sidebar_label: 'Setting up virtual folders'
title: 'Setting up virtual folders'
sidebar_position: 16
---
TL;DR - what are virtual folders?
------

- Virtual folders give users and client applications a uniform view of your storage, no matter how it is actually organized: you choose the folder names credentials see and map each one to a real location.
- One set of credentials can reach several unrelated locations under friendly names, without granting access to a shared parent folder.
- The view stays stable: you can reorganize your storage and repoint a virtual folder without the connecting user or integration noticing.
- They are an alternative to a single [home directory](./setting-up-user-home-dirs.md), configured per set of credentials. The default is still a single home directory, and existing credentials are unaffected.

Introduction
-----

By default, credentials are bound to a single [home directory](./setting-up-user-home-dirs.md). This works well when everything credentials need lives under one folder, but it forces you to choose a single point in your storage tree. To give credentials access to two unrelated folders, you would have to point their home directory at a common parent, exposing everything else beneath it.

Virtual folders solve this. Instead of one home directory, you define a set of folders that the credentials see after logging in, and you map each one to a real location in your storage. Each virtual folder has:

- A **folder** — the name the credentials see after logging in, for example `/invoices`.
- A **path** — the real location in your storage that the folder points to, for example `/finance/2026/invoices`.
- Its own **permissions** — read-only, read and write, write-only, and so on.

The credentials see only the virtual folders you define and cannot navigate above them. Virtual folders work over SFTP, FTPS, and the web portal.

Because the credentials only ever see the paths you choose, their view of your storage is uniform and stable: a client application that writes to `/upload` keeps working even if you later move the real folder — repoint the virtual folder and nothing changes on the client's side.

Configuring virtual folders
-----

When [creating or editing credentials](../getting-started/creating-and-modifying-users.md), choose **Use virtual folders** instead of the single home directory. For each virtual folder, set its **folder** (the name the credentials will see), its **path** (the real location in your storage) and its **permissions**. Click **Add folder** to add as many as you need.

Each virtual folder carries its own permissions, chosen when you map it. When credentials use virtual folders there is no credentials-level permission — access is defined entirely by the folders. Choosing **None** for a folder suspends access to it without removing it from the mapping.

Case 1 - Reaching unrelated locations
---------------------

An accounting partner needs the current invoices from your finance area and their own export folder from your analytics area. These live in completely different parts of your storage. With a single home directory you would have to expose a common parent. With virtual folders, you map exactly the two folders they need:

| Folder | Path |
|--------|------|
| `/invoices` | `/finance/2026/invoices` |
| `/exports` | `/analytics/exports/acme` |

After logging in, the partner sees `/invoices` and `/exports` at the top level and nothing else. The rest of `/finance` and `/analytics` stays hidden.

Case 2 - Hiding deep or internal structure
---------------------

A machine integration only needs to drop files into one deeply nested folder. Rather than exposing the full path, give it a short, stable name:

| Folder | Path |
|--------|------|
| `/upload` | `/warehouse/prod/customer-uploads/inbound` |

The integration writes to `/upload`, and you are free to reorganize the folders above `inbound` without changing the credentials.

Case 3 - Grouping folders under friendly names
---------------------

Reporting credentials need read-only access to reports from two regions that are stored separately:

| Folder | Path | Permissions |
|--------|------|-------------|
| `/eu` | `/regions/eu-west-1/reports` | Read-only |
| `/us` | `/regions/us-east-1/reports` | Read-only |

Both virtual folders are mapped with read-only permissions, so the credentials can list and download reports from either region but cannot modify them.

Limitations
-----

- **Virtual folders cannot overlap.** One folder cannot sit inside another — you cannot have both `/reports` and `/reports/2026`. Folders that merely share a prefix are fine, such as `/reports` and `/reports-archive`.
- **Mapping the root.** If you map the root folder `/`, it must be the only virtual folder.
- **Maximum of 50.** Credentials can have at most 50 virtual folders.
- **Not for the default credentials.** An organization's default credentials cannot use virtual folders.
- **Absolute paths.** Both folders and paths must begin with `/`, and must not end with one — apart from the root `/` itself.

:::note
Virtual folders are an alternative to a single home directory. If you only need to bind credentials to one folder, see [setting up user home directories](./setting-up-user-home-dirs.md).
:::
