---
sidebar_label: 'Using SSH Key Authentication'
title: 'Using SSH Key Authentication'
sidebar_position: 11
---
SSH key authentication allows you to connect to your cloud storage without a password and without passing private information between the client and the server.

SFTP To Go accepts PEM formatted RSA, ECDSA, and ED25519 keys. If you have an SSH2 public key, you will have to [convert it](../questions-and-answers/ssh2).

If you don't have a private/public key pair, generate a key pair on your local machine. On Linux or Mac open a terminal, type in `ssh-keygen` and follow the on-screen instructions. See [here](https://sftptogo.com/blog/how-to-create-ssh-keys-on-windows-10/) for more information on how to create SSH keys in Windows 10 and above. The keys should begin with 'ssh-rsa', 'ecdsa-sha2-nistp256', 'ecdsa-sha2-nistp384', 'ecdsa-sha2-nistp521', or 'ssh-ed25519'.

To connect using public key authentication, first add a public key to the credentials you'd like to use:

1. Go to your organization credentials list (click **Credentials** in the menu).
2. In the credentials list, expand the credentials you'd like to add a public key for.
3. Click **Import SSH key**.
4. Paste the public key.
5. Click **Import SSH key**.

Then, get your SFTP client acquainted with your private key to use it instead of a password. For example, with the sftp command line interface, use the following syntax:

```shell
sftp -i [/path/to/your/private-key] user@hostname
```

To remove a public key, click the 'X' next to it under the designated credentials.

You may also force all users to use only public key authentication through your [organization settings](../getting-started/organization-settings#security).
