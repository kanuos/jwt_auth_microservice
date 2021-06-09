const {Schema, model} = require("mongoose");

const UserSchema = new Schema({
    name : {
        type: Schema.Types.String,
        required : true,
    },
    email : {
        type: Schema.Types.String,
        required : true,
        unique : true,
    },
    password : {
        type: Schema.Types.String,
        required : true,
    },
    dateJoined : {
        type: Schema.Types.Date,
        default : Date.now
    }
});


module.exports = model("User", UserSchema);