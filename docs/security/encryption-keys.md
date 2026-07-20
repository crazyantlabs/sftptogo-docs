---
sidebar_label: 'Encryption Keys'
title: 'Managing encryption keys'
sidebar_position: 20
---

PGP keys let you encrypt and decrypt files as part of an [automation](../automation/automations). Store the keys you need once under **Settings → Security → Encryption keys**, then reference them from the **PGP encrypt** and **PGP decrypt** automation actions — the key material never has to be entered into an automation.

You can store up to **5** encryption keys per organization.

## How keys are used

* A **public key** can **encrypt**. Import a partner's public key to encrypt files you send them; only the holder of the matching private key can read them.
* A **private key** can **decrypt** — and also encrypt, since its public half is derived automatically. Import a private key to decrypt files that were encrypted to you.

Each key shows its capabilities (**Can encrypt** / **Can decrypt**), whether it includes a **Private key**, its fingerprint, and an expiry date if it has one.

## Supported algorithms

RSA keys (2048–4096 bit) and ECC keys on Curve25519, the NIST curves (P-256, P-384, P-521), and the Brainpool curves. To be usable for encryption, a key must include an encryption-capable (sub)key — sign-only keys can be stored but can't encrypt.

## Importing a key

Under **Settings → Security → Encryption keys**, click **Import key**, and provide:

* `Name` (optional) — a label to recognize the key by. Leave it blank to default to the key's identity (its user ID), or the key fingerprint when the key has no user ID.
* `Key` — paste the ASCII-armored key block (it begins with `-----BEGIN PGP PUBLIC KEY BLOCK-----` for a public key, or `-----BEGIN PGP PRIVATE KEY BLOCK-----` for a private key), or drag a key file onto the field to load it. Import one key at a time.
* `Passphrase` (optional) — required only when importing a passphrase-protected private key. The passphrase is checked at import, so a wrong or missing one is caught immediately rather than when an automation runs.

:::note
You can also import a key without leaving the automation builder: the **PGP key** field on a PGP encrypt or decrypt action has a **+ New key** option that imports a key and selects it for the action.
:::

## Renaming, rotating and deleting

Use the menu next to a key to:

* **Rename** — change the label.
* **Rotate (re-import)** — replace the key's material with a newly imported key, keeping the same entry (and any automations that reference it).
* **Delete** — remove the key. Any automation action that references a deleted key will fail when it next runs, so update those actions first.

## Security

* Private keys and passphrases are stored **encrypted** and are **never shown again** after import — only the derived public key and non-secret metadata are ever returned.
* Importing, rotating, and deleting a key are recorded in your [audit logs](./audit-logs) (the key material is never logged).
