---
sidebar_label: 'Webhook notifications'
title: 'Using webhooks notification to trigger processes'
sidebar_position: 1
---
Webhooks enable you to receive notifications whenever particular events occur within your SFTP To Go organization's storage. You can subscribe to notifications for the following events:

* File upload and directory creation
* File or directory deletion
* File download

Webhook notifications are sent as HTTP POST requests to a URL of your choosing. To integrate with webhooks, you need to implement a server endpoint that can receive and handle these requests.

:::info
Please note that our webhooks don’t work with self-signed certs. If a webhook detects a self-signed cert, it will result in an error and no request will be sent.
:::

To subscribe to webhooks, click **Webhooks** from the menu, and then click the `Add webhook` button.

In the dialog that opens, fill out the following:

* `Nickname` (optional) - a descriptive name for your webhook.
* `Endpoint`  
  * `Type` - select one of the supported endpoint types:  
    * `Webhook` - send a HTTP POST requests to the endpoint URL.
    * `Slack` - send a Slack message to the endpoint URL which should be a valid [Slack incoming webhook URL](https://slack.com/oauth/v2/authorize?client_id=754603809072.3867924020054&scope=incoming-webhook&user_scope=).
    * `Teams` - send a Microsoft Teams message to a [Teams incoming webhook URL](https://learn.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook?tabs=dotnet).
    * `Email` - send a notification to an email recipient.
  * `URL` - For Webhook, this should be a valid HTTPS URL that will receive webhook notifications. For Slack and Teams, this should be a valid incoming webhook URL. 
  * `Email` - An email address of a recipient that will receive all webhook notifications for Email types. An address with display name is also supported (e.g. `Display Name <email-address>`)
* `Authorization Header` (optional) - a custom `Authorization` header that will be included with all webhook notifications.
* `Topics` - select the types of notifications you want to be informed about. You must include at least one topic.
* `Filter` (optional) - apply filtering rules to trigger notifications that meet the specified criteria, i.e. have (or don't have) certain properties.

Finish by clicking `Add webhook`.

:::tip
Some common filters you can use:

 - Path matches `^.*[^/]$` - trigger webhook for files, not for folders.
 - Path ends with `/` - trigger webhook for folders, not for files.
 - Path starts with `home/user/` - triggers webhook for files or folders within `home/user/`.
 - Actor ID is `username` - triggers webhook for files or folders touched by `username`.
 - Actor ID is not `username` - triggers webhook for files or folders touched by anyone but `username`.
:::

### Securing Webhooks

To ensure the authenticity of webhook requests originating from SFTP To Go and to prevent tampering, validate the signature in the X-Hub-Signature header before processing the delivery further. This helps you avoid processing unauthorized requests and prevents man-in-the-middle attacks.

To do this, you need to:

1. Once a webhook is created, a signing secret is generated and displayed one time (you can rotate and request a new secret at any time).
2. Store the signing secret securely on your server.
3. Validate incoming webhook payloads against the signature to verify they are from SFTP To Go and were not tampered with.

:::important

1. **Never** hardcode the signing secret in your code. Always store it securely and never expose it in your logs.
2. **Never** use a plain comparison operator to compare the signatures. Use a secure comparison function to avoid timing attacks.
:::


You may also use an authorization header to verify that the request did, indeed, come from SFTP To Go. When properly set, the authorization header is passed through in the `Authorization` header in the request. It should be validated using the authorization mechanism of your choice on through your server.

#### Validating Webhook Signature

To ensure the authenticity of webhook requests originating from SFTP To Go and to ensure that the delivery was not tampered with, validate the signature in the `X-Hub-Signature` header before processing the delivery further. This helps you avoid processing unauthorized requests and prevents man-in-the-middle attacks.

#### Testing the Webhook Signature Validation

To test the validation process, you can use the following `secret` and `payload` values to verify that your implementation is working correctly.

`secret`: "Very Secret Secret"  
`payload`: "Hello! This is a test payload."  

If your implementation is correct, the generated signature should be `sha256=8ba4c47558de1872150c3ec82211c34bf0cbd6d60fc4f9875b97853af06de917` and it can be validated against the signature provided in the `X-Hub-Signature` header.


#### Examples

Here are code examples for validating the webhook signature in different languages:

**Ruby**

```ruby
require 'openssl'
require 'json'

payload = 'Hello! This is a test payload.'
secret = 'Very Secret Secret' # ENV['SFTPTOGO_WEBHOOK_SINGING_SECRET']

# This should be the value of the X-Hub-Signature header
signature = 'sha256=8ba4c47558de1872150c3ec82211c34bf0cbd6d60fc4f9875b97853af06de917'

computed_signature = 'sha256=' + OpenSSL::HMAC.hexdigest(OpenSSL::Digest.new('sha256'), secret, payload)

if computed_signature.bytesize == signature.bytesize && OpenSSL.fixed_length_secure_compare(computed_signature, signature)
  puts 'Signature is valid'
else
  puts 'Signature is invalid'
end
```

**Python**

```python
import hmac
import hashlib

payload = 'Hello! This is a test payload.'
secret = 'Very Secret Secret' # os.environ['SFTPTOGO_WEBHOOK_SINGING_SECRET']

# This should be the value of the X-Hub-Signature header
signature = 'sha256=8ba4c47558de1872150c3ec82211c34bf0cbd6d60fc4f9875b97853af06de917'

computed_signature = 'sha256=' + hmac.new(secret.encode(), payload.encode(), hashlib.sha256).hexdigest()

if hmac.compare_digest(computed_signature, signature):
    print('Signature is valid')
else:
    print('Signature is invalid')
```

**Node.js**

```javascript
const crypto = require('crypto');


const payload = 'Hello! This is a test payload.'
const secret = 'Very Secret Secret' // process.env.SFTPTOGO_WEBHOOK_SINGING_SECRET

// This should be the value of the X-Hub-Signature header
const signature = 'sha256=8ba4c47558de1872150c3ec82211c34bf0cbd6d60fc4f9875b97853af06de917';

const computedSignature = 'sha256=' + crypto.createHmac('sha256', secret).update(payload).digest('hex');

function safeCompare(a, b) {
  var strA = String(a);
  var strB = String(b);

  var aLen = Buffer.byteLength(strA);
  var bLen = Buffer.byteLength(strB);

  // Always use length of a to avoid leaking the length. Even if this is a
  // false positive because one is a prefix of the other, the explicit length
  // check at the end will catch that.
  var bufA = Buffer.alloc(aLen, 0, 'utf8');
  bufA.write(strA);
  var bufB = Buffer.alloc(aLen, 0, 'utf8');
  bufB.write(strB);

  return crypto.timingSafeEqual(bufA, bufB) && aLen === bLen;
}

if (safeCompare(computedSignature, signature)) {
  console.log('Signature is valid');
} else {
  console.log('Signature is invalid');
}

```

### Managing Webhooks

After creating a webhook, you may do the following:

* Pause/Resume - temporarily pause or resume webhook notifications.
* Rotate secret - request a new signing secret. See [Securing Webhooks](#securing-webhooks)
* Ping webhook - manually send a test event to your endpoint
* View deliveries - View a log of the notifications that SFTP To Go has enqueued for delivery. Each notification has a `status` (one of `Succeeded`, `Failed`, 'Pending'), `Created` timestamp, `ID`, `Topic` (one of `file.created`, `file.deleted`, `file.downloaded`, `webhook.ping`) and `Duration`. You may also view the `Request payload`, `Response code`, and `Response body` as well as manually send a webhook payload from within the webhook delivery dialog.

### Receiving Webhooks

When a webhook event that you've subscribed to occurs, SFTP To Go sends a POST request to your server endpoint consisting of the events’ details.

You can verify the authenticity of these requests through any of the following ways:

* The request’s Authorization header matches the value you provided when subscribing to notifications.
* The request’s X-Hub-Signature header contains the HMAC SHA256 signature of the request body (signed with the given secret value provided when subscribing).

A resulting webhook notification request resembles the following:

```
POST https://webhook.site/394f2074-e56f-4110-7bf7-ca14a1f48b7c
Authorization: Bearer 01234567-89ab-cdef-0123-456789abcdef
X-Hub-Signature: cLcN5U5x+jHEkANnVaaRwBw7yE4uv4pXdjcY9Cajc7M=
```

```json
{
  "Id": "2e579289-4c4a-4085-9b43-74020865cdda",
  "Topic": "webhook.ping",
  "UpdatedAt": 1590911947688,
  "CreatedAt": 1590911947688,
  "Actor": {
    "Type": "IAM",
    "Id": "AIDAIKEQXZMPCW5OVTUWU"
  },
  "Resource": "webhook",
  "PreviousData": null,
  "Data": {
    "Topics": [
      "file.deleted"
    ],
    "State": "enabled",
    "Alias": "Test Webhook",
    "CreatedAt": 1590501031122,
    "Id": "6b1c6f0c-52c1-47a6-9344-57a4579ced68",
    "OrganizationId": "d57060b1-23fe-2d59-afd0-7f56d9e1fc55",
    "UpdatedAt": 1590911941179,
    "Url": "https://webhook.site/394f2074-e56f-4110-7bf7-ca14a1f48b7c"
  },
  "Metadata": {
    "Webhook": {
      "Id": "6b1c6f0c-52c1-47a6-9344-57a4579ced68"
    },
    "Delivery": {
      "Id": "c7ce90e6-5708-43b1-a052-13991f45c771"
    },
    "Attempt": {
      "Id": "2e241efe-d22f-4fe7-aab9-adcde63fca6d"
    },
    "Event": {
      "Id": "2e579289-4c4a-4085-9b43-74020865cdda",
      "Topic": "webhook.ping"
    }
  } 
}
```

You should always respond with a 200-level status code to indicate that you had received the notification. SFTP To Go ignores the body of your response, so a 204 status with an empty body is ideal:

```
204 No Content
```

:::note
If you do not return a 200-level status code, SFTP To Go records the failure. The failure can be viewed in the deliveries log.
:::

The `Actor` key contains information on the user who performed the action. If the action was performed by an SFTP / FTPS / Web Portal user, the `Type` would be `User` and the `Id` would be the **username**. If the action was performed by an IAM user (via S3 APIs), the `Type` would be `IAM` and the `Id` would be the IAM user ID.

### file.created Event Format

```json
{
  "Id": "36cd78bc-0662-43b1-a7aa-0cde4876ab2a",
  "Topic": "file.created",
  "CreatedAt": 1591106805970,
  "UpdatedAt": 1591106805970,
  "Actor": {
    "Type": "User",
    "Id": "4ddb9e1265b8edb7685b4e1a5d129f"
  },
  "Resource": "File",
  "PreviousData": null,
  "Data": {
    "Path": "dir/file1.txt",
    "Size": 357464
  },
  "Metadata": {
    "Organization": {
      "Id": "d57060b1-23fe-2d59-afd0-7f56d9e1fc55"
    },
    "Webhook": {
      "Id": "7f3c5b1d-5df4-409f-bbbd-3ac6a72d8b5a"
    },
    "Delivery": {
      "Id": "0a4ed750-fbb8-4718-8a6c-86c35c9b6348"
    },
    "Attempt": {
      "Id": "2cb02803-b3a4-4ccd-bd19-ad769c51b291"
    },
    "Event": {
      "Id": "36cd78bc-0662-43b1-a7aa-0cde4876ab2a",
      "Topic": "file.created"
    }
  }
}
```

:::tip
When a Data.Path value ends with `/`, this indicates that a directory has been created. In all other instances, a file had been created.
:::

:::note
Data.Path is URL encoded - make sure to URL decode it to the get the correct path to the file.
:::

### file.deleted Event Format

```json
{
  "Id": "f63ad40e-711d-482b-979a-dca97281d8b7",
  "Topic": "file.deleted",
  "CreatedAt": 1591106814353,
  "UpdatedAt": 1591106814353,
  "Actor": {
    "Type": "IAM",
    "Id": "AIDAIKEQXZMPCW5OVTUWU"
  },
  "Resource": "File",
  "PreviousData": null,
  "Data": {
    "Path": "dir/file1.txt",
    "Size": null
  },
  "Metadata": {
    "Organization": {
      "Id": "d57060b1-23fe-2d59-afd0-7f56d9e1fc55"
    },
    "Webhook": {
      "Id": "7f3c5b1d-5df4-409f-bbbd-3ac6a72d8b5a"
    },
    "Delivery": {
      "Id": "aecd305e-f080-4c87-b40b-6b3d5d0d17db"
    },
    "Attempt": {
      "Id": "7dc9f0dc-06ad-4585-a9fd-5ac36d73f817"
    },
    "Event": {
      "Id": "f63ad40e-711d-482b-979a-dca97281d8b7",
      "Topic": "file.deleted"
    }
  }
}
```

:::tip
When a Data.Path value ends with `/`, this indicates that a directory has been created. In all other instances, a file had been created.
:::


### file.downloaded Event Format

```json
{
  "Id": "36cd78bc-0662-43b1-a7aa-0cde4876ab2a",
  "Topic": "file.downloaded",
  "CreatedAt": 1591106805970,
  "UpdatedAt": 1591106805970,
  "Actor": {
    "Type": "User",
    "Id": "4ddb9e1265b8edb7685b4e1a5d129f"
  },
  "Resource": "File",
  "PreviousData": null,
  "Data": {
    "Path": "dir/file1.txt",
    "Size": 357464,
    "Metadata": {
      "Protocol": "SFTP", // or "FTPS" or "WEB_PORTAL"
      "ClientIp": "1.2.3.4",
      "SessionId": "1234567890" // Optional, can help with debugging
    }
  },
  "Metadata": {
    "Organization": {
      "Id": "d57060b1-23fe-2d59-afd0-7f56d9e1fc55"
    },
    "Webhook": {
      "Id": "7f3c5b1d-5df4-409f-bbbd-3ac6a72d8b5a"
    },
    "Delivery": {
      "Id": "0a4ed750-fbb8-4718-8a6c-86c35c9b6348"
    },
    "Attempt": {
      "Id": "2cb02803-b3a4-4ccd-bd19-ad769c51b291"
    },
    "Event": {
      "Id": "36cd78bc-0662-43b1-a7aa-0cde4876ab2a",
      "Topic": "file.downloaded"
    }
  }
}
```

:::note
Data.Path is URL encoded - make sure to URL decode it to the get the correct path to the file.
:::

### webhook.ping Event Format

```json
{
  "Id": "2e579289-4c4a-4085-9b43-74020865cdda",
  "Topic": "webhook.ping",
  "CreatedAt": 1590911947688,
  "UpdatedAt": 1590911947688,
  "Resource": "webhook",
  "PreviousData": null,
  "Data": {
    "Topics": [
      "file.created",
      "file.deleted"
    ],
    "State": "paused",
    "Alias": "Test Webhook",
    "CreatedAt": 1590501031122,
    "Id": "6b1c6f0c-52c1-47a6-9344-57a4579ced68",
    "OrganizationId": "d57060b1-23fe-2d59-afd0-7f56d9e1fc55",
    "UpdatedAt": 1590911941179,
    "Url": "https://webhook.site/394f2074-e56f-4110-7bf7-ca14a1f48b7c"
  },
  "Metadata": {
    "Webhook": {
      "Id": "6b1c6f0c-52c1-47a6-9344-57a4579ced68"
    },
    "Delivery": {
      "Id": "c7ce90e6-5708-43b1-a052-13991f45c771"
    },
    "Attempt": {
      "Id": "2e241efe-d22f-4fe7-aab9-adcde63fca6d"
    },
    "Event": {
      "Id": "2e579289-4c4a-4085-9b43-74020865cdda",
      "Topic": "webhook.ping"
    }
  }
}
```


### Filtering Webhooks

With webhook filters, you can specify conditions that must be met for SFTP To Go to trigger events. This allows you to create customized rules for triggering webhooks, based on specific criteria.

Webhook filters use the AND operator to combine filtering rules. This means that all specified conditions must be met in order for the webhook to be triggered. Each rule consists of three elements: field, operator, and value.

#### Fields

The following fields can be used in a webhook filter:

* **Path**: The path to the file that triggered the event.
* **Actor ID**: The identifier of the actor - the user that initiated the action that triggered the event. This can be the user ID in case of an SFTP/FTPS operation or the IAM access key in case of an S3 operation.
* **Actor Type**: The type of the actor - "User" for SFTP/FTPS operations or "IAM" for S3 operations.

#### Operators

The following operators can be used in a webhook filter:

* **Is**: Checks if the field and value match exactly (e.g. Actor Type Is User).
* **Is not**: Checks if the field and value don't match (e.g. Actor Type Is not IAM).
* **Contains**: Checks if the field contains the value (e.g. Path Contains user).
* **Doesn't contain**: Checks if the field does not contain the value (e.g. Path Doesn't contain user).
* **Starts with**: Checks if the field starts with the value (e.g. Path Starts with /user).
* **Ends with**: Checks if the field ends with the value (e.g. Path Ends with mary).
* **Matches**: Checks if the field matches the regular expression in the value (e.g. Path Matches (mila|mary|greg)).

By using webhook filters, you can create powerful rules for triggering webhooks based on specific criteria.
