import { Routes, Route, Navigate } from "react-router-dom";

import {
  AppLayout,
  VendorLayout,
} from "@/components/layout/app-layout";

import { ReviewerLayout } from "@/components/layout/reviewer-layout";


import { LoginPage } from "@/features/auth/LoginPage";
import { ForgotPasswordPage } from "@/features/auth/ForgotPasswordPage";


import { DashboardPage } from "@/features/dashboard/DashboardPage";


import { QuestionBankPage } from "@/features/questions/QuestionBankPage";
import { QuestionFormPage } from "@/features/questions/QuestionFormPage";


import { TopicsPage } from "@/features/topics/TopicsPage";
import { TopicDetailPage } from "@/features/topics/TopicDetailPage";
import { TopicEditPage } from "@/features/topics/TopicEditPage";


import { TemplatesPage } from "@/features/templates/TemplatesPage";
import { TemplateBuilderPage } from "@/features/templates/TemplateBuilderPage";
import { TemplateDetailPage } from "@/features/templates/TemplateDetailPage";


import { EntitiesPage } from "@/features/entities/EntitiesPage";
import { EntityFormPage } from "@/features/entities/EntityFormPage";
import { EntityDetailPage } from "@/features/entities/EntityDetailPage";


import { AssessmentPage } from "@/features/assessments/AssessmentsPage";
import { AssessmentWizardPage } from "@/features/assessments/AssessmentWizardPage";
import { AssessmentDetailPage } from "@/features/assessments/AssessmentDetailPage";


import { ReviewerDashboardPage } from "@/features/reviewer/ReviewerDashboardPage";
import { ReviewWorkspacePage } from "@/features/reviewer/ReviewWorkspacePage";


import { FindingsPage } from "@/features/findings/FindingsPage";
import { FindingDetailPage } from "@/features/findings/FindingDetailPage";
import { FindingCreatePage } from "@/features/findings/FindingCreatePage";


import { ReportsPage } from "@/features/reports/ReportsPage";
import { NotificationsPage } from "@/features/notifications/NotificationsPage";
import { AuditLogsPage } from "@/features/audit/AuditLogsPage";


import { SettingsPage } from "@/features/settings/SettingsPage";
import { ProfilePage } from "@/features/settings/ProfilePage";


import { AboutPage } from "@/features/misc/AboutPage";

import {
  NotFoundPage,
  AccessDeniedPage,
} from "@/features/misc/ErrorPages";


import { VendorDashboardPage } from "@/features/vendor/VendorDashboardPage";
import { VendorAssessmentsPage } from "@/features/vendor/VendorAssessmentsPage";
import { VendorQuestionnairePage } from "@/features/vendor/VendorQuestionnairePage";
import { VendorHistoryPage } from "@/features/vendor/VendorHistoryPage";
import { VendorMessagesPage } from "@/features/vendor/VendorMessagesPage";



export default function App(){


  return (

      <Routes>


        {/* ================= PUBLIC ================= */}


        <Route
            path="/login"
            element={<LoginPage />}
        />


        <Route
            path="/forgot-password"
            element={<ForgotPasswordPage />}
        />


        <Route
            path="/access-denied"
            element={<AccessDeniedPage />}
        />



        {/* ================= ADMIN ================= */}


        <Route element={<AppLayout />}>



          <Route
              index
              element={
                <Navigate
                    to="/dashboard"
                    replace
                />
              }
          />



          <Route
              path="/dashboard"
              element={<DashboardPage />}
          />



          {/* QUESTIONS */}


          <Route
              path="/questions"
              element={<QuestionBankPage />}
          />


          <Route
              path="/questions/new"
              element={<QuestionFormPage />}
          />


          <Route
              path="/questions/:id/edit"
              element={<QuestionFormPage />}
          />



          {/* TOPICS */}


          <Route
              path="/topics"
              element={<TopicsPage />}
          />


          <Route
              path="/topics/edit/:id"
              element={<TopicEditPage />}
          />


          <Route
              path="/topics/:id"
              element={<TopicDetailPage />}
          />



          {/* TEMPLATES */}


          <Route
              path="/templates"
              element={<TemplatesPage />}
          />


          <Route
              path="/templates/create"
              element={<TemplateBuilderPage />}
          />


          <Route
              path="/templates/builder"
              element={<TemplateBuilderPage />}
          />


          <Route
              path="/templates/builder/:id"
              element={<TemplateBuilderPage />}
          />


          <Route
              path="/templates/:id"
              element={<TemplateDetailPage />}
          />



          {/* ENTITIES */}


          <Route
              path="/entities"
              element={<EntitiesPage />}
          />


          <Route
              path="/entities/new"
              element={<EntityFormPage />}
          />


          <Route
              path="/entities/:id"
              element={<EntityDetailPage />}
          />



          {/* ASSESSMENTS */}


          <Route
              path="/assessments"
              element={<AssessmentPage />}
          />


          <Route
              path="/assessments/new"
              element={<AssessmentWizardPage />}
          />


          <Route
              path="/assessments/:id"
              element={<AssessmentDetailPage />}
          />



          <Route
              path="/reports"
              element={<ReportsPage />}
          />


          <Route
              path="/notifications"
              element={<NotificationsPage />}
          />


          <Route
              path="/audit"
              element={<AuditLogsPage />}
          />


          <Route
              path="/settings"
              element={<SettingsPage />}
          />


          <Route
              path="/profile"
              element={<ProfilePage />}
          />


          <Route
              path="/about"
              element={<AboutPage />}
          />



        </Route>





        {/* ================= REVIEWER ================= */}



        <Route element={<ReviewerLayout />}>


          <Route
              path="/reviewer"
              element={<ReviewerDashboardPage />}
          />



          <Route
              path="/reviewer/:id"
              element={<ReviewWorkspacePage />}
          />



          {/* FINDINGS */}



          <Route
              path="/findings"
              element={<FindingsPage />}
          />
          <Route
              path="/findings/create"
              element={<FindingCreatePage />}
          />


          <Route
              path="/findings/new"
              element={<FindingCreatePage />}
          />



          <Route
              path="/findings/:id"
              element={<FindingDetailPage />}
          />



        </Route>






        {/* ================= VENDOR ================= */}



        <Route element={<VendorLayout />}>


          <Route
              path="/vendor"
              element={<VendorDashboardPage />}
          />



          <Route
              path="/vendor/assessments"
              element={<VendorAssessmentsPage />}
          />



          <Route
              path="/vendor/assessments/:id"
              element={<VendorQuestionnairePage />}
          />



          <Route
              path="/vendor/questionnaire/:id"
              element={<VendorQuestionnairePage />}
          />



          <Route
              path="/vendor/assessment/:id"
              element={<VendorQuestionnairePage />}
          />



          <Route
              path="/vendor-assessment/:token"
              element={<VendorQuestionnairePage />}
          />



          <Route
              path="/vendor/history"
              element={<VendorHistoryPage />}
          />



          <Route
              path="/vendor/messages"
              element={<VendorMessagesPage />}
          />



        </Route>





        {/* ================= 404 ================= */}



        <Route
            path="*"
            element={<NotFoundPage />}
        />



      </Routes>


  );

}