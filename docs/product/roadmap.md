# Feature Roadmap (Draft)

> **Source:** `docs/product/PRD.md`  
> **Status:** Draft — Pending Approval  
> **Date:** 2025-12-30

---

## Bounded Context: **User**

- **User Registration**
  - Description: Allow users to create accounts with email and password, including email verification.
  - Bounded Context: User
  - Depends on: None

- **User Login**
  - Description: Allow users to authenticate with email and password to access their account.
  - Bounded Context: User
  - Depends on: User Registration

- **User Account Deletion**
  - Description: Allow users to permanently delete their account and all associated data for GDPR/CCPA compliance.
  - Bounded Context: User
  - Depends on: User Login

- **User Profile Management**
  - Description: Allow users to view and update their profile information and email preferences.
  - Bounded Context: User
  - Depends on: User Login

- **Wishlist**
  - Description: Allow authenticated users to save products for later viewing and purchase.
  - Bounded Context: User
  - Depends on: User Login, Product Catalog

---

## Bounded Context: **Catalog**

- **Product Catalog**
  - Description: Display browsable product listings with descriptions, images, ethical markers, and availability status.
  - Bounded Context: Catalog
  - Depends on: None

- **Category Navigation**
  - Description: Allow users to filter products by category (skin care, hair care, cosmetics).
  - Bounded Context: Catalog
  - Depends on: Product Catalog

- **Product Search**
  - Description: Allow users to search for products by name, category, or ingredients using Algolia.
  - Bounded Context: Catalog
  - Depends on: Product Catalog

- **Product Detail View**
  - Description: Display comprehensive product information including ingredients, usage tips, and ethical certifications.
  - Bounded Context: Catalog
  - Depends on: Product Catalog

- **Product Availability Management**
  - Description: Allow admins to toggle product availability status (In Stock / Out of Stock).
  - Bounded Context: Catalog
  - Depends on: Product Catalog

---

## Bounded Context: **Cart**

- **Anonymous Cart**
  - Description: Allow anonymous users to add products to a cart with 7-day localStorage persistence.
  - Bounded Context: Cart
  - Depends on: Product Catalog

- **Authenticated Cart**
  - Description: Allow authenticated users to manage cart with Firestore persistence.
  - Bounded Context: Cart
  - Depends on: User Login, Product Catalog

- **Cart Merge on Login**
  - Description: Automatically merge anonymous cart with authenticated user's cart upon login with duplicate detection.
  - Bounded Context: Cart
  - Depends on: Anonymous Cart, Authenticated Cart

- **Cart Management**
  - Description: Allow users to add, update quantity, and remove products from cart.
  - Bounded Context: Cart
  - Depends on: Anonymous Cart OR Authenticated Cart

---

## Bounded Context: **Order**

- **Checkout Flow**
  - Description: Allow users to enter shipping address and select shipping option before payment.
  - Bounded Context: Order
  - Depends on: Cart Management, Shipping Options

- **Shipping Options**
  - Description: Display available shipping carriers with delivery estimates and costs via Shiprocket API.
  - Bounded Context: Order
  - Depends on: Product Catalog

- **Order Creation**
  - Description: Create an order from cart with shipping address and selected shipping option.
  - Bounded Context: Order
  - Depends on: Checkout Flow, Payment Processing

- **Order Confirmation**
  - Description: Send email confirmation when order is successfully created and payment is confirmed.
  - Bounded Context: Order
  - Depends on: Order Creation

- **Order History**
  - Description: Allow authenticated users to view past orders with status and details.
  - Bounded Context: Order
  - Depends on: User Login, Order Creation

- **Order Cancellation**
  - Description: Allow users to cancel orders before shipment is created.
  - Bounded Context: Order
  - Depends on: Order Creation

- **Order Status Tracking**
  - Description: Display current order status (Created, Paid, Cancelled, Shipped, Delivered).
  - Bounded Context: Order
  - Depends on: Order Creation

---

## Bounded Context: **Payment**

- **Payment Processing**
  - Description: Process payments via Cashfree gateway with single automatic retry on failure.
  - Bounded Context: Payment
  - Depends on: Checkout Flow

