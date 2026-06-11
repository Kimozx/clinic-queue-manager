const express = require('express');
const { listTodayQueue } = require('../controllers/queueController');

const router = express.Router();

router.get('/today', listTodayQueue);

module.exports = router;
