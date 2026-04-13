export type CertStatus = "next" | "in-progress" | "locked" | "done";

export type CertResource = { name: string; url: string };

export type CertRoadmapEntry = {
  id: string;
  name: string;
  fullName: string;
  level: string;
  color: string;
  months: string;
  cost: string;
  studyWeeks: string;
  examCode: string;
  status: CertStatus;
  why: string;
  topics: string[];
  resources: CertResource[];
  prereq?: string;
};

/** Default template status only — runtime state comes from localStorage. */
export const CERT_ROADMAP: CertRoadmapEntry[] = [
  {
    id: "az900",
    name: "AZ-900",
    fullName: "Azure Fundamentals",
    level: "Foundation",
    color: "#0078d4",
    months: "Month 1",
    cost: "R1,200",
    studyWeeks: "2-3 weeks",
    examCode: "AZ-900",
    status: "next",
    why: "Required foundation for all Azure certs. Covers cloud concepts, Azure services, pricing and governance.",
    topics: [
      "Cloud Concepts (25-30%)",
      "Azure Architecture & Services (35-40%)",
      "Azure Management & Governance (30-35%)",
    ],
    resources: [
      {
        name: "Microsoft Learn (Free)",
        url: "https://learn.microsoft.com/en-us/certifications/exams/az-900",
      },
      {
        name: "John Savill Free Course",
        url: "https://www.youtube.com/watch?v=pY0LnKiDwRA",
      },
      {
        name: "Book exam (Pearson VUE)",
        url: "https://examregistration.microsoft.com",
      },
    ],
  },
  {
    id: "az204",
    name: "AZ-204",
    fullName: "Azure Developer Associate",
    level: "Associate",
    color: "#005a9e",
    months: "Month 2-3",
    cost: "R3,500",
    studyWeeks: "6-8 weeks",
    examCode: "AZ-204",
    status: "locked",
    prereq: "AZ-900",
    why: "Directly applicable to building cloud-native apps. Covers App Service, Functions, Service Bus, Key Vault, Container Apps, Cosmos DB.",
    topics: [
      "Develop Azure compute solutions (25-30%)",
      "Develop for Azure storage (15-20%)",
      "Implement Azure security (20-25%)",
      "Monitor, troubleshoot, optimize (15-20%)",
      "Connect to and consume Azure services (15-20%)",
    ],
    resources: [
      {
        name: "Microsoft Learn (Free)",
        url: "https://learn.microsoft.com/en-us/certifications/exams/az-204",
      },
      { name: "AzureMentor Course", url: "https://www.youtube.com/c/AzureMentor" },
    ],
  },
  {
    id: "az400",
    name: "AZ-400",
    fullName: "DevOps Engineer Expert",
    level: "Expert",
    color: "#002050",
    months: "Month 4-5",
    cost: "R3,500",
    studyWeeks: "8-10 weeks",
    examCode: "AZ-400",
    status: "locked",
    prereq: "AZ-204",
    why: "GitHub Actions, pipelines, monitoring, release management. Validates senior DevOps practice.",
    topics: [
      "Configure processes and communications (10-15%)",
      "Design and implement source control (15-20%)",
      "Design and implement build and release pipelines (40-45%)",
      "Develop a security and compliance plan (10-15%)",
      "Implement an instrumentation strategy (10-15%)",
    ],
    resources: [
      {
        name: "Microsoft Learn (Free)",
        url: "https://learn.microsoft.com/en-us/certifications/exams/az-400",
      },
    ],
  },
  {
    id: "az104",
    name: "AZ-104",
    fullName: "Azure Administrator Associate",
    level: "Associate",
    color: "#005a9e",
    months: "Month 7-8",
    cost: "R3,500",
    studyWeeks: "6-8 weeks",
    examCode: "AZ-104",
    status: "locked",
    prereq: "AZ-900",
    why: "Fills infrastructure gaps between developer and architect. Networking, IAM, monitoring, backup.",
    topics: [
      "Manage Azure identities and governance (15-20%)",
      "Implement and manage storage (15-20%)",
      "Deploy and manage Azure compute resources (20-25%)",
      "Implement and manage virtual networking (15-20%)",
      "Monitor and maintain Azure resources (10-15%)",
    ],
    resources: [
      {
        name: "Microsoft Learn (Free)",
        url: "https://learn.microsoft.com/en-us/certifications/exams/az-104",
      },
    ],
  },
  {
    id: "az305",
    name: "AZ-305",
    fullName: "Azure Solutions Architect Expert",
    level: "Expert",
    color: "#002050",
    months: "Month 10-11",
    cost: "R3,500",
    studyWeeks: "8-10 weeks",
    examCode: "AZ-305",
    status: "locked",
    prereq: "AZ-104",
    why: "Architect level. Strong signal for senior consulting and enterprise design conversations. AZ-104 recommended first.",
    topics: [
      "Design identity, governance, and monitoring (25-30%)",
      "Design data storage solutions (25-30%)",
      "Design business continuity solutions (10-15%)",
      "Design infrastructure solutions (25-30%)",
    ],
    resources: [
      {
        name: "Microsoft Learn (Free)",
        url: "https://learn.microsoft.com/en-us/certifications/exams/az-305",
      },
    ],
  },
  {
    id: "togaf",
    name: "TOGAF 9",
    fullName: "Enterprise Architecture Foundation",
    level: "Enterprise",
    color: "#5c2d91",
    months: "Month 13-15",
    cost: "R8,000",
    studyWeeks: "10-12 weeks",
    examCode: "TOGAF 9",
    status: "locked",
    prereq: "AZ-305",
    why: "Enterprise architecture vocabulary for large customers and governance-heavy engagements.",
    topics: [
      "Architecture Development Method (ADM)",
      "Enterprise Continuum",
      "Architecture Repository",
      "Architecture Governance",
      "Building Blocks",
    ],
    resources: [{ name: "The Open Group", url: "https://www.opengroup.org/togaf" }],
  },
];

export const CERT_ORDER = CERT_ROADMAP.map((c) => c.id);
