import { transporter } from "../config/email.config";

class EmailService {
    async sendEmail() {
        const mailOptions = {
            from: '"Example Team" <example@example.com>',
            to: "chiragvaviya98@gmail.com",
            subject: "Test Email",
            html: "<h1>Hello World</h1>"
        };
        
        await transporter.sendMail(mailOptions);
    }
}

export default new EmailService();