/**
 * Mock API service layer. Simulates network latency and mirrors the shape of a
 * future REST/GraphQL backend so screens can migrate to real endpoints without
 * changing call sites. Swap these implementations for `fetch` calls when the
 * backend is ready — the query keys and return types stay identical.
 */
import {
  users, topics, questions, templates, entities, assessments, findings, notifications, auditLogs,
} from "./mock";

const delay = <T,>(data: T, ms = 300): Promise<T> =>
  new Promise((res) => setTimeout(() => res(data), ms));

export const api = {
  getUsers: () => delay(users),
  getTopics: () => delay(topics),
  getQuestions: () => delay(questions),
  getQuestion: (id: string) => delay(questions.find((q) => q.id === id)),
  getTemplates: () => delay(templates),
  getTemplate: (id: string) => delay(templates.find((t) => t.id === id)),
  getEntities: () => delay(entities),
  getEntity: (id: string) => delay(entities.find((e) => e.id === id)),
  getAssessments: () => delay(assessments),
  getAssessment: (id: string) => delay(assessments.find((a) => a.id === id)),
  getFindings: () => delay(findings),
  getNotifications: () => delay(notifications),
  getAuditLogs: () => delay(auditLogs),
};

export function dashboardStats() {
  const totalVendors = entities.length;
  const activeAssessments = assessments.filter((a) => ["assigned", "in_progress", "under_review", "needs_correction", "correction_submitted"].includes(a.status)).length;
  const pendingReviews = assessments.filter((a) => ["submitted", "under_review", "correction_submitted"].includes(a.status)).length;
  const dueSoon = assessments.filter((a) => {
    const d = new Date(a.dueDate).getTime() - Date.now();
    return d > 0 && d < 1000 * 60 * 60 * 24 * 14 && !["approved", "completed", "rejected"].includes(a.status);
  }).length;
  const highRisk = entities.filter((e) => e.riskRating === "critical" || e.riskRating === "high").length;
  const openFindings = findings.filter((f) => f.status === "open" || f.status === "in_remediation").length;
  const completed = assessments.filter((a) => a.status === "approved" || a.status === "completed").length;
  const compliance = Math.round(entities.reduce((a, e) => a + e.complianceScore, 0) / entities.length);
  const overdue = assessments.filter((a) => a.overdue).length;
  return { totalVendors, activeAssessments, pendingReviews, dueSoon, highRisk, openFindings, completed, compliance, overdue };
}

export function riskDistribution() {
  const levels = ["critical", "high", "medium", "low", "minimal"] as const;
  return levels.map((l) => ({ level: l, count: entities.filter((e) => e.riskRating === l).length }));
}

export function assessmentStatusDistribution() {
  const map: Record<string, number> = {};
  assessments.forEach((a) => (map[a.status] = (map[a.status] ?? 0) + 1));
  return Object.entries(map).map(([status, count]) => ({ status, count }));
}

export function complianceTrend() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  let base = 74;
  return months.map((m) => {
    base += Math.round((Math.random() - 0.35) * 4);
    base = Math.max(68, Math.min(94, base));
    return { month: m, compliance: base, assessments: 20 + Math.round(Math.random() * 22) };
  });
}

export function findingsBySeverity() {
  const sev = ["critical", "high", "medium", "low"] as const;
  return sev.map((s) => ({ severity: s, count: findings.filter((f) => f.severity === s).length }));
}
