---
sidebar_label: 'HIPAA Compliance'
title: 'HIPAA Compliance with SFTP To Go'
sidebar_position: 40
---

The Health Insurance Portability and Accountability Act (HIPAA) establishes national standards for the privacy, security, and breach notification of individuals' protected health information (PHI). HIPAA applies to covered entities and their business associates, as defined by the law.

Covered entities are healthcare providers, health plans, and healthcare clearinghouses that transmit any health information in electronic form in connection with certain administrative and financial transactions. Examples of covered entities include hospitals, doctors' offices, nursing homes, pharmacies, and health insurance companies.

Business associates are individuals or entities that perform certain functions or activities on behalf of a covered entity, such as billing companies, claims processing companies, third-party administrators, and other contractors or vendors. Business associates are also required to comply with HIPAA regulations.

Covered entities who require a secure cloud storage service can use SFTP To Go after signing a BAA (Business Associate Agreement) that establishes the parameters for the relationship between covered entity and business associate, outlining the responsibilities of the business associate in protecting the privacy and security of PHI.

SFTP To Go completes an annual assessment of security risks in addition to ongoing risk analysis, to ensure that our service meets changing security requirements and threats. 

As part of our HIPAA program, we sign BAAs with customers on eligible plans. Contact our team for more information.

## Data location

When you sign up to SFTP To Go, select the region you would like your data to be hosted on. As an American covered entity, select one of the United States regions.

## PHI data protection

In transit, all communication is encrypted with AES-256 bit using the HTTPS, SFTP and FTPS protocols. At rest, files are encrypted on Amazon S3 using server side encryption with AES-256 bit.

## Privacy and intrusion protection

* SFTP To Go's endpoints only allow access to the ports required to serve SFTP, FTPS and HTTPS.

* Multi-factor authentication can be enabled and monitored for all administrators in an organization for web access.

* SFTP and FTPS passwords are by default strong and complex for all users and cannot be overridden by simple passwords.

* Inbound network rules allow IP safelisting (by specific IP addresses or CIDR notation for address range) is allowed in certain plans. If your security team requires IP safelisting, make sure to select the right plan for this.

* File access audit logs are provided by request. The logs track timestamp, IP addresses, usernames, and file access. 

## Storage durability and high availability

SFTP To Go uses Amazon Web Services (AWS) for its infrastructure. SFTP To Go's storage layer is Amazon S3 (Simple Storage Service), which is a cloud-based storage solution that offers high durability and availability, making it a secure and reliable option for healthcare organizations that need to store and transmit protected health information (PHI) in compliance with HIPAA regulations.

Amazon Web Services' SLA for S3 is [99.9%](http://aws.amazon.com/s3/sla/). It is designed for 99.99% availability and 99.999999999% durability.

## Requesting a BAA

BAAs are available on eligible plans. To request our standard BAA or to discuss custom BAAs, please contact us via the in-app chat or email.
