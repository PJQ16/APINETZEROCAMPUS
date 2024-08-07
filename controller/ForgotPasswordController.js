const express = require('express');
const crypto = require('crypto'); // เพิ่มการนำเข้า crypto
const bcrypt = require('bcrypt'); // เพิ่มการนำเข้า bcrypt
const nodemailer = require('nodemailer');
const { UsersModels } = require('../models/userModel');
const { Op } = require('sequelize');

const app = express();
app.use(express.json()); // เพิ่มการใช้ express.json() เพื่อให้สามารถรับข้อมูลจาก req.body ได้

app.post('/api/check-email', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await UsersModels.findOne({ where: { email } });
        if (user) {
            return res.status(200).json({ exists: true });
        } else {
            return res.status(200).json({ exists: false });
        }
    } catch (error) {
        console.error('Error checking email:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/forgot-password', async (req, res) => {
    const { email } = req.body;
  
    try {
        const user = await UsersModels.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
  
        const token = crypto.randomBytes(20).toString('hex');
        const expiry = Date.now() + 3600000; // 1 ชั่วโมง
  
        await user.update({
            verificationToken: token,
            verificationTokenExpiry: expiry,
        });
  
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'your-email@gmail.com',
                pass: 'your-email-password',
            },
        });
  
        const mailOptions = {
            to: email,
            from: 'your-email@gmail.com',
            subject: 'Password Reset',
            text: `You are receiving this email because you (or someone else) has requested a password reset. Please click on the following link, or paste it into your browser to complete the process: \n\n http://${req.headers.host}/reset-password/${token} \n\n If you did not request this, please ignore this email and your password will remain unchanged.`,
        };
  
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Password reset link sent to your email' });
    } catch (error) {
        console.error('Error handling forgot password request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
  
    try {
        const user = await UsersModels.findOne({
            where: {
                verificationToken: token,
                verificationTokenExpiry: {
                    [Op.gt]: Date.now()
                }
            }
        });
  
        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
        }
  
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({
            password: hashedPassword,
            verificationToken: null,
            verificationTokenExpiry: null,
        });
  
        res.status(200).json({ message: 'Password has been reset' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = app;
