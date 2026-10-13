# Proposed MySQL data model and application flows

Status: implementation specification, not deployed tables. The shared Docker server creates an empty `lerviz` database. Prisma migrations will create the application tables during the Node.js migration.

## Core ERD

One vehicle record represents one physical rentable car. A booking reserves that physical car. A quote does not reserve inventory. A booking hold does.

```mermaid
erDiagram
    USERS ||--o{ AUTH_IDENTITIES : authenticates_with
    USERS ||--o{ SESSIONS : has
    USERS ||--o{ USER_ROLES : assigned
    ROLES ||--o{ USER_ROLES : contains
    USERS ||--o{ DRIVER_PROFILES : owns
    USERS ||--o{ QUOTES : requests
    USERS ||--o{ BOOKINGS : makes
    CATEGORIES ||--o{ VEHICLES : classifies
    BRANCHES ||--o{ VEHICLES : based_at
    VEHICLES ||--o{ VEHICLE_IMAGES : shows
    VEHICLES ||--o{ VEHICLE_BLOCKS : unavailable_during
    VEHICLES ||--o{ RATE_RULES : priced_by
    VEHICLES ||--o{ QUOTES : quoted_for
    VEHICLES ||--o{ BOOKINGS : reserved_by
    BRANCHES ||--o{ BOOKINGS : pickup_branch
    BRANCHES ||--o{ BOOKINGS : return_branch
    QUOTES ||--o| BOOKINGS : converted_to
    BOOKINGS ||--|{ BOOKING_ITEMS : includes
    ADDONS o|--o{ BOOKING_ITEMS : optionally_sources
    BOOKINGS ||--o{ PAYMENTS : charged_by
    PAYMENTS ||--o{ REFUNDS : refunded_by
    BOOKINGS ||--o{ BOOKING_EVENTS : tracks
    BOOKINGS ||--o{ INSPECTIONS : checked_at
    BOOKINGS ||--o{ BOOKING_DRIVERS : permits
    DRIVER_PROFILES ||--o{ BOOKING_DRIVERS : included_as
    BOOKINGS ||--o| REVIEWS : reviewed_after
    PROMOTIONS o|--o{ BOOKINGS : discounted_by

    USERS {
        char36 id PK
        varchar254 email UK
        varchar255 password_hash "nullable for Google-only accounts"
        datetime email_verified_at "nullable"
        varchar20 status
        datetime created_at
    }
    AUTH_IDENTITIES {
        char36 id PK
        char36 user_id FK
        varchar32 provider
        varchar255 provider_subject "unique together with provider"
    }
    SESSIONS {
        char36 id PK
        char36 user_id FK
        char64 token_hash UK
        datetime expires_at
        datetime revoked_at
    }
    ROLES {
        smallint id PK
        varchar32 name UK
    }
    USER_ROLES {
        char36 user_id PK,FK
        smallint role_id PK,FK
    }
    DRIVER_PROFILES {
        char36 id PK
        char36 user_id FK
        varchar255 legal_name
        date date_of_birth
        varchar255 license_object_key "private storage reference"
        datetime license_expires_at
        varchar24 verification_status
    }
    BRANCHES {
        char36 id PK
        varchar120 name
        varchar64 timezone
        varchar255 address
        json opening_hours
    }
    CATEGORIES {
        char36 id PK
        varchar80 name UK
    }
    VEHICLES {
        char36 id PK
        char36 category_id FK
        char36 branch_id FK
        varchar160 slug UK
        varchar17 vin UK
        varchar32 registration_number UK
        varchar80 make
        varchar80 model
        smallint model_year
        smallint seats
        varchar20 transmission
        varchar20 fuel_type
        varchar24 status
        bigint base_daily_minor
        char3 currency
    }
    VEHICLE_IMAGES {
        char36 id PK
        char36 vehicle_id FK
        varchar255 object_key
        varchar255 alt_text
        int sort_order
    }
    VEHICLE_BLOCKS {
        char36 id PK
        char36 vehicle_id FK
        datetime starts_at
        datetime ends_at
        varchar32 reason
        varchar24 status
    }
    RATE_RULES {
        char36 id PK
        char36 vehicle_id FK
        datetime starts_at
        datetime ends_at
        bigint daily_minor
        int priority
    }
    QUOTES {
        char36 id PK
        char36 user_id FK "nullable before sign-in"
        char36 vehicle_id FK
        datetime pickup_at
        datetime return_at
        datetime expires_at
        bigint total_minor
        char3 currency
        json price_snapshot
        varchar40 policy_version
    }
    BOOKINGS {
        char36 id PK
        varchar24 reference UK
        char36 user_id FK
        char36 vehicle_id FK
        char36 quote_id FK,UK
        char36 pickup_branch_id FK
        char36 return_branch_id FK
        char36 promotion_id FK "nullable"
        datetime pickup_at
        datetime return_at
        datetime occupied_until "includes turnaround buffer"
        datetime hold_expires_at "nullable after confirmation"
        varchar32 status
        bigint total_minor
        bigint deposit_minor
        char3 currency
        json policy_snapshot
        int version
    }
    ADDONS {
        char36 id PK
        varchar100 name
        varchar20 charge_basis
        bigint unit_minor
        char3 currency
        boolean active
    }
    BOOKING_ITEMS {
        char36 id PK
        char36 booking_id FK
        char36 addon_id FK "nullable for rental, discount, tax"
        varchar24 type
        varchar255 description_snapshot
        decimal quantity
        bigint unit_minor
        bigint total_minor
    }
    PAYMENTS {
        char36 id PK
        char36 booking_id FK
        varchar32 purpose "rental or security_deposit"
        varchar32 provider
        varchar255 provider_payment_id UK
        varchar255 provider_checkout_id UK
        varchar64 idempotency_key UK
        varchar32 status
        bigint amount_minor
        char3 currency
    }
    REFUNDS {
        char36 id PK
        char36 payment_id FK
        varchar255 provider_refund_id UK
        varchar64 idempotency_key UK
        bigint amount_minor
        varchar32 status
        varchar255 reason
    }
    BOOKING_EVENTS {
        char36 id PK
        char36 booking_id FK
        char36 actor_user_id FK "nullable for system"
        varchar40 event_type
        datetime created_at
        json metadata
    }
    BOOKING_DRIVERS {
        char36 booking_id PK,FK
        char36 driver_profile_id PK,FK
        boolean is_primary
    }
    INSPECTIONS {
        char36 id PK
        char36 booking_id FK
        char36 staff_user_id FK
        varchar16 type "pickup or return"
        int odometer_km
        smallint fuel_percent
        json damage_report
        datetime signed_at
    }
    PROMOTIONS {
        char36 id PK
        varchar40 code UK
        varchar20 discount_type
        bigint discount_value
        int maximum_redemptions
        datetime starts_at
        datetime ends_at
    }
    REVIEWS {
        char36 id PK
        char36 booking_id FK,UK
        smallint rating
        text body
        varchar20 moderation_status
    }
```

