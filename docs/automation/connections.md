---
sidebar_label: 'Connections'
title: 'Connecting to remote servers and storage'
sidebar_position: 2
---

Connections are the servers and storage your [automations](./automations) can copy files to and from — a partner's SFTP server, a bucket in your own cloud account, a WebDAV server. Set one up once under **Settings → Connections**, test it there, and reference it from automation actions by name. The credentials are entered once and never have to be put into an automation.

:::info
Connections are only available with certain plans. Read more about our different plans [here](https://sftptogo.com/pricing)
:::

How many connections you can have is set by your plan. The **Connections** section shows how many you have used out of that allowance.

## Supported types

* **SFTP** — an SFTP server, reached over SSH, with a password or a private key.
* **FTPS** — an FTP server over TLS, explicit or implicit. Plain FTP is not supported.
* **S3-compatible storage** — Amazon S3, or any service that speaks the S3 API: MinIO, Wasabi, Backblaze B2, Cloudflare R2, DigitalOcean Spaces and others. Amazon S3 can also be reached with a role in your own AWS account instead of an access key.
* **WebDAV** — Nextcloud, ownCloud, or any WebDAV server.

## Adding a connection

Under **Settings → Connections**, click **Add connection**, and provide:

* `Name` — a label to recognize the connection by, such as the partner or system it reaches.
* `Type` — one of the types above. It can't be changed once the connection is saved, because every automation using the connection would silently start pointing somewhere else; add a new connection instead.
* The server or storage details and credentials for that type — see below.
* `Folder` (optional) — a folder on the remote that this connection is limited to. Everything an automation does through the connection stays inside it, so a connection scoped to `/incoming` can't reach `/` even if an action asks to. Leave it blank to allow the whole account or bucket.

Click **Test connection** to check the details before saving — see [Testing a connection](#testing-a-connection) — then click **Add connection**.

### SFTP

* `Host` and `Port` — the server's address, and its port if it isn't the standard `22`.
* `Username` — the account to sign in as.
* `Authentication` — **Password**, or **Private key**. For a key, paste the private key (OpenSSH or PEM format) and, if it has one, its `Passphrase`.

The first time a test succeeds, the server's host key is shown and is pinned when you save. See [Host keys](#host-keys) for what happens if it changes.

### FTPS

* `Host` and `Port` — the server's address, and its port if it isn't the standard `21`.
* `Username` and `Password`.
* `TLS` — **Explicit** (the common one, where the connection is upgraded with `AUTH TLS`) or **Implicit** (TLS from the first byte, usually on port `990`).

The server's certificate is always verified. A server with a self-signed or expired certificate can't be connected to.

### S3-compatible storage

* `Bucket` — the bucket name.
* `Region` (optional) — for Amazon S3, leave it blank and it is found for you when you test. Other providers name their regions their own way — Cloudflare R2 uses `auto`, Backblaze B2 uses names like `us-west-004` — so enter whatever your provider specifies.
* `Endpoint` (optional) — leave it blank for Amazon S3. For any other provider, its service URL, such as `https://s3.wasabisys.com` or `https://s3.us-west-004.backblazeb2.com`.
* `Authentication` — **Access key** (an access key ID and secret access key for the bucket), or, for Amazon S3 only, **Role in your AWS account**.

#### Using a role instead of an access key

With a role, nothing secret is stored: you create a role in your own AWS account that trusts SFTP To Go, and you can revoke that trust at any time from your account. Access appears in your own CloudTrail under the role. This is the option to prefer for Amazon S3.

1. Choose **Role in your AWS account**. Two policies appear below, filled in for your organization.
2. In the AWS console, create an IAM role. Choose **AWS account** as the trusted entity, then **Another AWS account**, and enter the account ID shown in the trust policy. Tick **Require external ID** and enter the external ID from the trust policy exactly — it is specific to your organization and never changes.
3. Attach the **permissions policy** shown to the role. It is scoped to the bucket you entered above; enter the bucket first so the policy is filled in.
4. If the bucket is encrypted with a KMS key of your own, allow the role in the key's policy as well — a bucket policy alone isn't enough, and this is the most common cause of an "access denied" result from a role that is otherwise set up correctly.
5. Paste the role's ARN into `Role ARN`, and click **Test connection**.

Role-based access is available for Amazon S3 only; other S3-compatible providers don't support it, so the option is disabled once an endpoint is entered.

### WebDAV

* `URL` — the WebDAV address, for example `https://cloud.example.com/remote.php/dav/files/you` for Nextcloud.
* `Server` — **Nextcloud**, **ownCloud**, or **Other** for any other WebDAV server.
* `Username` and `Password`.

:::note
A Nextcloud or ownCloud account with two-factor authentication needs an **app password** here, created under the account's security settings, rather than the account password.
:::

SharePoint is not supported through WebDAV.

## Testing a connection

**Test connection** connects to the server or storage, signs in with the details in the form, and lists the folder. It shows the first few entries it finds, so you can see it reached the right place, or says what went wrong — the credentials were rejected, the host couldn't be reached, the certificate couldn't be verified, the bucket or folder doesn't exist, or the role couldn't be assumed.

Nothing is saved by a test. When editing a saved connection, a test uses the stored credentials for anything you haven't retyped, so you can check a connection without re-entering its password.

## Host keys

An SFTP server identifies itself with a host key. When a test of a new connection succeeds, the server's host key fingerprint is shown, and it is pinned when you save: from then on the connection only talks to a server presenting that key.

If the key ever changes, a test fails and shows both fingerprints — the one pinned, and the one the server now presents. A changed host key is what a server that has been rebuilt looks like, but it is also what someone intercepting the connection looks like, so check with whoever runs the server that the key really changed before trusting it. When you're sure, click **Trust the new host key** and save. The new fingerprint is pinned, and nothing else.

## Enabling, disabling and deleting

Use the menu next to a connection to:

* **Edit** — change its details or credentials. A credential left blank keeps what is stored.
* **Disable** — stop every automation that uses the connection, without deleting it. Actions using a disabled connection fail until it is enabled again.
* **Delete** — remove the connection. Any automation action that references it will fail when it next runs, so update those actions first.

A connection is also disabled automatically after ten consecutive failures that are down to the connection itself — rejected credentials, an unreachable host, a changed host key — rather than to a particular file. The list shows it as **Failing** with the reason, and as **Disabled**. Fix the cause, test, and enable it again.

## Security

* Credentials are held in a dedicated secrets store, **encrypted at rest** and kept **separately from your automations** — an automation references a connection, it never carries the credentials.
* Neither a password, a private key, nor an access key is **ever shown again** after it is saved, or included in any API response — only whether one is stored.
* A connection that uses a role in your AWS account stores nothing secret at all.
* Connections can only reach public addresses. A server or endpoint on a private network can't be connected to.
* If the server only accepts connections from known addresses, allow ours: connections are made from [the same addresses](./automations#allowing-our-ip-addresses) the notification actions send from.
* Adding, editing, deleting and testing a connection are recorded in your [audit logs](../security/audit-logs), as is a connection being disabled automatically. Credentials are never logged.
