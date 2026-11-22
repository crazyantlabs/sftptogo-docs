---
id: authentication
title: Authentication
sidebar_label: Authentication
description: Authenticate requests to the SFTP To Go Management API with an API key in the Authorization header.
---

Every request to the Management API is authenticated with an API key. A key belongs to one organization and acts on that organization's behalf.

## Getting an API key

Request an API key from our support team through the in-app chat, and tell us which organization it is for.

## Authenticating a request

Send the key in the `Authorization` header, using the `Bearer` scheme:

```bash
curl https://api.sftptogo.com/organizations/$SFTPTOGO_ORGANIZATION_ID/users \
  -H "Authorization: Bearer $SFTPTOGO_API_KEY"
```

Every path starts with your organization ID. It is the ID that follows `/organizations/` in your dashboard's address.

## What a key can reach

* **Only its own organization.** A request for any other organization's path is rejected.
* **Only organization endpoints.** Endpoints about a signed-in person rather than an organization, such as account settings, are not available with an API key.
* **Everything in its organization.** A key has full access to its organization: there are no read-only or limited keys.
* **Only an active organization.** While your organization is not active, every request is rejected.

## Keeping your key safe

* Treat the key like a password. Anyone who has it can do anything the API allows in your organization.
* Keep it in a secret manager or an environment variable, never in source code, a repository, or code that runs in a browser or mobile app.
* Avoid writing it to logs, and share it only with the systems that need it.
* Keys do not expire. If a key is no longer needed, have it revoked.

## Authentication errors

When a request cannot be authenticated, the API returns `401 Unauthorized` with this body:

```json
{
  "message": "Unauthorized"
}
```

The response does not say which check failed. Look for one of these:

* The `Authorization` header is missing, or does not use the `Bearer` scheme.
* The key is wrong or has been revoked.
* The path names a different organization from the key's.
* The endpoint is not available with an API key.
* The organization is not active.

## Revoking a key

If a key has been exposed, or you no longer need it, ask our support team to revoke it through the in-app chat. Requests made with a revoked key return `401 Unauthorized`.

If your integrations must keep running, ask for a new key first, switch them over, and then have the old key revoked.
