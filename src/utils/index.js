require('dotenv').config();

const bcrypt = require('bcrypt');
const constants = require('../config/constants');

const { JWT_SECRET, SUPPORTED_CURRENCIES } = constants;

function sanitizeInput(input) {
    if (typeof input === 'string') {
        return input.replace(/[^a-zA-Z0-9\s\.\-\/\:]/g, '');
    }
    return input;
}

function isValidCurrency(currency) {
    return SUPPORTED_CURRENCIES.includes(currency?.toUpperCase());
}

function isValidDate(dateString) {
    return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
}

async function hashSensitiveData(data) {
    return bcrypt.hash(data, 10);
}

module.exports = {
    JWT_SECRET,
    sanitizeInput,
    isValidCurrency,
    isValidDate,
    hashSensitiveData
};
