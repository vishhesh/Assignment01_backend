const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');
var userSchema = new mongoose.Schema({
	secretKey : {
		type : String,
		required : false,
	},
	email : {
		type : String,
		trim : true,
		minlength : 5,
		unique : true,
		required : true,
		validate : {
			validator : validator.isEmail,
			message : '{VALUE} must be Email.'
		}
	},
	password: {
		type: String, 
		minlength: 8,
		required : true,
	},
	name : {
		type : String, 
		required : true,
		minlength : 1,
		trim : true,
	},
});

// userSchema.statics.
userSchema.statics.findByCredential = function(credential){
	var User = this;
	return User.findOne({email : credential.email}).then((usr)=>{
		if(!usr){
			return Promise.reject();
		}
		return new Promise((resolve, reject)=>{
			bcrypt.compare(credential.password, usr.password, (err, status)=>{
				if(err || !status){
					reject(err);
				}else{
					resolve(usr);
				}
			})
		});

	});
}

var User = mongoose.model('User', userSchema);
module.exports = {
	User
}