'use strict';
module.exports = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // upgrade later with STARTTLS
    auth: {
        user: 'your_gmail_username',
        pass: 'your_gmail_password'
    }
};