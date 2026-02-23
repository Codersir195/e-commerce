import nodemailer from 'nodemailer'
import 'dotenv/config'

export const verifyEmail = async (token, email) => {
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
        subject:'Email Varification',

        text:`Hi! There, You have recently visited 
        our website and entered your email
        please follow the given link to verify your email
        http://localhost:5173/verify/${token}
        Thanks`
    };

    try{
        const info = await transportar.sendMail(mailConfigurations);
        console.log("Email send Successfully");
        console.log(info);
    } catch(error) {
        console.log("Email Sending faild :",error)
        throw error
    }
}
