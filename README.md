# Restful Booker API Automation Testing

API Automation Testing project using **Playwright** and **TypeScript** to validate REST API functionality on the Restful Booker demo application.

## Project Overview

This project focuses on testing API authentication and booking management functionality using Playwright APIRequestContext.

The test suite covers API requests, response status codes, response body validation, authentication handling, and booking operations.

**Base URL:** https://restful-booker.herokuapp.com

## Tech Stack

- **Language:** TypeScript
- **Test Framework:** Playwright Test
- **Runtime:** Node.js
- **API Testing:** Playwright APIRequestContext
- **Reporting:** Playwright HTML Report / Ortoni Report

## Project Structure

```text
Restful-Booker-API-Automation/
│
├── tests/
│   └── api_auth.spec.ts
│
├── page/
│   └── api_function.ts
│
├── package.json
├── package-lock.json
├── playwright.config.ts
├── tsconfig.json
└── .gitignore
```

## Test Coverage

| Module | Test Scenario |
|---|---|
| Authentication | Create authentication token |
| Booking | Retrieve all booking IDs |
| Booking | Retrieve a non-existent booking |
| Booking | Create a new booking |
| Booking | Create booking with invalid data |
| Booking | Update booking with valid token |
| Authentication | Update booking with invalid token |
| Booking | Delete an existing booking |
| Authentication | Delete booking with invalid credentials / ID |

*Note: Test scenarios are based on the current test implementation. Invalid ID and invalid authentication should be tested independently to isolate each condition.*

## Key Testing Techniques

- Validate HTTP response status codes.
- Verify API response body and data types.
- Validate authentication token handling.
- Test positive and negative scenarios.
- Use reusable helper functions for token and booking creation.
- Validate booking update and deletion operations.

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/harenoleon/Restful-Booker-API-Automation-.git
```

### 2. Navigate to the project

```bash
cd Restful-Booker-API-Automation-
```

### 3. Install dependencies

```bash
npm ci
```

### 4. Install Playwright browser

```bash
npx playwright install chromium
```

## Run Tests

Run the API authentication test suite:

```bash
npx playwright test tests/api_auth.spec.ts --project=chromium
```

Run tests in headed mode:

```bash
npx playwright test tests/api_auth.spec.ts --project=chromium --headed
```

## Test Reports

View the Playwright HTML report:

```bash
npx playwright show-report
```

## Learning Objectives

- Understand REST API testing concepts.
- Practice API authentication and authorization.
- Validate HTTP methods and response codes.
- Design positive and negative API test scenarios.
- Build reusable API helper functions.
- Develop practical API automation testing skills using Playwright and TypeScript.

## Project Status

**In Progress**

This project is part of my QA Automation learning journey, focusing on API testing, authentication, booking CRUD operations, and test automation practices.

## Author

GitHub: https://github.com/harenoleon
