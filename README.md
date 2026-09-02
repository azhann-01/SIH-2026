# 🏭 SIH26130 --- Efficiency in Streamlining Industrial Approvals, Compliance Processes, and Access to Government Support Services

### InduSync -- Intelligent Industrial Approval, Compliance & Regulatory Assistance Platform



<p align="center">
  <b>Smart India Hackathon 2026</b><br>
  Streamlining industrial approvals, compliance processes, and access to government support services
</p>

------------------------------------------------------------------------

## 📌 Problem Statement

**SIH26130 --- Efficiency in Streamlining Industrial Approvals,
Compliance Processes, and Access to Government Support Services**

Industrial projects often require multiple approvals from different
departments. Applicants must identify applicable approvals, understand
dependencies, prepare documents, submit applications, and track their
status. Missing even one requirement can lead to delays and repeated communication.

InduSync addresses this fragmentation through a centralized,
project-aware platform connecting the industrial applicant workflow with
the government approval workflow.

------------------------------------------------------------------------

# 📍 Executive Summary

InduSync is a full-stack industrial compliance and approval management
platform designed around the lifecycle of an industrial project.

The platform uses the project's **industry, project stage, location
type, hazardous-waste status, fire-safety requirements, and production
status** to determine applicable approvals through a deterministic Rules
Engine.

### Core workflow

``` text
Company Registration
        ↓
Create Industrial Project
        ↓
Project Compliance Profile
        ↓
Rules Engine Evaluation
        ↓
Applicable Approvals Identified
        ↓
Approval Roadmap Generated
        ↓
Applicant Submits Application
        ↓
Government Dashboard
        ↓
Review / Approve / Reject
        ↓
Applicant Roadmap Updated
```

### Core capabilities

-   🏭 Project and company management
-   ⚙️ Rule-based approval identification
-   🗺️ Approval dependency roadmap
-   📄 Application submission and tracking
-   🏛️ Government-side application processing
-   ⏱️ Approval status and SLA tracking
-   📊 Dashboard analytics
-   🔐 JWT authentication and role-based access
-   🤖 Architecture for future AI/RAG regulatory assistance

------------------------------------------------------------------------

# 🎯 Existing Challenges

1.  **Manual approval identification** --- Applicants may not know which
    permissions apply to their project.
2.  **Fragmented approval process** --- Different approvals involve
    different departments and requirements.
3.  **Poor dependency visibility** --- Applicants may not understand
    which approvals precede others.
4.  **Application tracking difficulty** --- Status, documents and
    deadlines can be difficult to manage.
5.  **Limited applicant-government synchronization** --- Submitted
    applications need a clear workflow with the concerned authority.
6.  **Lack of project-specific compliance intelligence** --- Generic
    information is less useful than requirements derived from the actual
    project.

------------------------------------------------------------------------

# 💡 Proposed Solution

InduSync creates a project-specific compliance profile and uses it as
the basis for regulatory decision-making.

Example:

``` text
Industry              → Chemicals
Project Stage         → Pre-establishment
Location Type         → MIDC
Hazardous Waste       → Yes
Fire Safety Required  → Yes
Production Started    → No
```

The Rules Engine evaluates these parameters and identifies applicable
approvals.

``` text
Chemical Manufacturing
        │
        ├── Consent to Establish (CTE)
        ├── Provisional / Final Fire Safety Approval
        └── Factory Plan Approval / Factory Licence
```

The applicant can then submit applications against the relevant approval
requirements.

------------------------------------------------------------------------

# 🧠 Regulatory Rules Engine

The current prototype uses a **deterministic rule-based engine**, not an
AI model, for core approval determination.

Rules are maintained in structured configuration and evaluated by the
Spring Boot backend.

Example:

``` json
{
  "rule_id": "RULE001",
  "industry": "Chemicals",
  "project_stage": "Pre-establishment",
  "approval_id": "APP001"
}
```

Conditional example:

``` json
{
  "rule_id": "RULE002",
  "requires_fire_safety": true,
  "approval_id": "APP004"
}
```

### Advantages

-   Deterministic results
-   Explainable decisions
-   Easy rule modification
-   Fast evaluation
-   No AI dependency for core approval logic

