export type RiskLevel = "critical" | "high" | "medium" | "low" | "minimal";
export type EntityType = "Vendor" | "Supplier" | "Partner" | "Service Provider";
export type EntityStatus = "active" | "onboarding" | "inactive" | "suspended";

export type QuestionType =
  | "text" | "paragraph" | "yesno" | "dropdown" | "checkbox" | "number" | "date" | "file";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Reviewer" | "Analyst" | "Vendor" | "Auditor";
  department?: string;
  avatar?: string;
  lastActive: string;
  status: "active" | "inactive";
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  color: string;
  questionCount: number;
}

export interface Question {
  id: string;
  code: string;
  text: string;
  helpText?: string;
  type: QuestionType;
  topicId: string;
  weight: number;
  mandatory: boolean;
  options?: string[];
  status: "published" | "draft" | "archived";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface TemplateSectionItem { questionId: string; }
export interface TemplateSection {
  id: string;
  title: string;
  description?: string;
  questions: string[]; // question ids
}
export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  version: string;
  status: "published" | "draft" | "archived";
  sections: TemplateSection[];
  questionCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
}

export interface Contact {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  primary: boolean;
}
export interface EntityDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
}
export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  category: string;
  country: string;
  status: EntityStatus;
  riskRating: RiskLevel;
  complianceScore: number;
  website: string;
  onboardedAt: string;
  contacts: Contact[];
  documents: EntityDocument[];
  assessmentCount: number;
  openFindings: number;
  criticality: "Tier 1" | "Tier 2" | "Tier 3";
  spend: number;
}

export type AssessmentStatus =
  | "draft" | "assigned" | "in_progress" | "submitted" | "under_review"
  | "needs_correction" | "correction_submitted" | "approved" | "rejected" | "completed";

export interface AnswerVersion {
  version: number;
  value: string;
  by: string;
  at: string;
  reviewerComment?: string;
  vendorExplanation?: string;
  evidence?: string;
}
export interface Answer {
  questionId: string;
  value: string;
  evidence?: string;
  status: "answered" | "flagged" | "corrected" | "approved";
  versions: AnswerVersion[];
}
export interface Assessment {
  id: string;
  code: string;
  entityId: string;
  entityName: string;
  templateId: string;
  templateName: string;
  status: AssessmentStatus;
  reviewerId: string;
  reviewerName: string;
  createdAt: string;
  dueDate: string;
  submittedAt?: string;
  completedAt?: string;
  progress: number;
  riskLevel: RiskLevel;
  score?: number;
  answers: Answer[];
  overdue: boolean;
}

export type FindingSeverity = "critical" | "high" | "medium" | "low";
export type FindingStatus = "open" | "in_remediation" | "resolved" | "accepted_risk";
export interface Finding {
  id: string;
  code: string;
  title: string;
  description: string;
  severity: FindingSeverity;
  status: FindingStatus;
  entityId: string;
  entityName: string;
  assessmentId: string;
  owner: string;
  recommendation: string;
  dueDate: string;
  createdAt: string;
  topic: string;
}

export type NotificationType =
  | "assigned" | "reminder" | "submitted" | "comment" | "correction" | "approved";
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actor: string;
  link?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  userRole: string;
  action: string;
  module: string;
  entity: string;
  previousValue?: string;
  newValue?: string;
  ip: string;
}
