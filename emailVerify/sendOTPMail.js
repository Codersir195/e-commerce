import nodemailer from 'nodemailer'
import 'dotenv/config'

export const sendOTPMail = async (otp, email) => {
    const transportar = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    const mailConfigurations = {
        from: process.env.MAIL_USER,
        to: email,
        subject:'Password Reset OTP',

        html:`<p>Your OTP for password reset is :<b>${otp}</b></p>`
    };

    try{
        const info = await transportar.sendMail(mailConfigurations);
        console.log("OTP send Successfully");
        console.log(info);
    } catch(error) {
        console.log("OTP Sending faild :",error)
        throw error
    }
}