Cardinality notes: quote conversion and review creation are optional and at most one per booking/quote. Refund and payment records are append-oriented attempts, not a single mutable `is_paid` flag. Nullable provider IDs allow recording the attempt before a remote request. Driver verification is needed before handover; collecting documents before checkout is a configurable business policy.

## Supporting tables and constraints

| Table | Key fields / rules |
| --- | --- |
| `webhook_events` | Provider + provider event ID unique; received/processed timestamps, status, retry count, minimal payload with retention policy |
| `outbox_events` | ID, aggregate ID, event type, payload, available_at, published_at, attempts; written in the same transaction as booking/payment updates |
| `idempotency_requests` | User ID + route + key unique, request hash, result reference, expiry; same key with different request returns conflict |
| `auth_tokens` | User FK, hashed token, purpose, expiry, used_at; one-time email verification/password reset |
| `audit_logs` | Actor, action, entity ID/type, redacted changes, request ID, timestamp; restricted access |
| `notifications` | User/booking optional FKs, channel, template, delivery status, provider message ID; deduplicate on event and recipient |
| `contact_requests` | Optional user FK, name, email, message, consent, status, assigned staff, created_at |
| `blog_posts` | Author FK, unique slug, title, sanitized content, publication state, timestamps |
| `favorites` | User ID + vehicle ID composite unique key; optional post-MVP |
| `inspection_media` | Inspection FK and private object storage key; no public document URLs |

Use InnoDB, `utf8mb4`, UTC `DATETIME(3)` timestamps, branch IANA timezone for display and local-day rules, and opaque UUID IDs. Use normalized/canonical email with a unique index and case-sensitive provider identifiers. Store monetary values in integer currency minor units, serialize large integers safely, and never use binary floating point for money. Establish maximum supported amounts. Tax percentages can use decimal values with explicit rounding per policy.

Indexes: booking `(vehicle_id, status, pickup_at, occupied_until)`, booking `(user_id, created_at)`, holds `(status, hold_expires_at)`, block `(vehicle_id, starts_at, ends_at)`, vehicle `(branch_id, category_id, status)`, events `(status, received_at)`. Inspect real query plans before adding more indexes. These indexes accelerate searches; they **do not enforce non-overlap**.

Checks: return > pickup, occupied_until >= return, amount >= 0 except explicitly signed discount items, rating 1–5, fuel 0–100, valid state values, refund totals no greater than captured amount. Enforce policy and cross-table invariants in a transaction. Keep booking/payment history; archive vehicles and users according to retention requirements instead of cascading away financial records.

## Preventing double bookings

Proposed invariant: all writers of vehicle occupancy (new holds, extensions, reassignment, cancellation, maintenance blocks and payment confirmation) acquire the **same physical vehicle row lock** before changing occupancy.

