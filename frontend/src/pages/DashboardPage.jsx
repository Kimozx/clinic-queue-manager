import { useEffect, useState } from 'react';
import { api } from '../api';

function percent(value, total) {
  if (!total) {
    return 0;
  }
  return Math.round((value / total) * 100);
}

function DashboardPage() {
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [report, setReport] = useState(null);

  const total = report?.totalAppointments || 0;
  const completed = report?.completedAppointments || 0;
  const cancelled = report?.cancelledAppointments || 0;
  const waiting = report?.waitingPatients || 0;

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);

    api.getTodayAppointments().then(setTodayAppointments).catch(console.error);
    api.getDailyReport(today).then(setReport).catch(console.error);
  }, []);

  return (
    <section>
      <div className="hero-strip card">
        <div>
          <h2>Dashboard</h2>
          <p className="muted">Keep the clinic moving with a quick view of today.</p>
        </div>
        <div className="hero-value">
          <span>Completion Rate</span>
          <strong>{percent(completed, total)}%</strong>
        </div>
      </div>

      <div className="metrics-grid">
        <article className="card metric">
          <h3>Today's Appointments</h3>
          <strong>{total}</strong>
        </article>
        <article className="card metric">
          <h3>Completed</h3>
          <strong>{completed}</strong>
        </article>
        <article className="card metric">
          <h3>Cancelled</h3>
          <strong>{cancelled}</strong>
        </article>
        <article className="card metric">
          <h3>Waiting</h3>
          <strong>{waiting}</strong>
        </article>
      </div>

      <div className="card distribution-card">
        <h3>Status Distribution</h3>
        <div className="distribution-row">
          <span>Completed</span>
          <div className="bar-track">
            <div className="bar-fill completed" style={{ width: `${percent(completed, total)}%` }} />
          </div>
          <strong>{percent(completed, total)}%</strong>
        </div>
        <div className="distribution-row">
          <span>Cancelled</span>
          <div className="bar-track">
            <div className="bar-fill cancelled" style={{ width: `${percent(cancelled, total)}%` }} />
          </div>
          <strong>{percent(cancelled, total)}%</strong>
        </div>
        <div className="distribution-row">
          <span>Waiting / In Treatment</span>
          <div className="bar-track">
            <div className="bar-fill waiting" style={{ width: `${percent(waiting, total)}%` }} />
          </div>
          <strong>{percent(waiting, total)}%</strong>
        </div>
      </div>

      <div className="card">
        <h3>Today Schedule Snapshot</h3>
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Patient</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {todayAppointments.map((item) => (
              <tr key={item.id}>
                <td>{item.appointment_time}</td>
                <td>{item.patient_name}</td>
                <td>{item.reason}</td>
                <td>{item.status}</td>
              </tr>
            ))}
            {todayAppointments.length === 0 ? (
              <tr>
                <td colSpan="4">No appointments for today.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default DashboardPage;
