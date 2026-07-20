---
sidebar_label: 'Automations'
title: 'Automating file workflows'
sidebar_position: 1
---

Automations run a sequence of actions on your files whenever something happens in your storage. Use them to sort uploads into dated folders, archive downloads, clean up temporary files, or notify another system — without running any infrastructure of your own.

:::info
Automations are only available with certain plans. Read more about our different plans [here](https://sftptogo.com/pricing)
:::

An automation has three parts:

* A **trigger** — the event that starts it.
* An optional **filter** — narrows the trigger to the files you care about.
* One or more **actions** — the work to perform, run in order.

## Creating an automation

To create an automation, click **Automations** from the menu, and then click **Add automation**.

In the dialog that opens, fill out the following:

* `Name` (optional) — a descriptive name for your automation. Limited to 80 characters.
* `Trigger events` — one or more events that start the automation. The automation runs whenever any of the selected events occurs:
  * `File created` — a file or folder was created by any means (SFTP/FTPS, the web portal, or the S3 API).
  * `File downloaded` — a file was downloaded.
  * `File deleted` — a file or folder was deleted.
* `Filter` (optional) — only run the automation when the triggering event matches your rules. Filter on the file `Path`, the `Actor ID`, or the `Actor Type`, using operators such as `Starts with`, `Ends with`, `Contains` or `Matches` — for example, only files whose path starts with `/incoming/`, or only files ending with `.csv`.
* `Actions` — the actions to run, in order. An automation can have up to 5 actions.

Click **Save** to create the automation. It starts running on matching events immediately, unless you create it paused.

:::note
Automations don't trigger on **system-generated actions**. In particular, a file created, moved, renamed, or deleted by another automation won't start a new automation — this prevents automations from triggering each other in a loop. To run several steps on the same file, add them as multiple actions in a single automation (later file actions can operate on the file produced by the previous one).
:::

## Actions

| Action | Description | Available for |
|--|--|--|
| Copy file or folder | Copies the file to a destination path, leaving the original in place | File created, File downloaded |
| Move file or folder | Copies the file to a destination path and deletes the original | File created, File downloaded |
| Rename file or folder | Renames the file in place. The new name must not contain `/` | File created, File downloaded |
| Delete file or folder | Deletes the file | File created, File downloaded |
| PGP encrypt file | Encrypts the file to a PGP key's public key | File created, File downloaded |
| PGP decrypt file | Decrypts a PGP-encrypted file with a private key | File created, File downloaded |
| Send webhook request | Sends an HTTP POST request describing the trigger to an endpoint you choose | File created, File downloaded, File deleted |
| Send Slack message | Posts a message describing the trigger to a Slack incoming webhook | File created, File downloaded, File deleted |
| Send Microsoft Teams message | Posts a message describing the trigger to a Microsoft Teams incoming webhook | File created, File downloaded, File deleted |
| Send email | Emails a notification describing the trigger to an address you choose | File created, File downloaded, File deleted |

Actions run one after another. By default, if an action fails the automation stops and the remaining actions don't run. Enable **Allow failure** on an action to let the automation continue to the next action instead of stopping if that action fails.

The file actions (copy, move, rename, delete) after the first **default to operating on the file produced by the previous action** — the intuitive chaining flow, for example copying a file and then renaming the copy — but you can switch a step back to the file that triggered the automation.

The notification actions (webhook, Slack, Microsoft Teams and email) after the first **default to describing the previous action's result**, but can be switched to the **triggering event**. This lets you announce what a step did — for example, encrypt a file and then notify about the encrypted file, or delete a file and notify that it was removed. When set to the previous action, the notification is sent in the same format as any other file event: a **`file.created`** event for the file the step produced (copy, move, rename, PGP encrypt/decrypt), or a **`file.deleted`** event for the file a delete removed.

By default, the file-writing actions (copy, move, rename, and PGP encrypt/decrypt) **overwrite** any file already at the destination. Turn off **Overwrite existing files** on an action to have it fail instead when the destination file already exists. This applies to single files only — folder operations always overwrite.

### PGP encrypt and decrypt

The PGP actions encrypt or decrypt a single file using a key from your [encryption keys](../security/encryption-keys) (**Settings → Security → Encryption keys**). The key is referenced by selection — no key material is stored on the automation.

* `PGP key` — the key to use. For **PGP encrypt**, pick a key that can encrypt (any public or private key). For **PGP decrypt**, pick the private key the file was encrypted to — a file can only be decrypted with a private key it was encrypted to (you must be one of its recipients). The **+ New key** option lets you import a key without leaving the builder.
* `Destination path` (optional) — where to write the result. By default, **encrypt** appends a `.pgp` extension to the source path, and **decrypt** removes a trailing `.pgp`, `.gpg` or `.asc` extension. To keep that default name but write it somewhere else, give a **folder** (e.g. `/decrypted/`) — the file keeps the extension-stripped name. For a custom name, give a full path; `{{file.basename}}` is the source name without its last extension, so `/decrypted/{{file.basename}}` also drops the `.pgp`.
* `ASCII-armored output` (**encrypt** only) — on by default, producing text output that is safe to paste or email. Turn it off for binary output, which is about a third smaller and is what some partners require. **Decrypt** detects either format automatically, so you never have to tell it which one a file uses.

The original file is left in place — chain a **Move** or **Delete** action after the PGP action if you want to replace it. Like the other file actions, a PGP action after the first can operate on the file produced by the previous action, so you can, for example, encrypt a file and then move the encrypted copy.

:::note
PGP actions operate on a single file (not a folder) and support files up to 100 MB. Decryption of a file that is both signed and encrypted is supported — the file is decrypted normally; the signature is not verified.
:::

### Send webhook request

The webhook action sends an HTTP POST request with a JSON body describing the trigger.

* `Endpoint URL` — must be a public HTTPS URL. Private, loopback and link-local addresses are rejected, as are URLs containing credentials. Variables are supported in the path and query string, but not in the host name.
* `Authorization header` (optional) — sent as the `Authorization` header value with the request.
* `API version` — determines the format of the request payload sent to your endpoint. New automations use the latest version. See [API versions](#api-versions) below.

:::note
For security, the authorization header is never shown again after you save it. Leave the field blank when editing to keep the stored value, type a new value to replace it, or clear the field to remove it. Duplicating an automation does not copy its authorization header.
:::

#### Request body

The request body is a JSON object describing the triggering event, with a `Metadata` object identifying the automation, execution, action and attempt:

```json
{
  "Id": "b2c3…",
  "Topic": "file.created",
  "Resource": "File",
  "PreviousData": null,
  "Data": { "Path": "/uploads/report.pdf", "Size": 1048576 },
  "Actor": { "Id": "…", "Type": "User" },
  "CreatedAt": 1783695150000,
  "UpdatedAt": 1783695150000,
  "Metadata": {
    "ApiVersion": "2026-07-01.atlas",
    "Organization": { "Id": "…" },
    "Automation": { "Id": "…" },
    "Execution": { "Id": "…" },
    "Action": { "Id": "…" },
    "Attempt": { "Id": "…", "Count": 0 },
    "Event": { "Id": "b2c3…", "Topic": "file.created" },
    "IdempotencyKey": "…"
  }
}
```

`Metadata.ApiVersion` identifies the payload format, so you can branch on it if the format ever changes. It matches the **API version** selected on the action.

#### API versions

The API version pins the payload contract, so an existing automation keeps working even after a newer format ships. The versions differ only in how the file path in `Data.Path` is encoded:

* `2026-07-01.atlas` — **latest**, and the default for new automations. `Data.Path` is the **decoded** path — spaces and other special characters appear as-is (e.g. `/uploads/my report.pdf`).
* `2020-01-01` — `Data.Path` is the raw, **URL-encoded** S3 object key, matching [webhook notifications](./using-webhook-notifications-to-trigger-processes) (e.g. `/uploads/my+report.pdf`, where a space is `+`). Use this if your endpoint already handles that format.

A newer version becomes the default for automations created after it ships; existing automations stay on the version they were created with until you change it.

#### Verifying the signature

Each automation has a signing secret, shown once when the automation is created and whenever you rotate it. Every webhook request is signed with it, so you can confirm a request genuinely came from SFTP To Go and was not tampered with.

The signature is sent in the `X-Hub-Signature` header as `sha256=<hmac>`, the HMAC-SHA256 of the exact request body computed with your signing secret. To verify a request:

1. Store the signing secret securely on your server. **Never** hardcode it or log it.
2. Compute the HMAC-SHA256 of the raw request body using the secret.
3. Compare it to the `X-Hub-Signature` header using a constant-time comparison to avoid timing attacks.

To check your implementation, this secret and body should produce this exact signature:

```
secret: your-signing-secret
body:   {"hello":"world"}
X-Hub-Signature: sha256=3cbbff88ab4a82398a21ab3e2934ee47e53c3a5ba0609866587a80feddb7f755
```

Rotating the secret invalidates the old one: requests are immediately signed with the new secret. To rotate, open the automation's actions menu and click **Rotate signing secret**.

#### Request headers and retries

Requests are retried when the endpoint times out, refuses the connection, or answers `429` or a `5xx` status. Delivery is therefore **at least once**: your endpoint may receive the same request more than once, and it must be safe to process a repeat.

Every request carries these headers:

| Header | Description |
|--|--|
|`X-Idempotency-Key`| Identifies the unit of work. Stable across every retry of the same action, and different for every automation run. Deduplicate on this |
|`X-Automation-Id`| The automation that sent the request |
|`X-Automation-Execution-Id`| The execution that sent the request |
|`X-Automation-Action-Id`| The action within that execution |
|`X-Automation-Attempt`| `0` on the first attempt, then `1`, `2`, … on each retry |
|`X-Hub-Signature`| `sha256=<hmac>` signature of the request body — see [Verifying the signature](#verifying-the-signature) |

The same values are also available in the `Metadata` object of the request body.

To handle retries safely, record the `X-Idempotency-Key` of each request you process and ignore a request whose key you have already seen. An `X-Automation-Attempt` greater than `0` tells you the request is a redelivery.

### Send Slack message

Posts a formatted message describing the triggering event to Slack.

* `Incoming webhook URL` — the Slack [incoming webhook](https://api.slack.com/messaging/webhooks) URL to post to. Must be a public HTTPS URL. The message is delivered to whichever channel the incoming webhook is configured for.

### Send Microsoft Teams message

Posts a formatted message describing the triggering event to Microsoft Teams.

* `Incoming webhook URL` — the Microsoft Teams [incoming webhook](https://learn.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook) URL to post to. Must be a public HTTPS URL. The message is delivered to whichever channel the incoming webhook is configured for.

### Send email

Emails a notification describing the triggering event.

* `Recipient email` — the address to send the notification to.

## Variables

Destination paths, new names and webhook endpoint URLs can include variables, which are replaced with values from the triggering event when the automation runs.

| Variable | Description | Example |
|--|--|--|
|`{{file.name}}`| Full file or folder name | `report.pdf` |
|`{{file.basename}}`| Name without extension | `report` |
|`{{file.extension}}`| File extension, without the dot | `pdf` |
|`{{file.path}}`| Full path of the file | `/uploads/report.pdf` |
|`{{file.parent_folder}}`| Parent folder path | `/uploads` |
|`{{file.size}}`| File size in bytes | `1048576` |
|`{{actor.id}}`| ID of the user or system that triggered the event | |
|`{{actor.type}}`| Type of the actor | `User` |
|`{{date.year}}`| Year the automation ran (UTC) | `2026` |
|`{{date.month}}`| Month, zero padded (UTC) | `07` |
|`{{date.day}}`| Day of month, zero padded (UTC) | `10` |
|`{{date.hour}}`| Hour, zero padded (UTC) | `14` |
|`{{date.minute}}`| Minute, zero padded (UTC) | `52` |
|`{{date.second}}`| Second, zero padded (UTC) | `30` |
|`{{date.iso}}`| Full ISO 8601 timestamp (UTC) | `2026-07-10T14:52:30.000Z` |
|`{{date.epoch}}`| Unix timestamp in seconds | `1783695150` |
|`{{uuid}}`| A newly generated unique identifier | |

For example, a `Move file or folder` action with a destination of `/archive/{{date.year}}/{{date.month}}/` files every upload into a folder for the current month.

:::warning
A variable that doesn't match any of the names above is not replaced, and the action fails rather than creating a file with a literal `{{...}}` in its name.
:::

## Execution history

Every run of an automation is recorded as an execution, showing whether it succeeded and the state and result of each individual action, including the error reported by any action that failed. Executions are retained for 30 days.

To view an automation's executions, open its actions menu and click **View executions**.

### Running an automation manually

Open an automation's actions menu and click **Run now** to run it on demand against a file you choose, without waiting for a matching event — useful for testing an automation or reprocessing a specific file. Enter the file path, pick the trigger event to record on the run, and click **Run now**.

A manual run ignores the automation's filter and runs its real actions, so it may change files in your storage. It runs even when the automation is paused or disabled, which lets you test a fix before resuming. Manual runs are shown with a **Run now** marker in the execution history and recorded in your [audit logs](../security/audit-logs#automations) as `automation.execution.manual-run`.

### Rerunning an execution

Expand an execution and click **Rerun** to run the automation again against the same trigger that started it.

:::warning
A rerun runs the automation's real actions again. It may fail if the file the original run acted on no longer exists, or if its current state differs from the original trigger — for example, if a previous run already moved or deleted it. Reruns are recorded in your [audit logs](../security/audit-logs#automations) as `automation.execution.rerun`.
:::

## Loop prevention

Actions that write to your storage — copy, move and rename — generate `file.created` events of their own. These events do **not** trigger automations, so an automation that copies a file into a folder it also watches will not run forever.

## When an automation fails

If an automation fails 5 times in a row, SFTP To Go pauses it automatically and emails your organization's owners. This prevents a misconfigured automation — a destination that no longer resolves, or an endpoint that rejects every request — from failing on every file indefinitely.

Review the execution history to find the failing action, correct the automation, and click **Resume** to start it again.

A webhook action whose endpoint is temporarily unavailable — timing out, or answering `429` or `5xx` — is retried a few times with an increasing delay before the execution is marked as failed, so a brief outage on the receiving side won't pause your automation.

## Auditing

Automations record what they do. Because automations act using SFTP To Go's own credentials, the `file.created` and `file.deleted` events they generate are attributed to the `system` principal. Every action an automation runs — file operations and notifications alike — also records an `automation.action.executed` event, which traces the change back to the automation and execution responsible for it.

See [Automation events](../security/audit-logs#automations) for the full list.
