export type FlashcardDifficulty = "Easy" | "Medium" | "Hard";

export type Flashcard = {
  id: number;
  topic: string;
  question: string;
  answer: string;
  difficulty: FlashcardDifficulty;
};

export const AZ900_FLASHCARDS: Flashcard[] = [
  {
    id: 1,
    topic: "Cloud Concepts",
    question: "What are the three cloud deployment models?",
    answer:
      "Public cloud (owned by provider, shared), Private cloud (dedicated to one org), Hybrid cloud (combination of both). Azure supports all three.",
    difficulty: "Easy",
  },
  {
    id: 2,
    topic: "Cloud Concepts",
    question: "What is the shared responsibility model?",
    answer:
      "Security responsibilities are shared between the cloud provider and the customer. The split depends on service type: IaaS (you manage OS+), PaaS (you manage app+data), SaaS (you manage data only). Microsoft always manages physical infrastructure.",
    difficulty: "Easy",
  },
  {
    id: 3,
    topic: "Cloud Concepts",
    question: "What is the difference between CapEx and OpEx in cloud?",
    answer:
      "CapEx (Capital Expenditure) = upfront investment in physical infrastructure. OpEx (Operational Expenditure) = pay-as-you-go ongoing costs. Cloud shifts spending from CapEx to OpEx — you pay for what you use, no upfront hardware.",
    difficulty: "Easy",
  },
  {
    id: 4,
    topic: "Cloud Concepts",
    question: "What are the benefits of high availability in Azure?",
    answer:
      "High availability ensures services remain accessible during failures. Azure achieves this through availability zones (physically separate datacenters), availability sets (fault/update domain separation), and Azure SLAs guaranteeing uptime percentages (e.g. 99.99% for VMs in availability zones).",
    difficulty: "Medium",
  },
  {
    id: 5,
    topic: "Cloud Concepts",
    question: "What is scalability vs elasticity?",
    answer:
      "Scalability = ability to handle increased load by adding resources (scale up = bigger VM, scale out = more VMs). Elasticity = automatically scaling resources up or down based on demand in real-time. Azure provides both through auto-scale rules.",
    difficulty: "Easy",
  },
  {
    id: 6,
    topic: "Cloud Concepts",
    question: "What is the consumption-based model?",
    answer:
      "You only pay for the resources you use — no fixed cost. No upfront cost, pay as you go, stop paying when you stop using. Enables cost optimization and matches spend to actual usage.",
    difficulty: "Easy",
  },
  {
    id: 7,
    topic: "Azure Architecture",
    question: "What is an Azure Region?",
    answer:
      "A geographic area containing one or more datacenters. Azure has 60+ regions globally including South Africa North (Johannesburg) and South Africa West (Cape Town). Resources are deployed to specific regions.",
    difficulty: "Easy",
  },
  {
    id: 8,
    topic: "Azure Architecture",
    question: "What is an Availability Zone?",
    answer:
      "Physically separate datacenters within a single Azure region, each with independent power, cooling, and networking. Deploying across availability zones protects against datacenter-level failures. Not all regions have availability zones.",
    difficulty: "Medium",
  },
  {
    id: 9,
    topic: "Azure Architecture",
    question: "What is a Resource Group?",
    answer:
      "A logical container that holds related Azure resources for a solution. Resources in a group share the same lifecycle — you can deploy, update, and delete them together. A resource can only belong to one resource group.",
    difficulty: "Easy",
  },
  {
    id: 10,
    topic: "Azure Architecture",
    question: "What is an Azure Subscription?",
    answer:
      "A logical unit of Azure services linked to an Azure account. Provides authenticated and authorised access to Azure resources. Used for billing boundaries and access control. An account can have multiple subscriptions.",
    difficulty: "Easy",
  },
  {
    id: 11,
    topic: "Azure Architecture",
    question: "What is Azure Resource Manager (ARM)?",
    answer:
      "The deployment and management service for Azure. Provides a consistent layer for creating, updating, deleting resources. All Azure tools (portal, CLI, PowerShell, APIs) use ARM. Enables infrastructure as code via ARM templates or Bicep.",
    difficulty: "Medium",
  },
  {
    id: 12,
    topic: "Compute",
    question: "What is the difference between IaaS, PaaS, and SaaS?",
    answer:
      "IaaS (Infrastructure as a Service): You manage OS, runtime, apps — e.g. Azure VMs. PaaS (Platform as a Service): You manage apps and data only — e.g. Azure App Service, Azure SQL. SaaS (Software as a Service): You manage nothing — e.g. Microsoft 365, Dynamics 365.",
    difficulty: "Easy",
  },
  {
    id: 13,
    topic: "Compute",
    question: "What is Azure App Service?",
    answer:
      "A PaaS offering for hosting web apps, REST APIs, and mobile backends. Supports .NET, Node.js, Python, Java, PHP. Handles OS patching, scaling, load balancing automatically. No server management required.",
    difficulty: "Easy",
  },
  {
    id: 14,
    topic: "Compute",
    question: "What are Azure Functions?",
    answer:
      "Serverless compute service. You write code that runs in response to events (HTTP trigger, timer, queue message). You only pay for execution time — no idle cost. Scales automatically. Ideal for event-driven architectures.",
    difficulty: "Easy",
  },
  {
    id: 15,
    topic: "Compute",
    question: "What is Azure Container Instances vs Azure Kubernetes Service?",
    answer:
      "ACI: Run individual containers without managing infrastructure. Simple, fast, no orchestration. AKS: Managed Kubernetes for orchestrating multiple containers at scale. Complex but powerful. ACI = simple use cases, AKS = production microservices.",
    difficulty: "Medium",
  },
  {
    id: 16,
    topic: "Networking",
    question: "What is Azure Virtual Network (VNet)?",
    answer:
      "A private network in Azure that enables Azure resources to securely communicate with each other, the internet, and on-premises networks. Like a traditional network but virtualised. You control IP address space, subnets, routing, and security.",
    difficulty: "Easy",
  },
  {
    id: 17,
    topic: "Networking",
    question: "What is Azure VPN Gateway vs ExpressRoute?",
    answer:
      "VPN Gateway: Encrypted connection over public internet between on-premises and Azure. Cheaper, slower, uses internet. ExpressRoute: Private dedicated connection to Azure, not over internet. Higher bandwidth, more reliable, more expensive. Use ExpressRoute for sensitive/high-volume data.",
    difficulty: "Medium",
  },
  {
    id: 18,
    topic: "Storage",
    question: "What are the four Azure Storage services?",
    answer:
      "Blob Storage: Unstructured data (files, images, videos, backups). File Storage: Managed cloud file shares (SMB protocol). Queue Storage: Message queuing for async communication. Table Storage: NoSQL key-value store for structured data.",
    difficulty: "Easy",
  },
  {
    id: 19,
    topic: "Storage",
    question: "What are the Azure Blob Storage access tiers?",
    answer:
      "Hot: Frequently accessed data. Highest storage cost, lowest access cost. Cool: Infrequently accessed, stored for 30+ days. Lower storage cost. Cold: Rarely accessed, stored for 90+ days. Archive: Rarely accessed, stored for 180+ days. Cheapest storage, highest retrieval cost and time.",
    difficulty: "Medium",
  },
  {
    id: 20,
    topic: "Identity",
    question: "What is Microsoft Entra ID (formerly Azure AD)?",
    answer:
      "Microsoft's cloud-based identity and access management service. Provides authentication (who you are) and authorisation (what you can access). Used for single sign-on, MFA, conditional access. Different from Windows Server AD — it's cloud-native.",
    difficulty: "Easy",
  },
  {
    id: 21,
    topic: "Identity",
    question: "What is Role-Based Access Control (RBAC)?",
    answer:
      "Authorisation system built on Azure Resource Manager. Assign roles to users, groups, or service principals at a scope (subscription, resource group, resource). Built-in roles: Owner, Contributor, Reader. Least-privilege principle — give only the access needed.",
    difficulty: "Medium",
  },
  {
    id: 22,
    topic: "Identity",
    question: "What is Multi-Factor Authentication (MFA)?",
    answer:
      "Requires two or more verification methods: something you know (password), something you have (phone/authenticator app), something you are (biometric). Protects against compromised passwords. Entra ID MFA can be enforced via Conditional Access policies.",
    difficulty: "Easy",
  },
  {
    id: 23,
    topic: "Identity",
    question: "What is Conditional Access?",
    answer:
      "Entra ID feature that enforces access policies based on conditions: user location, device compliance, app being accessed, sign-in risk level. Example: Require MFA when accessing from outside your country. Block access from non-compliant devices.",
    difficulty: "Medium",
  },
  {
    id: 24,
    topic: "Governance",
    question: "What is Azure Policy?",
    answer:
      "Service to create, assign, and manage policies that enforce rules on Azure resources. Ensures resources comply with corporate standards. Example: Require all resources to have tags, restrict VM sizes, enforce region deployment. Policies can audit, deny, or remediate.",
    difficulty: "Medium",
  },
  {
    id: 25,
    topic: "Governance",
    question: "What are Azure Resource Locks?",
    answer:
      "Prevent accidental deletion or modification of resources. Two types: ReadOnly (no changes allowed) and Delete (can modify but not delete). Applied at subscription, resource group, or resource level. Locks are inherited by child resources.",
    difficulty: "Easy",
  },
  {
    id: 26,
    topic: "Governance",
    question: "What is the Azure Pricing Calculator?",
    answer:
      "Tool to estimate the cost of Azure services before deploying. Configure services, regions, and usage patterns to get a monthly cost estimate. Useful for budgeting and comparing options. Different from the Total Cost of Ownership (TCO) calculator which compares on-prem vs cloud.",
    difficulty: "Easy",
  },
  {
    id: 27,
    topic: "Governance",
    question: "What is Azure Cost Management?",
    answer:
      "Tool to monitor, allocate, and optimise Azure spending. Set budgets and alerts when spending approaches limits. Analyse costs by service, region, or resource group. Identify unused or underutilised resources. Available in Azure portal.",
    difficulty: "Easy",
  },
  {
    id: 28,
    topic: "Monitoring",
    question: "What is Azure Monitor?",
    answer:
      "Comprehensive monitoring service that collects and analyses telemetry from Azure and on-premises resources. Includes: Metrics (numerical data over time), Logs (Log Analytics workspace), Alerts (notify or trigger actions), Application Insights (app performance monitoring).",
    difficulty: "Medium",
  },
  {
    id: 29,
    topic: "Monitoring",
    question: "What is Azure Service Health?",
    answer:
      "Provides personalised alerts and guidance when Azure service issues affect your resources. Three components: Azure Status (global service issues), Service Health (issues affecting your subscriptions), Resource Health (health of your specific resources).",
    difficulty: "Easy",
  },
  {
    id: 30,
    topic: "Governance",
    question: "What is the Microsoft Trust Center / compliance documentation?",
    answer:
      "Central resource for Microsoft's security, privacy, and compliance information. Contains details on GDPR, ISO, SOC compliance certifications. Important for regulated industries. For South Africa: relevant to POPIA alignment when customers need assurance on data handling.",
    difficulty: "Easy",
  },
];
