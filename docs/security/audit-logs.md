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

<h2 id="export">Exporting Audit Logs</h2>

To export audit logs to your SFTP To Go storage, click your organization's [Settings tab](../getting-started/organization-settings#audit-logs), and scroll to Export Audit Logs. Choose the time range you want and click Export to CSV to generate the files. Note that the time range is based on your local time.

The audit data will be saved as CSV files under the /audit-logs folder in your storage, where you can access, download, or process them as needed. You will get an email notification when the process is complete. 

To automate exports and processing, use SFTP To Go’s APIs to trigger audit log exports programmatically. You can also set up a webhook to notify your system whenever a new file is uploaded to the /audit-logs/ folder, allowing you to kick off downstream processing or archiving workflows.

CSV file structure:

| Property	| Description|
|--|--|
|Id|	ID of the event|
|Timestamp (UTC) |	Time and date at which the event took place  (UTC)|
|Type|	Name of the specific event. e.g. `share-link.access-failed`, `share-link.access-expired`, `share-link.access-limit-reached`, `user.access-expired`, `user.login-failed`, `user.login`, `user.logout`, `user.password-updated`, `user.password-reset-email-sent`, `user.access-denied`, `file.created`, `file.deleted`, `file.downloaded`, `file.access-denied`|
|Principal ID|	ID of the principal responsible for the event|
|Principal Type|	Type of the principal responsible for the event. e.g. `user`, `share-link`, `admin`, `system`|
|Username|	Username of the principal responsible for the event|
|Session ID|	ID of the event session|
|IP Address|	IP address of the event actor|
|Location	| Details about the country and city of the event actor|
|Client |	Details about the application, operating system, vendor, and/or browser version of the event actor|
|Data	| JSON object of the event data|


If you need to inspect S3 access logs (for direct S3 access), please reach out to our support and we'll provide you with the logs you need. Note that webhooks trigger for activities performed by direct S3 requests as well.

<h2 id="stream">Streaming audit logs</h2>

:::info
Streaming audit logs is only available with certain plans. Read more about our different plans [here](https://sftptogo.com/pricing).
:::

In addition to inspecting audit logs in the dashboard or exporting them to your storage, you can stream events in near real-time to a SIEM (Security Information and Event Management) or observability platform of your choice. This lets you correlate SFTP To Go activity with the rest of your security telemetry, set up alerts, and meet compliance requirements that mandate centralized log retention.

Each streamed event mirrors the structure of the [CSV export](#export) above and is delivered as it happens, so you can react to suspicious activity (e.g., failed logins, access from unexpected locations, mass downloads) without waiting for a scheduled export.

### Supported destinations

| Destination | Description |
|--|--|
| **Amazon EventBridge** | Stream events to an EventBridge event bus in your AWS account. From there you can fan out to Lambda, Kinesis Data Firehose, S3, CloudWatch, or any other EventBridge target. |
| **Datadog** | Stream events to Datadog Logs via the HTTP intake. Choose your Datadog site (US1, US3, US5, EU, GovCloud, AP1) when you configure the destination. |
| **Splunk Cloud** | Stream events to a Splunk HTTP Event Collector (HEC) endpoint. |
| **Sumo Logic** | Stream events to a Sumo Logic HTTP Logs source using the **Auth Header** flow. |
| **Webhook** | Stream events to a custom HTTPS endpoint as JSON. Useful for sending events to your own service, internal SIEM, or any platform that accepts authenticated webhook deliveries. |

### Add a streaming destination

1. Go to your organization's [**Settings** tab](../getting-started/organization-settings#audit-logs) and scroll to the **Stream audit logs** section.
2. Click **Add destination**.
3. Pick a destination type and click **Next**.
4. Enter a **Destination name** (used to identify the destination in the dashboard) and the provider-specific configuration:
   - **Amazon EventBridge** — provide the **AWS account ID** that owns the event bus, the **Region**, and the **Event bus name**. After you save the destination, SFTP To Go shows the **resource policy** you need to attach to your event bus's **Permissions** tab. See [Amazon EventBridge destination](#amazon-eventbridge-destination) below for details.
   - **Datadog** — pick your **Datadog site** and paste a Datadog **API key**. We probe the [Datadog validate endpoint](https://docs.datadoghq.com/api/latest/authentication/) to confirm the key is valid before we save the destination.
   - **Splunk Cloud** — provide your **HEC endpoint** (must start with `https://`) and a **HEC token**. We probe the collector to confirm the token is accepted before we save the destination. See [Splunk Cloud destination](#splunk-cloud-destination) below for details.
   - **Sumo Logic** — provide your **HTTP source URL** (the unique URL Sumo Logic generates for the source) and the **Authentication token** from the source's **Auth Header** option. We probe the source to confirm the token is accepted before we save the destination. See [Sumo Logic destination](#sumo-logic-destination) below for details.
   - **Webhook** — provide an HTTPS **Endpoint** and the **Authorization header name** + **value** to authenticate the requests. See [Webhook destination](#webhook-destination) below for details.
5. Click **Add destination** to save.

If the credentials don't validate, the destination won't be saved and you'll see an error explaining what went wrong. The destination starts in the **Active** state, and you can pause or resume it from the **Edit destination** dialog.

### Manage destinations

You can configure multiple destinations and stream the same events to all of them. From the destinations table you can:

- **Edit destination** — change the name, rotate credentials, switch the state between **Active** and **Paused**.
- **Delete destination** — stop streaming and remove all related resources.

:::note
Pausing a destination stops the flow of new events but keeps the configuration around so you can resume it later without re-entering credentials.
:::

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

Each delivered event carries `detail-type: "Audit Log"`, and its `source` is `sftptogo`. Use these to write EventBridge rules that target audit log events. The event detail mirrors the structure of the [CSV export](#export) above.

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

A Splunk Cloud destination delivers events to a [Splunk HTTP Event Collector (HEC)](https://help.splunk.com/en/splunk-enterprise/leverage-rest-apis/rest-api-reference/10.4/input-endpoints/input-endpoint-descriptions) endpoint, authenticated with a HEC token.

**Request shape**

`POST <your-HEC-endpoint>/services/collector/raw`

```
Content-Type: application/json
Authorization: Splunk <your-HEC-token>
```

Each request body is one event wrapped in the Splunk HEC envelope:

```json
{
  "event": { /* the audit log event */ },
  "source": "sftptogo",
  "time": 1716897600000
}
```

:::warning
The `time` field is the event's `Timestamp` in **milliseconds since epoch**. Splunk HEC's default `time` parser expects seconds. Either configure your HEC token to accept milliseconds, or add a `SOURCETYPE`/props.conf rule that divides by 1000.
:::

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

