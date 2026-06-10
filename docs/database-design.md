# Database Design

## 1. Users Collection

| Field     | Type            |
| --------- | --------------- |
| _id       | ObjectId        |
| name      | String          |
| email     | String (Unique) |
| password  | String          |
| role      | String          |
| createdAt | Date            |

### Role Values

* customer
* vendor
* admin

### Purpose

Stores user account information and authentication details. The role field determines whether the user is a customer, vendor, or administrator.

---

## 2. Products Collection

| Field       | Type          |
| ----------- | ------------- |
| _id         | ObjectId      |
| vendorId    | ObjectId      |
| title       | String        |
| description | String        |
| category    | String        |
| brand       | String        |
| price       | Number        |
| stock       | Number        |
| images      | Array<String> |
| rating      | Number        |
| createdAt   | Date          |
| updatedAt   | Date          |

### Purpose

Stores all product information displayed in the application.

Each product belongs to a vendor and stores the vendorId of the user whose role is "vendor".

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
| updatedAt   | Date     |

### Order Product Structure

| Field     | Type     |
| --------- | -------- |
| productId | ObjectId |
| quantity  | Number   |
| price     | Number   |

### Status Values

* Pending
* Confirmed
* Shipped
* Delivered
* Cancelled

### Purpose

Stores completed purchases and order history.

---

# Planned Product Categories

## Fruits & Vegetables

* Apple
* Banana
* Orange
* Tomato
* Potato
* Onion
* Carrot

## Dairy & Bakery

* Milk
* Butter
* Cheese
* Bread
* Paneer
* Curd
* Eggs

## Snacks & Beverages

* Coca Cola
* Pepsi
* Lays Chips
* Kurkure
* Biscuits
* Fruit Juice
* Energy Drink

## Grocery & Staples

* Rice
* Wheat Flour
* Sugar
* Salt
* Cooking Oil
* Dal
* Spices

## Personal Care

* Shampoo
* Soap
* Toothpaste
* Face Wash
* Body Lotion
* Deodorant
* Hair Oil

## Home & Kitchen

* Pressure Cooker
* Water Bottle
* Frying Pan
* Storage Container
* Kitchen Knife
* Cleaning Brush
* Mug Set

## Electronics

* Mobile Charger
* USB Cable
* Earphones
* Bluetooth Speaker
* Power Bank
* Smart Watch
* Extension Board

---

# Relationships

## Vendor User and Products

One Vendor User can sell multiple Products.

Relationship:

User(role = vendor) (1) → (N) Products

---

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
