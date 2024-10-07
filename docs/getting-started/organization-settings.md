---
sidebar_label: 'Organization Settings'
title: 'Organization Settings'
sidebar_position: 40
---
To manage your organization, security, billing, and team settings, click **Settings** from the menu.

## Security

### Authentication Methods

SFTP To Go allows several authentication methods, which are ways to identify the client when they are logging into the server:

* Password authentication - identification based on username and password. This authentication method can be used with both SFTP and FTPS protocols.

* Public key authentication - identification based on username and a cryptographic system that uses pairs of keys. To use it, add a public SSH key to each one of the credentials. This form of authentication is only supported by the SFTP protocol.

### Audit logs

Use the audit logs to monitor access to your storage. The Audit logs dialog lets you browse through your organization's logs, filter them by Username, session ID or timestamp range.

### Password policy

Set your organization's password policy for credentials. This will not change existing passwords, but changes to passwords (either ones generated automatically or manually) must adhere to the organization's current password policy.

### Sharing policy

Control how your users share files and folders with others. This will not change existing share links, but newly created share links will adhere to changes you make in the policy.

## Network

### Domains

Custom domains allow you to customize and brand your SFTP To Go endpoints for both SFTP / FTPS and web portal access.

To add a new custom domain:

1. Click **Add domain**.
2. Enter the fully qualified domain you'd like to use as an endpoint. Note that root domains cannot be used (i.e., use files.example.io instead of example.io).
3. Select the type of endpoint that the domain will be used for:
    * SFTP/FTPS - For use with FTP clients. Requires adding a CNAME pointing to the endpoint.
    * Web portal - Accessible with any web browser. Requires adding a CNAME pointing to the endpoint. TLS certificates are managed by SFTP To Go.
4. Click **Add domain** to return to the list.
5. Wait for instructions on what records to add in your DNS provider. Either apply them yourself or send them to your network manager.
6. It may take some time for DNS records to apply. You can wait for the state of your domain to show as "Verified" or click the ... menu button to manually refresh the state.
7. Once the domain has been verified, you can click the ... menu button to set it as the default domain, which will replace the default domain with the newly set up domain in the SFTP To Go admin dashboard.

