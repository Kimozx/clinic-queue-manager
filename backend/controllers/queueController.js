const { getAll } = require('../database/db');

function listTodayQueue(req, res) {
  const today = new Date().toISOString().slice(0, 10);
  const queue = getAll(
    `SELECT
      appointments.id,
      appointments.patient_id,
      appointments.appointment_date,
      appointments.appointment_time,
      appointments.reason,
      appointments.status,
      patients.name AS patient_name,
      patients.phone AS patient_phone
    FROM appointments
    INNER JOIN patients ON patients.id = appointments.patient_id
    WHERE appointments.appointment_date = ?
    ORDER BY
      CASE appointments.status
        WHEN 'Waiting' THEN 1
        WHEN 'In Treatment' THEN 2
        WHEN 'Completed' THEN 3
        WHEN 'Cancelled' THEN 4
        ELSE 5
      END,
      appointments.appointment_time ASC`,
    [today]
  );

  return res.json(queue);
}

module.exports = {
  listTodayQueue,
};
