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
|Type|	Name of the specific event — see [Event types](#event-types) below|
|Principal ID|	ID of the principal responsible for the event|
|Principal Type|	Type of the principal responsible for the event. e.g. `user`, `share-link`, `admin`, `system`|
|Username|	Username of the principal responsible for the event|
|Session ID|	ID of the event session|
|IP Address|	IP address of the event actor|
|Location	| Details about the country and city of the event actor|
|Client |	Details about the application, operating system, vendor, and/or browser version of the event actor|
|Data	| JSON object of the event data|


If you need to inspect S3 access logs (for direct S3 access), please reach out to our support and we'll provide you with the logs you need. Note that webhooks trigger for activities performed by direct S3 requests as well.

## Event types {#event-types}

### File access

| Event type | Description |
|---|---|
| `file.created` | A file or directory was uploaded or created |
| `file.deleted` | A file or directory was deleted |
| `file.downloaded` | A file was downloaded |
| `file.access-denied` | Access to a file was denied |

### User sessions

| Event type | Description |
|---|---|
| `user.login` | A user logged in successfully |
| `user.login-failed` | A login attempt failed |
| `user.logout` | A user logged out |
| `user.access-denied` | A user was denied access |
| `user.access-expired` | A user's access expired |
| `user.password-updated` | A user changed their own password |
| `user.password-reset-email-sent` | A password reset email was sent |

### Share links

| Event type | Description |
|---|---|
| `share-link.access-failed` | An attempt to access a share link failed |
| `share-link.access-expired` | A share link was accessed after expiry |
| `share-link.access-limit-reached` | A share link's access limit was reached |
| `share-link.created` | A share link was created by an admin |
| `share-link.updated` | A share link was updated by an admin |
| `share-link.deleted` | A share link was deleted by an admin |

### Credentials (users)

| Event type | Description |
|---|---|
| `user.created` | A credential was created |
| `user.updated` | A credential was updated |
| `user.deleted` | A credential was deleted |
| `user.activated` | A credential was activated |
| `user.deactivated` | A credential was deactivated |
| `user.password.updated` | A credential's password was rotated by an admin |
| `user.aws-credentials.rotated` | A credential's AWS access key was rotated |
| `user.ssh-public-key.added` | An SSH public key was added to a credential |
| `user.ssh-public-key.removed` | An SSH public key was removed from a credential |
| `user.mfa-factor.added` | An MFA factor was added to a credential |
| `user.mfa-factor.removed` | An MFA factor was removed from a credential |
| `user.mfa-factor.updated` | An MFA factor was updated on a credential |

### Organization

| Event type | Description |
|---|---|
| `organization.updated` | Organization settings were updated |
| `organization.member.invited` | A member was invited to the organization |
| `organization.member.joined` | A member accepted an invitation and joined |
| `organization.member.left` | A member removed themselves from the organization |
| `organization.member.removed` | A member was removed by an admin |
| `organization.member.role.updated` | A member's role was changed |
| `organization.member.login` | An organization member logged into the dashboard |
| `organization.member.logout` | An organization member logged out of the dashboard |

### Domains

| Event type | Description |
|---|---|
| `domain.created` | A custom domain was added |
| `domain.updated` | A custom domain was updated |
| `domain.deleted` | A custom domain was removed |

### Webhooks

| Event type | Description |
|---|---|
| `webhook.created` | A webhook was created |
| `webhook.updated` | A webhook was updated |
| `webhook.deleted` | A webhook was deleted |
| `webhook.paused` | A webhook was paused |
| `webhook.resumed` | A webhook was resumed |
| `webhook.tested` | A webhook ping was sent |
| `webhook.secret.rotated` | A webhook signing secret was rotated |
| `webhook.delivery.resent` | A webhook delivery was manually resent |

### Malware scans

| Event type | Description |
|---|---|
| `malware-scan.started` | A malware scan was initiated |
| `malware-scan.completed` | A malware scan completed (clean or unknown result) |
| `malware-scan.threat-detected` | A file was detected as infected |
| `malware-scan.failed` | A malware scan failed |
| `malware-scan.restored` | File access was restored after an infected detection |
| `malware-scan.false-detection-reported` | A false detection was reported |

### Audit logs

| Event type | Description |
|---|---|
| `audit-logs.export-requested` | An audit log export was requested |

