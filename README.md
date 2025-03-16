# Secure Multi-Currency Investment Module

This project "Task" simulates a real-world financial workflow emphasizing **security**, **precision**, and **integration**. It allows authenticated users to invest money in various currencies (EUR, USD, GBP), calculates ROI, and integrates with a mock payment gateway that handles payment states with retry logic.

---

## Table of Contents

- [Features](#features)  
- [Technology Stack](#technology-stack)  
- [Setup Instructions](#setup-instructions)  
  - [1. Clone & Install](#1-clone--install)  
  - [2. Environment Variables](#2-environment-variables)  
  - [3. Run the Application](#3-run-the-application)  
  - [4. Run Tests](#4-run-tests)  
- [Project Structure](#project-structure)  
- [Endpoints Overview](#endpoints-overview)  
- [Design Choices](#design-choices)  
- [Assumptions](#assumptions)  

---

## Features

1. **Multi-Currency Support**: Converts EUR/GBP to USD using hardcoded exchange rates.  
2. **Secure Authentication**: Uses JWT-based authentication on protected endpoints (e.g., `/invest`, `/payments`).  
3. **Investment Workflow**:  
   - Validate inputs (currency, amount, date).  
   - Convert to USD.  
   - Calculate ROI.  
   - Create a payment record (pending status).  
4. **Payment Gateway Simulation**:  
   - `POST /payments` creates a pending payment.  
   - `GET /payments/:id` returns payment status (pending, completed, or failed).  
   - `POST /payments/:id/retry` implements exponential backoff for up to 3 retry attempts.  
5. **Input Validation & Logging**:  
   - Sanitizes user input to prevent injection.  
   - Uses Winston (or console) for basic logging.  
6. **DTOs**:  
   - `InvestmentRequestDTO` for validating and transforming investment inputs.  
   - `TransactionResponseDTO` for sending structured responses.

---

## Technology Stack

- **Node.js** + **Express** for server-side application.  
- **Jest** (or **Mocha**) for testing.  
- **Winston** (optional) for logging.  
- **jsonwebtoken** (JWT) for secure token-based auth.  
- **decimal.js** for precise numeric calculations.  

---

## Setup Instructions

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/TariqAyman/secure-investment-module-task.git
cd secure-investment-module-task

# Install dependencies
npm install
```

### 2. Environment Variables

Create a `.env` file (optional but recommended) at the root. Example:

```
JWT_SECRET=SUPER_SECRET_JWT_KEY
NODE_ENV=development
```

- `JWT_SECRET`: used to sign and verify JWT tokens.  
- `NODE_ENV`: environment mode (test, development, production), can affect things like logging or DB connections.  

### 3. Run the Application

```bash
npm start
```

By default, the server runs on **port 3000**. If you want to override it:

```bash
PORT=8080 npm start
```

### 4. Run Tests

To run **unit** and **integration** tests:

```bash
npm test
```

This runs Jest with coverage enabled (`--coverage`). You can see detailed coverage in the terminal after it completes.

---

## Project Structure

A simplified layout:

```
.
├── controllers/
│   ├── authController.js
│   ├── investmentController.js
│   └── paymentController.js
├── dtos/
│   ├── InvestmentRequestDTO.js
│   └── TransactionResponseDTO.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   └── userModel.js
├── services/
│   ├── PaymentService.js
│   └── TransactionService.js
├── utils/
│   ├── index.js
│   └── logger.js
├── tests/
│   ├── controllers/
│   ├── services/
│   └── ...
├── .env
├── package.json
└── server.js
```

---

## Endpoints Overview

1. **`POST /login`**  
   - Body: `{ username, password }`  
   - Returns a `{ token }` if valid credentials.  
2. **`POST /invest`** (protected by JWT)  
   - Body: `{ currency, amount, projectedValueDate }`  
   - Validates input; returns transaction data (including paymentId) in JSON.  
3. **`POST /payments`** (protected by JWT)  
   - Creates a new payment record (pending). Returns `{ paymentId, status }`.  
4. **`GET /payments/:id`** (protected by JWT)  
   - Returns the status of a payment.  
5. **`POST /payments/:id/retry`** (protected by JWT)  
   - Retries a payment up to 3 times with exponential backoff. Returns final status.  

---

## Design Choices

1. **DTO Architecture**  
   - We use **InvestmentRequestDTO** to parse & validate incoming investment data.  
   - We use **TransactionResponseDTO** to standardize what the controller sends back to the client.  

2. **Services Layer**  
   - **TransactionService** handles the financial logic (currency conversion, ROI calculation).  
   - **PaymentService** manages payment creation, status tracking, and retry logic.  

3. **Security**  
   - **JWT Authentication** ensures only authorized users can invest or create payments.  
   - Inputs are sanitized to reduce risk of injection.  
   - Sensitive data (e.g., user IDs) is hashed before logging or returning.  

4. **Precision**  
   - We use **decimal.js** to avoid floating-point issues when dealing with currency.  

5. **Logs & Testing**  
   - Winston or console-based logging for auditing and debugging.  
   - **Jest** tests cover ~90%+ of core logic, including integration tests for controllers.  

---

## Assumptions

1. **Limited Currencies**  
   - Only USD, EUR, and GBP are supported. Hardcoded exchange rates are used.  
2. **Mock Payment Gateway**  
   - Payment status transitions between `pending`, `completed`, or `failed`.  
   - In a real system, you’d integrate with an external API.  
3. **Mock User Database**  
   - A small in-memory array stores user credentials. This should be replaced with a real DB in production.  
4. **ROI Calculation**  
   - We assume a simplistic approach: `((currentValue - initialInvestment) / initialInvestment) * 100`.  
   - Actual financial products may require more detailed logic.  
5. **KYC / Verification**  
   - Some users may be flagged as unverified in the mock user model (`verified: false`) to demonstrate blocking at login.  
6. **Exponential Backoff**  
   - The default waits can exceed 5 seconds if all retries fail. In tests, you can reduce or mock the delay.  
7. **Error Handling**  
   - Validation errors return **400**.  
   - Server/internal errors return **500**.  

---

**Thank you** for checking out this Secure Multi-Currency Investment Module! Feel free to open an issue or submit a PR if you find improvements or want to expand functionality.