------------------------------------------------------------------------

## 🏛️ System Architecture

The following architecture represents the current InduSync implementation along with planned future upgrades.

![InduSync System Architecture](docs/architecture/InduSync_System_Architecture.png)

> **Implementation note:** The current prototype's core workflow is
> powered by the Rules Engine and relational database. AI/RAG is a
> proposed intelligence extension and is not presented as a fully
> implemented production feature.

------------------------------------------------------------------------

## 🛠️ Technology Stack

| Layer | Technologies | Purpose |
|---|---|---|
| **Frontend** | React, Vite, Tailwind CSS, React Router, React Flow, Lucide React | Responsive applicant and government dashboards, project management, application tracking, approval roadmap and workflow visualization |
| **Backend** | Java, Spring Boot, Spring Web, Spring Data JPA, Hibernate | REST APIs, business logic, project/application management and workflow processing |
| **Database** | MySQL | Persistent storage for users, companies, projects, applications, approvals, documents and regulatory data |
| **Authentication & Security** | JWT, Spring Security | Secure authentication, authorization and role-based access for applicants and government officers |
| **Rules & Compliance Engine** | Java, Spring Boot, JSON-based Rules Engine | Determines applicable approvals and compliance requirements based on project characteristics |
| **Document Management** | Spring Boot REST APIs, MySQL | Application document handling, metadata management and verification workflow |
| **Workflow & Approval Management** | Spring Boot, REST APIs, React Flow | Approval lifecycle, dependency visualization, application status tracking and government review workflow |
| **Government Dashboard** | React, Tailwind CSS, Spring Boot REST APIs | Application review, document verification, approval/rejection and compliance monitoring |
| **Analytics & Visualization** | Recharts, React | Approval statistics, project insights and government analytics |
| **API Communication** | REST APIs, Axios | Communication between frontend, backend and application modules |
| **Development & Version Control** | Git, GitHub, VS Code | Source-code management, team collaboration and version control |

### 🔮 Planned AI & Intelligence Layer

AI/RAG is planned as a future enhancement to extend InduSync beyond deterministic rule-based compliance processing.

| Component | Planned Technology | Purpose |
|---|---|---|
| **Document Intelligence** | OCR + LLM | Extract information from regulatory documents and uploaded applications |
| **Regulatory Knowledge Base** | Vector Database | Store and retrieve relevant acts, rules, circulars and guidelines |
| **RAG Pipeline** | Embeddings + RAG + LLM | Provide context-aware regulatory answers with source-based retrieval |
| **Compliance Assistant** | LLM + RAG | Explain applicable requirements and assist users in understanding regulations |
| **Document Mismatch Detection** | NLP/LLM | Identify inconsistencies between submitted documents and application information |
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 🔐 Security Architecture

InduSync uses JWT-based authentication with role-based authorization to secure access to platform resources.

### Authentication Flow

```text
User
  ↓
Login / Registration
  ↓
Spring Boot Authentication API
  ↓
Credential Validation
  ↓
JWT Token Generation
  ↓
Authenticated API Requests
  ↓
JWT Validation
  ↓
Role-Based Authorization
  ↓
Protected Resources

### Roles

``` .
                 ┌── Applicant
User ── Login ───┤
                 └── Government
```
### Role Access

| Feature / Module | Applicant | Government Officer |
|---|:---:|:---:|
| Register / Login | ✅ | ✅ |
| Manage Profile | ✅ | ❌ |
| Create & Manage Projects | ✅ | ❌ |
| View Applicable Approvals | ✅ | ❌ |
| Submit Applications | ✅ | ❌ |
| Upload Application Documents | ✅ | ❌ |
| Track Application Status | ✅ | ❌ |
| View Approval Roadmap | ✅ | ❌ |
| Receive Notifications | ✅ | ✅ |
| Government Dashboard | ❌ | ✅ |
| View Submitted Applications | ❌ | ✅ |
| Verify Documents | ❌ | ✅ |
| Approve / Reject Applications | ❌ | ✅ |
| Add Remarks | ❌ | ✅ |
| Compliance Monitoring | ❌ | ✅ |
| Reports & Analytics | ❌ | ✅ |

The role determines which workflow and protected APIs the user can
access.

Security objectives include authentication, JWT authorization,
role-based access and separation of applicant/government operations.

------------------------------------------------------------------------

# 👤 Applicant Workflow

``` text
1. Login / Register
        ↓
