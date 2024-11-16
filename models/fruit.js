const mongoose = require('mongoose');

const fruitSchema = new mongoose.Schema({
    name: String,
    isReadyToEat: Boolean,
});

const Fruit = mongoose.model('Fruit', fruitSchema); //creates the model

module.exports = Fruit