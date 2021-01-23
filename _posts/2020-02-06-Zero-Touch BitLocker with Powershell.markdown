---
title:  "Zero-Touch BitLocker with PowerShell"
excerpt: "The heart and soul of all this is a single PowerShell script which is designed to check several pre-requisites are met before enabling BitLocker on the local system drive and backing up the recovery key to AD."
date:   "2020-02-06"
categories: 
- "SECURITY"
tags: 
- "BITLOCKER"
- "POWERSHELL"
- "AUTOMATION"
---
The majority of IT engineers and architects traverse various forms of security on a daily basis ranging from our complex alphanumeric corporate logon passwords to the increasingly common MFA prompts on our mobiles. You could say that we have become experts in navigating modern security measures required to stay protected. But perhaps you're not familiar in planning and rolling out that same security, at scale, to your organisation's Windows laptops in the form of disk encryption.

So the main subject matter of this post is BitLocker because a while back (>12 mths) a customer with >1000 corporate laptops spread across 90 locations and 3 countries needed a solution. In my dreams I imagined sending an email out to those 1000 users politely asking them to enable BitLocker - with instructions of course!

![Windows 10 BitLocker Management GUI](/assets/images/BitLocker-capture-300x105.png "Windows 10 BitLocker Management GUI")

In reality I needed to automate the activation of BitLocker disk encryption on the system drives of these laptops with as little user intervention as possible.

# A Zero-Touch BitLocker Deployment

This is such a catchy heading I had to reuse it. If this is new to you I recommend Adam Eyob and his [deep-dive post](https://adameyob.com/2016/12/08/zero-touch-bitlocker-deployments/) on zero-touch BitLocker which really helped me get a handle on the difficulties involved with enterprise deployments. There's a lack of quality community guidance out there on this particular subject so I appreciate the effort Adam undertook to document his solution and share it with the world.

You might be wondering what is Zero-Touch BitLocker? Basically it means the TPM chip and BitLocker work together to unlock the drive upon system startup - without user intervention. No passwords, pin codes, or USB keys required for the user which is a win-win for everyone!

BTW, here's what a TPM chip looks like.

![TPM Chip](/assets/images/TPM_Asus-2-300x255.jpg "Source = Wikipedia")

I don't recommend opening up your laptop to discover yours as that could void the manufacturer's warranty! Instead run this cmdlet in an elevated PowerShell window:

```powershell
Get-WmiObject win32_tpm -Namespace root\cimv2\security\microsofttpm
```

If you get any output from the above cmdlet then you have a TPM chip and can relax because using BitLocker on your OS/system drive can be a seamless experience :-)

> Enabling BitLocker without a TPM chip is still possible but you'll need to use another method to unlock the encrypted OS drive such as a password or USB Key. Activating BitLocker without TPM available is unfavourable because passwords can be forgotten and USB devices are easily lost.

Anyways let's begin with a simple diagram of our solution to put things into perspective. We might call this a birds eye view? :-)

![Birds Eye](/assets/images/Birds_eye.png)

![BitLocker Enterprise Solution Diagram](/assets/images/BitLocker-Design-Diagram.png "BitLocker Enterprise Solution Diagram")

I've attempted to summarise the above solution with this short description:

* AD-joined Laptops running Windows 8 Pro/Ent and above with a TPM 1.2 or higher will be protected by zero-touch BitLocker encryption.
* AD leveraged to securely store BitLocker Recovery Keys against the AD Computer object.
* 1x GPO used to configure and enforce common BitLocker variables (e.g. Encryption Method and Cipher). Targeted to Laptop OUs.
* 1x GPO used to run a PS script upon computer shutdown. Targeted to Laptop OUs.
* 1x PS script automates the activation of BitLocker encryption on the local system drive and any non-interactive pre-requisites required (TPM initialisation, BitLocker volume provisioning). This script will also backup any/all BitLocker Recovery Keys to the nearest AD DC for safe storage and easy retrieval if required!
* The initial disk encryption process runs in the background invisible to the Laptop's end-user once the machine is powered on again after the PS script has successfully completed all steps.

## The Script
The heart and soul of all this is a single PowerShell script which is designed to check several pre-requisites are met before enabling BitLocker on the local system drive and backing up the recovery key to Active Directory. As per my diagram above I am applying this PS script from a GPO to run during a corporate Laptop's system shutdown. I found this reduced user impact and was as seamless as it gets.

I recommend creating and testing your own script by taking elements that you require from below as some sections may not apply to your environment/needs.

<script src="https://gist.github.com/jesseloudon/7f7482916c2c4c993948c2157a537045.js"></script>

Assuming you may want to reverse engineer and improve upon this imperfect script I’ve included descriptions below of the logic to smooth the journey.

![bitlocker powershell logic table](/assets/images/table-zero-touch-bitlocker-deployment-with-powershell.png)

# Overall Approach

