import { rng, pick, pickN, int, chance, daysFromNow, resetSeed } from "./rng";
import type {
  User, Topic, Question, Template, TemplateSection, Entity, Contact, EntityDocument,
  Assessment, Answer, AnswerVersion, Finding, Notification, AuditLog,
  QuestionType, RiskLevel, EntityType, AssessmentStatus,
} from "@/types";

resetSeed();

/* ------------------------------------------------------------------ Topics */
export const topics: Topic[] = [
  { id: "TP-01", name: "Information Security", description: "Core security governance, ISMS, policies and controls.", color: "#1f47d8" },
  { id: "TP-02", name: "Cloud Security", description: "Cloud infrastructure, shared responsibility and configuration.", color: "#0ea5e9" },
  { id: "TP-03", name: "Network Security", description: "Perimeter, segmentation, firewalls and monitoring.", color: "#8b5cf6" },
  { id: "TP-04", name: "Data Privacy", description: "PII handling, GDPR/DPDP, retention and consent.", color: "#ec4899" },
  { id: "TP-05", name: "Access Management", description: "IAM, MFA, privileged access and joiner-mover-leaver.", color: "#f59e0b" },
  { id: "TP-06", name: "Business Continuity", description: "BCP, resilience and crisis management.", color: "#10b981" },
  { id: "TP-07", name: "Disaster Recovery", description: "Backups, RTO/RPO and DR testing.", color: "#14b8a6" },
  { id: "TP-08", name: "Compliance", description: "Regulatory alignment, ISO 27001, SOC 2, PCI DSS.", color: "#6366f1" },
  { id: "TP-09", name: "Physical Security", description: "Facilities, access control and environmental safeguards.", color: "#64748b" },
].map((t) => ({ ...t, questionCount: 0 }));

/* ------------------------------------------------------------------ Users */
const firstNames = ["Aarav","Vivaan","Aditya","Diya","Ananya","Ishaan","Kavya","Rohan","Meera","Arjun","Priya","Karthik","Sneha","Rahul","Nisha","Vikram","Pooja","Sanjay","Divya","Manish","Ritika","Suresh","Anjali","Deepak","Neha"];
const lastNames = ["Sharma","Iyer","Reddy","Nair","Gupta","Menon","Rao","Kapoor","Bose","Pillai","Verma","Joshi","Desai","Kulkarni","Chopra","Malhotra","Banerjee","Krishnan","Shetty","Bhat"];
const roles: User["role"][] = ["Admin", "Reviewer", "Analyst", "Auditor"];

export const users: User[] = Array.from({ length: 26 }, (_, i) => {
  const name = `${pick(firstNames)} ${pick(lastNames)}`;
  const role = i === 0 ? "Admin" : i < 12 ? "Reviewer" : pick(roles);
  return {
    id: `USR-${String(i + 1).padStart(3, "0")}`,
    name,
    email: `${name.toLowerCase().replace(/\s/g, ".")}@vivritinext.com`,
    role,
    department: pick(["Information Security", "GRC", "IT Risk", "Compliance", "Vendor Management"]),
    lastActive: daysFromNow(-int(0, 20)),
    status: chance(0.92) ? "active" : "inactive",
  };
});
export const reviewers = users.filter((u) => u.role === "Reviewer" || u.role === "Admin");

