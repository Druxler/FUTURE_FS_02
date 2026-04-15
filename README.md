# FUTURE_FS_02
# ⚡ LeadPulse CRM — South Africa

> A full-stack Client Lead Management System built specifically for South African businesses. Track leads, manage your sales pipeline, and convert prospects into clients — all from a sleek dark-themed dashboard.

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248?style=flat-square&logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
![Made for SA](https://img.shields.io/badge/🇿🇦-Made%20for%20South%20Africa-007A4D?style=flat-square)

---

## 📌 About the Project

LeadPulse CRM was built to solve a simple problem: South African businesses needed a fast, lightweight tool to manage the leads flowing in from their website contact forms, WhatsApp messages, walk-ins, and referrals — without paying for expensive international CRM software.

It runs entirely on your own machine or server, stores data in MongoDB, and is accessible from any browser. The interface is designed with a dark industrial theme using teal neon accents, making it comfortable for long work sessions.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 Secure Login | JWT-based authentication with bcrypt password hashing |
| 👥 Lead Management | Full CRUD — add, view, edit, and delete leads |
| 📊 Live Dashboard | Stats overview, leads by source, leads by province |
| 🔄 Pipeline Tracking | New → Contacted → Qualified → Proposal Sent → Converted / Lost |
| 📝 Notes System | Add timestamped follow-up notes to any lead |
| 🗺️ SA Provinces | Tag leads by all 9 South African provinces |
| 💰 ZAR Value Tracking | Track estimated deal values in South African Rand |
| 📱 WhatsApp Source | Tag leads as coming from WhatsApp (dominant in SA) |
| 🔍 Search & Filter | Filter by status, province, priority, and source simultaneously |
| 🛡️ Role-Based Access | Admin sees all leads; Agents see only their assigned leads |
| 👤 Agent Management | Admins can create and manage sales agents |
| 📄 Pagination | Handles large lead lists cleanly |

---

## 🛠️ Tech Stack

**Backend**
- [Node.js](https://nodejs.org/) — Runtime environment
- [Express.js](https://expressjs.com/) — Web framework and REST API
- [MongoDB](https://www.mongodb.com/) — NoSQL database
- [Mongoose](https://mongoosejs.com/) — MongoDB object modeling
- [JSON Web Tokens](https://jwt.io/) — Stateless authentication
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) — Password hashing

**Frontend**
- Vanilla HTML, CSS, and JavaScript — no framework required
- [Rajdhani](https://fonts.google.com/specimen/Rajdhani) + [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) — Typography
- Served directly by Express as static files

---

## 📁 Project Structure

```
leadpulse-crm/
├── server/
│   ├── index.js              # Express server entry point
│   ├── models/
│   │   ├── User.js           # User schema (admin / agent)
│   │   └── Lead.js           # Lead schema with SA-specific fields
│   ├── routes/
│   │   ├── auth.js           # Login, register agents, get current user
│   │   ├── leads.js          # CRUD operations + notes + status updates
│   │   └── dashboard.js      # Analytics and stats aggregation
│   ├── middleware/
│   │   └── auth.js           # JWT authentication + admin guard
│   └── utils/
│       └── seed.js           # Creates the first admin user on startup
├── client/
│   └── public/
│       └── index.html        # Complete single-file frontend
├── .env                      # Environment configuration (do not commit)
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) (v6 or higher)
- [MongoDB Shell (mongosh)](https://www.mongodb.com/try/download/shell)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/your-username/leadpulse-crm.git
cd leadpulse-crm
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

Open the `.env` file and update the values:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/leadpulse_crm
JWT_SECRET=your_strong_random_secret_here
ADMIN_EMAIL=admin@yourcompany.co.za
ADMIN_PASSWORD=YourSecurePassword@123
```

> ⚠️ Change `JWT_SECRET` and the admin credentials before deploying to production.

**4. Start MongoDB**

On Windows, open a terminal and run:
```bash
net start MongoDB
```

On macOS/Linux:
```bash
sudo systemctl start mongod
```

**5. Start the server**

```bash
node server/index.js
```

You should see:
```
✅ MongoDB Connected: mongodb://127.0.0.1:27017/leadpulse_crm
✅ Admin created: admin@yourcompany.co.za

🚀 LeadPulse CRM is running!
   Open in browser: http://localhost:5000
   Admin Email:     admin@yourcompany.co.za
   Admin Password:  YourSecurePassword@123
```

**6. Open in your browser**

```
http://localhost:5000
```

---

## 🔑 Default Login

| Field | Value |
|---|---|
| Email | `admin@yourcompany.co.za` |
| Password | `Admin@123` |

> Change these immediately in your `.env` file before sharing or deploying.

---

## 🌐 API Reference

All protected routes require the `Authorization: Bearer <token>` header.

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | None | Login and receive JWT token |
| `GET` | `/api/auth/me` | User | Get current logged-in user |
| `POST` | `/api/auth/create-agent` | Admin | Create a new agent account |
| `GET` | `/api/auth/agents` | Admin | List all agents |

### Leads
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/leads` | User | Get all leads (supports filters + pagination) |
| `GET` | `/api/leads/:id` | User | Get a single lead by ID |
| `POST` | `/api/leads` | User | Create a new lead |
| `PUT` | `/api/leads/:id` | User | Update a lead |
| `DELETE` | `/api/leads/:id` | Admin | Delete a lead |
| `POST` | `/api/leads/:id/notes` | User | Add a note to a lead |
| `PATCH` | `/api/leads/:id/status` | User | Update lead status only |

### Dashboard
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/dashboard/stats` | User | Get pipeline stats and analytics |

### Query Parameters for `GET /api/leads`

```
?status=New
?source=WhatsApp
?priority=High
?province=Gauteng
?search=John
?page=1&limit=15
```

---

## 👥 User Roles

| Role | Permissions |
|---|---|
| **Admin** | View all leads, create/delete leads, manage agents |
| **Agent** | View and manage only their assigned leads |

---

## 🇿🇦 South Africa Specific

This CRM was built with the South African market in mind:

- **All 9 provinces** are available as lead tags: Gauteng, Western Cape, KwaZulu-Natal, Eastern Cape, Limpopo, Mpumalanga, North West, Free State, and Northern Cape
- **Deal values are tracked in ZAR** (South African Rand) with proper `en-ZA` locale formatting
- **WhatsApp is a first-class lead source** alongside Website Form, Referral, Cold Call, Social Media, Email Campaign, and Walk-In
- **Phone numbers** use the `+27` South African format as a placeholder
- **Email domains** default to `.co.za`

---

## 🔧 Troubleshooting

**MongoDB connection refused**

If you see `ECONNREFUSED ::1:27017`, change your `.env` to use IPv4:
```env
MONGO_URI=mongodb://127.0.0.1:27017/leadpulse_crm
```

**MongoDB not starting on Windows**

Open the Run dialog (`Win + R`), type `services.msc`, find **MongoDB Server**, and click **Start**.

**Port already in use**

Change the port in `.env`:
```env
PORT=5001
```

**Forgot admin password**

Open MongoDB Shell and run:
```bash
mongosh
use leadpulse_crm
db.users.deleteOne({ email: "admin@yourcompany.co.za" })
```
Then restart the server — it will recreate the admin from your `.env` values.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🙌 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

---

<p align="center">
  Built with ❤️ for South African businesses · 🇿🇦
</p>
