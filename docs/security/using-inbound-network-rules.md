---
sidebar_label: 'Using Inbound Network Rules'
title: 'Using Inbound Network Rules'
sidebar_position: 30
---
Inbound network rules define IP address ranges from which a user can connect to your storage. They can be defined at the [organization level](../getting-started/organization-settings.md#inbound-network-rules) (for all users) or at the [user level](../getting-started/creating-and-modifying-users.md#editing-inbound-network-rules-for-users) (for a specific user).

By default, users can connect to your organization's storage from any IP address.

Each rule applies to one protocol (SFTP, FTPS or web portal) or to all of them. [Share links](../getting-started/sharing-files-and-folders.md) open in the web portal, so recipients can only open them from addresses that a **Web portal** rule allows. If your rules allow only SFTP or FTPS, every share link returns an access denied error.

:::note
Editing inbound network rules is only available with certain plans. Read more about our different plans [here](https://sftptogo.com/pricing).
:::
