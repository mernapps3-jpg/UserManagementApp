## Table of Contents
1. [Project Architecture Overview](#project-architecture-overview)
2. [File Structure & Logic Flow](#file-structure--logic-flow)
3. [Complete Component Breakdown](#complete-component-breakdown)
4. [User Flows & Interactions](#user-flows--interactions)
5. [API Integration & State Management](#api-integration--state-management)
6. [Routing & Navigation](#routing--navigation)
7. [Styling & UI Components](#styling--ui-components)

## Project Architecture Overview

### Technology Stack
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.2.0
- **Routing**: React Router DOM 6.22.3
- **HTTP Client**: Axios 1.6.8
- **Styling**: CSS Modules + Global CSS

### Architecture Pattern
- **Component-Based**: Reusable, isolated components
- **Context API**: Global state management (authentication)
- **Custom Hooks**: Reusable logic (useAuth)
- **Protected Routes**: Route guards for authentication/authorization
- **API Layer**: Centralized API configuration with interceptors

### Key Concepts for Students
1. **React Hooks**: useState, useEffect, useContext
2. **React Router**: Navigation, protected routes
3. **Context API**: Global state sharing
4. **Axios Interceptors**: Request/response handling
5. **CSS Modules**: Scoped styling
6. **Form Handling**: Controlled components
7. **Error Handling**: User-friendly error messages

## File Structure & Logic Flow

### Complete File Structure

```
frontend/
├── package.json              # Dependencies and scripts
├── vite.config.js            # Vite build configuration
├── env.example               # Environment variables template
├── index.html                # HTML entry point
└── src/
    ├── main.jsx              # React entry point
    ├── App.jsx               # Main app component (routing)
    ├── api.js                # Axios configuration
    ├── styles.css            # Global styles
    ├── context/
    │   └── AuthContext.jsx   # Authentication context provider
    ├── hooks/
    │   └── useAuth.js        # Custom hook for auth context
    ├── components/
    │   ├── NavBar.jsx        # Navigation bar
    │   ├── NavBar.module.css
    │   ├── ProtectedRoute.jsx # Route guard component
    │   ├── ConfirmModal.jsx  # Confirmation dialog
    │   └── ConfirmModal.module.css
    └── pages/
        ├── Login.jsx         # Login page
        ├── Register.jsx      # Registration page
        ├── Dashboard.jsx     # User dashboard
        ├── Admin.jsx         # Admin panel
        └── Admin.module.css
    └── styles/
        └── common.module.css # Shared styles
```