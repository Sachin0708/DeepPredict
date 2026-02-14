📊 DeepPredict – AI Forecasting Suite

DeepPredict is a multi-domain forecasting web application built with React + Vite that provides interactive prediction tools across multiple business domains.
### 🏠 Home Page


<p align="center">
  <img src="deeppredict/screenshots/home-page.png" width="85%" />
</p>


It includes forecasting modules for:

📈 Stock Market Prediction
🚚 Supply Chain Forecasting
🛒 E-commerce Analytics
🏠 Real Estate Valuation

 Features: 
    Multi-model architecture
    Dynamic routing using React Router
    Interactive UI with Bootstrap
    Chart-based forecasting visualization (Chart.js)
    CSV upload & multi-column analytics (Supply Chain model)
    Downloadable forecast results
    Clean, responsive dashboard layout

🏗️ Tech Stack

Frontend
React 18
Vite
React Router DOM
Bootstrap 5
Chart.js
Development Tools
VS Code
Chrome DevTools
Vite HMR

📂 Project Structure
deeppredict/
│
├── src/
│   ├── components/
│   │   └── Models.jsx
│   ├── models/
│   │   ├── StockModel.jsx
│   │   ├── SupplyChainModel.jsx
│   │   ├── EcomModel.jsx
│   │   └── RealEstateModel.jsx
│   ├── pages/
│   ├── routes.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── public/
├── package.json
└── README.md

⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/your-username/deeppredict.git
cd deeppredict

2️⃣ Install dependencies
npm install

3️⃣ Install required packages (if not installed)
npm install bootstrap chart.js react-router-dom

4️⃣ Start development server
npm run dev

Open:
http://localhost:5173

📈 Models Overview
📊 Stock Prediction

Simple price projection logic
Interactive user input
Instant forecast result

🚚 Supply Chain Forecast

CSV file upload
Auto-detect numeric columns
Moving average forecast
Multi-column insights
Downloadable forecast CSV

🛒 E-commerce Analytics

Conversion-based demand estimation
User-driven prediction inputs

🏠 Real Estate Valuation

Price estimation based on square footage
Quick property value projection

🧠 Forecast Logic

Current forecasting logic uses:
Moving Average based projections
Percentage trend analysis
Sentiment classification:
Increase Orders
Hold Orders
Reduce Orders


Prophet

Backend ML APIs
