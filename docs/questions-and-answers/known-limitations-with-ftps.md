---
sidebar_label: 'Known limitations with FTPS'
title: 'Known limitations with FTPS'
sidebar_position: 5
---
These are the known limitations with FTPS:

1. Only Explicit mode is supported. Implicit mode is not supported.
2. Only Passive mode is supported.
3. Only STREAM mode is supported.
4. Only Image/Binary mode is supported.
5. TLS - PROT C (unprotected) TLS for the data connection is the default. However, PROT C is not supported, so the client must issue PROT P in order to initiate a data operation.