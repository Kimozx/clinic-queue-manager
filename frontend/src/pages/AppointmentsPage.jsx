import { useEffect, useState } from 'react';
import { api } from '../api';

const statuses = ['Waiting', 'In Treatment', 'Completed', 'Cancelled'];

function statusClass(status) {
  return `status-pill ${status.toLowerCase().replace(/\s+/g, '-')}`;
}

function AppointmentsPage() {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    patient_id: '',
    appointment_date: new Date().toISOString().slice(0, 10),
    appointment_time: '09:00',
    reason: '',
    status: 'Waiting',
  });

  const waiting = appointments.filter((item) => item.status === 'Waiting').length;
  const inTreatment = appointments.filter((item) => item.status === 'In Treatment').length;
  const completed = appointments.filter((item) => item.status === 'Completed').length;

  const loadPageData = async (date) => {
    try {
      const [patientsData, appointmentsData] = await Promise.all([
        api.getPatients(),
        api.getAppointmentsByDate(date),
      ]);
      setPatients(patientsData);
      setAppointments(appointmentsData);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  useEffect(() => {
    loadPageData(selectedDate);
  }, [selectedDate]);

  const handleCreate = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await api.createAppointment(form);
      await loadPageData(selectedDate);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const updateStatus = async (appointmentId, status) => {
    try {
      await api.updateAppointmentStatus(appointmentId, status);
      await loadPageData(selectedDate);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <section>
      <h2>Appointments</h2>

      <div className="card">
        <h3>Create Appointment</h3>
        <form className="form-grid" onSubmit={handleCreate}>
          <label>
            Patient
            <select
              value={form.patient_id}
              onChange={(event) => setForm({ ...form, patient_id: Number(event.target.value) })}
              required
            >
              <option value="">Select patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} ({patient.phone})
                </option>
              ))}
            </select>
          </label>

          <label>
            Date
            <input
              type="date"
              value={form.appointment_date}
              onChange={(event) => setForm({ ...form, appointment_date: event.target.value })}
              required
            />
          </label>

          <label>
            Time
            <input
              type="time"
              value={form.appointment_time}
              onChange={(event) => setForm({ ...form, appointment_time: event.target.value })}
              required
            />
          </label>

          <label>
            Status
            <select
              value={form.status}
              onChange={(event) => setForm({ ...form, status: event.target.value })}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="full-width">
            Reason
            <textarea
              rows="2"
              value={form.reason}
              onChange={(event) => setForm({ ...form, reason: event.target.value })}
            />
          </label>

          <button type="submit" className="primary-btn full-width">
            Save Appointment
          </button>
        </form>
      </div>

      <div className="card">
        <div className="inline-control-row">
          <h3>Appointments for Date</h3>
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
          />
        </div>

        {error ? <p className="error">{error}</p> : null}

        <div className="mini-kpis">
          <span className="kpi-chip">Total: {appointments.length}</span>
          <span className="kpi-chip">Waiting: {waiting}</span>
          <span className="kpi-chip">In Treatment: {inTreatment}</span>
          <span className="kpi-chip">Completed: {completed}</span>
        </div>

        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Patient</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((item) => (
              <tr key={item.id}>
                <td>{item.appointment_time}</td>
                <td>{item.patient_name}</td>
                <td>{item.reason}</td>
                <td>
                  <span className={statusClass(item.status)}>{item.status}</span>
                </td>
                <td>
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
            {appointments.length === 0 ? (
              <tr>
                <td colSpan="5">No appointments for this date.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AppointmentsPage;
