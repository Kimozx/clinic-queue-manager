const express = require('express');
const { getDailyReport } = require('../controllers/reportsController');

const router = express.Router();

router.get('/daily', getDailyReport);

module.exports = router;
