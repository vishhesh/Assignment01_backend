const jwt = require('jsonwebtoken');
const {User} = require('./../mongoose/model/index');

const verifyToken = async(req, res, next)=>{
	const token = req.headers.token;
	if(!token) res.end(401);
	const decoded =  await jwt.decode(token);
	await User.findOne({_id: decoded.id}).then(async user=>{
		if(!user) throw new Error({message : 'Unauthorized'});
		try{
			const status = await jwt.verify(token, user.secretKey);
			if(status){
				req.body.__user = user;
			}
		}catch(e){
			throw new Error({message : 'Unauthorized'})
		}
	}).catch(e=>{
		res.status(401).end();
	})
	next();
}

module.exports = {
	verifyToken
}