# Epic: Wishlist

## Overview

The Wishlist epic enables authenticated users to save products for future consideration and purchase. This epic provides a private wishlist capability that supports product discovery and conversion by allowing users to curate collections and transfer items to their cart.

## Bounded Context

**Primary Context:** `wishlist/`

## Business Value

- Increase conversion by capturing purchase intent
- Improve customer retention through saved product collections
- Reduce cart abandonment by enabling deferred purchase decisions
- Support impulse buying through easy cart transfer
- Enable future product recommendation features

## Constituent Features

This epic groups the following features:

1. **Wishlist Management** (`docs/features/wishlist/feat-wishlist-management.md`)
   - Enables users to add, view, and remove products from wishlist
   - Dependencies: User Login, Product Catalog Browsing

2. **Wishlist to Cart Transfer** (`docs/features/wishlist/feat-wishlist-to-cart-transfer.md`)
   - Enables users to move wishlist items to shopping cart
   - Dependencies: Wishlist Management, Authenticated Cart Management

## Dependencies

**Prerequisites:**
- User Login (Identity Foundation)
- Product Catalog Browsing (Catalog Foundation)
- Authenticated Cart Management (Shopping Cart) - for Wishlist to Cart Transfer

**Dependent Epics:** None - Core layer epic

## Execution Strategy

This epic is part of the **Core Layer** with sequential dependencies:
1. Wishlist Management first (requires User Login + Product Catalog Browsing)
2. Wishlist to Cart Transfer second (requires Wishlist Management + Authenticated Cart Management)

## Success Criteria

- [ ] Authenticated users can add products to their wishlist
- [ ] Users can view their complete wishlist
- [ ] Users can remove items from wishlist
- [ ] Wishlists are private (no sharing functionality)
- [ ] Add-to-cart is blocked if wishlist product is unavailable
- [ ] Users can transfer wishlist items to cart
- [ ] All features are behind feature flags
- [ ] Acceptance criteria for both features are met

## Risk & Mitigation

| Risk | Mitigation |
|------|------------|
| Product becomes unavailable after wishlist addition | Block cart transfer; show clear availability status |
| Wishlist grows too large affecting performance | Set reasonable limits; implement pagination if needed |
| Users expect sharing features (out of scope) | Clear documentation; consider for future release |

## Timeline

**Layer:** Core (Week 3-4)
**Sequential Execution:** Wishlist Management → Wishlist to Cart Transfer

---

**Status:** Ready for Implementation  
**Last Updated:** 2025-12-30