/* ------------------------------------------------------------------ Questions */
const questionStems: Record<string, string[]> = {
  "TP-01": ["Do you maintain a documented Information Security Management System (ISMS)?","Is there a designated CISO or equivalent security leader?","How frequently are security policies reviewed and approved?","Do you conduct periodic security awareness training for staff?","Describe your vulnerability management and patching cadence.","Do you maintain an asset inventory of information systems?","How are security incidents classified and escalated?","Do you perform annual penetration testing?"],
  "TP-02": ["Which cloud service providers do you use for production workloads?","Do you enforce encryption at rest for cloud-hosted data?","How is cloud security posture continuously monitored?","Are infrastructure-as-code templates security-reviewed?","Describe your approach to cloud key management.","Do you segregate production and non-production cloud environments?"],
  "TP-03": ["Do you deploy next-generation firewalls at network boundaries?","Is network traffic monitored via IDS/IPS?","How is network segmentation implemented?","Do you maintain a network diagram updated at least annually?","Are remote connections secured via VPN with MFA?"],
  "TP-04": ["Do you process personal data on behalf of customers?","Are you compliant with GDPR / DPDP requirements?","What is your data retention and deletion policy?","Do you maintain records of processing activities (RoPA)?","How do you handle data subject access requests?","Is a Data Protection Officer appointed?"],
  "TP-05": ["Is multi-factor authentication enforced for all users?","Describe your privileged access management approach.","How are access rights reviewed and recertified?","Do you follow a formal joiner-mover-leaver process?","Are shared/service accounts inventoried and rotated?"],
  "TP-06": ["Do you maintain a documented Business Continuity Plan?","When was the BCP last tested?","What is your maximum tolerable downtime for critical services?","Is there a crisis management team with defined roles?"],
  "TP-07": ["What are your defined RTO and RPO targets?","How frequently are backups performed and tested?","Are backups stored in geographically separate locations?","When was your last full DR test conducted?"],
  "TP-08": ["Are you certified against ISO/IEC 27001?","Do you hold a current SOC 2 Type II report?","Are you PCI DSS compliant where applicable?","Do you undergo independent third-party audits?","Can you provide the latest audit attestation?"],
  "TP-09": ["Are data centre facilities access-controlled 24/7?","Do you maintain CCTV coverage of sensitive areas?","How is visitor access to facilities managed?","Are environmental controls (fire, power, cooling) in place?"],
};
const qTypes: QuestionType[] = ["text","paragraph","yesno","dropdown","checkbox","number","date","file"];
const dropdownOpts: Record<string, string[]> = {
  frequency: ["Monthly", "Quarterly", "Semi-annually", "Annually", "Ad-hoc"],
  maturity: ["Not implemented", "Partially implemented", "Largely implemented", "Fully implemented"],
  yesno: ["Yes", "No", "Partially", "Not applicable"],
};

export const questions: Question[] = [];
let qCounter = 1;
topics.forEach((topic) => {
  const stems = questionStems[topic.id] ?? ["Describe your controls."];
  // ~55 questions per topic to reach ~500
  const target = topic.id === "TP-01" ? 70 : 55;
  for (let i = 0; i < target; i++) {
    const baseStem = stems[i % stems.length];
    const type: QuestionType = baseStem.startsWith("Do ") || baseStem.startsWith("Is ") || baseStem.startsWith("Are ")
      ? (chance(0.5) ? "yesno" : "dropdown")
      : baseStem.startsWith("How ") || baseStem.startsWith("Describe") ? "paragraph"
      : baseStem.startsWith("What") || baseStem.startsWith("When") ? "text"
      : pick(qTypes);
    const suffix = i >= stems.length ? ` (Control ${String.fromCharCode(65 + (i % 26))}${Math.floor(i / 26) + 1})` : "";
    let options: string[] | undefined;
    if (type === "dropdown" || type === "checkbox") options = pick([dropdownOpts.frequency, dropdownOpts.maturity, dropdownOpts.yesno]);
    questions.push({
      id: `Q-${String(qCounter).padStart(4, "0")}`,
      code: `${topic.id.replace("TP", "Q")}-${String(i + 1).padStart(3, "0")}`,
      text: baseStem + suffix,
      helpText: chance(0.4) ? "Provide supporting evidence where possible." : undefined,
      type,
      topicId: topic.id,
      weight: pick([1, 2, 3, 3, 5, 5, 8]),
      mandatory: chance(0.6),
      options,
      status: chance(0.85) ? "published" : chance(0.5) ? "draft" : "archived",
      createdBy: pick(users).name,
      createdAt: daysFromNow(-int(30, 400)),
      updatedAt: daysFromNow(-int(0, 30)),
      tags: pickN(["ISO 27001", "SOC 2", "NIST CSF", "PCI DSS", "GDPR", "DPDP", "CIS"], int(1, 3)),
    });
    qCounter++;
  }
});
topics.forEach((t) => (t.questionCount = questions.filter((q) => q.topicId === t.id).length));

