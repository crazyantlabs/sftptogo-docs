---
sidebar_label: 'Branding your SFTP service'
title: 'Setting Up a Custom SFTP Server Name - Branding your SFTP'
sidebar_position: 10
---
To personalize your storage, you can replace SFTP To Go's hostname with a subdomain of a domain you own. To do so, copy your SFTP To Go hostname from the dashboard and add a CNAME record to point to the hostname. For example (make sure to use the hostname that shows in your dashboard as the target):


| Record | Name | Target                               |
|--------|------|--------------------------------------|
| CNAME  | sftp | yellow-rectangle-14793.sftptogo.com. |

Here are some links to the documentation regarding editing DNS records with popular domain providers. If your DNS provider isn't listed here, login to your provider's website and search their documentation on adding DNS records.

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

:::tip
Adding a custom domain for your SFTP endpoint is available in all plans. However, if you'd like to change the domain that shows as default in SFTP To Go's admin dashboard, read more about this option [here](../getting-started/organization-settings#domains). This feature is only available with [certain plans](https://sftptogo.com/pricing).
:::