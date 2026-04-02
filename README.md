# Planeat - Dual-Role MVP

Planeat is a mobile-first, dual-role SaaS application bringing food businesses and customers together. It specializes in reducing institutional demand forecasting errors and subsequent food waste by providing live insights, order matching, and intuitive financial modeling.

## Features

- **Dual-Role Capabilities**: Seamlessly transition between **Customer** interfaces (for finding dynamic discounts and tracking orders) and **Business Owner** interfaces (for managing orders, tweaking menus, and reviewing analytics).
- **Executive Demand Dashboard**: Owners have access to multi-day timeframe selections predicting food demand directly alongside financial estimations.
- **Instagram-style Chat**: Intuitive real-time mock communication between buyers and providers to arrange pickups and answer questions.
- **Blinkit-style Profile**: Location and delivery tracking metrics.
- **Glassmorphism Theme**: Fully customized responsive CSS utilizing layered gradients.

## Tech Stack

- **Frontend**: React (v19) + Vite
- **Routing**: React Router (v7)
- **Styling**: Vanilla CSS (Mobile-first, Dark Theme)
- **Backend / API**: Node.js & Express
- **Database**: SQLite3

## Getting Started

To run the application locally on your machine:

1. Copy repository and prepare dependencies:
   ```bash
   npm install
   ```

2. Start the Application:
   ```bash
   npm start
   ```

3. Open your browser and navigate to the frontend:
   **http://localhost:5173**

*(Note: The backend Express server runs concurrently on port 3001 using `nodemon` or standard node context. Local mock databases will re-seed immediately on start if missing.)*
