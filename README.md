# IDBI Bank Merchant Portal

A secure, enterprise-grade unified dashboard for IDBI Bank merchants to manage UPI transactions, generate QR codes, synchronize device settings, and manage support tickets.

## 🚀 Technical Stack

- **Core**: React 18 (Vite-based)
- **State Management**: Redux Toolkit (Slices: `auth`, `menu`, `language`)
- **UI Architecture**: Material UI (MUI) & Vanilla CSS (BEM naming convention)
- **Icons & Animations**: Lucide-React, React-Icons, Framer Motion
- **Form Management**: Formik & Yup (Strict Validation)
- **Security**: Crypto-JS (AES-256 encryption/decryption for API payloads)
- **Date Handling**: Day.js

---

## 🏗️ Architecture & Directory Structure

The project follows a **Feature-Based Industry Standard** folder structure, ensuring high modularity and scalability.

```text
src/
├── api/          # Centralized API service layer (user, qr, reports, language)
├── assets/       # Static assets (logos, illustrations)
├── components/   # Shared UI components and shared dashboard feature widgets
│   ├── common/   # Reusable atomic UI elements
│   └── Dashboard/# Shared dashboard-specific components (KPICard, Profile, Dialogs)
├── layout/       # Application layout shells (MainLayout, Sidebar, Header)
├── pages/        # Route-level feature modules (Auth, Dashboard Home, TransactionReport)
├── store/        # Redux store configuration and feature slices
├── styles/       # Optimized CSS modules and global design system
├── utils/        # Generic utilities (crypto, storage, string-manipulation)
└── App.jsx       # Central routing and application configuration
```

---

## 🛠️ Core Functionalities

### 🔐 1. Authentication & Enterprise Security
- **PKCE OIDC Flow**: Implements a secure OAuth2 proof key for code exchange (PKCE) login via Authentik.
- **Payload Encryption**: All sensitive API requests are encrypted using **AES-256** before transmission to ensure end-to-end data integrity.
- **Session Management**: Secure token persistence and auto-redirection logic.

### 📊 2. Merchant Dashboard (Home)
- **KPI Overview**: Dynamic visual tracking of **Total Transaction Count** and **Total Transaction Volume**.
- **VPA Contextualization**: Allows merchants to toggle between multiple VPAs (Virtual Payment Addresses) with instant board data synchronization.

### 🧾 3. Transaction Intelligence & reporting
- **Advanced Filtering**: Support for pre-defined (Today, Last 30 Days) and custom date range queries.
- **Data Export**: Specialized integration with `export-from-json` for high-performance CSV downloads of transaction reports.
- **Performance Optimized Tables**: Custom pagination and search indexing for handling large transaction datasets.

### ⏹️ 4. QR Details Management
- **Static QR**: Instant retrieval of the merchant's official UPI QR code.
- **Dynamic QR**: Real-time generation of amount-specific QR codes with a **TTL (Time-To-Live)** countdown (90 seconds) for secure collections.
- **Branding Isolation**: Implements an intelligent **CSS Cropping Logic** to extract the core QR square for dashboard previews while preserving official IDBI branding for full downloads.

### 🌐 5. Remote Language Synchronization
- **Device Sync**: Remote update of IDBI soundbox/device language settings.
- **Atomic Updates**: Single-click update flow for 10+ regional languages (Hindi, Odia, Marathi, Tamil, etc.).
- **Feedback Loop**: Real-time validation of update status with success/failure modal systems.

### 💬 6. Help & Support (Ticketing System)
- **Issue Lifecycle**: Comprehensive ticket management (Raised -> Pending -> Resolved).
- **Incident Detail View**: Granular tracking of ticket logs, including timestamps and original Transaction IDs.
- **Response Modal**: Integrated UI for closing resolved tickets and marking resolution status.

---

## 🏁 Getting Started

### Installation
```bash
npm install
```

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

---

*This project is built and maintained following the security and coding guidelines of IDBI Bank Digital Banking standards.*
