---
sidebar_label: 'Audit Logs'
title: 'Audit Logs'
sidebar_position: 40
---

SFTP To Go's audit logs keep track of all the activities happening in your storage. Every time a user logs in, uploads, downloads or deletes a file, or logs out (or fails to do any of these actions), an event is added to the audit log to take note of who did what, and when. Since there are multiple protocols and methods to connect to your SFTP To Go storage (SFTP, FTPS, web portal), the events may contain slightly different information for each protocol used. The audit logs can help you understand what happened to a certain file or what a certain user was up to.

:::info
Logs are retained for a certain period, depending on your organization's subscription plan.
:::

To inspect your audit logs, click your organization's [settings tab](../getting-started/organization-settings#audit-logs) and the click View audit logs to open the audit logs dialog. 

The logs are sorted in a descending order (latest activity to earliest activity), in your timezone. You can filter the logs by timestamp range, Username or session ID.

:::tip
Expand an event and click the Username or Session ID links to quickly filter for the same username or session ID.
:::

## Exporting Audit Logs {#export}

To export audit logs to your SFTP To Go storage, click your organization's [Settings tab](../getting-started/organization-settings#audit-logs), and scroll to Export Audit Logs. Choose the time range you want and click Export to CSV to generate the files. Note that the time range is based on your local time.

The audit data will be saved as CSV files under the /audit-logs folder in your storage, where you can access, download, or process them as needed. You will get an email notification when the process is complete. 

To automate exports and processing, use SFTP To Go’s APIs to trigger audit log exports programmatically. You can also set up a webhook to notify your system whenever a new file is uploaded to the /audit-logs/ folder, allowing you to kick off downstream processing or archiving workflows.

CSV file structure:

| Property	| Description|
|--|--|
|Id|	ID of the event|
|Timestamp (UTC) |	Time and date at which the event took place  (UTC)|
|Type|	Name of the specific event. e.g. `share-link.access-failed`, `share-link.access-expired`, `share-link.access-limit-reached`, `user.access-expired`, `user.login-failed`, `user.login`, `user.logout`, `user.password-updated`, `user.password-reset-email-sent`, `user.access-denied`, `file.created`, `file.deleted`, `file.downloaded`, `file.access-denied`, `audit-logs.streaming-destination.created`, `audit-logs.streaming-destination.updated`, `audit-logs.streaming-destination.deleted`, `audit-logs.streaming-destination.failed`, `webhook.delivery.failed`, `webhook.paused`, `automation.created`, `automation.updated`, `automation.deleted`, `automation.paused`, `automation.resumed`, `automation.execution.rerun`, `automation.action-executed`, `automation.execution.failed`|
|Principal ID|	ID of the principal responsible for the event|
|Principal Type|	Type of the principal responsible for the event. e.g. `user`, `share-link`, `admin`, `system`|
|Username|	Username of the principal responsible for the event|
|Session ID|	ID of the event session|
|IP Address|	IP address of the event actor|
|Location	| Details about the country and city of the event actor|
|Client |	Details about the application, operating system, vendor, and/or browser version of the event actor|
|Data	| JSON object of the event data|


If you need to inspect S3 access logs (for direct S3 access), please reach out to our support and we'll provide you with the logs you need. Note that webhooks trigger for activities performed by direct S3 requests as well.

## Automation events {#automations}

[Automations](../automation/automations) record both the changes admins make to them and the work they perform on your files.

Administrative events are attributed to the admin who made the change:

| Type | Description |
|--|--|
|`automation.created`| An automation was created |
|`automation.updated`| An automation was updated |
|`automation.deleted`| An automation was deleted |
|`automation.resumed`| An automation was resumed |
|`automation.execution.rerun`| An admin re-ran a past execution. The `Data` object's `Id` is the source execution and `NewExecutionId` is the execution the rerun created |

The remaining events are recorded by the system, so their principal type is `system` rather than the admin who created the automation:

