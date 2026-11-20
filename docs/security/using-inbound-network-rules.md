---
sidebar_label: 'Using Inbound Network Rules'
title: 'Using Inbound Network Rules'
sidebar_position: 30
---
Inbound network rules decide which IP addresses can reach your storage over SFTP and FTPS, sign in to the web portal, and open your share links. They can be defined at the [organization level](../getting-started/organization-settings.md#inbound-network-rules) (for all users) or at the [user level](../getting-started/creating-and-modifying-users.md#editing-inbound-network-rules-for-users) (for a specific user).

By default, your organization has a single rule that allows access from any IP address with all protocols, so users can connect, and anyone with a share link can open it, from anywhere.

:::info
Editing inbound network rules is only available with certain plans. Read more about our different plans [here](https://sftptogo.com/pricing)
:::

## Protocols

Each rule allows access from an IP address or range with one protocol:

| Protocol | What it allows |
| --- | --- |
| **All protocols** | Everything below. |
| **SFTP** | Connecting over SFTP. |
| **FTPS** | Connecting over FTPS. |
| **Web portal** | Signing in to the web portal, and opening share links. |
| **Share links** | Opening share links only. It never allows SFTP, FTPS or web portal sign-ins. Available for organization rules only. |

## How rules are checked

When a user connects over SFTP or FTPS, or signs in to the web portal, the connection is allowed if their IP address matches an enabled rule with that protocol or **All protocols**, either in the organization's rules or in the rules of the credentials they use.

When someone opens a share link, only the organization's rules count. The link opens if the visitor's IP address matches an enabled organization rule with **All protocols**, **Web portal** or **Share links**. Credential rules never affect share links. If no rule matches, the visitor can't open the link.

:::warning
If you restrict your organization's rules to your own IP addresses, people you send share links to from anywhere else can't open them. Add a **Share links** rule for the addresses they use, or for any address, as shown below.
:::

## Example: restrict SFTP, share links with anyone

To let your users connect over SFTP and FTPS only from your office and your partners, while anyone with a share link can open it:

1. In the organization's inbound network rules, add a rule with **All protocols** (or one rule each for **SFTP** and **FTPS**) for your office's IP address or range, for example `203.0.113.0/24`.
2. Add a rule like it for each partner's IP address or range.
3. Add a rule with **Share links** for `0.0.0.0/0`, which matches any IP address.
4. Delete or disable the default rule that allows any IP address with all protocols.

Users connecting over SFTP or FTPS from any other address are refused, unless their own credential rules allow that address, while share links open from anywhere. With **All protocols**, the same addresses can also sign in to the web portal. With **SFTP** and **FTPS** rules only, add a **Web portal** rule for the addresses that should be able to sign in.

## Testing an IP address

To check whether an IP address is allowed with a given protocol, including **Share links**, expand the organization's **Inbound rules**, click **Test IP address** next to **Add inbound rule**, select the protocol, and enter the IP address.
