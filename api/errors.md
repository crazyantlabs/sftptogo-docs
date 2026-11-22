---
id: errors
title: Errors
sidebar_label: Errors
description: The status codes, error body and error ids the SFTP To Go Management API returns, and when to retry.
---

The SFTP To Go Management API uses standard HTTP status codes to say whether a request succeeded. A `2xx` code means it did, a `4xx` code means the request needs changing, and a `5xx` code means something went wrong on our side.

## Error body

An error response is a JSON object with a stable `id` and a readable `message`:

```json
{
  "id": "not_found",
  "message": "Credentials not found."
}
```

* `id`: a code for the error. Match on it in your code; it doesn't change.
* `message`: an explanation for a person. Log it, but don't match on it: the wording can change.
* `errors`: only on `400` responses for an invalid request body. It says which fields were rejected and why. See [Validation errors](#validation-errors).

A `401` from a failed authentication is the one exception: its body has only a `message`. See [Authentication](./authentication.mdx).

## Status codes

| Code | Meaning | What to do |
| --- | --- | --- |
| `400` | The request body is invalid. | Fix the fields listed in `errors`, then send it again. |
| `401` | The request isn't authenticated: the API key is missing, wrong or revoked, or it can't reach this path. | Check the `Authorization` header, the key, and the organization ID in the path. |
| `402` | Your plan doesn't include this feature. | Upgrade your plan, or don't use the feature. |
| `403` | The request is authenticated and your plan includes the feature, but this request isn't allowed. | Read `message`: for example, you reached a limit, or the item can't be changed this way. |
| `404` | The item doesn't exist in your organization. | Check the ID in the path. |
| `422` | The request is well formed but can't be done, such as a login name that is already taken. | Change the request, such as choosing another name. |
| `429` | Too many requests of this kind. | Wait, then retry. |
| `500` | Something went wrong on our side. | Retry later. If it keeps happening, contact our support team. |

### 401, 402 or 403?

* **`401`: we don't know who you are.** The key is missing, wrong or revoked, or it doesn't belong to the organization in the path. Fix the key or the path.
* **`402`: your plan doesn't include the feature.** The key is fine. No request to that feature will work until your plan includes it.
* **`403`: you can't do this particular thing.** The key is fine and your plan includes the feature, but this request isn't allowed, for example because it would go over your plan's credentials limit. Read `message` to see why.

## Error ids

| `id` | Status | Description |
| --- | --- | --- |
| `invalid_request_body` | `400` | The request body failed validation. `errors` lists the fields. |
| `bad_request` | `400` | The request is invalid. `message` says why. |
| `unauthorized` | `401` | An endpoint rejected the request as not authorized. |
| `payment_required` | `402` | Your plan doesn't include this feature. |
| `forbidden` | `403` | The request isn't allowed. `message` says why. |
| `not_found` | `404` | The item doesn't exist. |
| `unprocessable_entity` | `422` | The request can't be done as sent, such as a login name that is already taken. |
| `invalid_params` | `422` | A parameter's value is invalid, such as a login name that isn't allowed. |
| `too_many_requests` | `429` | Too many requests of this kind in a short time. |
| `internal_server_error` | `500` | Something went wrong on our side. |

## Validation errors

A `400` with the id `invalid_request_body` comes with an `errors` field naming the rejected fields. It takes one of two forms, so handle both.

An object keyed by field name. It lists every field that was checked, so look for `isInvalid: true`:

```json
{
  "id": "invalid_request_body",
  "message": "Invalid request body.",
  "errors": {
    "isValid": false,
    "UserName": { "isInvalid": true, "message": "Unfortunately, username can't be shorter than 5 characters." },
    "Alias": { "isInvalid": false, "message": "" }
  }
}
```

Or a list of the rejected fields:

```json
{
  "id": "invalid_request_body",
  "message": "Invalid request body.",
  "errors": [
    { "field": "HomeDirectoryDetails", "message": "Unfortunately, two virtual folders can't share the same path." }
  ]
}
```

## Retrying

* **Retry `429` and `5xx` responses**, waiting longer between each attempt.
* **Don't retry other `4xx` responses** unchanged: they fail the same way until you change the request, the key or your plan.
* **Before retrying a request that creates something,** check whether the first attempt went through, for example by listing your credentials. A request that timed out may still have succeeded.
* A `5xx` from our gateway, such as `502`, reaches your browser without CORS headers. In a browser, including the request panel on these pages, it shows as a failed request with no status code.
