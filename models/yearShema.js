const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Модель для хранения дат рабочих дней
const workDaySchema = new Schema({
    value: {
        type: Number,
        required: true,
    },
});

// Модель для хранения месяцев
const monthSchema = new Schema({
    month: {
        type: Number,
        required: true,
    },
    workDays: [workDaySchema], // Массив дат рабочих дней для каждого месяца
});

// Модель для хранения года
const yearSchema = new Schema({
    name: {
        type: Number,
        required: true,
    },
    months: [monthSchema], // Массив месяцев для каждого года
});

const Year = mongoose.model('Year', yearSchema);

module.exports = Year;