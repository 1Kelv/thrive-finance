# Thrive Finance 🌱

Personal finance management with enterprise-grade security features.

![Thrive Finance](https://img.shields.io/badge/status-live-success)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)

**Live App:** [https://getmythrive.io](https://getmythrive.io)

---

## 🎯 Overview

Thrive is a personal finance application that brings fintech-grade security to budget management. Built by a Fraud Operations Lead, it incorporates real-world fraud detection patterns typically found in banking applications.

### Key Features

- 🔐 **Two-Factor Authentication** - OTP-based email verification for secure access
- 🚨 **Fraud Detection** - Real-time transaction analysis with 0-100 risk scoring
- 💰 **Multi-Currency Support** - Manage finances across 9 currencies (GBP, USD, EUR, NGN, KES, ZAR, GHS, INR, CAD)
- 📊 **Smart Budget Tracking** - Visual progress monitoring with category-based budgets
- 📈 **Interactive Charts** - Pie charts for category breakdowns, line charts for spending trends
- 🔒 **Session Timeout** - Automatic logout after 10 minutes of inactivity
- 📥 **CSV Export** - Download all transaction data
- ⚙️ **Customisable Settings** - Manage profile, currency preferences, and security options

---

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety and improved developer experience
- **Vite** - Fast build tool and development server
- **Recharts** - Data visualization

### Backend
- **Supabase** - PostgreSQL database, authentication, and real-time subscriptions
- **Row-Level Security (RLS)** - Database-level security policies

### Deployment
- **Vercel** - Hosting and continuous deployment
- **Resend** - Transactional email service for OTP delivery

---

## 🚨 Fraud Detection Algorithm

The fraud detection system analyzes six distinct patterns observed in real fraud operations:

1. **Unusual Amounts** - Transactions 3x+ average spend (5x+ flagged as high severity)
2. **Round Number Patterns** - Suspicious round numbers (£100, £500, £1000)
3. **Duplicate Transactions** - Same amount, category, and date
4. **Rapid Succession** - 3+ transactions within 1 hour
5. **Category Mismatches** - Unusually large amounts in specific categories (e.g., £5000 in "Food")
6. **Weekend Anomalies** - Large transactions 2x+ average on weekends

Each transaction receives a risk score (0-100) with severity classification:
- **0-30**: Low Risk ✅
- **31-69**: Medium Risk ⚠️
- **70-100**: High Risk 🚨

Users can review detailed fraud analysis reports and mark transactions as safe or delete suspicious activity.

---

## 🏗️ Architecture

thrive/
├── src/
│   ├── assets/          # Logo components and static assets
│   ├── components/      # React components
│   │   ├── common/      # Shared components (Logo, ProtectedRoute)
│   │   ├── dashboard/   # Dashboard-specific components
│   │   └── transactions/# Transaction management components
│   ├── contexts/        # React Context (AuthContext)
│   ├── hooks/           # Custom React hooks (useSessionTimeout)
│   ├── lib/             # Third-party library configurations
│   ├── pages/           # Page components
│   ├── services/        # API service layer
│   ├── styles/          # Global styles
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions (fraud detection, charts, export)
├── public/              # Static assets
└── vercel.json          # Vercel configuration

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository

git clone https://github.com/yourusername/thrive-finance.git
cd thrive-finance


2. Install dependencies

npm install


3. Create a `.env` file in the root directory

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

4. Set up Supabase database

Run the following SQL in your Supabase SQL editor:

-- Create transactions table
CREATE TABLE transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  description TEXT NOT NULL,
  date DATE NOT NULL,
  is_fraud_flagged BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create budgets table
CREATE TABLE budgets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  period TEXT CHECK (period IN ('monthly', 'weekly')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create security settings table
CREATE TABLE user_security_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  two_factor_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create OTP codes table
CREATE TABLE otp_codes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_security_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies (see full SQL in documentation)

5. Start the development server

npm run dev

6. Open [http://localhost:5174](http://localhost:5174)

---

## 📦 Build for Production
npm run build

The build output will be in the `dist/` directory.

---

## 🔐 Security Features

### Authentication
- Email/password authentication via Supabase Auth
- Email verification required for new accounts
- Two-factor authentication with OTP via email
- Session timeout after 10 minutes of inactivity

### Database Security
- Row-Level Security (RLS) policies ensure users can only access their own data
- All API calls go through Supabase's secure endpoints
- No direct database access from the frontend

### Data Protection
- HTTPS encryption for all connections
- Secure password hashing (handled by Supabase)
- API keys stored in environment variables

---

## 🎨 Features in Detail

### Multi-Currency Support
Switch between 9 supported currencies:
- British Pound (GBP)
- US Dollar (USD)
- Euro (EUR)
- Nigerian Naira (NGN)
- Kenyan Shilling (KES)
- South African Rand (ZAR)
- Ghanaian Cedi (GHS)
- Indian Rupee (INR)
- Canadian Dollar (CAD)

### Budget Tracking
- Set category-specific budgets (Food, Transport, Shopping, etc.)
- Choose weekly or monthly budget periods
- Visual progress bars with color-coded status
- Automatic spending calculations
- Budget alerts when approaching or exceeding limits

### Data Visualisation
- Category pie charts for income and expenses
- Monthly spending trend line charts
- Real-time balance calculations
- Spending breakdown by category

---

## 🤝 Contributing

This is a personal project, but feedback and suggestions are welcome! Feel free to open an issue or reach out.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Kelvin Olasupo**
- Fraud Operations Lead at NALA
- Currently transitioning to Software Engineering
- LinkedIn: [https://www.linkedin.com/in/kelvino123/]
- Twitter: [@MyThriveFinance](https://twitter.com/MyThriveFinance)
- Portfolio: [kelvinolasupo.com](https://kelvinolasupo.com)

---

## 🙏 Acknowledgments

- Inspired by real-world fraud patterns encountered in fintech operations
- UI/UX inspiration from modern fintech applications

---

## 📞 Support

For questions or issues, please open an issue on GitHub.

---

**Built with ❤️ and ☕ in London, UK**