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

To export audit logs to your SFTP To Go storage, click your organization's [settings tab](../getting-started/organization-settings#audit-logs), and scroll to Security - Audit Logs. Choose the time range you want and click Export to CSV to generate the files. Note that the time range is based on your local time.

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