To make this easier, and depending on the scale of your environment, my recommendation is to split your BitLocker project into the following phases below and iterate on each phase where necessary.

* Phase 1 = BitLocker Discovery - Identity current state (# of laptops, specs, BitLocker status)
* Phase 2 = BitLocker Design - Design target state and implementation approach
* Phase 3 = BitLocker Pilot - Test the implementation
* Phase 4 = BitLocker Rollout - Complete the implementation

So for example, if your organisation has new laptops being provisioned frequently the BitLocker Discovery phase can be run multiple times using mgmt software such as System Center Configuration Manager (SCCM). This will help to maintain the current state view and results can be fed into PowerBI from SCCM for some nice visual reporting.

For my project I used several SCCM query statements to keep track of Laptops with/without a TPM chip and the status of BitLocker.

<b>SCCM Query Name: TPM discovery</b>

```
select distinct SMS_R_System.Name, SMS_R_System.ADSiteName, SMS_R_System.IPAddresses, SMS_R_System.DistinguishedName, SMS_R_System.LastLogonUserName, SMS_R_System.operatingSystem, SMS_G_System_COMPUTER_SYSTEM.Domain, SMS_G_System_COMPUTER_SYSTEM.Manufacturer, SMS_G_System_COMPUTER_SYSTEM.Model, SMS_G_System_TPM.IsEnabled_InitialValue, SMS_G_System_TPM.SpecVersion, SMS_G_System_PROCESSOR.Is64Bit from SMS_R_System inner join SMS_G_System_COMPUTER_SYSTEM on SMS_G_System_COMPUTER_SYSTEM.ResourceID = SMS_R_System.ResourceId inner join SMS_G_System_PROCESSOR on SMS_G_System_PROCESSOR.ResourceID = SMS_R_System.ResourceId inner join SMS_G_System_TPM on SMS_G_System_TPM.ResourceID = SMS_R_System.ResourceId order by SMS_G_System_COMPUTER_SYSTEM.Model
```

<b>SCCM Query Name: TPM and BitLocker discovery</b>

```
select distinct SMS_R_System.Name, SMS_R_System.ADSiteName, SMS_R_System.IPAddresses, SMS_R_System.DistinguishedName, SMS_R_System.LastLogonUserName, SMS_R_System.operatingSystem, SMS_G_System_COMPUTER_SYSTEM.Domain, SMS_G_System_COMPUTER_SYSTEM.Manufacturer, SMS_G_System_COMPUTER_SYSTEM.Model, SMS_G_System_TPM.IsEnabled_InitialValue, SMS_G_System_TPM.SpecVersion, SMS_G_System_ENCRYPTABLE_VOLUME.ProtectionStatus, SMS_G_System_PROCESSOR.Is64Bit from SMS_R_System inner join SMS_G_System_COMPUTER_SYSTEM on SMS_G_System_COMPUTER_SYSTEM.ResourceID = SMS_R_System.ResourceId inner join SMS_G_System_PROCESSOR on SMS_G_System_PROCESSOR.ResourceID = SMS_R_System.ResourceId inner join SMS_G_System_ENCRYPTABLE_VOLUME on SMS_G_System_ENCRYPTABLE_VOLUME.ResourceID = SMS_R_System.ResourceId inner join SMS_G_System_TPM on SMS_G_System_TPM.ResourceID = SMS_R_System.ResourceId order by SMS_G_System_COMPUTER_SYSTEM.Model
```

# Today's Challenges Are Tomorrow's Opportunities

I also faced several familiar challenges throughout this project such as below. If you're just beginning the planning journey the below points are an indication of what to expect.

* Laptops were deployed at times ad-hoc and have varying specs e.g Make/Model/OS/Hardware.
* Laptops are in various states of compliance with BitLocker's pre-requisites e.g. TPM enabled, BitLocker recovery partition provisioned.
* Some laptops had no TPM chip meaning a different solution was required altogether.
* Laptops were not always connected to a power source which prevented the disk encryption process from beginning/completing.
* Access to laptops for testing the PS script was difficult given there were few spares and users had no alternate devices.
* Users are not savvy IT pros and are often roaming between sites with infrequent corporate network access to an AD DC meaning Group Policy would not apply and PS scripts would not run.
* Users may sleep/hibernate their machine instead of shutting it down (this prevents the BitLocker activation script from running and BitLocker also needs a few reboots before disk encryption can begin).
* For laptops where TPM was not enabled/initialised users needed to press the F1 key upon bootup to complete the TPM initialisation from a startup prompt. Some users didn't press the right key or feared it was a system issue and tried to bypass the prompt.
* Group Policy was not reliably applying the BitLocker computer settings to some laptops. I grabbed the registry keys the GPO would have applied and baked them into the main PS script for a 100% success rate.

# Closing Remarks
You may have also come across similar challenges in your project and have your own unique solutions to solve them, I'd love to hear your feedback in the comments below and feel free to share your own stories too! :-)

Cheers,
Jesse