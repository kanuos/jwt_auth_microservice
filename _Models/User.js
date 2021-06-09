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
    },
    country : {
        type: Schema.Types.String,
    },
    profilePicture : {
        type: Schema.Types.String,
    },
    bio : {
        type: Schema.Types.String,
    },
});


module.exports = model("User", UserSchema);