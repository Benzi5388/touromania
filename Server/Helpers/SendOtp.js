import nodemailer from 'nodemailer';

import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

 export function sentOTP(email, otp){
  console.log(email, otp, "helpers");
    return new Promise((resolve, reject)=>{
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              user: process.env.EMAIL,
              pass: process.env.PASSWORD,
            },
          });
      
            var mailOptions={
              from: process.env.EMAIL,
              to: email,
              subject: "Touropedia Email verification",
              html: `
              <h1>Verify Your Email For Touropedia</h1>
                <h3>use this code to verify your email</h3>
                <h2>${otp}</h2>
              `,
            }       
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                reject(error)
              } else {
                resolve({success:true, message:"Email sent successfull"})
              }
            });
    })
}
