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

If you need to inspect S3 access logs (for direct S3 access), please reach out to our support and we'll provide you with the logs you need.

