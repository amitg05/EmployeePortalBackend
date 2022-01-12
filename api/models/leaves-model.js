const mongoose = require('mongoose');


const LeaveSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: [true, 'Employee Id Is Required']
    },
    employeeCode: {
        type: String,
        required: [true, 'Employee Code Is Required'],
    },
    reportingTo: {
        type: String,
    },
    leaveType: {
        type: String
    },
    teamEmailId: {
        type: String,
        required: [true, 'Email Is Required'],
        unique: false,
        allownull: false,
        lowercase: true
    },
    leaveFrom: {
        type: Date,
        required: [true, 'Leave From Date Is Required'],
    },
    leaveTo: {
        type: Date,
        required: [true, 'Leave To Date Is Required'],
    },
    leaveReason: {
        type: String
    }

});


const Leaves = mongoose.model('Leaves', LeaveSchema);
module.exports = Leaves;