---
sidebar_label: 'Using SSH Key Authentication'
title: 'Using SSH Key Authentication'
sidebar_position: 1
---
SSH key authentication allows you to connect to your cloud storage without a password and without passing private information between the client and the server.

If you don't have a private/public key pair, generate a key pair on your local machine (See [here](https://sftptogo.com/blog/how-to-create-ssh-keys-on-windows-10/) for help).

To connect using public key authentication, first add a public key to the credentials you'd like to use:

1. Go to your organization dashboard (click **Dashboard** in the menu).
2. In the credentials list, expand the credentials you'd like to add a public key for.
3. Click **Import SSH key**.
4. Paste the public key. Make sure it begins with `ssh-rsa`.
5. Click **Import SSH key**.

Then, get your SFTP client acquainted with your private key to use it instead of a password. For example, with the sftp command line interface, use the following syntax:

```shell
sftp -i [/path/to/your/private-key] user@hostname
```

To remove a public key, click the 'X' next to it under the designated credentials.

You may also force all users to use only public key authentication through your organization settings <LINK/>.