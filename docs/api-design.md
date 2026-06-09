# API Documentation

## Authentication APIs

| Endpoint           | Method | Purpose                    |
| ------------------ | ------ | -------------------------- |
| /api/auth/register | POST   | Register user              |
| /api/auth/login    | POST   | Login user                 |
| /api/auth/profile  | GET    | Get logged-in user profile |

## Product APIs

| Endpoint          | Method | Purpose            |
| ----------------- | ------ | ------------------ |
| /api/products     | GET    | Get all products   |
| /api/products/:id | GET    | Get single product |
| /api/products     | POST   | Add product        |
| /api/products/:id | PUT    | Update product     |
| /api/products/:id | DELETE | Delete product     |

## Order APIs

| Endpoint        | Method | Purpose             |
| --------------- | ------ | ------------------- |
| /api/orders     | POST   | Create order        |
| /api/orders     | GET    | Get user orders     |
| /api/orders/:id | GET    | Get order details   |
| /api/orders/:id | PUT    | Update order status |
