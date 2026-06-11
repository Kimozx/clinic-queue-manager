import { useEffect, useState } from 'react';
import { api } from '../api';

function ratio(value, total) {
  if (!total) {
    return 0;
  }
  return Math.round((value / total) * 100);
}

function ReportsPage() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const total = report?.totalAppointments || 0;
  const completed = report?.completedAppointments || 0;
  const cancelled = report?.cancelledAppointments || 0;
  const waiting = report?.waitingPatients || 0;

  const loadReport = async (selectedDate) => {
    try {
      setError('');
      const data = await api.getDailyReport(selectedDate);
      setReport(data);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  useEffect(() => {
    loadReport(date);
  }, [date]);

  const seedDemoData = async () => {
    try {
      setError('');
      const result = await api.seedDemoData();
      setInfo(`${result.patientsCreated} patients and ${result.appointmentsCreated} appointments seeded.`);
      await loadReport(date);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <section>
      <div className="inline-control-row">
        <h2>Daily Report</h2>
        <div className="button-row">
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          <button type="button" className="secondary-btn" onClick={seedDemoData}>
            Seed Demo Data
          </button>
          <button type="button" className="primary-btn" onClick={() => window.print()}>
            Print Report
          </button>
        </div>
      </div>

      {error ? <p className="error">{error}</p> : null}
      {info ? <p className="success">{info}</p> : null}

      <div className="metrics-grid">
        <article className="card metric">
          <h3>Total Appointments</h3>
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
          <h3>Waiting Patients</h3>
          <strong>{waiting}</strong>
        </article>
      </div>

      <div className="card report-chart">
        <h3>Daily Breakdown</h3>
        <p className="muted">Read this as percentage of total appointments for the selected day.</p>

        <div className="distribution-row">
          <span>Completed</span>
          <div className="bar-track">
            <div className="bar-fill completed" style={{ width: `${ratio(completed, total)}%` }} />
          </div>
          <strong>{ratio(completed, total)}%</strong>
        </div>

        <div className="distribution-row">
          <span>Cancelled</span>
          <div className="bar-track">
            <div className="bar-fill cancelled" style={{ width: `${ratio(cancelled, total)}%` }} />
          </div>
          <strong>{ratio(cancelled, total)}%</strong>
        </div>

        <div className="distribution-row">
          <span>Waiting / In Treatment</span>
          <div className="bar-track">
            <div className="bar-fill waiting" style={{ width: `${ratio(waiting, total)}%` }} />
          </div>
          <strong>{ratio(waiting, total)}%</strong>
        </div>
      </div>
    </section>
  );
}

export default ReportsPage;
