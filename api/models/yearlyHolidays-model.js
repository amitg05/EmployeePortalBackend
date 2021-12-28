const mongoose = require('mongoose');


const HolidaySchema = new mongoose.Schema({
    occasion: {
        type: String
    },
    holidayDate: {
        type: Date
    },
    holidayDay: {
        type: String
    }

});


const Holidays = mongoose.model('Holidays', HolidaySchema)

module.exports = Holidays;