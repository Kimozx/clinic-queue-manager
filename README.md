# Clinic Queue Manager

A modern, full-stack web application built to help small clinics manage patients, appointments, and queues efficiently. Features a beautiful React frontend with dark/light mode support and a robust Node.js/Express backend with SQLite database.

**Done by Karam Khanji**

## Features

- **Staff Authentication**: Secure login system for clinic staff
- **Patient Management**: Add, edit, search, and manage patient records
- **Appointment Scheduling**: Create and manage appointments with real-time status updates
- **Live Queue Management**: Live operations board with auto-refresh capability
- **Status Tracking**: Update patient status (Waiting, In Treatment, Completed, Cancelled)
- **Daily Reports**: Comprehensive daily analytics and statistics
- **Light/Dark Mode**: Beautiful theme support for day and night usage
- **Print Reports**: Export daily reports in a printer-friendly format
- **Demo Data**: One-click seeding of realistic demo data for testing
- **Responsive Design**: Works seamlessly on desktop and tablet devices

## Tech Stack

### Frontend
- **React 19** - Modern UI library with functional components
- **Vite** - Ultra-fast bundler and dev server
- **React Router v7** - Client-side routing and navigation
- **CSS3** - Advanced styling with CSS variables for theming

### Backend
- **Node.js** - JavaScript runtime
- **Express 5** - Fast and lightweight web framework
- **sql.js** - SQLite database engine (WASM-based, no native compilation required)
- **CORS** - Cross-origin resource sharing support

### Deployment Ready
- Production builds optimized and gzipped
- Responsive and accessible UI components
- Print-optimized report layouts

## Project Structure

```
Clinic Queue Manager/
├── frontend/                 # React application
│   ├── src/
│   │   ├── pages/           # Page components (Dashboard, Patients, etc.)
│   │   ├── components/      # Reusable components (Layout, etc.)
│   │   ├── api.js           # API client for backend communication
│   │   ├── App.jsx          # Main app with routing and auth
│   │   ├── main.jsx         # React entry point
│   │   └── index.css        # Global styles with theme system
│   ├── package.json
│   └── vite.config.js
│
└── backend/                  # Node.js API server
    ├── controllers/         # Business logic (auth, patients, appointments, etc.)
    ├── routes/             # API endpoints
    ├── database/           # Database setup and persistence
    ├── server.js           # Express entry point
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js v20+
- npm v10+

### Installation

1. **Clone or extract the project**
   ```bash
   cd "path/to/Clinic Queue Manager"
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   npm install
   ```

### Running the Application

#### Option 1: Two Terminals (Recommended)

**Terminal 1 - Start Backend:**
```bash
cd backend
npm start
```
Backend will run on `http://localhost:4000`

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

#### Option 2: Single Terminal (Sequential)

```bash
cd backend
npm start &
cd ../frontend
npm run dev
```

### First Use

1. Open `http://localhost:5173` in your browser
2. Log in with:
   - **Username**: `staff`
   - **Password**: `password123`
3. On the Reports page, click "Seed Demo Data" to populate the system with sample data
4. Toggle "Dark Mode" in the top-right corner to see the theme system in action

## Key Pages and Features

### Dashboard
- Overview of today's appointments
- Status distribution charts
- Completion rate metrics
- Quick schedule snapshot

### Patients
- List all patients with search functionality
- Add new patient records
- Edit patient information
- Delete patient records and associated appointments
- Search by name or phone number

### Appointments
- Create new appointments
- View appointments by date
- Update appointment status
- Quick KPI summary

### Queue (Real-Time)
- Live queue board with auto-refresh (10-second interval)
- "Now Serving" spotlight for current patient
- Quick metrics: total, waiting, in-treatment counts
- One-click status updates

### Reports
- Daily statistics and analytics
- Visual breakdown of appointments by status
- Exportable PDF reports
- Seed demo data option

## API Endpoints

### Authentication
- `POST /api/auth/login` - Staff login

### Patients
- `GET /api/patients` - List all patients (with optional search)
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient
- `POST /api/patients/seed-demo` - Generate demo data

### Appointments
- `GET /api/appointments` - List appointments (with optional date filter)
- `GET /api/appointments/today` - Today's appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id/status` - Update appointment status

### Queue
- `GET /api/queue/today` - Today's queue (sorted by status priority)

### Reports
- `GET /api/reports/daily` - Daily statistics (with optional date filter)

## Database Schema

### users
- id, username, password, name

### patients
- id, name, phone, dob, notes, created_at

### appointments
- id, patient_id, appointment_date, appointment_time, reason, status, created_at, updated_at

## Customization

### Changing Branding
Edit the app name and description in:
- `frontend/src/components/Layout.jsx` - Main header
- `frontend/src/pages/LoginPage.jsx` - Login screen

### Theme Colors
All colors are defined as CSS variables in `frontend/src/index.css`:
- Light mode: `:root { --brand: ..., --danger: ..., etc }`
- Dark mode: `:root[data-theme='dark'] { --brand: ..., --danger: ..., etc }`

### Login Credentials
To change the default staff account, edit the database seed in:
- `backend/database/db.js` - Initial user creation
- Or `backend/controllers/patientsController.js` - Demo data seeding

## Building for Production

### Frontend
```bash
cd frontend
npm run build
```
Output will be in `frontend/dist/` - ready to deploy to static hosting.

### Backend
No build step required. Run:
```bash
cd backend
npm start
```

## Features Highlight

- ✅ Real-time queue management with auto-refresh
- ✅ Responsive dark/light theme toggle
- ✅ Print-ready report exports
- ✅ One-click demo data seeding
- ✅ Beautiful animations and transitions
- ✅ Professional watermark credit
- ✅ Search and filter capabilities
- ✅ Status-aware visual indicators
- ✅ Date-based appointment filtering
- ✅ Persistent authentication (localStorage)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (responsive design)

## Performance

- Frontend production bundle: ~78 KB gzipped
- Lightweight CSS: 2.67 KB gzipped
- Fast React rendering with optimized re-renders
- SQL.js in-memory database for instant queries

## Testing Demo Workflow

1. Login with `staff` / `password123`
2. Go to Reports → Click "Seed Demo Data"
3. Visit Dashboard to see metrics populated
4. Go to Queue → Enable "Auto Refresh" to see live updates
5. Click on Patients to see sample patient records
6. Visit Appointments to see scheduled appointments
7. Toggle "Dark Mode" to see theme switching
8. Go to Reports → Click "Print Report" to export

## Known Limitations

- SQLite database is in-memory (data persists during session but resets on server restart)
- Single user authentication (no multi-user roles)
- No backup/restore functionality
- Phone numbers are stored as text (no international format validation)

## Future Enhancements

- Multi-user support with role-based access
- Persistent database (SQLite file-based or PostgreSQL)
- SMS/Email notifications
- Appointment reminders
- Patient medical history
- Financial/billing module
- Advanced analytics and reporting
- Mobile app version

## License

MIT - Open source for educational and commercial use

## Support

For issues or questions, review the code comments and architecture:
- Frontend routing: `frontend/src/App.jsx`
- Backend API setup: `backend/server.js`
- Database schema: `backend/database/db.js`

---

**Built with React + Node.js + SQLite by Karam Khanji**

Made for clinic operations that need simplicity, speed, and beauty.