/* ------------------------------------------------------------------ Templates */
const templateCategories = ["Onboarding", "Annual Reassessment", "Cloud Provider", "Critical Vendor", "Data Processor", "Financial Services", "SaaS Vendor", "Managed Service"];
export const templates: Template[] = Array.from({ length: 50 }, (_, i) => {
  const category = pick(templateCategories);
  const topicSubset = pickN(topics, int(3, 6));
  const sections: TemplateSection[] = topicSubset.map((t, si) => {
    const pool = questions.filter((q) => q.topicId === t.id && q.status === "published");
    return {
      id: `SEC-${i}-${si}`,
      title: t.name,
      description: t.description,
      questions: pickN(pool, int(4, 9)).map((q) => q.id),
    };
  });
  const count = sections.reduce((a, s) => a + s.questions.length, 0);
  return {
    id: `TPL-${String(i + 1).padStart(3, "0")}`,
    name: `${category} Security Assessment ${i > 20 ? "v2 " : ""}${String.fromCharCode(65 + (i % 8))}`,
    description: `Standard ${category.toLowerCase()} security posture questionnaire covering ${topicSubset.length} control domains.`,
    category,
    version: chance(0.4) ? "2.0" : "1.0",
    status: chance(0.8) ? "published" : chance(0.5) ? "draft" : "archived",
    sections,
    questionCount: count,
    createdBy: pick(users).name,
    createdAt: daysFromNow(-int(30, 300)),
    updatedAt: daysFromNow(-int(0, 30)),
    usageCount: int(0, 45),
  };
});

/* ------------------------------------------------------------------ Entities */
const companyPrefix = ["Nexa","Vertex","Aegis","Quantum","Meridian","Sterling","Pinnacle","Halcyon","Cobalt","Sentinel","Apex","Zephyr","Orbit","Cipher","Lumen","Fortis","Nimbus","Astra","Vanta","Helix","Onyx","Argon","Cardinal","Beacon","Summit","Ironclad","Northwind","Brightpath","Clearview","Everest"];
const companySuffix = ["Technologies","Systems","Solutions","Labs","Networks","Cloud","Analytics","Security","Digital","Software","Consulting","Infotech","Data Services","Payments","Financial"];
const countries = ["India","United States","United Kingdom","Singapore","Germany","Netherlands","UAE","Australia","Canada","Ireland"];
const entityTypes: EntityType[] = ["Vendor", "Supplier", "Partner", "Service Provider"];
const riskLevels: RiskLevel[] = ["critical", "high", "medium", "low", "minimal"];

export const entities: Entity[] = Array.from({ length: 100 }, (_, i) => {
  const name = `${pick(companyPrefix)} ${pick(companySuffix)}`;
  const risk = pick([...riskLevels, "medium", "low", "high"]) as RiskLevel;
  const contactCount = int(1, 3);
  const contacts: Contact[] = Array.from({ length: contactCount }, (_, c) => {
    const cn = `${pick(firstNames)} ${pick(lastNames)}`;
    return {
      id: `CT-${i}-${c}`, name: cn, title: pick(["CISO", "IT Manager", "Security Lead", "Compliance Officer", "CTO", "Account Manager"]),
      email: `${cn.toLowerCase().replace(/\s/g, ".")}@${name.toLowerCase().replace(/\s/g, "")}.com`,
      phone: `+91 ${int(70, 99)}${int(10000000, 99999999)}`, primary: c === 0,
    };
  });
  const docCount = int(0, 4);
  const documents: EntityDocument[] = Array.from({ length: docCount }, (_, d) => ({
    id: `DOC-${i}-${d}`, name: pick(["ISO27001_Certificate.pdf", "SOC2_TypeII_Report.pdf", "MSA_Agreement.pdf", "DPA_Signed.pdf", "PenTest_Summary.pdf", "InfoSec_Policy.pdf"]),
    type: "PDF", size: `${int(120, 4800)} KB`, uploadedAt: daysFromNow(-int(1, 200)), uploadedBy: pick(contacts).name,
  }));
  return {
    id: `ENT-${String(i + 1).padStart(3, "0")}`, name, type: pick(entityTypes),
    category: pick(["Cloud Infrastructure", "Payment Processing", "SaaS", "Managed IT", "Data Analytics", "Consulting", "Logistics", "Telecom"]),
    country: pick(countries), status: pick<Entity["status"]>(["active", "active", "active", "onboarding", "inactive", "suspended"]),
    riskRating: risk, complianceScore: int(42, 99), website: `www.${name.toLowerCase().replace(/\s/g, "")}.com`,
    onboardedAt: daysFromNow(-int(30, 900)), contacts, documents,
    assessmentCount: int(1, 8), openFindings: risk === "critical" || risk === "high" ? int(2, 9) : int(0, 4),
    criticality: pick<Entity["criticality"]>(["Tier 1", "Tier 2", "Tier 3"]), spend: int(5, 500) * 100000,
  };
});

