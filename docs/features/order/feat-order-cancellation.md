# Order Cancellation

---

## 0. Metadata

```yaml
feature_name: "Order Cancellation"
bounded_context: "order"
status: "draft"
owner: "Order Team"
```

---

## 1. Overview

Order Cancellation enables users to cancel orders before shipment following defined business rules.

**As a** logged-in user with a pending order  
**I want** to cancel my order  
**So that** I'm not charged or receive unwanted items

**Dependencies:** Order Creation

**Feature Flag:** `feature_order_cancellation_enabled`

---

## 7. User Stories & Experience Scenarios

#### Scenario 1.1 — Cancel Before Shipment

**Given** I have an order that hasn't shipped  
**When** I click "Cancel Order"  
**And** I confirm cancellation  
**Then** the order status changes to cancelled  
**And** I receive confirmation

#### Scenario 1.2 — Cannot Cancel After Shipment

**Given** my order has already shipped  
**When** I attempt to cancel  
**Then** I see a message "Order cannot be cancelled after shipment"  
**And** cancellation is prevented

---

## 10. Acceptance Criteria

```markdown
- [ ] AC1 — Users can cancel orders before shipment
- [ ] AC2 — Cancellation blocked after shipment
- [ ] AC3 — Order status updated to cancelled
- [ ] AC4 — Confirmation provided to user
- [ ] AC5 — Feature controlled by flag
```

---

## 12. History & Status

- **Status:** Draft
- **Created:** 2025-12-30
- **Related Epics:** Order Management
- **Dependencies:** Order Creation
