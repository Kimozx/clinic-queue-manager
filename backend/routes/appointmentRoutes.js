const express = require('express');
const {
  listAppointments,
  listTodayAppointments,
  createAppointment,
  updateAppointmentStatus,
} = require('../controllers/appointmentsController');

const router = express.Router();

router.get('/', listAppointments);
router.get('/today', listTodayAppointments);
router.post('/', createAppointment);
router.put('/:id/status', updateAppointmentStatus);

module.exports = router;