- **Payment Status Webhooks**
  - Description: Receive and process payment status updates from Cashfree to update order status.
  - Bounded Context: Payment
  - Depends on: Payment Processing, Order Creation

- **Payment Failure Handling**
  - Description: Display graceful error messages and allow manual retry when payment fails.
  - Bounded Context: Payment
  - Depends on: Payment Processing

---

## Bounded Context: **Shipping**

- **Shipment Creation**
  - Description: Create shipment via Shiprocket when order is confirmed and paid.
  - Bounded Context: Shipping
  - Depends on: Order Creation, Payment Processing

- **Shipment Tracking**
  - Description: Provide tracking link and status updates for active shipments.
  - Bounded Context: Shipping
  - Depends on: Shipment Creation

- **Shipment Status Webhooks**
  - Description: Receive shipment status updates from Shiprocket and notify users.
  - Bounded Context: Shipping
  - Depends on: Shipment Creation

---

## Cross-Cutting Concerns

- **Feature Flags**
  - Description: Implement Firebase Remote Config for progressive feature rollout with manual rollback.
  - Bounded Context: Infrastructure
  - Depends on: None

- **Observability**
  - Description: Implement OpenTelemetry tracing, GA4 analytics, and error tracking.
  - Bounded Context: Infrastructure
  - Depends on: None

- **PWA Installation**
  - Description: Prompt users to install PWA to home screen after add-to-cart engagement signal.
  - Bounded Context: Frontend
  - Depends on: Cart Management

---

## Total Feature Count

- **User Context:** 5 features
- **Catalog Context:** 5 features
- **Cart Context:** 4 features
- **Order Context:** 7 features
- **Payment Context:** 3 features
- **Shipping Context:** 3 features
- **Cross-Cutting:** 3 features

**Total: 30 features**

---

## Dependency Summary

### Foundation Layer (No Dependencies)

- User Registration
- Product Catalog
- Feature Flags
- Observability

### Core Layer (Depends on Foundation)

- User Login → User Registration
- Anonymous Cart → Product Catalog
- Authenticated Cart → User Login, Product Catalog
- Category Navigation → Product Catalog
- Product Search → Product Catalog
- Product Detail View → Product Catalog
- Product Availability Management → Product Catalog
- Shipping Options → Product Catalog

### Integration Layer (Depends on Core)

- Cart Merge on Login → Anonymous Cart, Authenticated Cart
- Cart Management → Anonymous Cart OR Authenticated Cart
- User Profile Management → User Login
- User Account Deletion → User Login
- Wishlist → User Login, Product Catalog
- Checkout Flow → Cart Management, Shipping Options
- Payment Processing → Checkout Flow
- PWA Installation → Cart Management

### Transaction Layer (Depends on Integration)

- Order Creation → Checkout Flow, Payment Processing
- Payment Status Webhooks → Payment Processing, Order Creation
- Payment Failure Handling → Payment Processing
- Shipment Creation → Order Creation, Payment Processing

### Service Layer (Depends on Transaction)

- Order Confirmation → Order Creation
- Order History → User Login, Order Creation
- Order Cancellation → Order Creation
- Order Status Tracking → Order Creation
- Shipment Tracking → Shipment Creation
- Shipment Status Webhooks → Shipment Creation

---

## Notes

1. **Cart Management** depends on "Anonymous Cart OR Authenticated Cart" — This means the feature can work with either cart type, allowing phased implementation.

2. **Checkout Flow** requires both Cart Management and Shipping Options, as users must select shipping before payment.

3. **Order Creation** depends on both Checkout Flow and Payment Processing — Order is only created after successful payment confirmation.

4. **Bounded Context Isolation** — Features are organized by bounded context to maintain clear domain boundaries and support independent development.

5. **Foundation First** — Features with no dependencies (User Registration, Product Catalog, Feature Flags, Observability) should be prioritized as they unblock subsequent features.

6. **Critical Path** — The core e-commerce flow requires:
   - Product Catalog → Anonymous Cart → Cart Management → Checkout Flow → Payment Processing → Order Creation → Shipment Creation