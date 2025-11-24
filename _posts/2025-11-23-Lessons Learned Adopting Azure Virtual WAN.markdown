---
title: "Lessons Learned Adopting Azure Virtual WAN"
excerpt: "Discover lessons learned adopting Azure Virtual WAN from a traditional hub and spoke architecture"
header:
  og_image: /assets/images/vwan-migration.png
  teaser: /assets/images/vwan-migration.png
date: "2025-11-24"
categories:
  - "cloud"
tags:
  - "azure virtual wan"
  - "lessons learned"
---

Hey folks in this blog post I'll be stepping you through some lessons learned adopting Azure Virtual WAN from a traditional hub and spoke architecture. Azure Virtual WAN (vWAN) provides a solid foundation to modernise your network architecture. Given the maturity and feature status of vWAN I'm seeing a steady flow of customers choose it as their greenfield solution to replace an existing brownfield solution. If you're just getting up to speed with vWAN's architecture I recommend checking out the [Microsoft docs](https://learn.microsoft.com/en-us/azure/virtual-wan/virtual-wan-about) and if possible getting hands-on with it in a lab environment.

Before we get cracking my assumption is that you have a basic to intermediate understanding of how Azure networking works so I can make this writeup as streamlined as possible!

Firstly let's look at a potential high-level migration architecture diagram as shown in the below. This helps set the scene for what's to come.

- A brownfields hub and spoke architecture exists with IaaS-based shared services deployed into the hub VNET alongside an existing ExpressRoute Circuit providing connectivity to on-premises.
- A greenfields virtual WAN hub will be deployed with PaaS-based shared services and connected to the brownfields ExpressRoute Circuit to achieve hub to hub connectivity and hybrid connectivity to on-premises.

![Azure Virtual WAN Migration Architecture](/assets/images/vwan-migration-arch.png "Azure Virtual WAN Migration Architecture")

Based on Microsoft's published guidance on [migrating to Azure Virtual WAN](https://learn.microsoft.com/en-us/azure/virtual-wan/migrate-from-hub-spoke-topology) the ideal sequence is:

1. Deploy Virtual WAN hub(s)
2. Connect remote sites (ExpressRoute/VPN) to Virtual WAN
3. Test hybrid connectivity via Virtual WAN
4. Transition connectivity to Virtual WAN hub
5. Old hub becomes shared services spoke
6. Optimise on-premises connectivity to fully utilise Virtual WAN

Whilst I won't go into specific instructions/detail on each of the above steps (because Microsoft's doco is solid with diagrams to help understand the changes) I will touch on a few related points that caught me out during a recent project.

## Multi Region Architecture

If you're implementing a primary region and secondary region deployment of vWAN to cover multi-region requirements the thing which might not be obvious is that you will need to have vWAN Hub in both regions tied to the same vWAN.

So for example:

- Australia East Region - AE vWAN + AE vWAN Hub deployed
- Australia SouthEast Region - ASE vWAN Hub deployed (and associated to AE vWAN)

Having your vWAN Hubs associated to the same vWAN ensures that hub to hub connectivity and routing is automatically established and there's no need to create VPN/ExpressRoute connections directly between your vWAN Hubs in either region.

## Allowing Traffic from Non-Virtual WAN Networks

If you're about to deploy Virtual WAN you should know that the default behaviour for enabling traffic from Non-Virtual WAN networks has changed ([since 2024 I think](https://techcommunity.microsoft.com/blog/azurenetworkingblog/customisation-controls-for-connectivity-between-virtual-networks-over-expressrou/4147722)) and takes a few more steps to achieve.

I was caught out by this after creating an ExpressRoute connection to link my new vWAN hub to the old hub's ExpressRoute Circuit then noticing that none of the old hub's routes were being received on vWAN side :)

To resolve this you need to firstly ensure that your vWAN hub has this option "Allow traffic from non Virtual WAN networks" turned on.

![Allowing Traffic from Non-Virtual WAN Networks 1](/assets/images/vwan-migration-1.png "Allowing Traffic from Non-Virtual WAN Networks 1")

Additionally your vWAN ExpressRoute Gateway needs to have the "allowNonVirtualWanTraffic" property set to true.

![Allowing Traffic from Non-Virtual WAN Networks 2](/assets/images/vwan-migration-2.png "Allowing Traffic from Non-Virtual WAN Networks 2")