| Type | Description |
|--|--|
|`automation.paused`| An automation was paused, either by an admin or automatically after consecutive failed executions. When paused automatically, the `Data` object includes a `Reason` of `consecutive-execution-failures` and the `ConsecutiveFailuresCount` |
|`automation.action-executed`| An automation moved, renamed or deleted a file or folder. The `Data` object's `Id` is the execution, plus the `AutomationId`, `ActionId`, `ActionType`, and the `SourcePath` and `DestinationPath` involved |
|`automation.execution.failed`| An automation execution failed. The `Data` object's `Id` is the execution, plus the `AutomationId`, the triggering `Path`, and the `Error` reported by the failing action |

:::note
Automations act on your files using SFTP To Go's own credentials, so the resulting `file.created` and `file.deleted` events are attributed to the `system` principal. Use the `automation.action-executed` event to trace a moved, renamed or deleted file back to the automation and execution responsible for it.
:::

## Streaming audit logs {#stream}

:::info
Streaming audit logs is only available with certain plans. Read more about our different plans [here](https://sftptogo.com/pricing).
:::

In addition to inspecting audit logs in the dashboard or exporting them to your storage, you can stream events in near real-time to a SIEM (Security Information and Event Management) or observability platform of your choice. This lets you correlate SFTP To Go activity with the rest of your security telemetry, set up alerts, and meet compliance requirements that mandate centralized log retention.

Each streamed event mirrors the structure of the [CSV export](#export) above and is delivered as it happens, so you can react to suspicious activity (e.g., failed logins, access from unexpected locations, mass downloads) without waiting for a scheduled export.

:::note
Unlike the CSV export — where `Data` is stringified to fit a CSV cell — the streaming payload keeps `Data` as a nested JSON object so your SIEM can index and search its fields directly.
:::

### Supported destinations

| Destination | Description |
|--|--|
| **Amazon EventBridge** | Stream events to an EventBridge event bus in your AWS account. From there you can fan out to Lambda, Kinesis Data Firehose, S3, CloudWatch, or any other EventBridge target. |
| **Datadog** | Stream events to Datadog Logs via the HTTP intake. Choose your Datadog site (US1, US3, US5, EU, GovCloud, AP1) when you configure the destination. |
| **Microsoft Sentinel** _(Beta)_ | Stream events to a Log Analytics workspace via the [Azure Monitor Logs Ingestion API](https://learn.microsoft.com/azure/azure-monitor/logs/logs-ingestion-api-overview). Azure public cloud only. |
| **Splunk Cloud** _(Beta)_ | Stream events to a Splunk HTTP Event Collector (HEC) endpoint. |
| **Sumo Logic** | Stream events to a Sumo Logic HTTP Logs source using the **Auth Header** flow. |
| **Webhook** | Stream events to a custom HTTPS endpoint as JSON. Useful for sending events to your own service, internal SIEM, or any platform that accepts authenticated webhook deliveries. |

### Add a streaming destination

1. Go to your organization's [**Settings** tab](../getting-started/organization-settings#audit-logs) and scroll to the **Stream audit logs** section.
2. Click **Add destination**.
3. Pick a destination type and click **Next**.
4. Enter a **Destination name** (used to identify the destination in the dashboard) and the provider-specific configuration:
   - **Amazon EventBridge** — provide the **AWS account ID** that owns the event bus, the **Region**, and the **Event bus name**. After you save the destination, SFTP To Go shows the **resource policy** you need to attach to your event bus's **Permissions** tab. See [Amazon EventBridge destination](#amazon-eventbridge-destination) below for details.
   - **Datadog** — pick your **Datadog site** and paste a Datadog **API key**. We probe the [Datadog validate endpoint](https://docs.datadoghq.com/api/latest/authentication/) to confirm the key is valid before we save the destination.
   - **Microsoft Sentinel** — provide your **Data collection endpoint URL**, **DCR immutable ID**, **Stream name**, **Tenant ID**, **Client ID**, and **Client secret**. We acquire an Azure AD access token and POST a validation event to the data collection rule to confirm everything is wired correctly before saving. See [Microsoft Sentinel destination](#microsoft-sentinel-destination) below for setup details.
   - **Splunk Cloud** — provide your **HEC endpoint** (must start with `https://`) and a **HEC token**. We probe the collector to confirm the token is accepted before we save the destination. See [Splunk Cloud destination](#splunk-cloud-destination) below for details.
   - **Sumo Logic** — provide your **HTTP source URL** (the unique URL Sumo Logic generates for the source) and the **Authentication token** from the source's **Auth Header** option. We probe the source to confirm the token is accepted before we save the destination. See [Sumo Logic destination](#sumo-logic-destination) below for details.
   - **Webhook** — provide an HTTPS **Endpoint** and the **Authorization header name** + **value** to authenticate the requests. See [Webhook destination](#webhook-destination) below for details.
5. Click **Add destination** to save.

If the credentials don't validate, the destination won't be saved and you'll see an error explaining what went wrong. The destination starts in the **Active** state, and you can pause or resume it any time from the actions menu.

### Manage destinations

You can configure multiple destinations and stream the same events to all of them. From the destinations table's actions menu (the **⋯** button on each row) you can:

- **Edit destination** — change the name, rotate credentials, or switch the state between **Active** and **Paused**.
- **Pause destination** — stop delivering new events to this destination without removing it. The action is only shown when the destination is **Active**.
- **Resume destination** — resume deliveries to a paused destination. The action is only shown when the destination is **Paused**.
- **Delete destination** — stop streaming and remove all related resources.

:::note
Pausing a destination stops the flow of new events but keeps the configuration around so you can resume it later without re-entering credentials.
:::

### Delivery health and failure alerts

Every destination is monitored for delivery failures. If new audit log events stop being accepted by the receiving endpoint — invalid credentials, a 4xx/5xx from the receiver, a missing EventBridge resource policy, etc. — SFTP To Go retries with exponential backoff up to a 24-hour window. If the retries are exhausted, the destination is marked as **Delivery failing**.

When a destination flips from healthy to failing:

- A **Delivery failing** badge appears next to the destination in the table. Hover the badge to see the error code, sanitized error message, and the time of the last failure.
- An **email alert is sent to all organization owners** whose Security email notifications are enabled (Account → Profile → Notifications → Security). Only owners receive it, and individual owners can opt out if they prefer to monitor the dashboard instead.
- An **audit log entry of type `audit-logs.streaming-destination.failed`** is recorded with the system principal. The event's data includes the destination ID, destination name, provider, error code, and error message — useful for compliance review or post-mortem.

The alert fires only once per healthy-to-failing transition, not on every retry, so a steady-state failure doesn't spam owners. To clear the alert, fix the underlying issue on the receiving side; once a delivery succeeds the badge stops updating, and a future transition will fire a fresh notification.

### Amazon EventBridge destination

An Amazon EventBridge destination delivers events to an event bus in your AWS account. SFTP To Go uses a shared service IAM role on our side, and authorization is granted by a **resource-based policy** that you attach to your event bus — no IAM role creation or trust policies needed on your end.

**Setup**

1. Pick or create the EventBridge bus that should receive events in your AWS account.
2. In SFTP To Go, start adding a destination of type **Amazon EventBridge** with your AWS **account ID**, the bus **region**, and the **event bus name** (leave blank for the `default` bus). As you fill the form, SFTP To Go renders a ready-to-paste **resource policy** prefilled with our service role ARN, your account ID, your region, and your bus name.
3. In the AWS console, open your event bus → **Permissions** tab → paste the policy.
4. Save the destination in SFTP To Go.

**What the policy grants**

The policy lets SFTP To Go's service role call `events:PutEvents` on your specific event bus, only when the call originates from our AWS account (`aws:SourceAccount` condition guards against confused-deputy attacks). It does not grant any other permissions.

**Event shape**

Each delivered event carries `detail-type: "Audit Log"`, and its `source` is `sftptogo`. The event detail mirrors the structure of the [CSV export](#export) above.

A delivered event looks like this on the bus:

```json
{
  "version": "0",
  "id": "9a1c8fcf-7a01-4c4d-b8aa-1bc8b3d2c3d1",
  "detail-type": "Audit Log",
  "source": "sftptogo",
  "account": "123456789012",
  "time": "2026-06-25T10:30:00Z",
  "region": "us-east-1",
  "resources": [],
  "detail": {
    "Id": "00000000-0000-0000-0000-000000000000",
    "Type": "user.login",
    "PrincipalId": "alice",
    "PrincipalType": "user",
    "UserName": "alice",
    "SessionId": "session-id",
    "OriginalIpAddress": "203.0.113.42",
    "Geo": "San Francisco, California, US",
    "UserAgent": "Chrome - macOS 14.5.0",
    "Timestamp": 1782556800000,
    "Data": { /* event-specific fields */ }
  }
}
```

**Writing EventBridge rules**

To target SFTP To Go audit log events, write a rule with this event pattern:

```json
{
  "source": ["sftptogo"],
  "detail-type": ["Audit Log"]
}
```

To narrow further by event type — for example, only failed logins and explicit access-denied events — match nested fields in `detail`:

```json
{
  "source": ["sftptogo"],
  "detail-type": ["Audit Log"],
  "detail": {
    "Type": ["user.login-failed", "user.access-denied"]
  }
}
```

Any field in the [delivered event detail](#amazon-eventbridge-destination) can be used in the event pattern. See [Amazon EventBridge event patterns](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-patterns.html) for the full filter syntax (prefix, anything-but, numeric matching, etc.).

**Validation**

We don't probe the event bus before saving the destination — there's no cross-account API to test the resource policy against. If the policy is missing or wrong, the destination's row in the dashboard shows a **Delivery failing** badge once the first event fails to deliver, with the underlying error code and message in the tooltip. The signal is updated as new failures occur, so once the policy is fixed and events start flowing again you can verify that the badge stops updating.

### Datadog destination

A Datadog destination delivers events to your Datadog org via the [Datadog Logs HTTP intake](https://docs.datadoghq.com/api/latest/logs/), authenticated with a Datadog **API key**. We probe the [Datadog validate endpoint](https://docs.datadoghq.com/api/latest/authentication/) with the key before we save the destination.

**Request shape**

`POST https://http-intake.logs.<your-site>/api/v2/logs`

```
Content-Type: application/json
DD-API-KEY: <your-API-key>
```

Each request body is one event wrapped in the Datadog ingest envelope:

```json
{
  "message": { /* the audit log event */ },
  "ddsource": "sftptogo",
  "service": "audit-logs",
  "ddtags": "org:<your-organization-id>"
}
```

In Datadog Logs Explorer you can filter on `source:sftptogo`, `service:audit-logs`, or `org:<id>`. The `message` field carries the audit log object whose shape mirrors the [CSV export](#export) above.

### Splunk Cloud destination

:::info
This destination is currently in **Beta**. The integration is functional but hasn't been validated end-to-end against a customer environment yet — please report any issues to support.
:::

A Splunk Cloud destination delivers events to a [Splunk HTTP Event Collector (HEC)](https://help.splunk.com/en/splunk-enterprise/leverage-rest-apis/rest-api-reference/10.4/input-endpoints/input-endpoint-descriptions) endpoint, authenticated with a HEC token.

**Request shape**

`POST <your-HEC-endpoint>/services/collector/event`

```
Content-Type: application/json
Authorization: Splunk <your-HEC-token>
```

Each request body is one event wrapped in the Splunk HEC envelope:

```json
{
  "event": { /* the audit log event */ },
  "source": "sftptogo",
  "time": 1716897600.5
}
```

The `time` field is the event's timestamp in Unix-seconds-with-fractional-milliseconds (`<sec>.<ms>`) — the default format Splunk HEC expects. Splunk indexes each event at this time, preserving sub-second precision.

### Sumo Logic destination

A Sumo Logic destination delivers events to a [Sumo Logic HTTP Logs source](https://www.sumologic.com/help/docs/send-data/hosted-collectors/http-source/logs-metrics/) using the **Auth Header** flow — the URL identifies the source, and the authentication token is sent as a separate header on every request. We probe the source with the token before we save the destination.

**Setup**

1. In Sumo Logic, create an **HTTP Logs and Metrics** source on a hosted collector.
2. Enable the **Auth Header** option on the source. Sumo Logic generates an authentication token; copy it.
3. Copy the source's **URL**.
4. In SFTP To Go, paste the **HTTP source URL** and the **Authentication token** into the Sumo Logic destination form.

**Request shape**

`POST <your-source-URL>`

```
Content-Type: application/json
X-Sumo-Token: <your-Auth-Header-token>
```

Each request body is one event wrapped in:

```json
{
  "message": { /* the audit log event */ },
  "source": "sftptogo",
  "service": "audit-logs",
  "host": "<your-organization-id>"
}
```

### Microsoft Sentinel destination

:::info
This destination is currently in **Beta**. The integration is functional but hasn't been validated end-to-end against a customer environment yet — please report any issues to support.
:::

A Microsoft Sentinel destination delivers events to a [Log Analytics workspace](https://learn.microsoft.com/azure/azure-monitor/logs/log-analytics-workspace-overview) via the [Azure Monitor Logs Ingestion API](https://learn.microsoft.com/azure/azure-monitor/logs/logs-ingestion-api-overview), authenticated with an OAuth 2.0 client credentials flow against Microsoft Entra ID. The events land in a [custom table](https://learn.microsoft.com/azure/azure-monitor/logs/create-custom-table) that you create in your workspace, where they're available to Microsoft Sentinel for queries, analytics rules, and workbooks.

:::info
SFTP To Go supports Azure public cloud only. Microsoft Azure operated by 21Vianet and Azure US Government clouds are not supported.
:::

**Setup**

You need to provision a few Azure resources before adding the destination in SFTP To Go. The steps below describe the minimum setup.

1. **Create a custom table in your Log Analytics workspace.** Open your workspace → **Tables** → **Create** → **New custom log (DCR-based)**. Use a table name ending in `_CL` (e.g., `SftptogoAuditLog_CL`). The Azure portal flow will guide you through creating a data collection rule (DCR) and a data collection endpoint (DCE) at the same time. When asked for sample data, paste a single event like:

   ```json
   [
     {
       "TimeGenerated": "2026-06-24T10:30:00.000Z",
       "Source": "sftptogo",
       "Service": "audit-logs",
       "EventType": "user.login",
       "OrganizationId": "00000000-0000-0000-0000-000000000000",
       "Data": {
         "Id": "00000000-0000-0000-0000-000000000000",
         "Type": "user.login",
         "PrincipalId": "user-id",
         "PrincipalType": "user",
         "Username": "alice",
         "SessionId": "session-id",
         "IpAddress": "203.0.113.42",
         "Timestamp": 1782556800000,
         "Data": {}
       }
     }
   ]
   ```

   This tells Sentinel the incoming stream has six columns: `TimeGenerated` (datetime), `Source` (string), `Service` (string), `EventType` (string), `OrganizationId` (string), and `Data` (dynamic). The first five are hoisted top-level so you can write KQL filters like `EventType == "user.login"` without descending into `Data`.

2. **Register a Microsoft Entra application.** In the Azure portal, go to **Microsoft Entra ID** → **App registrations** → **New registration**. Note down the **Application (client) ID** and the **Directory (tenant) ID** from the app's Overview page.

3. **Create a client secret.** On the app, open **Certificates & secrets** → **New client secret**. Copy the secret **Value** (not the Secret ID) — it's only shown once.

4. **Grant the app the `Monitoring Metrics Publisher` role on the DCR.** Open **Monitor** → **Data collection rules** → your DCR → **Access control (IAM)** → **Add role assignment** → **Monitoring Metrics Publisher** → assign to the Entra application from step 2.

5. **Collect the ingestion endpoint and DCR immutable ID.** Open your DCR → **JSON view** (set API version to the latest). Copy:
   - `properties.endpoints.logsIngestion` — this is the **Data collection endpoint URL** (looks like `https://<name>.<region>.ingest.monitor.azure.com`).
   - `properties.immutableId` — this is the **DCR immutable ID** (looks like `dcr-` followed by a 32-character hex string).

6. **Note the stream name.** On the DCR, open **Data sources** → look for the stream declaration (e.g., `Custom-SFTPToGoAuditLog`). This is the **Stream name**.

7. **In SFTP To Go**, paste all six values into the Microsoft Sentinel destination form.

**Request shape**

`POST {Data collection endpoint URL}/dataCollectionRules/{DCR immutable ID}/streams/{Stream name}?api-version=2023-01-01`

```
Content-Type: application/json
Authorization: Bearer <Azure AD access token>
```

Each request body is a single-element JSON array:

```json
[
  {
    "TimeGenerated": "2026-06-24T10:30:00.000Z",
    "Source": "sftptogo",
    "Service": "audit-logs",
    "EventType": "user.login",
    "OrganizationId": "<your-organization-id>",
    "Data": { /* the audit log event */ }
  }
]
```

The audit log object whose shape mirrors the [CSV export](#export) above is delivered under the `Data` column. `TimeGenerated` is the canonical timestamp column Sentinel uses for time-range filtering, while `Source`, `Service`, `EventType`, and `OrganizationId` are hoisted top-level so common KQL queries (e.g., `EventType == "user.login-failed"`) don't need to descend into the nested payload.

**Authentication**

SFTP To Go uses the OAuth 2.0 client credentials flow against Microsoft Entra ID:

`POST https://login.microsoftonline.com/{Tenant ID}/oauth2/v2.0/token`

```
Content-Type: application/x-www-form-urlencoded
```

```
grant_type=client_credentials
&client_id=<Client ID>
&client_secret=<Client secret>
&scope=https://monitor.azure.com/.default
```

Tokens are cached and refreshed automatically. The **Client secret** is stored in AWS Secrets Manager and never returned through the API or UI after it's saved.

**Validation**

Before saving the destination, we exchange your credentials for an access token and POST a single validation event to the DCR ingestion endpoint. If anything is misconfigured — Entra app credentials rejected, missing role assignment, wrong DCR ID, wrong stream name, or stream schema mismatch — the save is rejected with an error explaining what went wrong.

### Webhook destination

A Webhook destination sends events as authenticated HTTPS `POST` requests to an endpoint you control.

**Request shape**

`POST <your-endpoint>`

```
Content-Type: application/json
<your-Authorization-header-name>: <your-Authorization-header-value>
```

Each request body is one event wrapped in:

```json
{
  "Event": { /* the audit log event */ },
  "Source": "sftptogo",
  "Service": "audit-logs"
}
```

:::warning
Your endpoint must return a response within **5 seconds**. Requests that take longer are treated as failures and retried. Make sure your handler returns `2xx` immediately and processes the event asynchronously if needed.
:::

**Authentication**

You provide a header name and value that we attach to every request. The most common combinations:

- `Authorization` + `Bearer <token>` for OAuth/JWT-style bearer tokens
- `Authorization` + `Basic <base64>` for HTTP Basic auth
- `X-API-Key` + `<key>` for endpoints that expect an API-key header

The header value is stored in AWS Secrets Manager and never returned through the API or UI after it's saved.

**Validating the endpoint**

Before saving the destination, we send a ping `POST` to the endpoint using the configured authentication. The endpoint must respond with a `2xx` status code for the destination to be saved.

