---
sidebar_label: 'Connect using Web Portal'
title: 'Connect using Web Portal'
sidebar_position: 10
---
The web portal enables users with SFTP To Go credentials to manage files in their designated storage (i.e., their home directory) using a web browser over a secure HTTPS channel.

To access the web portal, first ensure it is enabled in your organization's [settings tab](../getting-started/organization-settings#web-portal).
Then, log in using your organization's portal login link, which can be found in the settings tab:

1. Enter a credentials username
2. Enter a credentials password or click "Email sign-in code" if the credentials are associated with an email address and the [Magic Code](../getting-started/organization-settings#authentication-methods) authentication method is enabled).
3. If MFA is enabled, use an extra factor in the authentication process.

:::note
Alternatively, use a shortcut from your SFTP To Go dashboard to connect as any user on your credentials list. Click the menu button (...) and select "Open web portal".
:::

:::note
Credentials associated with email addresses can reset their passwords without contacting an administrator by initiating the "Forgot password" flow.
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
* Print file
* Rename file
* Duplicate file (create a copy within same folder)
* Copy or move file to another folder
* Copy file path to clipboard.

**Print** is available for files the browser can display: PDFs, images, plain text and code, CSV and TSV spreadsheets, and Markdown. When previewing one of these files you can also press `Cmd`+`P` (or `Ctrl`+`P`) to print it. Some browsers cannot print PDFs directly — in that case the file opens in a new tab so you can print it from there.

### Searching, sorting and filtering

When your organization turns on [advanced search](../getting-started/organization-settings#advanced-search), the file browser adds a search box, filters and sortable columns.

#### Searching

1. Click the **Search files by name...** box, or press `/` or `Cmd`+`K` (`Ctrl`+`K` on Windows and Linux).
2. Type part of a file or folder name and press `Enter`.

The search covers the folder you are in and all of its subfolders, and the folder breadcrumbs change to **Search results**. Every word you type must appear in the name, in any order and regardless of case, so "annual report" finds `2026_Annual-Report.pdf`. When nothing matches exactly, the web portal shows close matches instead, so a small typo still finds the file. Close matches are listed by how closely they match, not by the column you sort by.

Each result shows the folder it is **in**. Click a result to open it, or click its folder to go to that folder. To go to a result's folder from its menu button (...), select **Go to parent folder**.

To change where the search looks, use the **In:** control beside the search box:

* **Anywhere**: every folder you can access.
* **_folder_ and subfolders**: the current folder and everything under it (the default).
* **_folder_ only**: the current folder, without its subfolders.

To leave the search, clear the search box. Opening another folder also leaves the search; your browser's back button returns you to the results.

#### Filtering

Use the filters beside the search box to narrow the list. With a search, they narrow the search results; without one, they narrow the current folder only.

* **Type**: select one or more types, such as **Folders**, **Documents**, **PDFs**, **Pictures**, **Spreadsheets** or **Other**.
* **Modified**: select a quick range, from **Past 5 minutes** to **Past year**, or set a custom range with **On or after** and **On or before**, then click **Apply**.
* **Size**: select a preset, from **Tiny** (under 100 KB) to **Massive** (over 1 GB), or set a custom range with **Greater than** and **Less than**, then click **Apply**.

To clear a filter, click the × beside it.

If nothing matches, click **Search anywhere** to apply the same search and filters to every folder you can access (offered unless they already cover them), or **Clear search and filters** to go back to the folder.

#### Sorting

Click the **Name**, **Type**, **Size** or **Modified** column header to sort by it. Click the same header again to reverse the order, and a third time to return to the default order, by name. Folders are always listed before files.

Search, filters and sorting also work in shared folder links, limited to the shared folder.

On small screens, the filters appear only while one of them is active, and only the **Name** column is shown.

:::note
New, changed and deleted files show up in search shortly after the change.
:::

:::info
This feature is only available with certain plans. Read more about our different plans [here](https://sftptogo.com/pricing)
:::

### Bulk operations

Selecting all or some files/folders in the items list displays the count of selected items above the list, along with a menu button (...). This allows bulk operations on the selected items:

* Copy selected files to another folder
* Move selected files to another folder
* Delete selected items

## User Settings

Click the avatar at the top-right corner of the screen in order to change user settings such as Multi-factor authentication.

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