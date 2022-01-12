const mongoose = require('mongoose')

const OnboardingSchema = new mongoose.Schema({

    first_name :{
        type:String,
        required:[true , 'first Name is required']
    },

    last_name:{
        type:String,
        required : [true , 'lastname is required']
    },

    email : {
        type:String,
        required : [true , 'email is required ']
    },

    phone : {
        type:String,
        required : [true , 'phone is required ']
    }

});

const Onboarding = mongoose.model('Onboarding' , OnboardingSchema)
module.exports = Onboarding;