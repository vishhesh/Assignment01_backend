const authRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const { User } = require("./../mongoose/model/index");

authRouter.post("/signup", async (req, res) => {
	const user = _.pick(req.body, ["name", "email", "password"]);
	const curUser = await User.findOne({ email: user.email });
	if (!curUser) {
		let sKey = "someke"; //generate random key;
		user.secretKey = sKey;
		let newUser = new User(user);
		newUser
			.save()
			.then(async (dbUser) => {
				let token = await jwt.sign(
					{ id: dbUser._id, email: dbUser.email },
					dbUser.secretKey,
					{ expiresIn: "30d" }
				);
				return res.send(
					JSON.stringify({
						ok: true,
						message: "user created",
						token,
						name: dbUser.name,
						email: dbUser.email,
					})
				);
			})
			.catch((e) => {
				return res.send(
					JSON.stringify({
						ok: false,
						data: { message: "Couldn't Create user!" },
					})
				);
			});
	} else {
		return res.send(
			JSON.stringify({
				ok: false,
				data: { message: "User ulready exists." },
			})
		);
	}
});

authRouter.post("/login", async (req, res) => {
	const credentials = _.pick(req.body, ["email", "password"]);
	console.log(credentials);
	const dbUser = await User.findOne({ email: credentials.email });



	if (dbUser && dbUser.password == credentials.password) {
		//todo update secret key //
		let token = await jwt.sign(
			{ id: dbUser._id, email: dbUser.email },
			dbUser.secretKey,
			{ expiresIn: "30d" }
		);
		return res.send(JSON.stringify({
			ok: true,
			message: "logged in. Sending token",
			token,
			name: dbUser.name,
			email: dbUser.email,
		}));
	} else {
		return res
			.send(JSON.stringify({ ok: false, message: "Invalid user name or password." }));
	}
});

module.exports = {
	authRouter,
};
