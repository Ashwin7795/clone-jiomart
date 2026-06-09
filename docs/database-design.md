# Database Design

## Users Collection

| Field     | Type     |
| --------- | -------- |
| _id       | ObjectId |
| name      | String   |
| email     | String   |
| password  | String   |
| role      | String   |
| createdAt | Date     |

## Products Collection

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

## Orders Collection

| Field       | Type     |
| ----------- | -------- |
| _id         | ObjectId |
| userId      | ObjectId |
| products    | Array    |
| totalAmount | Number   |
| status      | String   |
| createdAt   | Date     |

## Relationships

User → Orders (1:N)

Order → Products (N:N)
