'use strict';
require('dotenv').config()

const requiredVars = ['API_KEY', 'DELIVERY_TOKEN', 'ENVIRONMENT', 'HOST'];
const missingVars = requiredVars.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
    const errorMessage = `\x1b[31mError: Missing environment variables - ${missingVars.join(', ')}`;
    
    if (process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined) {
        throw new Error(errorMessage);
    } else {
        console.error(errorMessage);
        process.exit(1);
    }
}

module.exports = {
    stack: { 'api_key': process.env.API_KEY, 'delivery_token': process.env.DELIVERY_TOKEN, 'environment': process.env.ENVIRONMENT,  },
    host: process.env.HOST,
    contentTypes: {
        source: "source",
        numbers_content_type: "numbers_content_type"
    },
}