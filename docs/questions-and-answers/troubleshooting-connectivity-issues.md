---
sidebar_label: 'Troubleshooting connectivity issues'
title: 'Troubleshooting connectivity issues'
sidebar_position: 1
---
If opening a connection to your SFTP To Go host takes a long time or does not succeed, or if you come across connection timeouts in your client, follow these steps to troubleshoot:

1. Try to connect to SFTP To Go from a different network. There may be issues within your local network that are causing these connectivity issues. If it works well on the new network, it is recommended that you resolve the issues found within your network (e.g. firewall rules, DNS resolution, etc.).

1. Try to connect to SFTP To Go from a different computer. The problem may be your computer and services (e.g. anti-virus apps, OS firewall) that are causing these connectivity issues. If it works well on the new computer, it is recommended that you resolve issues found within your computer.

1. If, after running these two tests, you still experience slow connection time or connection timeouts, use the following command pattern on a Mac console to get a client side log with timestamps. Replace `URL` with your organization's URL (copied from the SFTP To Go dashboard):

```shell
sftp -v URL 2>&1 | while read line; do echo "`date -u +"%Y-%m-%dT%H:%M:%SZ"` $line"; done
```
For example:

```shell
sftp -v sftp://a9fe70b82zbb94f7160dfcBfcd7@yellow-rectangle-14793.sftptogo.com 2>&1 | while read line; do echo "`date -u +"%Y-%m-%dT%H:%M:%SZ"` $line"; done
```
Paste your password when prompted to do so and then hit `enter/return`.

Wait until you see the text `Connected to ... .sftptogo.com.`, and then type `quit` and hit `enter/return`.

Copy the client log and send it to our support center along with your computer's timezone via the chat button found on the bottom-right corner of your screen, so that we can investigate what happened on the servers simultaneously.