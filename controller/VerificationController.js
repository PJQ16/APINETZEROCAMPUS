const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

app.post('/users/register', async (req, res) => {
    const { fname, sname, email, password, role_id, fac_id } = req.body;

    try {
        // ตรวจสอบอีเมลว่ามีอยู่แล้วหรือไม่
        const existingUser = await UsersModels.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // เข้ารหัสรหัสผ่าน
        const hashedPassword = await bcrypt.hash(password, 10);

        // สร้าง token สำหรับการยืนยันตัวตน
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpiry = Date.now() + 3600000; // 1 ชั่วโมง

        // สร้างผู้ใช้ในฐานข้อมูล
        const newUser = await UsersModels.create({
            fname,
            sname,
            email,
            password: hashedPassword,
            role_id,
            fac_id,
            verificationToken,
            verificationTokenExpiry,
        });

        // สร้างลิงก์ยืนยันตัวตน
        const verificationLink = `http://yourdomain.com/users/verify/${verificationToken}`;

        // ส่งอีเมลยืนยันตัวตน
        await transporter.sendMail({
            to: email,
            subject: 'Verify your email',
            html: `<p>Click <a href="${verificationLink}">here</a> to verify your email address.</p>`,
        });

        res.status(200).json({ message: 'Registration successful, please check your email to verify your account' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = app