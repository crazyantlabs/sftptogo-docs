---
sidebar_label: 'PGP Keys'
title: 'Managing PGP keys'
sidebar_position: 20
---

PGP keys let you encrypt and decrypt files as part of an [automation](../automation/automations). Store the keys you need once under **Settings → Keys**, then reference them from the **PGP encrypt** and **PGP decrypt** automation actions — the key material never has to be entered into an automation.

## How keys are used

* A **public key** can **encrypt**. Import a partner's public key to encrypt files you send them; only the holder of the matching private key can read them.
* A **private key** can **decrypt** — and also encrypt, since its public half is derived automatically. Import (or generate) a private key to decrypt files that were encrypted to you.

Each key shows its capabilities (**Can encrypt** / **Can decrypt**), whether it includes a **Private key**, its fingerprint, and an expiry date if it has one.

## Importing a key

Go to **Settings → Keys**, click **Import key**, and provide:

* `Name` — a label to recognize the key by.
* `Armored key` — paste the ASCII-armored key block (it begins with `-----BEGIN PGP PUBLIC KEY BLOCK-----` or `-----BEGIN PGP PRIVATE KEY BLOCK-----`). Import one key at a time.
* `Passphrase` (optional) — required only when importing a passphrase-protected private key. The passphrase is checked at import, so a wrong or missing one is caught immediately rather than when an automation runs.

## Generating a key pair

If you don't already have a key pair, click **Generate key pair** and provide:

* `Name` — a label for the key.
* `Identity` — a name and/or email address embedded in the key's user ID.
* `Algorithm` — **ECC (Curve25519)** is recommended (fast and compact); **RSA 2048** and **RSA 4096** are also available for compatibility with older tools.
* `Expiry` — never, 1 year, or 2 years.
* `Passphrase` (optional) — protects the generated private key.

When generation finishes, the **private key is shown once** for you to download and back up. This is the only time it can be retrieved — store it somewhere safe. The public key can be downloaded at any time.

:::note
You can also create a key without leaving the automation builder: the **PGP key** field on a PGP encrypt or decrypt action has a **+ New key** option that generates or imports a key and selects it for the action.
:::

## Renaming, rotating and deleting

Use the menu next to a key to:

* **Rename** — change the label.
* **Rotate (re-import)** — replace the key's material with a newly imported key, keeping the same entry (and any automations that reference it).
* **Delete** — remove the key. Any automation action that references a deleted key will fail when it next runs, so update those actions first.

## Security

* Private keys and passphrases are stored **encrypted** and are **never shown again** after import — only the derived public key and non-secret metadata are ever returned. (Generated private keys are the sole exception: they're offered for download once, at generation time.)
* Importing or generating, rotating, and deleting a key are recorded in your [audit logs](./audit-logs) (the key material is never logged).
