import jwt from 'jsonwebtoken'
import { User } from "../moduls/userModul.js"


export const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(400).json({
                success: false,
                message: "Authorization Token missing or invalid"
            })
        }
        const token = authHeader.split(" ")[1]
        let decoded
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY)
        } catch (error) {
            if (error.name === "JsonWebTokenError") {
                return res.status(400).json({
                    success: false,
                    message: "registration token has expire"
                })
            }
            return res.status(400).json({
                success: false,
                message: "Access token is missing or invilid"
            })
        }
        const user = await User.findById(decoded.id)
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user not found"
            })
        }
        req.user = user
        req.id = user._id
        next()
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const isAdmin = async (req, res, next) => {
    if(req.user && req.user.role === 'admin') {
        next()
    } else{
        return res.status(403).json({
            success: false,
            message:"Access denied : only admin"
        })
    }
}