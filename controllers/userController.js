import { User } from "../moduls/userModul.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { verifyEmail } from "../emailVerify/verifyEmail.js";
import { Session } from "../moduls/sessionModul.js";
import { sendOTPMail } from "../emailVerify/sendOTPMail.js";
import cloudinary from "../utils/cloudinary.js";


export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!firstName || !lastName || !email || !password) {
            res.status(400).json({
                success: false,
                message: 'All fields are require'
            })
        }
        const user = await User.findOne({ email })
        if (user) {
            res.status(400).json({
                success: false,
                message: 'User already Exists'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        })

        // send Email with jwt token
        const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, { expiresIn: '10m' })
        verifyEmail(token, email)
        newUser.token = token

        await newUser.save()
        return res.status(201).json({
            success: true,
            message: 'User register Successfully',
            user: newUser
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const verify = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(400).json({
                success: false,
                message: 'Authorization token is missing or invalid'
            })
        }
        const token = authHeader.split(" ")[1] // [bearer, kgagliubava//token]
        let decoded
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY)
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(400).json({
                    success: false,
                    message: "The registration token has expired"
                })
            }
            return res.status(400).json({
                success: false,
                message: 'Token verification faild'
            })
        }

        const user = await User.findById(decoded.id)
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        user.token = null
        user.isVerified = true
        await user.save()
        return res.status(200).json({
            success: true,
            message: "Email varified successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const reVerify = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user Not found"
            })
        }
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '10m' })
        verifyEmail(token, email)
        user.token = token
        await user.save()
        return res.status(200).json({
            success: true,
            message: "verification email send agail successfully",
            token: user.token
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All field are required"
            })
        }
        const exisitingUser = await User.findOne({ email })
        if (!exisitingUser) {
            return res.status(400).json({
                success: false,
                message: "User not exists"
            })
        }
        const isPasswordValid = await bcrypt.compare(password, exisitingUser.password)
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "invalid Password"
            })
        }
        if (exisitingUser.isVerified === false) {
            return res.status(400).json({
                success: false,
                message: "Verify your account then login"
            })
        }

        // generate token
        const accessToken = jwt.sign({ id: exisitingUser._id }, process.env.SECRET_KEY, { expiresIn: '10d' })
        const refreshToken = jwt.sign({ id: exisitingUser._id }, process.env.SECRET_KEY, { expiresIn: '30d' })

        exisitingUser.isLogin = true
        await exisitingUser.save()

        // check for exisiting Session and delete it
        const exisitingSession = await Session.findOne({ userId: exisitingUser._id })
        if (exisitingSession) {
            await Session.deleteOne({ userId: exisitingUser._id })
        }

        // Create New Session
        await Session.create({ userId: exisitingUser._id })
        return res.status(200).json({
            success: true,
            message: `welcome back ${exisitingUser.firstName}`,
            user: exisitingUser,
            accessToken,
            refreshToken
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const logout = async (req, res) => {
    try {
        const userId = req.id
        await Session.deleteMany({ userId: userId })
        await User.findByIdAndUpdate(userId, { isLogin: false })
        return res.status(200).json({
            success: true,
            message: "user Logout Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        const otp = Math.floor(100000 + Math.random() * 1000000).toString()
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)   // 10 0mints
        user.otp = otp
        user.otpExpiry = otpExpiry

        await user.save()
        await sendOTPMail(otp, email)

        return res.status(200).json({
            success: true,
            message: "OTP send to email successfully"
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const verifyOTP = async (req, res) => {
    try {
        const { otp } = req.body
        const email = req.params.email
        if (!otp) {
            return res.status(400).json({
                success: false,
                message: "OTP is Required"
            })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User NOt found"
            })
        }
        if (!user.otp || !user.otpExpiry) {
            return res.status(400).json({
                success: false,
                message: "OTP is Not generated or already verified"
            })
        }
        if (user.otpExpiry < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP Expired"
            })
        }
        if (otp !== user.otp) {
            return res.status(400).json({
                success: false,
                message: "OTP invilad"
            })
        }
        user.otp = null
        user.otpExpiry = null
        await user.save()
        return res.status(200).json({
            success: true,
            message: "OTP Varified Successfully"
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const changePassword = async (req, res) => {
    try {
        const { newPassword, conformPassword } = req.body
        const { email } = req.params
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User Not Found"
            })
        }
        if (!newPassword || !conformPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        if (newPassword !== conformPassword) {
            return res.status(400).json({
                success: false,
                message: "Password do not match"
            })
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        await user.save()
        return res.status(201).json({
            success: true,
            message: "Password Change Successfully"
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const allUser = async (req, res) => {
    try {
        const user = await User.find()
        return res.status(200).json({
            success: true,
            user: user
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params
        const user = await User.findById(userId).select("-password -otp -otpExpiry -token")
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user Not found"
            })
        }
        return res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const updateUser = async (req, res) => {
    try {
        const userIdToUpdate = req.params.id    // get ID of the user we want to update
        const loggedInUser = req.user       // get user from isAuthenticated middleware
        const {firstName, lastName, phoneNo, address, city, zipCode, role} = req.body;

        if(loggedInUser._id.toString() !== userIdToUpdate && loggedInUser.role !== 'admin'){
            return res.status(403).json({
                success:false,
                message:"You are not allow to update"
            })
        }

        let user = await User.findById(userIdToUpdate)
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User is Not found"
            })
        }

        let profilePicUrl = user.profilePic;
        let profilePicPublicId = user.profilePicPublicId;

        // if a new file is uploaded
        if(req.file){
            if(profilePicPublicId){
                await  cloudinary.uploader.destroy(profilePicPublicId)
            }

            const uploadResult = await new Promise((resolve, reject) =>{
                const stream = cloudinary.uploader.upload_stream(
                    {folder:"profiles"},
                    (error, result)=> {
                        if(error){
                            reject(error)
                        } else{
                            resolve(result)
                        }
                    }
                )
                stream.end(req.file.buffer)
            })
            profilePicUrl = uploadResult.secure_url;
            profilePicPublicId = uploadResult.public_id
        }

        // update fields
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.address = address || user.address;
        user.zipCode = zipCode || user.zipCode;
        user.phoneNo = phoneNo || user.phoneNo;
        user.city = city || user.city;
        user.role = role;
        user.profilePic = profilePicUrl;
        user.profilePicPublicId = profilePicPublicId;

        const updatedUser = await user.save();
        return res.status(201).json({
            success:true,
            message:"Profile Update Successfull",
            user:updatedUser
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}