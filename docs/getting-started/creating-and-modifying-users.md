---
sidebar_label: 'Creating and Modifying Users'
title: 'Creating and Modifying Users'
sidebar_position: 20
---
## Credentials and permissions

To create more credentials to use and access your storage:

1. Click **+ Add credentials**.
2. Select a username. The username must be unique service-wide and at least 10 characters long. We recommend to leave it blank and have SFTP To Go generate a unique name for the user.
3. This is an optional step: Select a home directory for the credentials. By default, each credential only has access to its own home directory (`/home/<username>`). You can change the credentials' home directory to have multiple credentials access the same directory. The users are chrooted to this directory, meaning that this directory acts as an isolated storage for them. They will not have access to any parent or sibling directories.
4. Select the level of permissions accessible for the new user. By default, the user has read-only access to their home directory. For more information on the different permissions, see the table below.
5. Set an optional access expiration date for the credentials. If left blank, credentials access will never expire.
6. Choose a nickname for the credentials (optional). This shows up in the UI solely as a friendly user name.
7. Click **Add credentials**. The user will then be assigned a random password according to your organization's password policy (and username, if left empty). 


|  Permissions  |                                                                                            |
|------------|----------------------------------------------------------------------------------------------------------|
| Read-only  | List files and directories<br/>Get files                                                                 |
| Read and Write | List files and directories<br/>Create directories<br/>Remove files and directories<br/>Put files<br/>Get files         |
| Read and Write without delete | List files and directories<br/>Create directories<br/>Put files<br/>Get files         |
| Write-only | List files and directories<br/>Create directories<br/>Put files (no overwrite) |
| None       | Connect  |


### Editing user credentials

You may edit existing credentials by clicking the menu button (...) for the particular user you wish to edit and then selecting **Edit credentials** from the menu. You may change the username, home directory, user's permissions, and the nickname. 

### Setting user passwords

To set credentials' passwords, click the menu button (...) for the specific user and then select **Set Password** in the menu. If you select `Random password`, a new password will be generated according to your organization's password policy. If you select `Custom password`, you'll have to enter a password that conforms with the organization's password policy.

:::note
To change your organization's password policy, go to [Settings](../getting-started/organization-settings#password-policy).
:::

### Expiration

Credentials access expiration allows you to set a date and time when the credentials will become inactive, and the user will no longer be able to connect to your cloud storage (via either SFTP, FTPS, or Web Portal).

This is useful for temporary access or for rotating credentials for security reasons.

When credentials access expires, the credentials automatically become inactive and its expiration date is reset to `Never`. You can reactivate credentials access by clicking the menu button (...) for the specific user and then selecting **Activate credentials** in the menu.

For security reasons, the access expiration date can only be set to a date in the future and no more than 1 year from now.

:::note
Expiring credentials will not affect open sessions or any of the user's files (i.e. they will be kept intact within your storage). 

The expiration date timezone is **UTC** and it may take up to 5 minutes for the expiration to take effect.
:::

### Deactivating and reactivating users

You may want to temporarily deactivate users so they won't be able to connect to your cloud storage. To do this, click the menu button (...) for the specific user and then select **Deactivate credentials** in the menu. 

:::note
This will not affect open sessions or any of the user's files (i.e. they will be kept intact within your storage).
:::

To reactivate users, click the menu button (...) for a deactivated user (displayed with a striped background) and then select **Activate credentials**.

### Adding and removing public SSH keys

You can add public SSH keys to use with a username instead of a password. To import public SSH keys for this purpose, complete the following:

1. For the specific user you wish to add keys to, click *Import SSH key*.
2. Generate a new key pair or copy an existing public key (usually ending with `.pub`). You can generate a new key pair using `ssh-keygen -t rsa` on Linux/Mac, or using PuTTYgen or openssh on Windows. Make sure you generate a new **RSA** key.
3. Paste the public key. Make sure it begins with `ssh-rsa`.
4. Click *Import SSH key*

To remove an SSH key from a user, click the X next to the key and confirm deletion.

### Editing inbound network rules for users

Inbound network rules specify which IP addresses can connect to your storage. These rules can be set for the entire organization (applies to all users) or for individual users, at the credential level. When a user attempts to connect, the system checks a combined list of both the organization-wide and credentials-specific rules. If the IP address is on either list, the connection is allowed.

By default, the organization inbound network rules contain a single rule allowing access from any IP address to any endpoint or protocol (SFTP, FTPS or Web Portal). To restrict access, you will have to remove this rule or edit it to use a restrictive CIDR (Classless Inter-Domain Routing - an IP address range).

:::note
Editing inbound network rules is only available within certain plans. Read more about our different plans [here](https://sftptogo.com/pricing)
:::

To add user-level inbound network rules, please complete the following steps:
1. Under the specific user, click **Add inbound rule**.
2. Select the protocols to which you want to allow access to.
3. Enter the CIDR or IP range you want to allow access from.
4. Optionally add a description to help you identify the rules later.
5. Click **Add inbound rule**.

To edit, disable, or delete a rule, click the menu button (...) next to the rule and select the action you'd like to perform.
