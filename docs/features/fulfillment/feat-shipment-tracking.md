# Shipment Tracking

---

## 0. Metadata

```yaml
feature_name: "Shipment Tracking"
bounded_context: "fulfillment"
status: "draft"
owner: "Fulfillment Team"
```

---

## 1. Overview

Shipment Tracking enables users to view real-time shipment status and tracking information via Shiprocket integration.

**As a** user with a shipped order  
**I want** to track my shipment status  
**So that** I know when to expect delivery

**Dependencies:** Shipment Creation

**Feature Flag:** `feature_shipment_tracking_enabled`

---

## 7. User Stories & Experience Scenarios

#### Scenario 1.1 — View Tracking Info

**Given** my order has shipped  
**When** I view order details  
**Then** I see shipment tracking information  
**And** tracking number, carrier, current status  
**And** estimated delivery date if available

---

## 10. Acceptance Criteria

```markdown
- [ ] AC1 — Users can view tracking information
- [ ] AC2 — Shiprocket status is authoritative source
- [ ] AC3 — Tracking updates reflected in real-time or near-real-time
- [ ] AC4 — Tracking number and carrier displayed
- [ ] AC5 — Feature controlled by flag
```

---

## 12. History & Status

- **Status:** Draft
- **Created:** 2025-12-30
- **Related Epics:** Order Fulfillment
- **Dependencies:** Shipment Creation
