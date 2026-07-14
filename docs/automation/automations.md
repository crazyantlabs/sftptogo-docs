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
* `Trigger event` — the event that starts the automation:
  * `File created` — a file was uploaded or a folder was created.
  * `File downloaded` — a file was downloaded.
  * `File deleted` — a file or folder was deleted.
* `Filter` (optional) — only run the automation when the triggering event matches your rules. Filter on the file `Path`, the `Actor ID`, or the `Actor Type`, using operators such as `Starts with`, `Ends with`, `Contains` or `Matches` — for example, only files whose path starts with `/incoming/`, or only files ending with `.csv`.
* `Actions` — the actions to run, in order. An automation can have up to 5 actions.

Click **Save** to create the automation. It starts running on matching events immediately, unless you create it paused.

## Actions

| Action | Description | Available for |
|--|--|--|
| Copy file or folder | Copies the file to a destination path, leaving the original in place | File created, File downloaded |
| Move file or folder | Copies the file to a destination path and deletes the original | File created, File downloaded |
| Rename file or folder | Renames the file in place. The new name must not contain `/` | File created, File downloaded |
| Delete file or folder | Deletes the file | File created, File downloaded |
| Send webhook request | Sends an HTTP POST request describing the trigger to an endpoint you choose | File created, File downloaded, File deleted |
| Send Slack message | Posts a message describing the trigger to a Slack incoming webhook | File created, File downloaded, File deleted |
| Send Microsoft Teams message | Posts a message describing the trigger to a Microsoft Teams incoming webhook | File created, File downloaded, File deleted |
| Send email | Emails a notification describing the trigger to an address you choose | File created, File downloaded, File deleted |

Actions run one after another. By default, if an action fails the automation stops and the remaining actions don't run. Enable **Continue to next action on failure** on an action to let the automation carry on regardless.

The file actions (copy, move, rename, delete) after the first can operate either on the file that triggered the automation, or on the file produced by the previous action — useful for chaining, for example copying a file and then renaming the copy. The notification actions (webhook, Slack, Microsoft Teams and email) always describe the file that triggered the automation.

### Send webhook request

The webhook action sends an HTTP POST request with a JSON body describing the trigger.

* `Endpoint URL` — must be a public HTTPS URL. Private, loopback and link-local addresses are rejected, as are URLs containing credentials. Variables are supported in the path and query string, but not in the host name.
* `Authorization header` (optional) — sent as the `Authorization` header value with the request.
* `API version` — the API version that determines the request payload format sent to your endpoint. New automations use the latest version; change it only to adopt a newer format for an existing automation.

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
    "ApiVersion": "2020-01-01",
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

Automations record what they do to your files. Because automations act using SFTP To Go's own credentials, the `file.created` and `file.deleted` events they generate are attributed to the `system` principal. To trace a moved, renamed or deleted file back to the automation responsible, use the `automation.action.executed` event.

See [Automation events](../security/audit-logs#automations) for the full list.