/* ------------------------------------------------------------------ Assessments */
const statuses: AssessmentStatus[] = ["draft","assigned","in_progress","submitted","under_review","needs_correction","correction_submitted","approved","completed","rejected"];
function buildAnswers(template: Template): Answer[] {
  const qids = template.sections.flatMap((s) => s.questions);
  return qids.map((qid) => {
    const q = questions.find((x) => x.id === qid)!;
    const val = q?.type === "yesno" ? pick(["Yes", "No", "Partially"])
      : q?.type === "dropdown" && q.options ? pick(q.options)
      : q?.type === "number" ? String(int(1, 100))
      : q?.type === "date" ? daysFromNow(-int(1, 100)).slice(0, 10)
      : "We maintain documented controls reviewed periodically by our security team.";
    const versions: AnswerVersion[] = [{ version: 1, value: val, by: "Vendor", at: daysFromNow(-int(1, 30)) }];
    return { questionId: qid, value: val, status: pick<Answer["status"]>(["answered", "answered", "answered", "flagged", "approved"]), versions };
  });
}
export const assessments: Assessment[] = Array.from({ length: 200 }, (_, i) => {
  const entity = pick(entities);
  const template = pick(templates.filter((t) => t.status === "published"));
  const status = pick(statuses);
  const reviewer = pick(reviewers);
  const due = daysFromNow(int(-40, 60));
  const overdue = new Date(due) < new Date("2026-07-09") && !["approved", "completed", "rejected"].includes(status);
  const progress = status === "draft" ? 0 : status === "assigned" ? int(0, 10) : status === "in_progress" ? int(15, 85)
    : status === "approved" || status === "completed" ? 100 : int(88, 100);
  return {
    id: `ASM-${String(i + 1).padStart(4, "0")}`, code: `AS-2026-${String(i + 1).padStart(4, "0")}`,
    entityId: entity.id, entityName: entity.name, templateId: template.id, templateName: template.name,
    status: overdue ? status : status, reviewerId: reviewer.id, reviewerName: reviewer.name,
    createdAt: daysFromNow(-int(5, 120)), dueDate: due,
    submittedAt: ["submitted","under_review","needs_correction","correction_submitted","approved","completed","rejected"].includes(status) ? daysFromNow(-int(1, 30)) : undefined,
    completedAt: ["approved", "completed"].includes(status) ? daysFromNow(-int(0, 15)) : undefined,
    progress, riskLevel: entity.riskRating, score: progress === 100 ? int(55, 98) : undefined,
    answers: buildAnswers(template), overdue,
  };
});

