'use strict';
require('dotenv').config()

module.exports = {
    stack: { 'api_key': process.env.API_KEY, 'delivery_token': process.env.DELIVERY_TOKEN, 'environment': process.env.ENVIRONMENT,  },
    host: process.env.HOST,
    contentTypes: {
        source: "source",
        numbers_content_type: "numbers_content_type"
    },
}