2. Company Profile
        ↓
3. Create Project
        ↓
4. Enter Compliance Profile
        ↓
5. Rules Engine Evaluation
        ↓
6. View Applicable Approvals
        ↓
7. Open Approval Roadmap
        ↓
8. Submit Application
        ↓
9. Track Application
        ↓
10. Receive Approval / Rejection
```

The applicant dashboard provides active project information, project
status, approval statistics, approval status, deadlines and the
project-specific approval journey.

------------------------------------------------------------------------

# 🏭 Project Management

Each project stores general project information together with
compliance-specific attributes.

### Project information

-   Project name
-   Description
-   Location
-   Investment amount
-   Number of employees
-   Land type
-   Project status

### Compliance profile

-   Industry
-   Project stage
-   Location type
-   Generates hazardous waste
-   Requires fire safety
-   Production started

This profile becomes the input to the Rules Engine.

------------------------------------------------------------------------

# 🗺️ Approval Roadmap

The Approval Roadmap provides a visual representation of approvals
applicable to the selected project.

Example:

``` text
        ┌──────────────────────────┐
        │ Consent to Establish     │
        │ CTE                      │
        └────────────┬─────────────┘
                     │
                     ▼
        ┌──────────────────────────┐
        │ Fire Safety Approval     │
        └────────────┬─────────────┘
                     │
                     ▼
        ┌──────────────────────────┐
        │ Factory Plan / Licence   │
        └──────────────────────────┘
```

The roadmap supports:

-   Project selection
-   Applicable approval identification
-   Approval status
-   Application details
-   Submission information
-   SLA deadline
-   Remarks
-   Dependency visualization

The roadmap is generated from the selected project's data rather than
being a static page.

------------------------------------------------------------------------

# 📄 Application Management

Applicants can create and submit applications for required approvals.

Applications contain information such as:

-   Approval type
-   Project
-   Applicant
-   Application status
-   Submission date
-   SLA deadline
-   Remarks
-   Required documents

### Application lifecycle

``` text
READY
  ↓
SUBMITTED
  ↓
IN_REVIEW
  ↓
APPROVED
```

Alternative:

``` text
IN_REVIEW
    ↓
REJECTED
```

------------------------------------------------------------------------

# 🏛️ Government Dashboard

The government dashboard provides authorities with a centralized view of
incoming applications.

``` text
Application Submitted
        ↓
Government Dashboard
        ↓
Application Review
        ↓
Check Details / Documents
        ↓
Approve / Reject
        ↓
Database Update
        ↓
Applicant Roadmap Updated
```

This connects application submission with government-side processing
rather than treating the two dashboards as independent mock interfaces.

------------------------------------------------------------------------

# 🔄 End-to-End Data Flow

``` text
                    PROJECT CREATION
                          │
                          ▼
              ┌─────────────────────┐
              │ Compliance Profile  │
              └──────────┬──────────┘
                         │
                         ▼
                ┌─────────────────┐
                │   Rules Engine  │
                └────────┬────────┘
                         │
                         ▼
              Applicable Approvals
                         │
                         ▼
                Approval Roadmap
                         │
                         ▼
                 Create Application
                         │
                         ▼
                Government Dashboard
                         │
                  ┌──────┴──────┐
                  ▼             ▼
               APPROVE        REJECT
                  │             │
                  └──────┬──────┘
                         ▼
                 Database Update
                         │
                         ▼
                Applicant Roadmap
```

------------------------------------------------------------------------

# 🗄️ Backend Data Model

``` text
User
 │
 ├── Role
 │
 └── Authentication

Company
 │
 └── Projects
       │
       ├── Compliance Profile
       │
       └── Applications
              │
              └── Approval
