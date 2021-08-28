const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            required: true
        },
        last_name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minLength: 8,
        },
        country_of_residence: {
            type: String,
            required: true,
            enum: ['australia', 'usa']
        },
        address: {
            street_line_1: {
                type: String,
                required: true
            },
            street_line_2: {
                type: String,
                required: false
            },
            city: {
                type: String,
                required: true
            },
            state: {
                type: String,
                required: true
            },
            postcode: {
                type: String,
                required: true
            }
        },
        phone_number: {
            type: String,
            required: true
        },
    });

// UserSchema.methods.isDoctor = function isDocotr() {
//     return this.usertype == 'doctor';
// }

mongoose.model('User', UserSchema);
module.exports = mongoose.model('User')