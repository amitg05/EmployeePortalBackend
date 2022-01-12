const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../utils/authorization');
const { fileUpload, getEmployeeByDOB, getNewDOJEmployees, getDeparmentMembers, getAllEmployees, deleteEmployee, getEmployeeByID, updateEmployeeByID, uploadAvatar, saveAvatar, employeeLeaves, getAllemployeeLeaves, onboarding} = require('../../api/controllers/employeeController');


router.get('/getEmployeeByDOB', verifyToken, getEmployeeByDOB);
router.get('/getNewDOJEmployees', verifyToken, getNewDOJEmployees);
router.get('/getAllEmployees', verifyToken, getAllEmployees);
router.get('/getDepartmentMembers', getDeparmentMembers);
router.post('/deleteEmployee', verifyToken, deleteEmployee);
router.post('/file-upload', verifyToken, fileUpload);
router.post('/getEmployeeByID', verifyToken, getEmployeeByID);
router.post('/updateEmployeeByID', verifyToken, updateEmployeeByID);
router.post('/uploadAvatar', verifyToken, uploadAvatar);
router.post('/saveAvatar', verifyToken, saveAvatar);
router.post('/employeeLeaves', verifyToken, employeeLeaves);
router.get('/employeeLeaves', verifyToken, getAllemployeeLeaves);

router.post('/onboarding', verifyToken, onboarding);

router.post('/onboarding', verifyToken, onboarding);





module.exports = router;
