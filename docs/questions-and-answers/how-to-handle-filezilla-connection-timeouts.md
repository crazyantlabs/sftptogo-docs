---
sidebar_label: 'How to handle FileZilla connection timeouts'
title: 'How to handle FileZilla connection timeouts'
sidebar_position: 2
---
If you use FileZilla to connect to SFTP To Go and keep getting error messages such as 'Connection timed out' after 20 seconds of inactivity, follow these steps to change client side configuration:

* On Windows, click Edit >> Settings
* On Mac, click FileZilla >> Settings
* Under [Connection], increase the value for timeout in seconds to 600 (default is 20 seconds).
* Click [OK] to save your changes and connect again.

![Filezilla settings screenshot](https://devcenter2.assets.heroku.com/article-images/5192-imported-1562776507-fz_settings.b2df2047.png)
