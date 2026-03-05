# Thrive Finance 🌱

Personal finance management with enterprise-grade security features.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)

**Live App:** [https://getmythrive.io](https://getmythrive.io)

---

## 🎯 Overview

Thrive is a personal finance application that brings fintech-grade security to budget management. Built by a Fraud Operations Lead, it incorporates real-world fraud detection patterns typically found in banking applications.

---

## ✨ Key Features

- 🔐 **Two-Factor Authentication** - OTP-based email verification for secure access
- 🚨 **Fraud Detection** - Real-time transaction analysis with 0-100 risk scoring
- 💰 **Multi-Currency Support** - Manage finances across 9 currencies (GBP, USD, EUR, NGN, KES, ZAR, GHS, INR, CAD)
- 📊 **Smart Budget Tracking** - Visual progress monitoring with category-based budgets
- 📈 **Interactive Charts** - Pie charts for category breakdowns, line charts for spending trends
- 🔒 **Session Timeout** - Automatic logout after 10 minutes of inactivity
- 📥 **CSV Export** - Download all transaction data
- ⚙️ **Customizable Settings** - Manage profile, currency preferences, and security options

---

## 🚨 Fraud Detection

The fraud detection system analyzes six distinct patterns observed in real fraud operations:

1. **Unusual Amounts** - Transactions 3x+ average spend (5x+ flagged as high severity)
2. **Round Number Patterns** - Suspicious round numbers (£100, £500, £1000)
3. **Duplicate Transactions** - Same amount, category, and date
4. **Rapid Succession** - 3+ transactions within 1 hour
5. **Category Mismatches** - Unusually large amounts in specific categories
6. **Weekend Anomalies** - Large transactions 2x+ average on weekends

Each transaction receives a risk score (0-100) with severity classification:
- **0-30**: Low Risk ✅
- **31-69**: Medium Risk ⚠️
- **70-100**: High Risk 🚨

Users can review detailed fraud analysis reports and mark transactions as safe or delete suspicious activity.

---

## 🛠️ Built With

- **React** + **TypeScript** - Frontend framework with type safety
- **Vite** - Fast build tool and development server
- **Supabase** - PostgreSQL database and authentication
- **Recharts** - Data visualization
- **Vercel** - Hosting and deployment
- **Resend** - Email delivery for OTP

---

## 🔐 Security

- Email/password authentication with email verification
- - **Two-Factor Authentication** - OTP-based verification with 6-digit codes that expire in 5 minutes (email delivery planned for v2)
- Session timeout after 10 minutes of inactivity
- Row-Level Security (RLS) policies in database
- HTTPS encryption for all connections
- Secure password hashing

---

## 💡 Inspiration

As a Fraud Operations Lead at NALA, I work daily with fraud patterns, chargebacks, and risk management. I noticed personal finance apps rarely incorporate the fraud detection and security measures we rely on in fintech operations.

Working closely with engineers and product teams, I've built internal tools now used in business-as-usual processes. This experience, combined with mentorship from an engineering manager, sparked my transition into software engineering.

Thrive combines my fraud expertise with my growing technical skills to solve a real problem: bringing enterprise-level security to personal finance management.

---

## 🌱 Who It's For

Anyone who wants their personal finance management to be as secure as their banking apps. Whether you're:
- Tracking daily expenses
- Managing budgets across multiple currencies
- Want automatic fraud alerts for suspicious transactions
- Need a simple, secure way to manage your money

---

## 🚀 Try It

Visit [https://getmythrive.io](https://getmythrive.io) to start using Thrive Finance today!

---

## 👨‍💻 Author

**Kelvin Olasupo**  
Fraud Operations Lead at NALA | Aspiring Software Engineer

- Website: [kelvinolasupo.com](https://kelvinolasupo.com)
- Twitter: [@MyThriveFinance](https://twitter.com/MyThriveFinance)
- LinkedIn: [Kelvin Olasupo](https://www.linkedin.com/in/kelvinolasupo)

---

## 🙏 Acknowledgments

- Inspired by real-world fraud patterns encountered in fintech operations
- UI/UX inspiration from modern fintech applications

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ in London, UK**