```

### Major entities

-   User
-   Company
-   Project
-   Approval
-   Application
-   Regulatory / compliance records

Relationships are managed through JPA/Hibernate and persisted in MySQL.

------------------------------------------------------------------------

# ⚙️ Backend API Architecture

``` text
React
  │
  ├── Authentication APIs
  ├── Project APIs
  ├── Dashboard APIs
  ├── Application APIs
  └── Rules Engine API
          │
          ▼
     Spring Boot
```

### Rules Engine

``` text
POST /api/rules/evaluate
```

Example request:

``` json
{
  "industry": "Chemicals",
  "projectStage": "Pre-establishment",
  "locationType": "MIDC",
  "generatesHazardousWaste": true,
  "requiresFireSafety": true,
  "hasStartedProduction": false
}
```

For the above profile, the prototype's rules can identify:

``` text
APP001 → Consent to Establish (CTE)
APP004 → Provisional / Final Fire Safety Approval
APP005 → Factory Plan Approval / Factory Licence
```

------------------------------------------------------------------------

# 🤖 AI / RAG --- Proposed Intelligence Layer

The long-term architecture includes an AI/RAG layer for regulatory
intelligence.

### Proposed capabilities

-   Regulatory Assistant
-   Compliance Assistant
-   Government scheme information retrieval
-   Regulatory document processing
-   Information extraction
-   Document mismatch detection
-   Source-backed regulatory explanations

### Proposed architecture

``` text
Government Circulars
Acts / Rules
Regulatory Documents
       │
       ▼
Document Processing
       │
       ▼
Knowledge Base / Vector Store
       │
       ▼
Retriever
       │
       ▼
LLM
       │
       ▼
Source-backed Answer
```

RAG is proposed because regulatory information can change over time.
Retrieval can ground responses in relevant regulatory documents.

**Current status:** AI/RAG is not required for the current core
approval-generation workflow. The deterministic Rules Engine is the
implemented foundation.

------------------------------------------------------------------------

## 📊 Existing Approach vs InduSync

InduSync improves the industrial approval journey by combining project-specific regulatory evaluation, centralized application management, approval dependency visualization and applicant–government workflow into a single platform.

| Existing Approach | InduSync |
|---|---|
| Manual identification of applicable approvals | **Project-specific rule-based approval identification** |
| Regulatory information distributed across multiple sources | **Centralized platform for approvals, compliance and applications** |
| Generic regulatory information | **Compliance-profile and project-attribute driven requirements** |
| Limited visibility of approval dependencies | **Visual approval roadmap with dependency tracking** |
| Application tracking handled separately | **Integrated application lifecycle management** |
| Limited applicant–government interaction | **Connected Applicant + Government workflows** |
| Static or fragmented status tracking | **Database-backed real-time application status** |
| Difficult to understand project-level requirements | **Project-specific compliance journey** |
| Approval requirements determined manually | **Deterministic Rules Engine evaluates regulatory conditions** |
| Limited centralized visibility for government authorities | **Government dashboard for application review and processing** |
| AI, where used, may be treated as a decision-maker | **AI/RAG designed as a separate assistive intelligence layer** |

### 🚀 Key Differentiation

**InduSync does not replace regulatory decision-making with AI.**

The core approval determination is handled by a **deterministic Rules Engine**, making the system predictable, explainable and auditable.

The planned **AI/RAG layer** will work alongside the Rules Engine to provide regulatory document retrieval, contextual explanations, compliance assistance and document intelligence without becoming the authoritative decision-maker.

### 🔮 Future Intelligence Layer

`Regulatory Documents → Knowledge Base → RAG → AI Regulatory Assistant`

This architecture allows AI capabilities to be added incrementally without changing the core approval workflow or Rules Engine.

------------------------------------------------------------------------

# 🧪 Demonstration Scenario

### Chemical Manufacturing Project

``` text
Industry:
Chemicals

Project Stage:
Pre-establishment

Location Type:
MIDC

Generates Hazardous Waste:
Yes

Requires Fire Safety:
Yes

Production Started:
No
```

The Rules Engine identifies:

``` text
1. Consent to Establish (CTE)
2. Provisional / Final Fire Safety Approval
3. Factory Plan Approval / Factory Licence
```

The applicant can create an application, such as a
pollution/consent-related application.

The application is then visible in the Government Dashboard.

After government processing:

``` text
Government Action
       ↓
