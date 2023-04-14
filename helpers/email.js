import Mailjet from 'node-mailjet';

// Register email
const registerEmail = (data) => {
    // Connect with mailjet by api keys
    const mailjet = Mailjet.apiConnect(process.env.MAIL_KEY, process.env.MAIL_SKEY);
    const {name, email, token} = data;

    // Email config
    const request = mailjet
        .post('send', {version: 'v3.1'})
        .request({
            "Messages": [
                {
                    "From": {
                        "Email": 'adriangpe5666@gmail.com',
                        "Name": 'Truck Management'
                    },
                    "To": [
                        {
                            "Email": `${email}`,
                            "Name": `${name}`
                        }
                    ],
                    "Variables": {
                        "name": `${name}`,
                        "url": `${process.env.BACKEND_URL}/auth/confirm/${token}`
                    },
                    "TemplateID": 4578601,
                    "TemplateLanguage": true
                }
            ]
        });

        // Send email validation
        request
            .then(response => console.log(response.body))
            .catch(err => console.log(err.statusCode));
}

// Change password email
const resetPasswordEmail = (data) => {
    // Connect with mailjet by api keys
    const mailjet = Mailjet.apiConnect(process.env.MAIL_KEY, process.env.MAIL_SKEY);
    const {name, email, token} = data;

    // Email config
    const request = mailjet
        .post('send', {version: 'v3.1'})
        .request({
            "Messages": [
                {
                    "From": {
                        "Email": 'adriangpe5666@gmail.com',
                        "Name": 'Truck Management'
                    },
                    "To": [
                        {
                            "Email": `${email}`,
                            "Name": `${name}`
                        }
                    ],
                    "Variables": {
                        "name": `${name}`,
                        "url": `${process.env.BACKEND_URL}/auth/forgot-password/${token}`
                    },
                    "TemplateID": 4581243,
                    "TemplateLanguage": true
                }
            ]
        });

        // Send email validation
        request
            .then(response => console.log(response.body))
            .catch(err => console.log(err.statusCode));
}

export {
    registerEmail,
    resetPasswordEmail
}