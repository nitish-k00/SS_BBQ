# Online Food Ordering and Delivery Platform

A comprehensive MERN stack application for seamless online food ordering and delivery. The platform integrates various features including authentication, shopping functionalities, order tracking, admin management, payment processing, and more.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Setting Up Environment Variables](#setting-up-environment-variables)
- [Usage](#usage)


## Features

- **Authentication:** JWT, Google Login, OTP verification.
- **Shopping:** Cart management, favorites, coupons, search filters, reviews.
- **Order Tracking:** Real-time updates with Google Maps integration.
- **Admin Dashboard:** Manage products, categories, coupons, orders.
- **Delivery Management:** Order acceptance, status updates, OTP verification.
- **Payment Integration:** Secure transactions with PayTeam.
- **Performance Optimization:** Redux for state management, Bootstrap for UI, Redis for caching.

## Demo

[Live Demo Application](https://ss-bbq-scooter.onrender.com/)

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

- Node.js
- MongoDB
- Redis (optional for caching)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/nitish-k00/SS_BBQ.git
   cd SS_BBQ
2. Install dependencies

   ```bash
   npm install
   
2. Setting Up Environment Variables
### Backend Environment Variables :

  ```bash
    MONGODB_URI=your_ MONGODB_URI
    PORT=5000
    ACCESS_TOKEN_SECRET=your_access_token_secret
    REFRESH_TOKEN_SECRET=your_refresh_token_secret
    SESSION_SECRET=your_session_secret
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    EMAIL=your_email@example.com
    EMAIL_PASSWORD=your_email_password
    PAYMENT_ID=your_payment_id
    PAYMENT_KEY=your_payment_key
    TWILIO_ACCOUNT_SID=your_twilio_account_sid
    TWILIO_AUTH_TOKEN=your_twilio_auth_token
    TWILIO_PHONE_NUMBER=your_twilio_phone_number
    REDIS_URL=your_redis_url
    FRONT_END_URL=http://localhost:3000
  ```

### Frontend Environment Variables

   ```bash
   REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
   REACT_APP_RAZORPAY_KEY=your_razorpay_key
   REACT_APP_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token
   REACT_APP_BACKEND_URL=your_backend_url
   ```

3. Usage

### Start the backend server:

   ```bash
   cd server
   npm start
   ```

### Start the frontend development server:

   ```bash
   cd client
   npm start
   ```


