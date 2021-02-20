---
title: "My experience at Microsoft Containers OpenHack featuring Kubernetes challenges"
excerpt: "The underlying theme of OpenHack is that there's no clear path forward through the challenges and the 'unknown' factor is ever present"
header:
    og_image: /assets/images/openhack-containers.png
    teaser: /assets/images/openhack-containers.png
date:   "2020-02-28"
categories:
- "events"
tags: 
- "openhack"
- "team challenge"
- "k8s"
- "aks"
- "containers"
---
Azure consultants are constantly looking to expand our scope of expertise and aligning to this I've recently attended a Microsoft Containers OpenHack in Sydney. This event was a huge success for me and a rapid introduction to Kubernetes (K8s) and Azure Kubernetes Service (AKS) through a series of challenges over 3 days.

![OpenHackLogo](/assets/images/OpenHackLogo1.png "Open Hack Logo")

> Microsoft OpenHack is a developer-focused engagement where a wide variety of participants (Open) learn through hands-on experimentation (Hack) using challenges based on real-world customer scenarios designed to mimic the developer journey - Source: Microsoft

## My experience at OpenHack
About 80 attendees were split up between the 20 tables in the room. My team had 2 international attendees and 3 locals (myself included). Everyone was joining the OpenHack with varying levels of real experience with K8s/AKS so things were destined to be kept interesting. The underlying theme of OpenHack is that there's no clear path forward through the challenges and the 'unknown' factor is ever present.

>The-Super-Awesome-Hacker-Team
* Chan - Singapore
* Yong - Korea
* Chris - Australia
* Yegor - Australia
* Jesse (me) - Australia

As part of the fun (and because we were given seperate AAD logins to the Azure Subscription) our team took on aliases such as `hacker1`, `hacker2`, `hackerX`. During most of the challenges it felt as if we really did `hack` together a solution just to pass the success criteria. 

And by `hack` I'm referring to the process of:

* Searching through KB articles for code samples or architecture guidance
* Creating new .YAML config files to apply changes to K8s/AKS
* Testing code samples in Kubectl and AzureCLI via VSCode
* Troubleshooting abstract errors and/or connectivity/security issues
* More searching through KB articles
* More testing of code
* Finally getting something to work and meeting the success criteria

Elements of our application running in K8s/AKS would sometimes break during our changes and we'd have fun fixing it. That was a huge learning opportunity through break/fix and not something you'd experience very often under normal circumstances.

After making changes to our K8s/AKS environment as per the Challenge requirements, our instructor would have us demonstrate/prove each success criteria. For example: <i>Demonstrate that you are prompted on cluster access to authenticate with AAD.</i> 
There were some tense moments here as we waited for something, anything to break.

Due to limited time of the OpenHack (3 days) the focus was on completing challenges quickly by meeting the success criteria. This often led us to implement any available solution because there wasn't sufficient time to compare options with a `best` vs `sub-optimal` decision. In this case I was happy to put aside consulting habits to keep things ticking along.

![EscapeRoom](/assets/images/the-cipher-room.jpg "Escape Room")

Personally I believe the structure of OpenHack works because, similar to an Escape Room, it seemed as if Microsoft had locked you into the room and to get out you needed to build a working Kubernetes environment on Azure. 
Hackathons, where teams have limited time and resources to design and present their submission, are also a similiar concept to how an OpenHack operates.

## Challenges and Key Concepts
The Containers OpenHack consisted of 8 challenges to complete over 3 days. Unfortunately our Super-Awesome-Hacker-Team ran out of time to do them all, but it was a great learning experience anyways. 

I've tried to compress each challenge to a single paragraph below and include links to the key concepts.

### Challenge 1 / Day 1
We used <b>Docker</b> to build, tag, and push images to <b>Azure Container Registry (ACR)</b> based on the application source code. Docker was also used to pull, run, and configure a <b>SQL Server container</b> in Azure.

