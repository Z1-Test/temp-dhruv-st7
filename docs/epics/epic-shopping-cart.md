# Epic: Shopping Cart

## Overview

The Shopping Cart epic provides the core cart management capabilities for both guest and authenticated users. This epic enables users to collect products for purchase, maintain price consistency, and transition from guest to authenticated shopping experiences.

## Bounded Context

**Primary Context:** `cart/`

## Business Value

- Enable guest users to shop without account creation (reduce friction)
- Support authenticated users with persistent cart state
- Protect users from price changes during shopping session
- Reduce cart abandonment through seamless guest-to-user transition
- Foundation for checkout and order creation

## Constituent Features

This epic groups the following features:

1. **Guest Cart Management** (`docs/features/cart/feat-guest-cart-management.md`)
   - Enables unauthenticated users to manage a shopping cart
   - Dependencies: Product Catalog Browsing

2. **Cart Price Snapshot** (`docs/features/cart/feat-cart-price-snapshot.md`)
   - Captures product prices at time of cart addition
   - Dependencies: Guest Cart Management

3. **Authenticated Cart Management** (`docs/features/cart/feat-authenticated-cart-management.md`)
   - Enables authenticated users to manage persistent carts
   - Dependencies: User Login, Guest Cart Management

## Dependencies

**Prerequisites:**
- Product Catalog Browsing (Catalog Foundation)
- User Login (Identity Foundation) - for Authenticated Cart Management

**Dependent Epics:**
- Wishlist (for Wishlist to Cart Transfer)
- Checkout & Order Creation

## Execution Strategy

This epic is part of the **Core Layer** with sequential dependencies within the epic:
1. Guest Cart Management first (depends on Product Catalog Browsing)
2. Cart Price Snapshot second (depends on Guest Cart Management)
3. Authenticated Cart Management third (depends on User Login + Guest Cart Management)

## Success Criteria

- [ ] Guest users can add, update, and remove cart items
- [ ] Cart persists for 30 days via session storage
- [ ] Price snapshot is captured when items are added to cart
- [ ] Authenticated users inherit guest cart on login (replace strategy)
- [ ] Cart supports last-write-wins concurrency model
- [ ] All features are behind feature flags
- [ ] Acceptance criteria for all three features are met

## Risk & Mitigation

| Risk | Mitigation |
|------|------------|
| Price snapshot conflicts at checkout | Clear messaging; inventory validation before order creation |
| Guest cart loss frustrates users | Maximize session persistence (30 days); communicate cart lifespan |
| Cart replacement on login loses items | Document behavior clearly; consider notification on replacement |

## Timeline

**Layer:** Core (Week 2-4)
**Sequential Execution:** Must follow dependency chain within epic

---

**Status:** Ready for Implementation  
**Last Updated:** 2025-12-30
