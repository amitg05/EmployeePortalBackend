const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const path = require("path");
const util = require("util");
const Employee = require('../models/employees-model');
const Leaves = require('../models/leaves-model');


const Onboarding = require('../models/onboarding')
const sendMail = require('../../utils/email_verification')
const New_Employee = require("../models/New_employee");




module.exports = {
    /* File Upload APi */
    fileUpload: catchAsync(async (req, res, next) => {
        console.log(req.files.upfile)
        var sendUrl = []
        if (req.files) {
            let file = req.files.upfile;
            if (Array.isArray(file)) {
                for (var i = 0; i < file.length; i++) {
                    let fileName = file[i].name;
                    let extension = path.extname(fileName);
                    let md5 = file[i].md5;
                    Url = "/uploads/employee-file-uploads/" + md5 + extension;
                    sendUrl.push(Url)
                    await util.promisify(file[i].mv)("./public" + Url);
                }
            } else {
                let fileName = file.name;
                let extension = path.extname(fileName);
                let md5 = file.md5;
                Url = "/uploads/employee-file-uploads/" + md5 + extension;
                sendUrl.push(Url)
                await util.promisify(file.mv)("./public" + Url);
            }
        }
        res.json({
            success: 1,
            message: "File Uploaded Successfully",
            Url: sendUrl
        });
    }),

    /* GET Employee By DOB API */
    getEmployeeByDOB: catchAsync(async (req, res, next) => {
        const result = await Employee.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [{ $month: '$dob' }, { $month: new Date() }],
                    },
                    isDeleted: 1
                },
            },
            {
                $project: {
                    password: 0,
                    refreshToken: 0,
                    passwordChangedAt: 0,
                    doj: 0,
                    adharCardAttachment: 0,
                    panCardAttachment: 0,
                    otherAttachment: 0,
                    previousCompanyName: 0,
                    permanentAddress: 0,
                    currentAddress: 0,
                    currentCity: 0,
                    postalCode: 0,
                    employeeRole: 0,
                    isActive: 0,
                    isDeleted: 0,
                    createdAt: 0,
                    email: 0
                },
            }
        ])
        res.status(200).json({
            status: 'Success',
            count: result.length,
            dobMembersData: result
        });
    }),


    /* GET New DOJ Employees API */
    getNewDOJEmployees: catchAsync(async (req, res, next) => {
        let fromDate = new Date(Date.now() + 60 * 60 * 24 * 30 * 1000);
        var currentDate = new Date(Date.now() - (24*60*60*1000) * 1);

        const result = await Employee.find({

            doj: {
                $gte: new Date(currentDate),
                $lte: new Date(fromDate)
            },
            isDeleted: 1

        }, { _id: 1, firstName: 1, lastName: 1, employeeCode: 1, currentCity: 1, employeeDesignation: 1, contactNumber: 1, avatar: 1 });
          
        res.status(200).json({
            status: 'Success',
            count: result.length,
            dojEmployeeData: result
        })
    }),


    /* GET Department Members API */
    getDeparmentMembers: catchAsync(async (req, res, next) => {
        const result = await Employee.find({ isDeleted: 1 }, { _id: 1, firstName: 1, lastName: 1, employeeCode: 1, contactNumber: 1, avatar: 1 });
        res.status(200).json({
            status: 'Success',
            count: result.length,
            deptMembersData: result
        })
    }),

    /* GET All Employees API */
    getAllEmployees: catchAsync(async (req, res, next) => {
        let page = req.query.currentpage ? req.query.currentpage : 1;
        const limitPerPage = 10;
        let offset = (parseInt(page) - 1) * limitPerPage;

        const result = await Employee.find({ isDeleted: 1 }, { refreshToken: 0, password: 0, isActive: 0, isDeleted: 0, passwordChangedAt: 0 }).limit(limitPerPage).skip(offset)
        let count = await Employee.count({ isDeleted: 1 });
        res.status(200).json({
            status: 'Success',
            count,
            employeeData: result
        })
    }),


    /* DELETE An Employee API */
    deleteEmployee: catchAsync(async (req, res, next) => {
        let { id } = req.body;
        await Employee.updateOne({ _id: id }, { isDeleted: 0 })
        res.status(200).json({
            status: 'Success',
            message: 'Employee Data Deleted Successfully'
        })
    }),


    /* GET Employee By ID API */
    getEmployeeByID: catchAsync(async (req, res, next) => {
        let { id } = req.body;
        const result = await Employee.find({ _id: id }, { isDeleted: 0, refreshToken: 0, password: 0, passwordChangedAt: 0, isActive: 0, createdAt: 0 })
        res.status(200).json({
            status: 'Success',
            count: result.length,
            employeData: result
        })
    }),

    /* UPDATE Employee By ID API */
    updateEmployeeByID: catchAsync(async (req, res, next) => {
        let id = req.body.id;
        let data = req.body;
        console.log(data, 'data')
        await Employee.findByIdAndUpdate({ _id: id }, {
            firstName: data["firstName"],
            lastName: data["lastName"],
            email: data["email"],
            contactNumber: data["contactNumber"],
            employeeCode: data["employeeCode"],
            employeeDesignation: data["employeeDesignation"],
            previousCompanyName: data["previousCompanyName"],
            education: data["education"],
            dob: data["dob"],
            doj: data["doj"],
            avatar: data["avatar"],
            adharCardAttachment: data["adharCardAttachment"],
            panCardAttachment: data["panCardAttachment"],
            otherAttachment: data["otherAttachment"],
            permanentAddress: data["permanentAddress"],
            currentAddress: data["currentAddress"],
            currentCity: data["currentCity"],
            postalCode: data["postalCode"],
            employeeRole: data["employeeRole"],
            gender: data["gender"]
        });
        res.status(200).json({
            status: 'Success',
            message: 'Employee Updated Successfully',
        })
    }),

    /* AVTAR UPLOAD */
    uploadAvatar: catchAsync(async (req, res, next) => {
        let file = req.files.upfile;
        let fileName = file.name;
        let extension = path.extname(fileName);
        const allowedExtension = /png|jpeg|jpg|gif/;
        if (!allowedExtension.test(extension))
            throw new AppError("Unsupported Media Extension", 422);
        let md5 = file.md5;
        Url = "/uploads/avatar-uploads/" + md5 + extension;
        await util.promisify(file.mv)("./public" + Url);
        res.json({
            success: 'Success',
            message: "File Uploaded Successfully",
            Url: Url,
        });
    }),


    /*POST Save Avtar API */
    saveAvatar: catchAsync(async (req, res, next) => {
        let avatarUrl = req.body.avatarUrl;
        let employeeId = req.employee.id
        if (!avatarUrl) {
            throw new AppError('Avatar Url Is Required', 401);
        }

        if (!employeeId) {
            throw new AppError('Employee Id Is Required', 401);
        }

        await Employee.updateOne({ _id: employeeId }, { avatar: avatarUrl });
        res.status(200).json({
            status: 'Success',
            message: 'Profile Pic Changed Successfully'
        })
    }),


    /* POST - Add Leave Application */
    employeeLeaves: catchAsync(async (req, res, next) => {
        let employeeId = req.employee.id
        req.body['employeeId'] = employeeId;
        let body = req.body;

        await Leaves.create(body);
        res.status(201).json({
            status: 'Success',
            message: 'Leave Request Sent Successfully'
        })
    }),


    // POST - onboarding action 
    onboarding: catchAsync(async (req, res, next) => {


        let body = (req.body)
        await function () {
            Onboarding.create(body);
        }

        console.log("Hit hua ")
        var full_name = body.first_name + " " + body.last_name

        var num = (Math.floor(Math.random() * 90000) + 10000);
        var empcode = (Math.floor(Math.random() * 900) + 100);
        var Password = body.first_name + num;

        sendMail(full_name, body.email, Password, empcode, (status) => {
            if (status) {
                console.log("Bravo email send succesfully ")



                var newusr = {

                    firstName: body.first_name,
                    lastName: body.last_name,
                    email: body.email,
                    passwordChangedAt: new Date(),
                    contactNumber: body.phone,
                    // education:"B.E(Information Science)",
                    // dob:"1989-01-05T07:01:32.138+00:00",
                    doj: new Date(),
                    employeeCode: empcode,
                    //     employeeDesignation:"MEAN Stack Developer",
                    //     previousCompanyName:"Navient Technologies Pvt Ltd",
                    //     permanentAddress:"Subash Nagar Dandeli",
                    //     currentAddress:"Maa Shardha Nagar",
                    //     currentCity:"Indore",
                    //     postalCode:452010,
                    //     employeeRole:"Admin",
                    //     avatar:"/uploads/avatar-uploads/d19998b54b25c37b0b5ccf419064604e.jpg",
                    //     isActive:1,
                    //     isDeleted:1,
                    //     adharCardAttachment:Array,
                    //     panCardAttachment:Array,
                    //     otherAttachment:Array,
                    //     createdAt:"2021-09-24T11:59:00.899+00:00",
                    //     refreshToken:" "

                }
                newusr.password = Password

                Employee.create(newusr);
                console.log("Record inserted ")
            }
        })

        res.status(201).json({
            status: 'Success',
            message: 'Register Successfully'
        })
    }),


}