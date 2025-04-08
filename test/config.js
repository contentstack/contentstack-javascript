'use strict';
require('dotenv').config();

const requiredVars = ['HOST', 'EMAIL', 'PASSWORD', 'ORGANIZATION', 'API_KEY'];
const missingVars = requiredVars.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
    const errorMessage = `\x1b[31mError: Missing environment variables - ${missingVars.join(', ')}`;
    const error = new Error(errorMessage);
    error.stack = error.message;
    throw error;
}

module.exports = {
    stack: { 'api_key': process.env.API_KEY, 'delivery_token': process.env.DELIVERY_TOKEN, 'environment': process.env.ENVIRONMENT,  },
    host: process.env.HOST,
    contentTypes: {
        source: "source",
        numbers_content_type: "numbers_content_type"
    },
}