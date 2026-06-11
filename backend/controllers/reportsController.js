const { getOne } = require('../database/db');

function getDailyReport(req, res) {
  const date = (req.query.date || new Date().toISOString().slice(0, 10)).trim();

  const total = getOne(
    'SELECT COUNT(*) AS value FROM appointments WHERE appointment_date = ?',
    [date]
  );
  const completed = getOne(
    "SELECT COUNT(*) AS value FROM appointments WHERE appointment_date = ? AND status = 'Completed'",
    [date]
  );
  const cancelled = getOne(
    "SELECT COUNT(*) AS value FROM appointments WHERE appointment_date = ? AND status = 'Cancelled'",
    [date]
  );
  const waiting = getOne(
    "SELECT COUNT(*) AS value FROM appointments WHERE appointment_date = ? AND status IN ('Waiting', 'In Treatment')",
    [date]
  );

  return res.json({
    date,
    totalAppointments: Number(total.value || 0),
    completedAppointments: Number(completed.value || 0),
    cancelledAppointments: Number(cancelled.value || 0),
    waitingPatients: Number(waiting.value || 0),
  });
}

module.exports = {
  getDailyReport,
};
