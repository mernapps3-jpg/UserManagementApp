# Backend Project Complete Flow & Testing Guide

## Table of Contents
1. [Project Architecture Overview](#project-architecture-overview)
2. [File Structure & Logic Flow](#file-structure--logic-flow)
3. [Complete API Endpoints](#complete-api-endpoints)
4. [Postman Testing Guide](#postman-testing-guide)
5. [Error Scenarios & Success Responses](#error-scenarios--success-responses)

## Project Architecture Overview

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **AI Integration**: Google Gemini AI / OpenAI ChatGPT


### Architecture Pattern
- **MVC-like Pattern**: Controllers → Services → Models
- **Middleware Chain**: Request → Validation → Authentication → Authorization → Controller → Service → Response
- **Error Handling**: Centralized error handler middleware


### HTTP Status Codes

| Status Code | Meaning | When Used |
|------------|---------|-----------|
| 200 | OK | Successful GET, PATCH, DELETE requests |
| 201 | Created | Successful POST (register) |
| 400 | Bad Request | Validation errors, business logic errors |
| 401 | Unauthorized | Missing/invalid token, wrong credentials |
| 403 | Forbidden | Insufficient role permissions |
| 404 | Not Found | Resource not found (user, route) |
| 500 | Internal Server Error | Server-side errors |



#### Test 1: Health Check