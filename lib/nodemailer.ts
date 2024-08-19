const nodemailer = require("nodemailer");

// export const transporter = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     auth: {
//         user: 'nola.hegmann@ethereal.email',
//         pass: 'reTPGjr8XpdgtT6f2x'
//     },
// });



export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // Your App Password
    },
});

console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS)