const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    user_name: {type: String},
    user_id: {type: String},
    password: {type: String},
    email: {type: String},
    created: {type: Date, default: Date.now},
});

const TokenSchema = new mongoose.Schema({
    user_id: {type: String},
    refresh_token: {type: String},
    created: {type: Date, default: Date.now},
});

const LiveVideo = new mongoose.Schema({
    live_id: {type:Number},
    connect_id: {type:Number},
    cctv_map: {type:String},
    cctv_id: {type:Number},
    cctv_admin: {type:String},
    live_date: {type:Date, default: Date.now}
});

const RecodeVideo = new mongoose.Schema({
    video_id: {type:Number},
    map: {type:String},
    file_format: {type:String},
    file_size: {type:String},
    gender: {type:Number},
    height: {type:Number},
    form: {type:Number},
    face_picture: {type:String},
    uploader: {type: String},
    upload_date: {type:Date, default: Date.now}
});

module.exports.User = mongoose.model("user_db", UserSchema);
module.exports.Token = mongoose.model("token_db", TokenSchema);
module.exports.Recode = mongoose.model("recode_db", RecodeVideo);
module.exports.Live = mongoose.model("live_db", LiveVideo);