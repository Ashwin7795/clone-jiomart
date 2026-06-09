# Database Design

## 1. Users Collection

| Field     | Type     |
| --------- | -------- |
| _id       | ObjectId |
| name      | String   |
| email     | String   |
| password  | String   |
| role      | String   |
| createdAt | Date     |

### Purpose

Stores user account information and authentication details.

---

## 2. Products Collection

| Field       | Type          |
| ----------- | ------------- |
| _id         | ObjectId      |
| title       | String        |
| description | String        |
| price       | Number        |
| stock       | Number        |
| category    | String        |
| images      | Array<String> |
| createdAt   | Date          |

### Purpose

Stores all product information displayed in the application.

---

## 3. Cart Collection

| Field     | Type     |
| --------- | -------- |
| _id       | ObjectId |
| userId    | ObjectId |
| items     | Array    |
| updatedAt | Date     |

### Cart Item Structure

| Field     | Type     |
| --------- | -------- |
| productId | ObjectId |
| quantity  | Number   |

### Purpose

Stores products added to cart before checkout.

---

## 4. Orders Collection

| Field       | Type     |
| ----------- | -------- |
| _id         | ObjectId |
| userId      | ObjectId |
| products    | Array    |
| totalAmount | Number   |
| status      | String   |
| createdAt   | Date     |

### Order Product Structure

| Field     | Type     |
| --------- | -------- |
| productId | ObjectId |
| quantity  | Number   |
| price     | Number   |

### Purpose

Stores completed purchases and order history.

---

# Relationships

## User and Cart

One User has one active Cart.

Relationship:

User (1) ↔ (1) Cart

---

## User and Orders

One User can place multiple Orders.

Relationship:

User (1) → (N) Orders

---

## Cart and Products

One Cart can contain multiple Products.

One Product can exist in multiple Carts.

Relationship:

Cart (N) ↔ (N) Products

---

## Orders and Products

One Order can contain multiple Products.

One Product can appear in multiple Orders.

Relationship:

Orders (N) ↔ (N) Products
