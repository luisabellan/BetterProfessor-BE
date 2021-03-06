const jwt = require("jsonwebtoken")
const authModel = require("../auth/auth-model")
// const dotenv = require('dotenv')

const roles = ["student", "mentor"]

function restrict(role = "student") {
	return async (req, res, next) => {
		const authError = {
			message: "Invalid credentials",
		}

		try {
			const token = req.cookies.token
 			if (!token) {
				return res.status(401).json(authError)
			}

			jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
				try {
					// validate role based on a scale, so mentors can
					// still access resources restricted to student users
					if (err || roles.indexOf(decoded.role) < roles.indexOf(role)) {
						return res.status(401).json(authError)
					}
					
					// look up session from database and make sure it's not expired
					req.session = await authModel.findById(decoded.sessionId)
					if (!req.session || new Date(req.session.expires) <= new Date()) {
						return res.status(401).json(authError)
					}

					next()
				} catch(err) {
					next(err)
				}
			})
		} catch(err) {
			next(err)
		}
	}
}

module.exports = restrict