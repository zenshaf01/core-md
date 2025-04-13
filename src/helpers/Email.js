import FormData from 'form-data';
import Mailgun from 'mailgun.js';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';

let mailgun = null;
let client = null;
let domain = null;

export const initializeEmailService = () => {
    if (!process.env.MAILGUN_API_KEY) {
        throw new Error('MAILGUN_API_KEY is not defined in environment variables.');
    }
    if (!process.env.MAILGUN_DOMAIN) {
        throw new Error('MAILGUN_DOMAIN is not defined in environment variables.');
    }

    mailgun = new Mailgun(FormData);
    client = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });
    domain = process.env.MAILGUN_DOMAIN;

    console.log('Mailgun client initialized successfully.');
}

export const sendEmail = async (to, subject, templateName, context) => {
    if (!client) {
        throw new Error('Email service is not initialized. Call initializeEmailService() first.');
    }
    if (!to || !subject || !templateName) {
        throw new Error('Missing required parameters: to, subject, templateName');
    }

    try {
        //Load and compile the handlebars template
        const templatePath = path.join(import.meta.dirname, '../', 'templates', `${templateName}.hbs`);
        const templateSource = fs.readFileSync(templatePath, 'utf8');
        const template = Handlebars.compile(templateSource);

        const html = template(context);
        const response = await client.messages.create(domain, {
            from: `Core MD <mailgun@${domain}>`,
            to,
            subject,
            html,
        });
        return response;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}


