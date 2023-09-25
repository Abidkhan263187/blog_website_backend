const {Router}=require('express')
const jwt = require('jsonwebtoken');
const { tourismUsers } = require('../models/tourismModel');
const nodemailer = require('nodemailer');
const forgotPass=Router()
const bcrypt = require('bcrypt');
forgotPass.get('/forgot',(req,res)=>{
    res.send("hi from password")
})

forgotPass.post('/forgot', async (req, res) => {
    try {
        const { email } = req.body;                         
        const user = await tourismUsers.findOne({ email });
        if (user) {
            console.log("found,user", user);
            const token = jwt.sign({ userId: user._id }, "fari");
            const data = await tourismUsers.updateOne({ email: email }, { $set: { token: token } });
            sendResetPasswordMail(email, token)  // here email is the gmail where you got reset link
            res.status(200).json({ message: 'Password reset email sent, please check your mail',token:token });

        } else {
            return res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> reset mail function  >>>>>>>>>>>>>>>>>>>>>>>>
const sendResetPasswordMail = async (email, token) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: false,

            auth: {
                user: 'nkanko8@gmail.com',
                pass: 'nhgklvkctjrzwxmb',
            },
        });

        const mailOptions = {
            from: 'nkanko8@gmail.com',
            to: email,
            subject: 'Email reset Password',
            html:
                '<p>Please copy following link to reset your email password:</p>' +
                '<a href="http://localhost:3000/resetPassword"> click here </a>'
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log('Error in sending email  ' + error);
                return true;
            } else {
                console.log('Email sent: ' + info.response);
                return false;
            }
        });
    } catch (error) {
        console.log(error)
        res.status(404).json({ message: "Error" })
    }
}




forgotPass.post('/reset', async (req, res) => {
    try {
        const { token } = req.query;
        console.log("token =>", token)
        if(token !== ""){
            const user = await tourismUsers.findOne({ token: token });
            const { password,confirmPassword } = req.body;
            if (user) {
                console.log("user mila");
             
                console.log(password)
                // const hash = bcrypt.hashSync(password, 8);
                console.log("hashpass")
                const updatedData = await tourismUsers.findByIdAndUpdate(
                    { _id: user._id },
                    { $set: { password: password,confirmPassword:confirmPassword, token: '' } },
                    { new: true }
                );
                console.log(updatedData)
                res.status(200).json({ mssg: "Password reset successfully", data: updatedData });
            }
        } else {
            console.log("user nhi mila");
            res.status(200).json({ mssg: "this link has been expired" });
        }
       
       
    } catch (error) {
        res.status(404).json({ mssg: "error while resetting", error });
    }
});


module.exports ={forgotPass}