- [https://docs.docker.com/get-started/](https://docs.docker.com/get-started/)
- [https://docs.docker.com/engine/reference/builder/](https://docs.docker.com/engine/reference/builder/)
- [https://docs.docker.com/engine/reference/commandline/cli/](https://docs.docker.com/engine/reference/commandline/cli/)
- [https://docs.docker.com/network/](https://docs.docker.com/network/)
- [https://docs.microsoft.com/en-us/azure/container-registry/](https://docs.microsoft.com/en-us/azure/container-registry/)
- [https://docs.microsoft.com/en-us/azure/container-registry/container-registry-tutorial-quick-task](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-tutorial-quick-task)
- [https://docs.microsoft.com/en-us/sql/linux/quickstart-install-connect-docker?view=sql-server-2017&pivots=cs1-bash](https://docs.microsoft.com/en-us/sql/linux/quickstart-install-connect-docker?view=sql-server-2017&pivots=cs1-bash)
- [https://docs.microsoft.com/en-us/sql/linux/sql-server-linux-configure-docker?view=sql-server-ver15](https://docs.microsoft.com/en-us/sql/linux/sql-server-linux-configure-docker?view=sql-server-ver15)

### Challenge 2 / Day 1
We created an <b>Azure Kubernetes Service (AKS)</b> cluster and configured <b>environment variables</b> for the application's <b>microservices</b> to connect to eachother, then deployed the application into the AKS cluster.

- [https://docs.microsoft.com/en-us/azure/aks/concepts-clusters-workloads](https://docs.microsoft.com/en-us/azure/aks/concepts-clusters-workloads)
- [https://kubernetes.io/docs/concepts/services-networking/connect-applications-service/](https://kubernetes.io/docs/concepts/services-networking/connect-applications-service/)
- [https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/)
- [https://kubernetes.io/docs/tasks/access-application-cluster/port-forward-access-application-cluster/](https://kubernetes.io/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)
- [https://kubernetes.io/docs/tasks/access-application-cluster/create-external-load-balancer/](https://kubernetes.io/docs/tasks/access-application-cluster/create-external-load-balancer/)
- [https://kubernetes.io/docs/reference/kubectl/overview/](https://kubernetes.io/docs/reference/kubectl/overview/)
- [https://docs.microsoft.com/en-us/azure/aks/kubernetes-walkthrough](https://docs.microsoft.com/en-us/azure/aks/kubernetes-walkthrough)
- [https://docs.microsoft.com/en-us/cli/azure/aks?view=azure-cli-latest#az-aks-create](https://docs.microsoft.com/en-us/cli/azure/aks?view=azure-cli-latest#az-aks-create)
- [https://docs.microsoft.com/en-gb/azure/aks/cluster-container-registry-integration](https://docs.microsoft.com/en-gb/azure/aks/cluster-container-registry-integration)

### Challenge 3 / Day 2
We configured a <b>dedicated VNET/Subnet</b> for the <b>AKS cluster</b> and setup <b>Azure Container Networking Interface (CNI)</b>. We also setup <b>AAD</b> integration for cluster authentication.

- [https://docs.microsoft.com/en-us/azure/aks/concepts-identity](https://docs.microsoft.com/en-us/azure/aks/concepts-identity)
- [https://docs.microsoft.com/en-us/azure/aks/azure-ad-integration-cli](https://docs.microsoft.com/en-us/azure/aks/azure-ad-integration-cli)
- [https://docs.microsoft.com/en-us/azure/aks/control-kubeconfig-access](https://docs.microsoft.com/en-us/azure/aks/control-kubeconfig-access)
- [https://docs.microsoft.com/en-us/cli/azure/ad?view=azure-cli-latest](https://docs.microsoft.com/en-us/cli/azure/ad?view=azure-cli-latest)
- [https://docs.microsoft.com/en-us/azure/aks/configure-azure-cni](https://docs.microsoft.com/en-us/azure/aks/configure-azure-cni)

### Challenge 4 / Day 2
We configured Kubernetes <b>Namespaces</b> and <b>RBAC bindings</b> to assign access to different application teams. We used <b>Key Vault FlexVolume</b> and <b>Azure KeyVault</b> to secure our environment secrets. We also created Kubernetes <b>Ingress Controllers</b> for inbound Layer 7 traffic forwarding to our services.

- [https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/)
- [https://github.com/Azure/kubernetes-keyvault-flexvol](https://github.com/Azure/kubernetes-keyvault-flexvol)
- [https://docs.microsoft.com/en-us/azure/aks/concepts-network#ingress-controllers](https://docs.microsoft.com/en-us/azure/aks/concepts-network#ingress-controllers)
- [https://docs.microsoft.com/en-us/azure/aks/ingress-basic](https://docs.microsoft.com/en-us/azure/aks/ingress-basic)
- [https://docs.microsoft.com/en-us/azure/aks/operator-best-practices-cluster-security](https://docs.microsoft.com/en-us/azure/aks/operator-best-practices-cluster-security)
- [https://docs.microsoft.com/en-us/azure/aks/concepts-identity#role-based-access-controls-rbac](https://docs.microsoft.com/en-us/azure/aks/concepts-identity#role-based-access-controls-rbac)
- [https://docs.microsoft.com/en-us/azure/aks/azure-ad-rbac](https://docs.microsoft.com/en-us/azure/aks/azure-ad-rbac)

### Challenge 5 / Day 3
We setup monitoring, logging, and alerts for the AKS cluster using <b>Azure Monitor Insights</b>, implemented <b>Resource Limits</b> via <b>YAML</b> on a newly deployed application (which was resource-hungry), and tested the <b>Kubernetes Dashboard</b>.

- [https://docs.microsoft.com/en-us/azure/architecture/microservices/logging-monitoring](https://docs.microsoft.com/en-us/azure/architecture/microservices/logging-monitoring)
- [https://docs.microsoft.com/en-us/azure/azure-monitor/insights/container-insights-overview](https://docs.microsoft.com/en-us/azure/azure-monitor/insights/container-insights-overview)
- [https://docs.microsoft.com/en-us/azure/azure-monitor/insights/container-insights-agent-config](https://docs.microsoft.com/en-us/azure/azure-monitor/insights/container-insights-agent-config)
- [https://docs.microsoft.com/en-us/azure/azure-monitor/insights/container-insights-log-search#search-logs-to-analyze-data](https://docs.microsoft.com/en-us/azure/azure-monitor/insights/container-insights-log-search#search-logs-to-analyze-data)
- [https://docs.microsoft.com/en-us/azure/kusto/](https://docs.microsoft.com/en-us/azure/kusto/)
- [https://docs.microsoft.com/en-us/azure/azure-monitor/insights/container-insights-alerts]([https://docs.microsoft.com/en-us/azure/azure-monitor/insights/container-insights-alerts)
- [https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/)


### Challenge 6 / Day 3
We looked into enhancing <b>cluster security</b> by applying restrictions to traffic and application access. Ultimately the team decided not to pursue this challenge due to time constraints.

- [https://kubernetes.io/docs/reference/access-authn-authz/service-accounts-admin/](https://kubernetes.io/docs/reference/access-authn-authz/service-accounts-admin/)
- [https://docs.microsoft.com/en-us/azure/aks/use-pod-security-policies](https://docs.microsoft.com/en-us/azure/aks/use-pod-security-policies)
- [https://docs.microsoft.com/en-us/azure/aks/use-network-policies](https://docs.microsoft.com/en-us/azure/aks/use-network-policies)
- [https://docs.microsoft.com/en-us/azure/aks/api-server-authorized-ip-ranges](https://docs.microsoft.com/en-us/azure/aks/api-server-authorized-ip-ranges)
- [https://docs.microsoft.com/en-us/azure/aks/limit-egress-traffic](https://docs.microsoft.com/en-us/azure/aks/limit-egress-traffic)
- [https://docs.microsoft.com/en-us/azure/sql-database/sql-database-vnet-service-endpoint-rule-overview]([https://docs.microsoft.com/en-us/azure/sql-database/sql-database-vnet-service-endpoint-rule-overview)
- [https://docs.microsoft.com/en-us/cli/azure/network/vnet/subnet?view=azure-cli-latest#az-network-vnet-subnet-update](https://docs.microsoft.com/en-us/cli/azure/network/vnet/subnet?view=azure-cli-latest#az-network-vnet-subnet-update)
- [https://docs.microsoft.com/en-us/cli/azure/sql/server/firewall-rule?view=azure-cli-latest]([https://docs.microsoft.com/en-us/cli/azure/sql/server/firewall-rule?view=azure-cli-latest)

### Challenge 7 / Day 3
We deployed an <b>AKS Windows cluster</b> and <b>Windows Nodepools</b>. We also configured <b>Taints</b> on the Nodepools and <b>Tolerations</b> on Pods to allow deployment of Linux and Windows containers to the same AKS cluster.

- [https://kubernetes.io/docs/setup/production-environment/windows/intro-windows-in-kubernetes/](https://kubernetes.io/docs/setup/production-environment/windows/intro-windows-in-kubernetes/)
- [https://docs.microsoft.com/en-us/azure/aks/use-multiple-node-pools](https://docs.microsoft.com/en-us/azure/aks/use-multiple-node-pools)
- [https://docs.microsoft.com/en-us/azure/aks/windows-container-cli](https://docs.microsoft.com/en-us/azure/aks/windows-container-cli)
- [https://docs.microsoft.com/en-us/virtualization/windowscontainers/about/](https://docs.microsoft.com/en-us/virtualization/windowscontainers/about/)
- [https://docs.microsoft.com/en-us/azure/aks/use-multiple-node-pools#schedule-pods-using-taints-and-tolerations](https://docs.microsoft.com/en-us/azure/aks/use-multiple-node-pools#schedule-pods-using-taints-and-tolerations)

### Challenge 8 / Day 3
We looked into deploying a <b>service mesh</b> into the AKS cluster using either <b>Linkerd</b> or <b>Istio</b>. The service mesh would have provided capabilities like <b>traffic management</b> and <b>resiliency</b> to our workloads and decoupled these capabilities from the application layer to the infrastructure layer. Ultimately we ran out of time here and were not able to get it working.

- [https://docs.microsoft.com/en-us/azure/aks/servicemesh-about](https://docs.microsoft.com/en-us/azure/aks/servicemesh-about)
- [https://linkerd.io/2/getting-started/](https://linkerd.io/2/getting-started/)
- [https://docs.microsoft.com/en-us/azure/aks/servicemesh-linkerd-about](https://docs.microsoft.com/en-us/azure/aks/servicemesh-linkerd-about)
- [https://docs.microsoft.com/en-us/azure/aks/servicemesh-linkerd-install?pivots=client-operating-system-linux](https://docs.microsoft.com/en-us/azure/aks/servicemesh-linkerd-install?pivots=client-operating-system-linux)
- [https://istio.io/docs/concepts/what-is-istio/](https://istio.io/docs/concepts/what-is-istio/)
- [https://docs.microsoft.com/en-us/azure/aks/servicemesh-istio-about](https://docs.microsoft.com/en-us/azure/aks/servicemesh-istio-about)
- [https://docs.microsoft.com/en-us/azure/aks/servicemesh-istio-install?pivots=client-operating-system-linux](https://docs.microsoft.com/en-us/azure/aks/servicemesh-istio-install?pivots=client-operating-system-linux)

## Closing Remarks

![ChallengeComplete](/assets/images/openhack-containers.png "Challenge Complete")

My first Microsoft OpenHack was a great experience. I went in with low expectations and came away with more hands-on experience with Kubernetes and Azure Kubernetes Service than I would've hoped to achieve in 3 days.

You can check out if there's an event coming near you - [https://openhack.microsoft.com/][OpenHack]

Cheers,
Jesse

[OpenHack]:https://openhack.microsoft.com/