
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose")


// mongoose.connect("mongodb://localhost:27017/customerDB")


const app = express();
const PORT = process.env.PORT || 5000;
const googleAppPassword = process.env.CLIENT_PASS
const mongodbPassword = process.env.DB_PASSWORD

mongoose.connect(`mongodb+srv://fasanyasamuel36:${mongodbPassword}@cluster0.ytolgtv.mongodb.net/customerDB`)


app.use(cors());
app.use(bodyParser.json());


postSchema = new mongoose.Schema({
    customer_name: { type: String},
    mailingAddress: { type: String, required: true, unique: true },
    phone_no: { type: String},
    messages: [{type: String}]
});

const Post =  mongoose.model("Post", postSchema)


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'samuelfasanya351@gmail.com',
        pass: googleAppPassword,
    },
});

 app.post('/send', (req, res) => {
    const { name, email,phone, message } = req.body;

     try {
        Post.findOneAndUpdate(
            {mailingAddress: email },
            {$set: { customer_name: name, phone_no: phone },
             $push: { messages: message } },
            { new: true, upsert: true }
        ).then((err)=>{
            if(err !== null){
                // res.status(200).send('Message inserted successfully!');
                console.log("the message was successfully stored")

            }
        })

    } catch (error) {
        console.error(error);
    }

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
