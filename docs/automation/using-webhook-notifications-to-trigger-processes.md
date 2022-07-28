---
sidebar_label: 'Webhook notifications'
title: 'Using webhooks notification to trigger processes'
sidebar_position: 1
---
Webhooks enable you to receive notifications whenever particular events occur within your SFTP To Go organization's storage. You can subscribe to notifications for the following events:

* File / directory creation
* File / directory deletion

Webhook notifications are sent as HTTP POST requests to a URL of your choosing. To integrate with webhooks, you need to implement a server endpoint that can receive and handle these requests.

:::info
Please note that our webhooks don’t work with self-signed certs. If a webhook detects a self-signed cert, it will result in an error and no request will be sent.
:::

To subscribe to webhooks, click **Webhooks** from the menu, and then click the `Add webhook` button.

In the dialog that opens, fill out the following:

* Nickname (optional) - a descriptive name for your webhook.
* Endpoint
  * URL - HTTPS URL of the endpoint that will receive all webhook notifications.
  * Type - select one of the supported endpoint types:
    * Webhook - send a HTTP POST requests to the endpoint URL
    * Slack - send a Slack message to the endpoint URL which should be a valid [Slack incoming webhook URL](https://slack.com/help/articles/115005265063-Incoming-webhooks-for-Slack)
* Authorization Header (optional) - a custom `Authorization` header that will be included with all webhook notifications.
* Topics - select the types of notifications you want to be informed about. You must include at least one topic.

Finish by clicking `Add webhook`.

### Securing Webhooks

Once a webhook is created, a signing secret is generated and displayed one time. 

Each request is signed by SFTP To Go in the X-Hub-Signature header. If you’d like to verify the authenticity of our request, copy the signing secret and use it to verify the webhook signature. You can rotate the signing secret at any time to be assigned a new one.

You may also use an authorization header to verify that the request did, indeed, come from SFTP To Go. When properly set, the authorization header is passed through in the `Authorization` header in the request. It should be validated using the authorization mechanism of your choice on through your server.

### Managing Webhooks

After creating a webhook, you may do the following:

* Pause/Resume - temporarily pause or resume webhook notifications.
* Rotate secret - request a new signing secret. See [Securing Webhooks](#securing-webhooks)
* Ping webhook - manually send a test event to your endpoint
* View deliveries - View a log of the notifications that SFTP To Go has enqueued for delivery. Each notification has a `status` (one of `Succeeded`, `Failed`, 'Pending'), `Created` timestamp, `ID`, `Topic` (one of `file.created`, `file.deleted`, `webhook.ping`) and `Duration`. You may also view the `Request payload`, `Response code`, and `Response body`as well as manually send a webhook payload from within the webhook delivery dialog.

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

The `Actor` key contains information on the user who performed the action. If the action was performed by an SFTP user, the `Type` would be `User` and the `Id` would be the username. If the action was performed by an IAM user (via S3 APIs), the `Type` would be `IAM` and the `Id` would be the IAM user ID.

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
