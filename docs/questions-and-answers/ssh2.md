---
sidebar_label: 'SSH2 Support'
title: 'Does SFTP To Go support SSH2?'
sidebar_position: 7
---
SFTP To Go supports OpenSSH formatted public keys. SSH2 public keys can be easily converted to the OpenSSH format using the ssh-keygen command line on Windows, Mac or Linux:


```shell
ssh-keygen -i -f path/to/ssh2-key.pub > openssh-key.pub
```

You can also reach out to our support team if you need help with public key conversion, using the in-app chat.