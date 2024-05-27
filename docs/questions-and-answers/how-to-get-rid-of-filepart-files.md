---
sidebar_label: 'How to get rid of .filepart files?'
title: 'Why am I seeing redundant .filepart files in my SFTP To Go storage?'
sidebar_position: 2
---

If you're seeing .filepart files in your SFTP To Go storage, the issue is due to the behavior of WinSCP, which is being used by the uploader of the files in such cases. By default, WinSCP transfers files using a temporary filename with a `.filepart` extension. 

Once the transfer is complete, WinSCP renames the file to its final name, but this may fail due to user permissions, connectivity issues or other issues. 

Furthermore, upload of files with the `.filepart` extension could trigger webhook actions where triggers are set to that filename, which may not be desired. 

To disable this behaviour, follow these steps:

1. Open WinSCP.
2. Navigate to **Options > Preferences**.
3. Expand the **Transfer** section and click on **Endurance**.
4. Under **Enable transfer resume/Transfer to temporary filename for**, select **Disable**.
5. Click **OK** to save the changes.

By disabling this WinSCP feature, files will be uploaded directly to their final names, eliminating the issue of redundant .filepart files.
