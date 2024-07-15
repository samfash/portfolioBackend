
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const googleAppPassword = process.env.CLIENT_PASS

app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'samuelfasanya351@gmail.com',
        pass: googleAppPassword,
    },
});

app.post('/send', (req, res) => {
    const { name, email,phone, message } = req.body;

    const mailOptions = {
        from: email,
        to: 'samuelfasanya351@gmail.com',
        subject: 'Customer Form Submission',
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.status(200).send('Message sent successfully!');
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
