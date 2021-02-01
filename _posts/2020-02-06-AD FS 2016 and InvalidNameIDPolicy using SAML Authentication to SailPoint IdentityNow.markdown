---
title:  "AD FS 2016 and InvalidNameIDPolicy using SAML Authentication to SailPoint IdentityNow"
excerpt: "The resolution to this problem for me was to ensure that an SPNameQualifier value was sent as a claim property from AD FS to IdentityNow"
header:
    og_image: /assets/images/ADFS-Events-364_321.png
date:   "2020-02-06"
categories: 
- "identity"
tags: 
- "adfs"
- "saml"
- "claims"
---
I recently had a seemingly simple task for a customer to setup a AD FS 2016 relying party trust for their SailPoint IdentityNow deployment. Sounds easy right?

In this scenario AD FS 2016 was to be the Identity Provider (IdP) and IdentityNow the Service Provider (SP). Our end-goal of the solution was to allow the customer’s users to authenticate via SAML into IdentityNow using their corporate AD DS email address and password. Great outcome from a user experience perspective and for corporate governance too!

# Configuration Setup and Problem Encountered

Following SailPoint’s guide [here][sp-guide] I setup IdentityNow as a Service Provider using the Email attribute as the SAML NameID.

I then moved onto creating a new AD FS 2016 relying party trust using the sp-metadata.xml file downloaded directly from the customer’s IdentityNow portal. After some quick research of the claims required I created the following 2x AD FS Issuance Transform Rules within my new RPT:

* Rule #1: Send LDAP Attribute (E-Mail-Addresses) as an Outgoing Claim (E-Mail Address)

<script src="https://gist.github.com/jesseloudon/a1770b1035e89e674427ab5a28fad99c.js"></script>

* Rule #2 Transform an Incoming Claim (E-Mail Address) to an Outgoing Claim (Name ID) with the Outgoing name ID format (Email)

<script src="https://gist.github.com/jesseloudon/5abc590e4d11be89c8629fca6a816f9f.js"></script>

![ADFSClaimIssuanceRules](/assets/images/ClaimIssuanceRules.png)

Unfortunately during my testing I was continually returned the following web page message from the customer’s IdentityNow portal. 

![SailpointIdentityNowWebError](/assets/images/SailPoint-Error.png)

This was occurring after the initial AD FS authentication and token being issued.

Whilst the web page error is vague in it’s description of the error, I knew that because the initial AD FS authentication had succeeded that I was dealing with a claims issue between the IdP and SP. 

# InvalidNameIDPolicy SAML Response

Diving into the SAML response using Fiddler and a SAML decoder I could see a SAML status code of “<b>InvalidNameIDPolicy</b>". Problem discovered! The most useful and easily accessible diagnostic information was actually straight out of the AD FS server’s local event viewer logs under Applications and Services Logs > ADFS > Admin (in hindsight I should have looked here first!).

Event ID #364: Encountered error during federation passive request. The SAML request contained a NameIDPolicy that was not satisfied by the issued token.

Event ID #321: The SAML authentication request had a NameID Policy that could not be satisfied.

![ADFSeventerrors](/assets/images/ADFS-Events-364_321.png)

Events #364 and #321 also verified that the NameIDPolicy required from IdentityNow was not being met by the AD FS token issued.

> Tip: If you encounter the same problem I had, have a look at the detail of these two events and compare the Requested NameIDPolicy versus the Actual NameIDPolicy to discover what exactly is missing from the AD FS token.

# Sending SPNameQualifier as a Claim

The resolution to this problem for me was to ensure that an SPNameQualifier value was sent as a claim property from AD FS to IdentityNow.

> As far as I know, this is an undocumented requirement to have SAML authentication tokens from AD FS 2016 accepted by SailPoint IdentityNow.

The SPNameQualifier value needed to match the Entity ID specified in our IdentityNow portal under Admin > Global > Security Settings > Service Provider.

Because I couldn’t find SPNameQualifier property in any of the Claim rule templates I used a Custom Rule which you can create as shown below.

![ADFSCustomClaimRule](/assets/images/SendClaimsUsingaCustomRule.png)

The following Claim rule combines my original Rule #2 (described at the beginning of this post) with the new claim property for SPNameQualifier.

Note: If using the below claim code remember to replace “insertValueHere” with your Entity ID specified in IdentityNow.

<script src="https://gist.github.com/jesseloudon/6b905c273466e1730f18d310be327f3c.js"></script>

After updating my claim rule with the above change a quick test of authenticating to IdentityNow via AD FS SAML was successful and I could also finally see SAML authentication events from the IdentityNow Activity Tab.

Happy days! 🙂

![SailpointIdentityNowSAMLevents](/assets/images/IdentityNow-SAML-Events.png)

# Summary

In conclusion when configuring SAML authentication via AD FS 2016 (IdP) to IdentityNow (SP) you may need to insert a SPNameQualifier value as an outgoing claim property from AD FS. The SPNameQualifier value should match the Entity ID value specified in your IdentityNow portal.

Cheers, 
Jesse

[sp-guide]:https://community.sailpoint.com/docs/DOC-7131