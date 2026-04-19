const nodemailer = require("nodemailer");

const sendMail = async (options) => {
    // Support both SMPT_* and SMTP_* env var spellings
    const host = process.env.SMTP_HOST || process.env.SMPT_HOST;
    const port = parseInt(process.env.SMTP_PORT || process.env.SMPT_PORT || "465", 10);
    const service = process.env.SMTP_SERVICE || process.env.SMPT_SERVICE || process.env.SMPT_SERVICE;
    const user = process.env.SMTP_MAIL || process.env.SMPT_MAIL;
    const pass = process.env.SMTP_PASSWORD || process.env.SMPT_PASSWORD;

    const transporterConfig = {
        host: host,
        port: port,
        secure: port === 465,
        auth: user && pass ? { user, pass } : undefined,
    };

    // If a named service was provided, prefer it (nodemailer will set appropriate host/port)
    if (service) transporterConfig.service = service;

    const transporter = nodemailer.createTransport(transporterConfig);

    const mailOptions = {
        from: user || "no-reply@example.com",
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendMail;