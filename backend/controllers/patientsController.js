const { run, getAll, getOne } = require('../database/db');

function listPatients(req, res) {
  const search = (req.query.search || '').trim();

  if (!search) {
    const patients = getAll('SELECT * FROM patients ORDER BY id DESC');
    return res.json(patients);
  }

  const query = `%${search}%`;
  const patients = getAll(
    `SELECT * FROM patients
     WHERE name LIKE ? OR phone LIKE ?
     ORDER BY id DESC`,
    [query, query]
  );

  return res.json(patients);
}

function createPatient(req, res) {
  const { name, phone, dob, notes = '' } = req.body;

  if (!name || !phone || !dob) {
    return res.status(400).json({ message: 'Name, phone, and date of birth are required.' });
  }

  const now = new Date().toISOString();
  const result = run(
    'INSERT INTO patients (name, phone, dob, notes, created_at) VALUES (?, ?, ?, ?, ?)',
    [name, phone, dob, notes, now]
  );

  const patient = getOne('SELECT * FROM patients WHERE id = ?', [result.lastInsertRowId]);
  return res.status(201).json(patient);
}

function updatePatient(req, res) {
  const patientId = Number(req.params.id);
  const { name, phone, dob, notes = '' } = req.body;

  if (!name || !phone || !dob) {
    return res.status(400).json({ message: 'Name, phone, and date of birth are required.' });
  }

  const existing = getOne('SELECT id FROM patients WHERE id = ?', [patientId]);
  if (!existing) {
    return res.status(404).json({ message: 'Patient not found.' });
  }

  run(
    'UPDATE patients SET name = ?, phone = ?, dob = ?, notes = ? WHERE id = ?',
    [name, phone, dob, notes, patientId]
  );

  const updated = getOne('SELECT * FROM patients WHERE id = ?', [patientId]);
  return res.json(updated);
}

function deletePatient(req, res) {
  const patientId = Number(req.params.id);

  const existing = getOne('SELECT id FROM patients WHERE id = ?', [patientId]);
  if (!existing) {
    return res.status(404).json({ message: 'Patient not found.' });
  }

  run('DELETE FROM appointments WHERE patient_id = ?', [patientId]);
  run('DELETE FROM patients WHERE id = ?', [patientId]);

  return res.status(204).send();
}

function seedDemoData(req, res) {
  const today = new Date().toISOString().slice(0, 10);
  const now = new Date().toISOString();

  const demoPatients = [
    { name: 'Amina Yusuf', phone: '555-0101', dob: '1990-03-12', notes: 'Asthma follow-up.' },
    { name: 'Daniel Kim', phone: '555-0102', dob: '1985-11-28', notes: 'Blood pressure check.' },
    { name: 'Sofia Alvarez', phone: '555-0103', dob: '2001-06-07', notes: 'General consultation.' },
    { name: 'Liam Johnson', phone: '555-0104', dob: '1977-09-18', notes: 'Diabetes medication review.' },
    { name: 'Chinwe Okafor', phone: '555-0105', dob: '1995-01-22', notes: 'Routine physical exam.' },
  ];

  const appointmentTemplate = [
    { time: '08:30', reason: 'Initial triage', status: 'Waiting' },
    { time: '09:00', reason: 'Follow-up check', status: 'In Treatment' },
    { time: '09:30', reason: 'Vaccination consult', status: 'Completed' },
    { time: '10:00', reason: 'Lab result review', status: 'Cancelled' },
    { time: '10:30', reason: 'General assessment', status: 'Waiting' },
  ];

  run('DELETE FROM appointments');
  run('DELETE FROM patients');

  const createdPatients = demoPatients.map((patient) => {
    const result = run(
      'INSERT INTO patients (name, phone, dob, notes, created_at) VALUES (?, ?, ?, ?, ?)',
      [patient.name, patient.phone, patient.dob, patient.notes, now]
    );

    return getOne('SELECT * FROM patients WHERE id = ?', [result.lastInsertRowId]);
  });

  createdPatients.forEach((patient, index) => {
    const appointment = appointmentTemplate[index % appointmentTemplate.length];
    run(
      `INSERT INTO appointments
        (patient_id, appointment_date, appointment_time, reason, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [patient.id, today, appointment.time, appointment.reason, appointment.status, now, now]
    );
  });

  return res.json({
    message: 'Demo data generated successfully.',
    patientsCreated: createdPatients.length,
    appointmentsCreated: createdPatients.length,
  });
}

module.exports = {
  listPatients,
  createPatient,
  updatePatient,
  deletePatient,
  seedDemoData,
};
