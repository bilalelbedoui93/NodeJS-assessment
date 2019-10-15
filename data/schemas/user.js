  
const mongoose = require('mongoose')
const { Schema, SchemaTypes: { ObjectId } } = mongoose

const user = new Schema({
    fullname: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        trim: true
    },
    password: {
        type: String,
        minlength: 8,
        maxlength: 255,
        trim: true
    }
})

module.exports = user