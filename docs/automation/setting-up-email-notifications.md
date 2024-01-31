---
sidebar_label: 'Email notifications'
title: 'Setting up email notification'
sidebar_position: 2
---

SFTP To Go's email notifications alert you when files are uploaded or deleted. You can choose to receive notifications for all activities across your entire storage, or customize them to focus on specific files, paths, types, or even based on who performed the action.

To create a new email notification, click **Webhooks** from the menu, and then click the `Add webhook` button.

In the dialog that opens, fill out the following:

* Nickname (optional) - a descriptive name for this notification.
* Endpoint  
  * Type - select <b>email</b>.  
  * Enter a single email address.
* Topics - select the types of notifications you want to be informed about. You must include at least one topic.
* Filter (optional) - apply filtering rules to trigger notifications that meet the specified criteria, i.e. have (or don't have) certain properties.
  * File created - File upload and directory creation
  * File deleted - File or directory deletion


Finish by clicking `Add webhook`.

### Filtering Email notifications

With filters, you can specify conditions that must be met for SFTP To Go to trigger events. This allows you to create customized rules for triggering email notifications, based on specific criteria.

Filters use the AND operator to combine filtering rules. This means that all specified conditions must be met in order for the webhook to be triggered. Each rule consists of three elements: field, operator, and value.

#### Fields

The following fields can be used in a filter:

* **Path**: The path to the file that triggered the event.
* **Actor ID**: The identifier of the actor - the user that initiated the action that triggered the event. This can be the user ID in case of an SFTP/FTPS operation or the IAM access key in case of an S3 operation.
* **Actor Type**: The type of the actor - "User" for SFTP/FTPS operations or "IAM" for S3 operations.

#### Operators

The following operators can be used in a filter:

* **Is**: Checks if the field and value match exactly (e.g. Actor Type Is User).
* **Is not**: Checks if the field and value don't match (e.g. Actor Type Is not IAM).
* **Contains**: Checks if the field contains the value (e.g. Path Contains user).
* **Doesn't contain**: Checks if the field does not contain the value (e.g. Path Doesn't contain user).
* **Starts with**: Checks if the field starts with the value (e.g. Path Starts with /user).
* **Ends with**: Checks if the field ends with the value (e.g. Path Ends with mary).
* **Matches**: Checks if the field matches the regular expression in the value (e.g. Path Matches (mila|mary|greg)).

By using filters, you can create powerful rules for triggering email notifications based on specific criteria.
