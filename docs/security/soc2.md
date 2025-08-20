---
sidebar_label: 'SOC 2 Compliance'
title: 'SOC 2 Compliance with SFTP To Go'
sidebar_position: 41
---

SOC 2 is an independent attestation based on the AICPA Trust Services Criteria. It evaluates how a service organization designs and operates controls for Security, Availability, Confidentiality, Processing Integrity, and Privacy.

SFTP To Go focuses on the Security, Availability, and Confidentiality criteria. Our environment and controls are assessed annually by an independent auditor. You may request our SOC 2 Type II report under NDA - please reach out to our team for more information.

SFTP To Go operates on Amazon Web Services (AWS) and follows a defense-in-depth approach. We combine strong encryption, strict access controls, network protections, monitoring, and tested recovery procedures.

## Data location

When you sign up, select the AWS region where your data will be hosted. SFTP To Go supports regional data residency and multi-region options for disaster recovery on eligible plans.

## Data protection

All data in transit uses encrypted protocols, including HTTPS, SFTP, and FTPS with modern ciphers. Files at rest are encrypted on Amazon S3 using server-side encryption with AES-256.

## Access control and authentication

* Admin adshbaord access supports multi-factor authentication for organization administrators.
* Passwords for SFTP and FTPS users are enforced to be strong and complex by default.
* Access follows least-privilege principles using roles and policies. Secrets are stored in secure services.

## Network security and monitoring

* Endpoints expose only the ports required for SFTP, FTPS, and HTTPS.
* IP safelisting by address or CIDR range is available on eligible plans.
* Logs and metrics are collected and monitored. Threat detection and vulnerability scanning are part of our standard operations.

## Change management and software lifecycle

Infrastructure and application changes use version control and peer review. Deployments are automated and traceable. Security updates are applied as part of a managed release process.

## Incident response

An incident response plan defines roles, communication channels, and customer notification steps. The plan is reviewed and tested at least annually.

## Backup, durability, and availability

SFTP To Go uses Amazon S3 for storage. S3 is designed for high durability and availability. Where required, backups and disaster recovery options are available per plan. AWS states an S3 service level agreement of 99.9% availability and a design for 99.99% availability and 99.999999999% durability.

## Audit logs

File access audit logs are available by request. Logs include timestamp, IP address, username, and the action taken.

## Shared responsibility

SFTP To Go secures the service and its underlying infrastructure. Customers manage their own user accounts, keys, passwords, IP safelists, and data retention settings to meet their internal policies.

## Request our SOC 2 report

Enterprise customers can request our SOC 2 Type II report. An NDA is required. Contact us via Intercom or your account team.
