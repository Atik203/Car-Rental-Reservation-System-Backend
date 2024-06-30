# Car Rental Reservation System Backend

## Overview

This backend system is designed for managing a car rental business. It provides functionalities for user and admin roles, including car management, booking management, and ride cost calculation. The system ensures secure and controlled interactions through authentication and authorization.

**_Live Link:_** [Car Rental System](https://car-rental-system-nu.vercel.app)

## Features

### Admin Actions

**Car Management:**

- Create new car entries with details like name, color, features, etc.
- Update existing car information.
- Perform "soft deletes" to remove cars from active listings without deleting the record.
  **Booking Oversight:**

- View all ongoing and past bookings.
- Monitor rental activity and identify potential issues.

**Ride Cost Calculation:**

- Calculate the total cost for completed rentals using startTime, endTime, and pricePerHour.

### User Actions

**Book a Ride:**

- Select a car by entering carId and startTime to book a ride.
  **Rental History:**

- Access and review past rentals.

### Prerequisites

- Node.js
- Yarn
- MongoDB
- Mongoose
- TypeScript
- Zod
- Express.js

## Installation

1. Clone the repository:

```
git clone https://github.com/Atik203/Car-Rental-Reservation-System-Backend.git

```

2. Navigate into the project directory:

```
cd Car-Rental-Reservation-System-Backend

```

3. Install the dependencies:

```
yarn Install

```

4. Create a .env file in the root directory and add the following variables. Example:

```
PORT=5000
DATABASE_URL=mongodb database url
NODE_ENV=development
BASE_URL=http://localhost:5000/
BCRYPT_SALT=12
JWT_ACCESS_SECRET=lgkjasldfgthsdkhfgkjldashgkljhasdkfhkshdklrthewktrhnjgkalhdfk
JWT_REFRESH_SECRET=lahg;ahfdslkfh;lksdahfgklasdhgfkhasdkfkldhsakljfghsdahgkads
JWT_ACCESS_EXPIRATION=7d
JWT_REFRESH_EXPIRATION=90d

```

### Running the Application

1. Start the application in development mode:

```
yarn start:dev

```

2. Or, to start the application in production mode:

```
yarn start:prod

```

### Building the Application

1. To build the application:

```
yarn build
```

### Linting and Formatting

1. To lint the code:

```
yarn lint

```

2. To automatically fix linting errors:

```
yarn lint:fix

```

3. To format the code with Prettier:

```
yarn prettier

```

4. To automatically fix formatting errors with Prettier:

```
yarn prettier:fix

```

### API Endpoints

#### 1\. Sign Up

**_Route:_**`/api/auth/signup` (**POST**)

#### 2\. Sign In

**_Route:_** `/api/auth/signin`(**POST**)

#### 3\. Create a Car (Only accessible to the Admin)

**_Route:_** `/api/cars`(**POST**)

#### 4\. Get All Cars

**_Route:_** `/api/cars`(**GET**)

#### 5\. Get A Car

**_Route:_** `/api/cars/:id`(**GET**)

#### **6\. Update A Car (Only Accessible to the Admin)**

**_Route:_** `/api/cars/:id`(**PUT**)

#### **7\. Delete A Car (Only Accessible to the Admin)**

**_Route:_** `/api/cars/:id`(**DELETE**) \[SOFT DELETE\]

#### **8\. Get All Bookings (Accessible to the Admin)**

**_Route:_** `/api/bookings`(**GET**)

**_Query Parameters:_**

- `carId`: ID of the car for which availability needs to be checked.
- `date`: The specific date for which availability needs to be checked (format: YYYY-MM-DD).

Example Request:

`/api/bookings?carId=608a6d8d03a1b40012abcdef&date=2024-06-15`

#### **9\. Book a Car (Only Accessible to the User)**

**_Route:_** `/api/bookings`(**POST**)

#### **10\. Get User's Bookings (Only Accessible To the User)**

**_Route:_** `/api/bookings/my-bookings`(**GET**)

#### **11\. Return The Car (Only Accessible To Admin)**

**_Route:_** `/api/cars/return`(PUT)

### Middleware

- **Authentication:** Ensures that only authenticated users can access certain endpoints.
- **Authorization:** Differentiates actions that can be performed by users and admins.
- **ValidateRequest:** Validates incoming requests based on predefined schemas.

### Error Handling

The system uses a centralized error handling mechanism to catch and manage errors effectively. Custom errors provide meaningful messages and appropriate HTTP status codes.

### Contributing

Contributions are welcome! Please create a pull request or open an issue to discuss changes.

## License

This project is licensed under the MIT License.
