# Project 28: Zero-Trust Employee Onboarding & Multi-App Provisioning
**Inspired by Atlassian | Camunda 8 + Spring Boot + React + PostgreSQL**

## 1. Project Overview
An enterprise workflow orchestration platform automating Zero-Trust Employee Onboarding. When HR hires a new engineer, the workflow provisions multiple SaaS applications in parallel, conducts a sequential reference check and background verification (BGV) sub-process with SLA timers and error boundaries, and invokes a reusable child process for laptop and YubiKey courier dispatch.

## 2. Mandatory BPMN 2.0 Constructs Implemented
- **Main Process (`employee-onboarding-main.bpmn`):** Orchestrates concurrent IT provisioning and BGV auditing.
- **Parallel Multi-Instance Sub-Process:** Iterates over `=requestedApps` (`appItem`), routing high-privilege entitlements to a Security Officer User Task before invoking the IAM REST Connector.
- **Sequential Multi-Instance Activity:** Iterates sequentially over `=references` (`refItem`) inside the Background Verification Embedded Sub-Process.
- **Boundary Events (Error & Timer):**
  - *Non-Interrupting Timer (`PT24H`):* Escalates delayed BGV reviews to HR.
  - *Interrupting Error Boundary (`BGV_FAILED`):* Catches `ZeebeBpmnError` thrown by the Spring Boot worker, revokes provisional SaaS accounts, and blocks hardware shipping.
- **Reusable Call Activity (`hardware-procurement-child.bpmn`):** Allocates hardware serial numbers and dispatches courier tracking once BGV passes.

## 3. FEEL Expression Dictionary
| Construct | Property | FEEL Expression |
| :--- | :--- | :--- |
| Parallel MI (SaaS Apps) | Input Collection | `=requestedApps` |
| Parallel MI (SaaS Apps) | Output Element | `={appName: appItem.appName, role: appItem.role, status: appProvisionStatus, accountId: generatedAccountId}` |
| Security Gate XOR | Condition | `=appItem.requiresSecurityApproval = true` |
| Sequential MI (References) | Input Collection | `=references` |
| BGV Error Compensation | Output Mapping | `="FAILED"` -> `bgvStatus` |
| Hardware Dispatch Gateway | Condition | `=bgvStatus = "PASSED"` |

## 4. How to Run Locally (Quick Demo Mode or Full Docker Mode)

### Option A: Fast Local Run (For Code Walkthrough & Live Debugging)
1. **Start Spring Boot Backend:**
   ```bash
   cd backend-springboot
   mvn spring-boot:run