APPROVED / REJECTED
       ↓
Database
       ↓
Applicant Roadmap
       ↓
Updated Application Status
```

This demonstrates the complete workflow from **project creation →
regulatory identification → application → government processing →
applicant status update**.

------------------------------------------------------------------------

# 🖥️ Screenshots

### Applicant Dashboard

![Applicant Dashboard](docs/screenshots/applicant-dashboard.png)

### Projects

![Project Management](docs/screenshots/projects.png)

### Approval Roadmap

![Approval Roadmap](docs/screenshots/approval-roadmap.png)

### Government Dashboard

![Government Dashboard](docs/screenshots/government-dashboard.png)

------------------------------------------------------------------------

# 📁 Project Structure

``` text
SIH-2026/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/codexminds/indusync/
│   │       │       ├── controller/
│   │       │       ├── service/
│   │       │       ├── entity/
│   │       │       ├── dto/
│   │       │       └── ...
│   │       │
│   │       └── resources/
│   │           └── rules-engine/
│   │               └── rules.json
│   │
│   └── pom.xml
│
├── docs/
│   └── screenshots/
│
├── README.md
└── .gitignore
```

------------------------------------------------------------------------

# 🚀 Quickstart Guide

## 1. Clone the Repository

``` bash
git clone <YOUR_REPOSITORY_URL>
cd SIH-2026
```

## 2. Configure MySQL

Create the required database and configure the backend database
connection.

Example:

``` properties
spring.datasource.url=jdbc:mysql://localhost:3306/<database_name>
spring.datasource.username=<username>
spring.datasource.password=<password>
```

Do not commit credentials to GitHub.

## 3. Start the Backend

From PowerShell:

``` powershell
cd backend
.\mvnw.cmd spring-boot:run
```

## 4. Start the Frontend

Open another terminal:

``` powershell
cd frontend
npm install
npm run dev
```

Open the Vite development URL shown in the terminal.

------------------------------------------------------------------------

# 🔧 Environment & Security Configuration

Never commit:

-   Database passwords
-   JWT secrets
-   API keys
-   `.env` files containing credentials
-   Production secrets

Use environment/configuration files and include sensitive files in
`.gitignore`.

------------------------------------------------------------------------

## 🧭 Development Roadmap

The development of **InduSync** is structured into progressive phases, covering the core platform, regulatory intelligence, government workflow, and future AI capabilities.

| Phase | Module | Status | Key Deliverables |
|---|---|---|---|
| **1** | **Frontend Foundation** | ✅ Completed | React-based application structure, responsive UI, navigation, reusable components, Tailwind CSS styling and core applicant interfaces |
| **2** | **Spring Boot Backend** | ✅ Completed | REST API architecture, controllers, services, repositories, business logic and backend integration |
| **3** | **MySQL + JPA Persistence** | ✅ Completed | MySQL database integration, JPA/Hibernate entities, repositories, relationships and persistent storage for companies, projects, applications and approvals |
| **4** | **Authentication & Role-Based Workflow** | ✅ Completed | User authentication, JWT-based security, role-based access control and separate Applicant/Government workflows |
| **5** | **Project Management** | ✅ Completed | Project creation and management, project-specific information, company-project association and project status tracking |
| **6** | **Regulatory Rules Engine** | ✅ Completed | Rule-based approval identification, eligibility conditions, required documents, approval dependencies, project-stage evaluation and compliance logic |
| **7** | **Approval Roadmap** | ✅ Completed | Dynamic approval roadmap, project-specific applicable approvals, application status tracking, approval details and visual workflow |
| **8** | **Application Workflow** | ✅ Completed | Application creation, submission, document handling, application status transitions and applicant-government workflow integration |
| **9** | **Government Dashboard** | ✅ Completed | Government-side application management, application review, approval/rejection workflow, remarks and government operational view |
| **10** | **Dashboard Analytics** | ✅ Completed | Approval statistics, application status summaries, project-level insights and government dashboard analytics |
| **11** | **AI/RAG Regulatory Intelligence** | 🔄 Proposed | Regulatory document intelligence, RAG-based information retrieval, AI-powered compliance assistance, document understanding and regulatory guidance |
| **12** | **Production Deployment & Scaling** | 🔄 Future | Cloud deployment, production infrastructure, HTTPS, scalability, monitoring, reliability and production-grade security |

### 📌 Phase Progress

#### ✅ Completed — Core Platform

The current prototype has completed the primary application workflow:

**Frontend → Backend → Database → Authentication → Projects → Rules Engine → Approval Roadmap → Applications → Government Dashboard → Analytics**

These modules form the functional foundation of InduSync and demonstrate the complete applicant-to-government workflow.

#### 🔄 Proposed — AI/RAG Intelligence

The AI/RAG layer is planned as an enhancement to the existing Rules Engine. It will provide intelligent regulatory document retrieval, contextual explanations, compliance assistance and document-level intelligence while the deterministic Rules Engine continues to handle structured approval eligibility.

#### 🔮 Future — Production Deployment

The final phase focuses on transforming the prototype into a production-ready platform through cloud deployment, scalable infrastructure, HTTPS, monitoring, performance optimization and stronger operational security.

------------------------------------------------------------------------

# 🔬 Prototype Validation

The prototype has been validated through an end-to-end demonstration:

``` text
Create Project
      ↓
