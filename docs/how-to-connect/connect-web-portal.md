---
sidebar_label: 'Connect using Web Portal'
title: 'Connect using Web Portal'
sidebar_position: 10
---
The web portal enables users with SFTP To Go credentials to manage files in their designated storage (i.e., their home directory) using a web browser over a secure HTTPS channel.

To access the web portal, first enable it in your organization's [settings tab](../getting-started/organization-settings#web-portal).
Then, log in using your organization's portal login link, which can be found in the settings tab:

1. Enter a credentials username and password.
2. Click the "Log in" button.

:::note
Alternatively, use a shortcut from your SFTP To Go dashboard to connect as any user on your credentials list. Click the menu button (...) and select "Open web portal".
:::

## Organizing files and folders

### Navigation

The web portal offers various tools for easy and intuitive navigation. The navigation bar, also known as breadcrumbs, displays your current location in the folder hierarchy and enables quick navigation to higher levels. Clicking on a folder will open it, allowing you to view its contents. Remember, each user has a designated home directory, which appears as the root directory in their navigation and is marked by the home icon.

### Creating folders and uploading files

To create a new folder, select the "+" button beside the current folder, then choose "New folder". Name the new folder.

To upload files or folders, select the "+" button beside the current folder and choose "Upload files". Drag and drop files or folders into the designated area, or select "browse files" to open a file browser and choose files for upload. The portal supports uploading a maximum of 1,000 files at once.

### The items list

The item list displays files and folders in the current directory, providing details like file name, modification date, file type, and size for files, and folder name and creation date for folders. For lengthy lists, the web portal paginates, showing 100 items per page.

Each item includes a menu button (...) for actions such as:

* Download file
* Open file in browser
* Rename file
* Duplicate file (create a copy within same folder)
* Copy or move file to another folder
* Copy file path to clipboard.

### Bulk oprations

Selecting all or some files/folders in the items list displays the count of selected items above the list, along with a menu button (...). This allows bulk operations on the selected items:

* Copy selected files to another folder
* Move selected files to another folder
* Delete selected items


## Limitations

File and folder names can include any Unicode character. However, for compatibility with SFTP and S3 clients, they must not contain the following characters:

* 'Pound' character ("#")
* Percent character ("%")
* Caret ("^")
* Asterisk ("\*")
* Left square bracket ("`[`")
* Right square bracket ("`]`")
* Left curly brace ("`{`")
* Right curly brace ("`}`")
* Grave accent / back tick ("`")
* Quotation marks (",')
* 'Greater Than' symbol ("`>`")
* 'Less Than' symbol ("`<`")
* Forward slash ("/")

Additionally, avoid using file or folder names longer than 255 characters.

:::note
 File upload through the web portal does not support resuming interrupted uploads.
:::