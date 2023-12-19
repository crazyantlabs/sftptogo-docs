---
sidebar_label: 'Connect using Web Portal'
title: 'Connect using Web Portal (Beta)'
sidebar_position: 10
---
The web portal allows users with SFTP To Go credentials to use their web browser to manage files in their designated storage (that is, in their home directory).

To use the web portal, you will first have to enable the web portal in your organization's [settings tab](../getting-started/organization-settings#web-portal).
Use your organization's portal login link (found in the settings tab) to login:

1. Enter a credentials username and password.
2. Click the "Log in" button.

:::note
You can also use a shortcut from within your SFTP To Go dashboard to connect as any credential in your list by clicking the menu button (...) and then "Open web portal".
:::

## Organizing files and folders

### Navigation

The web portal provides several tools to make navigation easy and intuitive. The navigation bar, or breadcrumbs, shows you where you are in the folder hierarchy and allows you to quickly jump back to a higher level. Clicking on a folder will take you inside it, where you can view its contents. Keep in mind that each user has a designated home directory which shows as the root directory in the user's navigation (identified by the home icon).

### Creating folders and uploading files

To create a new folder, click on the "+" button next to the current folder, and then "New folder". Enter the new folder name.

To upload files or folders, click on the "+" button next to the current folder and then "Upload files". Either drag and drop files or folders to the drag area or click "browse files" to open a file browser dialog and select files to upload. The portal allows uploading up to 1,000 files in a single action.

### The items list

The item list shows the list of files and folders within the current folder and provides useful information about each file and folder. For files, the list displays the file name, modification date, file type, and size. For folders, it displays the folder name and creation date. The web portal paginates long lists of files and folders, and shows 100 items in each page.

Each item has a menu button (...) which allows you to perform various actions on the file:

* Download file
* Open file in browser
* Rename file
* Duplicate file (create a copy within same folder)
* Copy or move file to another folder
* Copy file path to clipboard.

### Bulk oprations

When you check all or some files or folders in the items list, the number of selected items show above the items list with a menu button (...) which allows you to perform bulk operations on selected items:

* Copy selected files to another folder
* Move selected files to another folder
* Delete selected items


## Limitations

File names may contain any unicode character, but in order to play nicely with SFTP and S3 clients, file and folder names cannot contain the following characters:

* 'Pound' character ("#")
* Percent character ("%")
* Caret ("^")
* Asterisk ("\*")
* Left square bracket ("[")
* Right square bracket ("]")
* Left curly brace ("{")
* Right curly brace ("}")
* Grave accent / back tick ("`")
* Quotation marks (",')
* 'Greater Than' symbol (">")
* 'Less Than' symbol ("<")
* Forward slash ("/")

It is also recommended not to use file or folder names longer than 255 characters.

File upload via the web web portal doesn't support resuming uploads.