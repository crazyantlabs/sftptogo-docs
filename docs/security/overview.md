---
sidebar_label: 'Overview'
title: 'Security Overview'
sidebar_position: 10
---
SFTP To Go prioritizes security, as we understand that keeping your data safe is fundamental to your business.

Authentication
---------

There are two types of logins in SFTP To Go:

1. Accounts - accounts are members in one or more organization and have the ability to access the admin dashboard: manage files, credentials, webhooks, inbound network rules and other settings at the organization level.

2. Credentials - credentials can only access your SFTP To Go file storage to upload, download or manage files, using various access protocols. They can be used by humans and machines alike.

Accounts use SFTP To Go's web dashboard to login, using an email address, a password and optionally an MFA device or SSO authentication.

Credentials can access files using secure protocols such as SFTP, FTPS, and S3 using user and password authentication. Passwords are strong by default and can be rotated at any time. We recommend rotating passwords every 60 days.

Public key authentication is available with SFTP. The supported algorithms are ssh-ed25519, rsa-sha2-256, rsa-sha2-512, ecdsa-sha2-nistp256, ecdsa-sha2-nistp384, and ecdsa-sha2-nistp521, including 4096-bit key pairs.

MFA devices can be used with credentials when accessing the web portal.

Authorization
---------

Credentials are assigned permissions (full access, read-only, write-only or read-write) and a home directory to which they are bound (chrooted). Multiple credentials can have access to the same home directory or to a parent directory and child directories (e.g. user `marketing` has access to `marketing/`, while user `marketing-partner1` has access to `marketing/partner1` and `marketing-partner2` has access to `marketing/partner2`).


Data encryption
---------

Both control and data channels are encrypted over the wire using the aforementioned protocols. In addition, data is encrypted at rest using server side 256 bit Advanced Encryption Standard (AES-256) on Amazon S3.

Access Restriction
---------

Depending on your plan, you may add inbound network rules at the organization or at the credential level to restrict access to certain IP address ranges. In addition we use static IPs with all of our host endpoints, so that if any users require outbound network rules, they can use static IPs to allow access to SFTP To Go from their network.

Auditing
-------

Login attempts, sessions and file access is audited and stored in logs, which can be made available upon request.