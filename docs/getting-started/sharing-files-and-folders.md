---
sidebar_label: 'Sharing files and folders'
title: 'Sharing files and folders'
sidebar_position: 60
---

To share files or folders with others, SFTP To Go offers share links. To ensure security, share links use random strings instead of the actual path to the shared folder or file, and they also provide additional ways to protect access to your data.

## Who Can Share Files?

By default, only the default credentials can create share links. To allow other users to create share links, assign them the [Full Access permission](creating-and-modifying-users).

## How to Share a File or Folder Using SFTP To Go

1. Open the file browser (or the web portal).
2. Locate the file or folder you wish to share, click the three-dot menu button, and select `Share`.

:::note
Creating share links is only available in certain plans. Learn more about our pricing plans [here](https://sftptogo.com/pricing).
:::

3. In the dialog box that appears, click the `Publish to web` toggle button.
4. Optionally, adjust permissions for the folder or file (file shares are read-only, while folders can have read-only, read and write, read and write without delete, or write-only permissions).
5. Optionally, set an expiration time for the link. Once expired, the share link will no longer work, but the folder or file remains intact.
6. Optionally, limit the number of accesses to the share. Once this limit is reached, the link is automatically deactivated.
7. Optionally, set a password for the share link. Ensure the password adheres to your organization's password policy.
8. Optionally, add notes to describe the purpose of the share. Notes will only be visible to those that have permissions to share.
9. Click `Create public link`. A shareable link will appear at the top of the dialog. You can copy it, browse it, or generate a QR code for others to scan and access the link directly.
10. Click `Close`.

## How to Edit, Modify, or Remove a Share Link

1. Open the file browser (or the web portal).
2. Find the shared file or folder, click the three-dot menu button, and select `Share`.
3. To remove the share link, toggle the `Publish to web` button off and click `Stop sharing`.
4. To modify the share link, adjust its properties and click `Save changes`.

## How to Customize Share Links

Share links are created using your default domain. You can change this by following [these instructions](../getting-started/organization-settings#domains).

You can also update your organization's sharing policy in the [Settings tab](organization-settings#sharing-policy).
