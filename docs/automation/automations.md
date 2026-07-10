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

Actions run one after another. By default, if an action fails the automation stops and the remaining actions don't run. Enable **Continue to next action on failure** on an action to let the automation carry on regardless.

Each action after the first can operate either on the file that triggered the automation, or on the file produced by the previous action — useful for chaining, for example copying a file and then renaming the copy.

### Send webhook request

The webhook action sends an HTTP POST request with a JSON body describing the trigger.

* `Endpoint URL` — must be a public HTTPS URL. Private, loopback and link-local addresses are rejected, as are URLs containing credentials. Variables are supported in the path and query string, but not in the host name.
* `Authorization header` (optional) — sent as the `Authorization` header value with the request.

:::note
For security, the authorization header is never shown again after you save it. Leave the field blank when editing to keep the stored value, type a new value to replace it, or clear the field to remove it. Duplicating an automation does not copy its authorization header.
:::

If you want to receive a notification for an event rather than act on the file, consider a [webhook notification](./using-webhook-notifications-to-trigger-processes) instead — it signs each request with a shared secret.

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

The same values are repeated in a `Metadata` object in the request body, alongside the `trigger`.

To handle retries safely, record the `X-Idempotency-Key` of each request you process and ignore a request whose key you have already seen. An `X-Automation-Attempt` greater than `0` tells you the request is a redelivery.

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

## Testing an automation

Click **Test** on an automation to run it once against a path you choose.

:::warning
A test runs the automation's real actions against your real files. A test of an automation with a delete or move action will delete or move the file at the path you provide. Tests are recorded in your [audit logs](../security/audit-logs#automations) as `automation.tested`.
:::

## Execution history

Every run of an automation is recorded as an execution, showing whether it succeeded and the result of each individual action, including the error reported by any action that failed. Executions are retained for 30 days.

## Loop prevention

Actions that write to your storage — copy, move and rename — generate `file.created` events of their own. These events do **not** trigger automations, so an automation that copies a file into a folder it also watches will not run forever.

## When an automation fails

If an automation fails 5 times in a row, SFTP To Go pauses it automatically and emails your organization's owners. This prevents a misconfigured automation — a destination that no longer resolves, or an endpoint that rejects every request — from failing on every file indefinitely.

Review the execution history to find the failing action, correct the automation, and click **Resume** to start it again.

A webhook action whose endpoint is temporarily unavailable — timing out, or answering `429` or `5xx` — is retried a few times with an increasing delay before the execution is marked as failed, so a brief outage on the receiving side won't pause your automation.

## Auditing

Automations record what they do to your files. Because automations act using SFTP To Go's own credentials, the `file.created` and `file.deleted` events they generate are attributed to the `system` principal. To trace a moved, renamed or deleted file back to the automation responsible, use the `automation.action-executed` event.

See [Automation events](../security/audit-logs#automations) for the full list.
