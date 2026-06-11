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

* user
* vendor


### Purpose

Stores user account information and authentication details. The role field determines whether the account belongs to a user or vendor.

---

## 2. Products Collection

| Field       | Type          |
| ----------- | ------------- |
| _id         | ObjectId      |
| vendorId    | ObjectId      |
| title       | String        |
| description | String        |
| category    | String        |
| subcategory | String        |
| brand       | String        |
| price       | Number        |
| stock       | Number        |
| images      | Array<String> |
| rating      | Number        |
| createdAt   | Date          |


### Purpose

Stores all product information displayed in the application.

Each product belongs to a vendor and stores the vendorId of the user whose role is "vendor".
Products are grouped by Category and Subcategory to support catalog browsing, filtering, and search functionality.

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

# Product Categories & Subcategories

## Groceries

### Subcategories

* Namkeen & Chips
* Tea
* Coffee
* Biscuits
* Sauces & Spreads
* Breakfast Cereals
* Chocolates
* Drinks & Juices
* Dry Fruits
* Seeds
* Makhana
* Raisins
* Cashews
* Dates & Walnuts
* Mixed Dry Fruits

---

## Fashion

### Subcategories

* Kurtas & Kurtis
* T-Shirts
* Sarees
* Handbags
* Trousers & Pants
* Lingerie & Innerwear
* Footwear
* Jewellery

---

## Home & Lifestyle

### Subcategories

* Home Decor
* Kitchen
* Car & Bike Care
* Luggage
* Sports
* Furniture
* Toys
* Stationery

---

## Electronics

### Subcategories

* Smartphones
* Televisions
* Large Appliances
* Laptops
* Tablets
* Audio & Wearables
* Mobile Accessories
* Kitchen Appliances

---

## Beauty & Personal Care

### Subcategories

* Hair Care
* Skin Care
* Oral Care
* Fragrances
* Men's Grooming
* Makeup
* Personal Hygiene
* Health & Wellness


# Relationships

## Vendor User and Products

One Vendor User can sell multiple Products.

Products are organized using a Category → Subcategory → Product hierarchy.

Example:

Electronics
    ↓
Audio & Wearables
    ↓
Boat Airdopes 141



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
