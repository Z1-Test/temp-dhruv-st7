# Shipment Creation

---

## 0. Metadata

```yaml
feature_name: "Shipment Creation"
bounded_context: "fulfillment"
status: "draft"
owner: "Fulfillment Team"
```

---

## 1. Overview

Shipment Creation automatically creates shipments via Shiprocket when orders are paid, initiating physical delivery.

**As a** system  
**I want** to create shipments for paid orders  
**So that** products are delivered to customers

**Dependencies:** Payment Processing

**Feature Flag:** `feature_shipment_creation_enabled`

---

## 7. User Stories & Experience Scenarios

#### Scenario 1.1 — Auto Shipment Creation

**Given** an order payment is successful  
**When** the payment processed event fires  
**Then** a shipment is created via Shiprocket API  
**And** all order items ship together (no partial shipments)  
**And** shipment record created in Firestore

---

## 10. Acceptance Criteria

```markdown
- [ ] AC1 — Shipments created automatically after payment
- [ ] AC2 — Shiprocket API integration works correctly
- [ ] AC3 — All items ship together (no partial shipments)
- [ ] AC4 — Shipment records persist in Firestore
- [ ] AC5 — Feature controlled by flag
```

---

## 12. History & Status

- **Status:** Draft
- **Created:** 2025-12-30
- **Related Epics:** Order Fulfillment
- **Dependencies:** Payment Processing
