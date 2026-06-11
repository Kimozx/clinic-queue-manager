const express = require('express');
const {
  listPatients,
  createPatient,
  updatePatient,
  deletePatient,
  seedDemoData,
} = require('../controllers/patientsController');

const router = express.Router();

router.get('/', listPatients);
router.post('/seed-demo', seedDemoData);
router.post('/', createPatient);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);

module.exports = router;
