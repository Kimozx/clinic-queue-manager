const { run, getAll, getOne } = require('../database/db');

const VALID_STATUSES = ['Waiting', 'In Treatment', 'Completed', 'Cancelled'];

function listAppointments(req, res) {
  const date = (req.query.date || '').trim();

  const baseQuery = `
    SELECT
      appointments.id,
      appointments.patient_id,
      appointments.appointment_date,
      appointments.appointment_time,
      appointments.reason,
      appointments.status,
      appointments.created_at,
      appointments.updated_at,
      patients.name AS patient_name,
      patients.phone AS patient_phone
    FROM appointments
    INNER JOIN patients ON patients.id = appointments.patient_id
  `;

  if (date) {
    const rows = getAll(
      `${baseQuery}
       WHERE appointment_date = ?
       ORDER BY appointment_time ASC`,
      [date]
    );
    return res.json(rows);
  }

  const rows = getAll(`${baseQuery} ORDER BY appointment_date DESC, appointment_time ASC`);
  return res.json(rows);
}

function listTodayAppointments(req, res) {
  const today = new Date().toISOString().slice(0, 10);
  req.query.date = today;
  return listAppointments(req, res);
}

function createAppointment(req, res) {
  const { patient_id, appointment_date, appointment_time, reason = '', status = 'Waiting' } = req.body;

  if (!patient_id || !appointment_date || !appointment_time) {
    return res.status(400).json({ message: 'Patient, date, and time are required.' });
  }

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ message: 'Invalid status.' });
  }

  const patient = getOne('SELECT id FROM patients WHERE id = ?', [Number(patient_id)]);
  if (!patient) {
    return res.status(404).json({ message: 'Patient not found.' });
  }

  const now = new Date().toISOString();
  const result = run(
    `INSERT INTO appointments
      (patient_id, appointment_date, appointment_time, reason, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [Number(patient_id), appointment_date, appointment_time, reason, status, now, now]
  );

  const created = getOne(
    `SELECT
      appointments.id,
      appointments.patient_id,
      appointments.appointment_date,
      appointments.appointment_time,
      appointments.reason,
      appointments.status,
      appointments.created_at,
      appointments.updated_at,
      patients.name AS patient_name,
      patients.phone AS patient_phone
    FROM appointments
    INNER JOIN patients ON patients.id = appointments.patient_id
    WHERE appointments.id = ?`,
    [result.lastInsertRowId]
  );

  return res.status(201).json(created);
}

function updateAppointmentStatus(req, res) {
  const appointmentId = Number(req.params.id);
  const { status } = req.body;

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ message: 'Invalid status.' });
  }

  const appointment = getOne('SELECT id FROM appointments WHERE id = ?', [appointmentId]);
  if (!appointment) {
    return res.status(404).json({ message: 'Appointment not found.' });
  }

  run(
    'UPDATE appointments SET status = ?, updated_at = ? WHERE id = ?',
    [status, new Date().toISOString(), appointmentId]
  );

  const updated = getOne('SELECT * FROM appointments WHERE id = ?', [appointmentId]);
  return res.json(updated);
}

module.exports = {
  listAppointments,
  listTodayAppointments,
  createAppointment,
  updateAppointmentStatus,
  VALID_STATUSES,
};
