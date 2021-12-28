const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const path = require("path");
const util = require("util");
const Holidays = require('../models/yearlyHolidays-model');


module.exports = {
    saveHolidays: catchAsync(async (req, res, next) => {
        await Holidays.create(req.body);
        res.status(201).json({
            status: 'OK',
            message: 'Holiday Saved Successfully'
        });
    }),

    getMonthlyHolidays: catchAsync(async (req, res, next) => {
        let fromDate = new Date(Date.now() + 60 * 60 * 24 * 30 * 1000);
        var currentDate = new Date(Date.now());
        const result = await Holidays.find({
            holidayDate: {
                $gte: new Date(currentDate),
                $lt: new Date(fromDate)
            }
        });

        res.status(200).json({
            status: 'Success',
            count: result.length,
            holidayData: result
        })
    })
}