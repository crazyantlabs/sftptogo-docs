---
sidebar_label: 'Using Static IPs'
title: 'Using Static IPs'
sidebar_position: 12
---
SFTP To Go's hostnames are mapped to static IPs to allow customers the option to add outbound network rules to their local infrastructure. Keep in mind that some legacy systems require an IP address (instead of a hostname) to connect to an SFTP server.

To find your host's underlying IP addresses, expand an existing credentials item in the credentials list. Then, click the *view IP addresses* link next to the host label.

That covers traffic coming *to* SFTP To Go. For traffic going the other way — the requests automations make to your own endpoints — see [Allowing our IP addresses](../automation/automations.md#allowing-our-ip-addresses).