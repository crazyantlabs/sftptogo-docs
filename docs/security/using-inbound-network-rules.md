---
sidebar_label: 'Using Inbound Network Rules'
title: 'Using Inbound Network Rules'
sidebar_position: 30
---
Inbound network rules define IP address ranges from which a user can connect to your storage. They can be defined at the [organization level](../getting-started/organization-settings.md#inbound-network-rules) (for all users) or at the [user level](../getting-started/creating-and-modifying-users.md#editing-inbound-network-rules-for-users) (for a specific user).

By default, users can connect to your organization's storage from any IP address.

Each rule applies to one protocol (**SFTP**, **FTPS** or **Web portal**) or to **All protocols**. [Share links](../getting-started/sharing-files-and-folders.md) open in the web portal, so recipients can only open them from addresses that one of your organization's **Web portal** or **All protocols** rules allows. If your organization's rules allow only SFTP or FTPS, recipients can't open any of your share links.

:::note
Editing inbound network rules is only available with certain plans. Read more about our different plans [here](https://sftptogo.com/pricing).
:::