:::info
SFTP domains can be added with any plan. Additionally, you can point subdomains to your SFTP endpoint without adding them to the domains list. Adding custom domains for use with the web portal is only available with certain plans. Read more about our various plans [here](https://sftptogo.com/pricing).
:::


Here are some links to documentation on editing DNS records with popular domain providers. If your DNS provider isn't listed, log in to your provider's website and search their documentation for adding DNS records.

| DNS Provider | Documentation |
|---|---|
| AWS Route53 | [Supported DNS record types](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html#CNAMEFormat) |
| Cloudflare | [Managing DNS records in Cloudflare](https://support.cloudflare.com/hc/en-us/articles/360019093151) |
| Digital Ocean | [How to Create, Edit, and Delete DNS Records](https://docs.digitalocean.com/products/networking/dns/how-to/manage-records/#cname-records) |
| Dreamhost | [Adding custom DNS records](https://help.dreamhost.com/hc/en-us/articles/360035516812-Adding-custom-DNS-records) |
| DNSimple | [Managing CNAME Records](https://support.dnsimple.com/articles/manage-cname-record/) |
| GoDaddy | [Add a CNAME record](https://www.godaddy.com/help/add-a-cname-record-19236) |
| Google Domains | [DNS basics](https://support.google.com/a/answer/48090) |
| Kinsta DNS | [How to Add DNS Records](https://kinsta.com/knowledgebase/dns/#cname-record) |
| HostGator | [Manage DNS Records with HostGator/eNom](https://www.hostgator.com/help/article/manage-dns-records-with-hostgatorenom) |
| Namecheap | [How to create CNAME record for your domain](https://www.namecheap.com/support/knowledgebase/article.aspx/9646/2237/how-to-create-a-cname-record-for-your-domain/) |
| Names.co.uk | [Changing your domain’s DNS settings](https://www.names.co.uk/support/articles/changing-your-domains-dns-settings/) |
| Wordpress | [Adding Custom DNS Records](https://wordpress.com/support/domains/custom-dns/#adding-custom-dns-records) |
| Wix | [Adding or Updating CNAME Records](https://support.wix.com/en/article/adding-or-updating-cname-records-in-your-wix-account) |


### Inbound network rules

Inbound network rules define IP address ranges from which a user can connect to your storage using the SFTP or FTPS protocols.

The organization level rules define the IP ranges from which any set of credentials can be used to login to your cloud storage.

By default, there is a single rule that allows access from any IP address to all endpoints/protocols (SFTP, FTPS or Web Portal).

To restrict access to your storage, you may edit, disable, or delete this rule, and either add rules at the organization level or at the 
[credentials level](../getting-started/creating-and-modifying-users.md)
To add a new inbound rule:

1. Click **Add inbound rule**.
2. Select the protocols you'd like to give access to (All, SFTP, FTPS or Web Portal).
4. Fill out the source IP address or CIDR for IP address range.
5. Add an optional description.
6. Click 'Add inbound rule'.

You can also edit, disable, enable, and delete inbound network rules by clicking the menu button (...) on a specific network rule followed by the relevant menu item.

:::info
Editing inbound network rules is only available with certain plans. Read more about our different plans [here](https://sftptogo.com/pricing)
:::

## Web Portal

The web portal enables users to sign in and manage files in their designated home directories directly through their web browser. To activate it, click the switch button in the settings tab, under the web portal section. Once the web portal is enabled, your organization's login URL will be displayed here.

:::info
When the web portal is activated in your organization, any credential can log in and manage files, provided the user or organization's inbound network rules permit access.
:::

### Public business information

Input the information you want to be accessible to web portal users. The business partner information influences the site title. You can opt to leave these fields empty to use the default text and links.

### Branding

Customize your web portal's appearance by selecting your icon, logo, and colors for both light and dark modes.

:::info
The icon serves as your site's favicon and the primary logo, unless you choose to use a logo URL instead. We recommend using a rectangular image with dimensions of 128x128 pixels.
:::


## Organization

The organization is the top level object that holds the storage, credentials, webhook notifications, and billing information. 

Within the organization section, you may change your organization's name and obtain your organization's unique identifier, which we may request from you during support conversations.

## Usage & Billing

Track your usage - storage and bandwidth metrics (Note that the metrics are update at certain intervals and not in real-time).

To change your organization's billing plan, Scroll to the billing section and click **Open your billing portal**.

In the billing portal, you can change your billing details (including credit card details), change or cancel your plan, and download your historical invoices.

If you are billed for SFTP To Go by a partner (e.g. Heroku), the billing section may not show up in your organization section. You can change your billing settings through the relevant partner's website.

:::info
If you'd like to change your plan during a trial, we ask that you please reach out to us via the live-chat button on the bottom-right corner of the screen and request that we modify it. Otherwise, your credit card may be automatically charged.
:::

## Access - team management

The access section lists the accounts that have access to an organization's management dashboard and allows owners to invite more team members, track their usage and their Multi-factor authentication status.

To invite a new member to your organization, scroll down to the **Access** section and click **Invite team member**. Fill out the team member's name and email address and an invitation will be sent out for the new member to join your organization. After clicking the invitation link, the new member will be requested to create a password. Once logged in, the new member will be able to access the organization according to the assigned role.

:::info
If access to SFTP To go is managed by a partner (e.g. Heroku), use the partner's access management to add or remove team members.
:::

To remove a member from the organization, click the menu button (...) and then **Remove from team**.

To change an existing member role, click the menu button (...) and then **Change role**.

:::note
An account must have at least one owner account.
:::