1. Start a short MySQL transaction. Lock the requested vehicle with parameterized `SELECT id FROM vehicles WHERE id = ? FOR UPDATE`.
2. Use locking/current reads for conflicting bookings and vehicle blocks. Do not rely on a stale consistent-read snapshot. Exclude expired holds by database time even if the expiry worker is delayed.
3. An overlap exists when `existing.pickup_at < requested.occupied_until AND existing.occupied_until > requested.pickup_at`. Intervals are half-open. Include cleaning/turnaround time.
4. Revalidate branch, operational status, dates, quote expiry, currency, rate/promotion eligibility and driver requirements; atomically reserve promotion capacity if capped.
5. Insert a `HELD` booking, immutable price items, an expiry timestamp (proposed 15 minutes) and an outbox event. Commit.
6. Contact Stripe **after committing**, using a stable payment-attempt idempotency key. Never hold a database lock during a network call.
7. If checkout creation fails, retry the same attempt safely or release the hold through the same lock discipline. A worker recovers interrupted attempts.

Lock multiple vehicles in sorted ID order for reassignment and apply bounded retry for deadlocks. Every staff tool must follow the same occupancy service. A Redis lock alone is insufficient as the booking correctness mechanism. MySQL supports transactional locking reads; the protocol above is this project's design choice. [MySQL locking-read documentation](https://dev.mysql.com/doc/refman/8.4/en/innodb-locking-reads.html).

## Booking and payment flow

```mermaid
sequenceDiagram
    actor Customer
    participant Web as React frontend
    participant API as Node.js API
    participant DB as MySQL
    participant Stripe
    participant Worker
    Customer->>Web: Select car, branch and dates
    Web->>API: Request server-calculated quote
    API->>DB: Read rates and availability
    API-->>Web: Expiring quote and itemized total
    Web->>API: Create hold with idempotency key
    API->>DB: Lock vehicle, recheck, insert HELD booking
    DB-->>API: Commit
    API->>Stripe: Create Checkout using payment-attempt key
    Stripe-->>API: Checkout URL
    API-->>Web: Redirect URL
    Customer->>Stripe: Pay
    Stripe->>API: Signed webhook
    API->>DB: Persist event with unique provider event ID
    API-->>Stripe: Acknowledge durable receipt
    Worker->>DB: Claim pending event
    Worker->>DB: Lock vehicle and booking, validate payment
    alt Live hold and valid successful payment
        Worker->>DB: Confirm booking and write notification outbox
        Worker-->>Customer: Send confirmation
    else Hold expired or inventory no longer available
        Worker->>DB: Record paid exception and refund request
        Worker->>Stripe: Idempotent refund
    end
    Web->>API: Read authoritative booking status
    API-->>Web: Confirmed, pending, or exception status
```

The success redirect alone never confirms payment. Validate event signature against the raw body, expected amount/currency, booking metadata, provider account and mode. Deduplicate events and tolerate out-of-order delivery. A success event after local hold expiry must not silently displace a later booking. Default policy is refund and notify; manual exception resolution is audited. Only enable immediate payment methods initially; delayed methods need a longer reservation policy. Stripe specifies signature verification and duplicate/out-of-order event handling in its [webhook guide](https://docs.stripe.com/webhooks), and request deduplication in its [idempotency guide](https://docs.stripe.com/api/idempotent_requests).

```mermaid
stateDiagram-v2
    [*] --> HELD
    HELD --> CONFIRMED: verified successful payment while hold valid
    HELD --> EXPIRED: hold deadline
    HELD --> CANCELLED: customer abandons or staff cancels
    CONFIRMED --> ACTIVE: verified pickup and inspection
    CONFIRMED --> CANCELLED: cancellation policy applied
    CONFIRMED --> NO_SHOW: pickup window elapsed and staff action
    ACTIVE --> COMPLETED: return inspection and final settlement
    EXPIRED --> [*]
    CANCELLED --> [*]
    NO_SHOW --> [*]
    COMPLETED --> [*]
```

Payment states are separate: `CREATED`, `PENDING`, `AUTHORIZED`, `SUCCEEDED`, `FAILED`, `PARTIALLY_REFUNDED`, `REFUNDED`. Refund attempts have their own pending/succeeded/failed state. Rental charges and security deposits are separate purposes; do not assume a card authorization can stay open until a distant pickup date. Finalize the deposit provider workflow before release.

## Google sign-in flow

```mermaid
sequenceDiagram
    actor Customer
    participant API as Node.js API
    participant Google
    participant DB as MySQL
    Customer->>API: Start Google sign-in
    API-->>Customer: Redirect with state and nonce
    Customer->>Google: Authenticate and consent
    Google-->>API: Callback with code and state
    API->>Google: Server-side code exchange
    Google-->>API: ID token
    API->>API: Validate signature, issuer, audience, expiry, nonce and state
    API->>DB: Find identity by provider and subject
    API->>DB: Create or safely link account and store session hash
    API-->>Customer: Secure HttpOnly session cookie
```

Use Google's provider subject as identity, never an unverified browser email. Existing accounts require explicit authenticated linking rather than automatic merging by email alone. Do not request Google Drive or other unnecessary scopes. Client secret stays on the backend. This flow follows [Google's OpenID Connect server-flow guidance](https://developers.google.com/identity/openid-connect/openid-connect).
