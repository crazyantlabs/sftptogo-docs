---
sidebar_label: 'File Browser'
title: 'File Browser'
sidebar_position: 10
---

SFTP To Go's web file browser is a powerful tool that allows users to manage their files and folders with ease without installing an SFTP client. In this guide, we'll examine the various features of the file browser and provide tips on how to utilize them effectively.

## Organizing files and folders

### Navigation

The file browser provides several tools to make navigation easy and intuitive. The navigation bar, or breadcrumbs, shows you where you are in the folder hierarchy and allows you to quickly jump back to a higher level. Clicking on a folder will take you inside it, where you can view its contents.

The file list shows the list of files and folders within the current folder and provides useful information about each file and folder. For files, the list displays the file name, modification date, file type, and size. For folders, it displays the folder name and creation date.

To create a new folder, click on the "New Folder" button and enter the new folder name.  The file browser automatically paginates long lists of files and folders, allowing for easy browsing by loading new content dynamically as you scroll through the page.

### Copying, Moving, Renaming

The file browser allows you to copy, move, and rename files and folders. To copy or move files or folders within your storage, simply select them (multiple files and folders can be copied or moved at the same time) and choose the appropriate action from the menu. Then choose the target folder and continue to complete the action. Note that if the target folder contains a file with the same name as one of the files you selected to copy or move, the target will be overwritten. 

To rename a file, select it and choose the rename action from the menu. However, folders cannot be renamed due to the nature of our underlying storage - Amazon S3. Instead of renaming a folder, you can create a new folder and move the content of the original folder to the new folder.

### Deleting files and folders

To delete a file or folder, select it and choose "Delete" from the menu. Be careful when deleting files or folders, as this action cannot be undone.

## Uploading and Downloading files

The file browser allows you to easily upload and download files. To upload files, simply click the "Upload" button in the menu and drag and drop the files into the browser window. 

To download a file, select it and choose "Download" from the menu.

## Limitations

File names may contain any unicode character, but in order to play nicely with SFTP and S3 clients, file and folder names cannot contain the following characters:

* Ampersand ("&")
* Dollar ("$")
* 'At' symbol ("@")
* Equals ("=")
* Semicolon (";")
* Forward slash ("/")
* Colon (":")
* Plus ("+")
* Comma (",")
* Question mark ("?")
* Backslash ("\")
* Left curly brace ("{")
* Caret ("^")
* Right curly brace ("}")
* Percent character ("%")
* Grave accent / back tick ("`")
* Right square bracket ("]")
* Quotation marks (",')
* 'Greater Than' symbol (">")
* Left square bracket ("[")
* Tilde ("~")
* 'Less Than' symbol ("<")
* 'Pound' character ("#")
* Vertical bar / pipe ("|")

It is also recommended not to use file or folder names longer than 255 characters.

File upload via the web file browser doesn't support resuming uploads. 