Rules Engine
      ↓
Applicable Approvals
      ↓
Create Application
      ↓
Government Dashboard
      ↓
Approve / Reject
      ↓
Applicant Roadmap
```

The Rules Engine has also been tested directly through the backend API
using project-specific compliance parameters.

------------------------------------------------------------------------

# 🌟 Key Differentiators

### 1. Project-Aware Compliance

Requirements are generated from the actual project's compliance profile.

### 2. Deterministic Regulatory Logic

The core approval engine uses explicit rules, making decisions
explainable and predictable.

### 3. Visual Approval Roadmap

Applicants can understand their approval journey instead of viewing
approvals as an unstructured list.

### 4. Applicant--Government Workflow

The prototype connects application submission with government-side
processing.

### 5. Database-Backed State

Project and application states are persisted instead of relying only on
frontend mock data.

### 6. Extensible Intelligence Layer

AI/RAG can be added without replacing the deterministic compliance
foundation.

------------------------------------------------------------------------

## 👥 Team CodeXMinds

| Member | Responsibility |
|---|---|
| **Priyanka — Research, Documentation & Presentation** | Problem-statement research, regulatory and domain research, competitor/existing-system analysis, solution validation, technical documentation, PPT preparation, demo planning and presentation coordination |
| **Manish — Backend & Database** | Spring Boot backend, MySQL, REST APIs, JPA/Hibernate, JWT authentication, authentication/user, company, project, application, approval, document, compliance, scheme, dashboard and notification APIs |
| **Deepak — Frontend & UI/UX** | React, Tailwind CSS, Axios, Recharts and React Flow; investor portal, company/project pages, approval roadmap, approval details, document status, compliance, government schemes and AI assistant UI |
| **Divyanshu — AI / RAG / Document Intelligence** | Python, FastAPI, LLM APIs, RAG, embeddings, vector database and OCR/PDF extraction; regulatory assistant, compliance assistant, document intelligence and document mismatch detection |
| **Yug — Regulatory Data & Rules Engine** | Regulatory dataset, approval eligibility, required documents, dependencies, processing stages, SLA, renewal, risk factors, official sources, Rules Engine, compliance rules and scheme eligibility |
| **Azhan — Team Leader + Full Integration + Government Intelligence Dashboard** | API/AI/Rules integration, error handling, end-to-end testing, deployment, environment configuration, Government Dashboard, analytics, bottleneck detection and SLA monitoring |
------------------------------------------------------------------------

# 📜 Smart India Hackathon 2026

**Problem Statement:** SIH26130\
**Project:** InduSync\
**Team:** CodeXMinds\
**Category:** Software

------------------------------------------------------------------------

# 📄 License

This project has been developed as a Smart India Hackathon 2026
prototype by Team CodeXMinds.

------------------------------------------------------------------------


<p align="center">
<b>InduSync --- Making Industrial Compliance Simpler, Traceable
and Project-Aware.</b>
</p>
