import { useEffect, useState } from 'react';
import { api } from '../api';

const statuses = ['Waiting', 'In Treatment', 'Completed', 'Cancelled'];

function statusClass(status) {
  return `status-pill ${status.toLowerCase().replace(/\s+/g, '-')}`;
}

function QueuePage() {
  const [queue, setQueue] = useState([]);
  const [error, setError] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const waitingCount = queue.filter((item) => item.status === 'Waiting').length;
  const inTreatmentCount = queue.filter((item) => item.status === 'In Treatment').length;
  const nowServing = queue.find((item) => item.status === 'In Treatment');

  const loadQueue = async () => {
    try {
      const data = await api.getTodayQueue();
      setQueue(data);
      setLastUpdated(new Date());
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  useEffect(() => {
    loadQueue();
  }, []);

  useEffect(() => {
    if (!autoRefresh) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      loadQueue();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [autoRefresh]);

  const updateStatus = async (id, status) => {
    try {
      await api.updateAppointmentStatus(id, status);
      await loadQueue();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <section>
      <div className="inline-control-row">
        <h2>Queue (Today)</h2>
        <div className="button-row">
          <button type="button" className="secondary-btn" onClick={loadQueue}>
            Refresh
          </button>
          <button
            type="button"
            className="secondary-btn"
            onClick={() => setAutoRefresh((value) => !value)}
          >
            Auto Refresh: {autoRefresh ? 'On' : 'Off'}
          </button>
        </div>
      </div>

      <p className="muted">
        {lastUpdated
          ? `Last updated at ${lastUpdated.toLocaleTimeString()}`
          : 'Waiting for first queue refresh...'}
      </p>

      {error ? <p className="error">{error}</p> : null}

      {nowServing ? (
        <div className="now-serving-widget card">
          <div className="now-serving-label">Now Serving</div>
          <div className="now-serving-patient">
            <strong>{nowServing.patient_name}</strong>
            <span>{nowServing.patient_phone}</span>
          </div>
        </div>
      ) : null}

      <div className="metrics-grid">
        <article className="card metric">
          <h3>Patients in Queue</h3>
          <strong>{queue.length}</strong>
        </article>
        <article className="card metric">
          <h3>Waiting</h3>
          <strong>{waitingCount}</strong>
        </article>
        <article className="card metric">
          <h3>In Treatment</h3>
          <strong>{inTreatmentCount}</strong>
        </article>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Patient</th>
              <th>Phone</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {queue.map((item) => (
              <tr key={item.id}>
                <td>{item.appointment_time}</td>
                <td>{item.patient_name}</td>
                <td>{item.patient_phone}</td>
                <td>{item.reason}</td>
                <td>
                  <span className={statusClass(item.status)}>{item.status}</span>
                  <select
                    value={item.status}
                    onChange={(event) => updateStatus(item.id, event.target.value)}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {queue.length === 0 ? (
              <tr>
                <td colSpan="5">Queue is empty for today.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default QueuePage;
