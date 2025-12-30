# Shipment Status Notifications

---

## 0. Metadata

```yaml
feature_name: "Shipment Status Notifications"
bounded_context: "fulfillment"
status: "draft"
owner: "Fulfillment Team"
```

---

## 1. Overview

Shipment Status Notifications sends proactive email notifications to users when their shipment status changes (dispatched, out for delivery, delivered).

**As a** user with a shipped order  
**I want** to receive notifications about shipment status changes  
**So that** I stay informed about my delivery

**Dependencies:** Shipment Creation

**Feature Flag:** `feature_shipment_notifications_enabled`

---

## 7. User Stories & Experience Scenarios

#### Scenario 1.1 — Dispatch Notification

**Given** my order shipment is created and dispatched  
**When** shipment status changes to "dispatched"  
**Then** I receive an email notification  
**And** it includes tracking number and estimated delivery

#### Scenario 1.2 — Delivery Notification

**Given** my shipment is delivered  
**When** shipment status changes to "delivered"  
**Then** I receive a delivery confirmation email

---

## 10. Acceptance Criteria

```markdown
- [ ] AC1 — Notifications sent on status changes
- [ ] AC2 — Emails include tracking and delivery information
- [ ] AC3 — Retry logic (3 attempts) on email failures
- [ ] AC4 — Failures logged but don't block fulfillment
- [ ] AC5 — Feature controlled by flag
```

---

## 12. History & Status

- **Status:** Draft
- **Created:** 2025-12-30
- **Related Epics:** Order Fulfillment
- **Dependencies:** Shipment Creation
