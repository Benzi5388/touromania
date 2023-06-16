import nodemailer from 'nodemailer';


 export function sentOTP(email, otp){
  console.log(email, otp);
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
                console.log("hhhhhhhh");

              } else {
                resolve({success:true, message:"Email sent successfull"})
                console.log("gggggggggg");
              }
            });
    })
}
