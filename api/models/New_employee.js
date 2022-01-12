const mongoose = require ('mongoose')


const New_Employee_schema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, 'First name is Required'],
        allownull: false
    },
    last_name: {
        type: String,
        required: [true, 'Last name is Required'],
        allownull: false
    },
    email: {
        type: String,
        required: [true, 'Email Is Required'],
        unique: true,
        allownull: false,
        lowercase: true
    },
    password: {
        type: String,
        allownull: false,
        trim: true,
        select: false
    },
 
    phone: {
        type: Number,
        trim: true,
        minlength: [10, 'Contact Number Must Atleast Contain Minimum 10 Digits']
    },


})


const New_Employee = mongoose.model('New_Employee', New_Employee_schema , )
module.exports = New_Employee;