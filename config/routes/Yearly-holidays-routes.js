const express = require('express');
const { saveHolidays, getMonthlyHolidays } = require('../../api/controllers/yearlyHolidaysController');
const { verifyToken } = require('../../utils/authorization');
const router = express.Router();


router.get('/getMonthlyHolidays', verifyToken, getMonthlyHolidays);
router.post('/saveHolidays', verifyToken, saveHolidays);


module.exports = router;