And finally on your old hub side - ensure the virtual network gateway for ExpressRoute has this option for "Allow traffic from remote Virtual WAN networks" turned on.

![Allowing Traffic from Non-Virtual WAN Networks 3](/assets/images/vwan-migration-3.png "Allowing Traffic from Non-Virtual WAN Networks 3")

So there's a couple non-default hoops to jump through there but once you do enable the above you'll get the delightful result of seeing your old hub's routes coming through to your vWAN side.

## Micro Segmentation Traffic Inspection

If you're using Routing Intent on your vWAN hub to centrally manage routing for your connected spokes the vWAN's default route table will automatically include all RFC1918 super-nets (10.0.0.0/8, 192.168.0.0/16 and 172.16.0.0/12) but did you know that traffic between subnets in the same VNET will not go through these RFC1918 routes and hence not be inspected by your hub firewall? The same applies for traffic between hosts in the same subnet.

This is because each VNET has a system route which, because it's often a smaller prefix than the RFC1918 super-nets in the vWAN default route table, will remain active and in use.

To demonstrate this scenario in my lab I created a secured vWAN hub with routing intent policies enabled  and a connected spoke VNET (10.1.0.0/16) with 2 subnets 10.1.1.0/24 and 10.1.2.0/24.

Below you can see my next hop test result between subnets showing traffic sending to the VirtualNetwork via that system route I mentioned earlier. This is the default behaviour for subnet to subnet traffic even within a vWAN architecture with routing intent policies enabled, and it means traffic between these subnets and hosts in the same VNET is not being inspected by the hub firewall.

![Microsegmentation Traffic Inspection 1](/assets/images/vwan-migration-4.png "Microsegmentation Traffic Inspection 1")

Now to achieve micro segementation I've created a route table associated to my subnets and a UDR for my VNET 10.1.0.0/16 to send to the firewall IP address 10.0.0.132. You can see based on the test result below that traffic between subnets is now directed to the firewall in the hub.

![Microsegmentation Traffic Inspection 2](/assets/images/vwan-migration-5.png "Microsegmentation Traffic Inspection 2")

This final test result also shows that with the route table and UDR addition, traffic between hosts in the same subnet is also now directed to the firewall in the hub.

![Microsegmentation Traffic Inspection 3](/assets/images/vwan-migration-6.png "Microsegmentation Traffic Inspection 3")

As demonstrated above, implementing micro segmentation so that host to host and subnet to subnet traffic within the same VNET is inspected at your hub firewall can be achieved within a vWAN architecture however I don't recommend doing this at scale for every workload in Azure as it may not be supported for certain PaaS architectures. Consult the Microsoft documentation on this before jumping in!

## Transitioning Azure DNS from Old Hub to New Hub

When adopting Azure Virtual WAN in a greenfields deployment coming from a traditional hub and spoke architecture a common scenario may resemble the below diagram.

- A brownfields hub and spoke with existing Private DNS Zones to service the brownfields landing zones and on-premises AD DC conditional forwarders setup to the brownfields hub.
- A greenfields Virtual WAN with Private DNS Resolver and new Private DNS Zones to service the greenfields landing zones.

![Azure DNS Migration Architecture](/assets/images/dns-migration-arch.png "Azure DNS Migration Architecture")

Because it's a high management overhead to run two Azure DNS hubs side by side for a long period of time I recommend planning and executing a transition to your greenfields deployment. Some key activities to consider and sequence are:

- Scripted syncing of Private DNS records from existing brownfields hub Private DNS zones to greenfields hub Private DNS zones
- Updating any brownfields Private Endpoints to point to greenfields Private DNS zones.
- Enabling Route Table network policies for brownfields private endpoints on the subnets where Private Endpoints are deployed to [prevent asymmetric routing from on-prem traffic to private endpoints](https://learn.microsoft.com/en-us/azure/virtual-wan/how-to-routing-policies#troubleshooting-data-path)
- Updating on-premises AD DNS conditional forwarders to point to the greenfields Private DNS Resolver service.
- Removing brownfields Private DNS Zone virtual network links to the brownfields hub VNET to avoid private DNS resolution conflicts.

## Conclusion

I hope you enjoyed reading, looking forward to your thoughts below.

Cheers,
Jesse
