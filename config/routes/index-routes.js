const express = require('express');
const router = express.Router();
// All new Routes Declaration
const employeesRoutes = require('./employees-routes');
const authRoutes = require('./auth-routes');
const holidayRoutes = require('./Yearly-holidays-routes');



router.get('/', (req, res, next) => res.render('index'));
router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/employees', employeesRoutes);
router.use('/api/v1/holidays', holidayRoutes);

module.exports = router