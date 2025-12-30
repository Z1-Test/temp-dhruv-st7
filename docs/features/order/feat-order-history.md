# Order History

---

## 0. Metadata

```yaml
feature_name: "Order History"
bounded_context: "order"
status: "draft"
owner: "Order Team"
```

---

## 1. Overview

Order History enables authenticated users to view a list of all their past and current orders.

**As a** logged-in user  
**I want** to view my order history  
**So that** I can track my purchases and order status

**Dependencies:** User Login, Order Creation

**Feature Flag:** `feature_order_history_enabled`

---

## 7. User Stories & Experience Scenarios

#### Scenario 1.1 — View Order List

**Given** I am logged in and have placed orders  
**When** I navigate to order history  
**Then** I see a list of all my orders  
**And** each shows order number, date, status, and total

#### Scenario 1.2 — No Orders

**Given** I am logged in with no orders  
**When** I view order history  
**Then** I see a message "You haven't placed any orders yet"  
**And** a link to browse products

---

## 10. Acceptance Criteria

```markdown
- [ ] AC1 — Users can view all their orders
- [ ] AC2 — Orders display key information (number, date, status, total)
- [ ] AC3 — Orders sorted by date (newest first)
- [ ] AC4 — Empty state handled gracefully
- [ ] AC5 — Feature controlled by flag
```

---

## 12. History & Status

- **Status:** Draft
- **Created:** 2025-12-30
- **Related Epics:** Order Management
- **Dependencies:** User Login, Order Creation
