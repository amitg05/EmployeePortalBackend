const { promisify } = require('util')
const Jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mailer = require("nodemailer");
const Employee = require('../models/employees-model');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');



module.exports = {

    signup: catchAsync(async (req, res, next) => {
        
        await Employee.create(req.body);

        
        res.status(201).json({
            status: 'success',
            message: `Employee Got Registered Successfully With Password Sent To ${req.body.email} Email Id,`
        })
    }),

    login: catchAsync(async (req, res, next) => {
        const { email, password } = req.body
        if (!email || !password) {
            throw new AppError('Email And Password Fields Are Required', 400)
        }
        const employee = await Employee.findOne({ email: email }).select('+password')
        if (!employee || !(await employee.correctPassword(password, employee.password))) {
            throw new AppError('Invalid Email Or Password', 401);
        }
        const accessToken = await promisify(Jwt.sign)({ id: employee._id }, process.env.JWT_ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN })
        const refreshToken = await promisify(Jwt.sign)({ id: employee._id }, process.env.JWT_REFRESH_TOKEN_SECRET)
        await Employee.updateOne({ id: employee._id }, { refreshToken: refreshToken, isActive: 1 })
        res.status(200).json({
            status: 'Success',
            message: 'Login Success',
            accessToken,
            refreshToken,
            employeeData: [
                {
                    id: employee['id'],
                    firstName: employee['firstName'],
                    lastName: employee['lastName'],
                    email: employee['email'],
                    employeeDesignation: employee['employeeDesignation'],
                    previousCompanyName: employee['previousCompanyName'],
                    avatar: employee['avatar'],
                    employeeCode: employee['employeeCode']
                }
            ],


        })
    }),


    logout: catchAsync(async (req, res, next) => {
        const employeeId = req.body.id;
        if (!employeeId) {
            return next(new AppError('Employee Id Is Required', 400))
        }
        await Employee.updateOne({ id: employeeId }, { refreshToken: null, isActive: 0 });
        res.status(200).json({
            status: 'Success',
            message: 'Logout Success'
        });
    }),

    changePassword: catchAsync(async (req, res, next) => {
        let { oldPassword, newPassword, confirmPassword } = req.body;
        let encryptedPass;
        let employeeId = req.employee.id;
        const employee = await Employee.findOne({ _id: employeeId }).select('+password');
        if (!employee || !(await employee.correctPassword(oldPassword.trim(), employee.password))) {
            return next(new AppError('Invalid Employee Id Or Old Password', 401));
        }

        if (newPassword !== confirmPassword) {
            return next(new AppError('New Password And Confirm Password Did Not Match', 401));
        }
        req.body.confirmPassword = undefined;
        encryptedPass = await bcrypt.hash(newPassword.trim(), 12);
        await Employee.updateOne({ _id: employeeId }, { password: encryptedPass, passwordChangedAt: Date.now() })
        res.status(201).json({
            status: 'Success',
            message: 'Password Got Changed Please Relogin'
        })
    }),


    refreshToken: catchAsync(async (req, res, next) => {
        let { refreshToken } = req.body;
        if (!refreshToken) {
            throw new AppError('Refresh Token is required', 401)
        }
        const results = await promisify(Jwt.verify)(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);
        console.log(results)
        const result = await Employee.find({
            $and: [
                { id: results['id'] },
                { refreshToken: refreshToken }
            ]
        });

        if (result.length === 0) {
            throw new AppError("Refresh token does not exist", 400);
        }

        let payload = {
            id: results['id'],
        };

        const access_Token = await promisify(Jwt.sign)(payload, process.env.JWT_ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        const refresh_Token = await promisify(Jwt.sign)(payload, process.env.JWT_REFRESH_TOKEN_SECRET);
        await Employee.updateOne({ id: results['id'] }, { refreshToken: refresh_Token });
        return res.status(201).json({
            status: 'Success',
            data: [
                {
                    accessToken: access_Token,
                    refreshToken: refresh_Token
                },
            ],
        });
    }),

}