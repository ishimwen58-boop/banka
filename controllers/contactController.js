const nodemailer = require('nodemailer');

exports.sendContactEmail = async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }

    try {
        // Create transporter (using the same credentials as auth)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email options
        const mailOptions = {
            from: email, // Sender's email (or your app's email with Reply-To)
            to: process.env.EMAIL_USER, // Send to the admin/support email
            replyTo: email,
            subject: `Contact Form: ${subject}`,
            text: `
                You have received a new message from the Banka Contact Form.
                
                Name: ${name}
                Email: ${email}
                Subject: ${subject}
                
                Message:
                ${message}
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Contact email error:', error);
        res.status(500).json({ message: 'Failed to send message' });
    }
};