/* ------------------------------------------------------------------ Findings */
const findingTitles = ["MFA not enforced for privileged accounts","Backup restoration not tested in 12 months","Outdated TLS configuration on public endpoints","Missing formal data retention policy","No documented incident response runbook","Excessive privileged access grants","Encryption at rest not enabled for backups","Vulnerability patching SLA exceeded","No independent penetration test on record","Shared administrator credentials in use","DR failover exceeds stated RTO","Vendor lacks current SOC 2 attestation"];
export const findings: Finding[] = Array.from({ length: 64 }, (_, i) => {
  const entity = pick(entities);
  const asm = pick(assessments.filter((a) => a.entityId === entity.id)) ?? assessments[0];
  const sev = pick<Finding["severity"]>(["critical", "high", "high", "medium", "medium", "low"]);
  return {
    id: `FND-${String(i + 1).padStart(3, "0")}`, code: `F-${String(i + 1).padStart(4, "0")}`,
    title: pick(findingTitles), description: "Control gap identified during assessment review requiring remediation to meet the organisation's security baseline.",
    severity: sev, status: pick<Finding["status"]>(["open", "open", "in_remediation", "resolved", "accepted_risk"]),
    entityId: entity.id, entityName: entity.name, assessmentId: asm.id, owner: pick(users).name,
    recommendation: "Implement the recommended control, document the change, and provide evidence for reviewer validation.",
    dueDate: daysFromNow(int(-10, 45)), createdAt: daysFromNow(-int(1, 60)), topic: pick(topics).name,
  };
});

/* ------------------------------------------------------------------ Notifications */
const notifTemplates: { type: Notification["type"]; title: string; msg: (a: string) => string }[] = [
  { type: "assigned", title: "New assessment assigned", msg: (a) => `${a} has been assigned to you for review.` },
  { type: "submitted", title: "Assessment submitted", msg: (a) => `${a} submitted their assessment for review.` },
  { type: "reminder", title: "Assessment due soon", msg: (a) => `${a} is due in 3 days.` },
  { type: "comment", title: "New comment added", msg: (a) => `A reviewer commented on ${a}.` },
  { type: "correction", title: "Correction requested", msg: (a) => `Corrections were requested for ${a}.` },
  { type: "approved", title: "Assessment approved", msg: (a) => `${a} has been approved.` },
];
export const notifications: Notification[] = Array.from({ length: 18 }, (_, i) => {
  const t = pick(notifTemplates);
  const asm = pick(assessments);
  return {
    id: `NTF-${String(i + 1).padStart(3, "0")}`, type: t.type, title: t.title, message: t.msg(asm.entityName),
    read: chance(0.4), createdAt: daysFromNow(-int(0, 10) - i * 0.1), actor: pick(users).name, link: "/assessments",
  };
});

/* ------------------------------------------------------------------ Audit Logs */
const actions = [
  { action: "Created question", module: "Question Master" }, { action: "Updated question weight", module: "Question Master" },
  { action: "Published template", module: "Templates" }, { action: "Created assessment", module: "Assessments" },
  { action: "Approved assessment", module: "Reviewer" }, { action: "Requested correction", module: "Reviewer" },
  { action: "Added finding", module: "Findings" }, { action: "Updated entity risk rating", module: "Entities" },
  { action: "Submitted assessment", module: "Vendor Portal" }, { action: "Exported report", module: "Reports" },
  { action: "Archived question", module: "Question Master" }, { action: "Login", module: "Authentication" },
];
export const auditLogs: AuditLog[] = Array.from({ length: 120 }, (_, i) => {
  const a = pick(actions);
  const u = pick(users);
  const hasChange = chance(0.5);
  return {
    id: `LOG-${String(i + 1).padStart(4, "0")}`, timestamp: daysFromNow(-i * 0.12 - int(0, 1)),
    user: u.name, userRole: u.role, action: a.action, module: a.module,
    entity: pick([...entities.map((e) => e.name), ...assessments.map((x) => x.code)]).toString(),
    previousValue: hasChange ? pick(["Medium", "Draft", "1.0", "Low", "Open"]) : undefined,
    newValue: hasChange ? pick(["High", "Published", "2.0", "Critical", "Resolved"]) : undefined,
    ip: `10.${int(0, 255)}.${int(0, 255)}.${int(1, 254)}`,
  };
});
