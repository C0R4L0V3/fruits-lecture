const dotenv = require('dotenv'); //requires dotenv package
dotenv.config(); // loads the enviroment variables from the .env file
const express = require('express');
const mongoose = require('mongoose') //requires mongoose db
const methodOverride = require('method-override')
const morgan = require('morgan');

const app = express();

const PORT = 3001;

app.get('/', async (req, res) => {
    res.send('Hello!')
});

//connects to the mongoDB using the connection string in the .env file
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`); //.name refrences the DB name   
});

//imports the fruit model
const Fruit = require('./models/fruit.js');

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
// app.use(morgan('dev'));

//landing page
app.get('/', async (req, res) => {
    res.render('index.ejs')
});

//creates all fruit route
app.get('/fruits', async  (req, res) => {
    const allFruits = await Fruit.find();
    res.render('fruits/index.ejs', { 
        fruits: allFruits });
});

//post /fruits 
app.post('/fruits', async (req, res) =>{
    //converts the 'on' value from the checkbos to a boolean value
    if (req.body.isReadyToEat === 'on'){
        req.body.isReadyToEat = true
    }
    else {
        req.body.isReadyToEat = false
    }
    await Fruit.create(req.body)
    res.redirect('/fruits'); //redirects to the fruit index
});

// get  /fruits/new
app.get('/fruits/new', (req, res) => {
    res.render("fruits/new.ejs");
});

//edits the object
app.get('/fruits/:fruitId/edit', async (req, res) => {
    const foundFruit = await Fruit.findById(req.params.fruitId)
    // res.send('edit page')
    res.render('fruits/edit.ejs', {
        fruit:foundFruit,
    })
})

//route to update the object
app.put('/fruits/:fruitId', async (req, res) => {
    if (req.body.isReadyToEat === 'on'){
        req.body.isReadyToEat = true
    }
    else {
        req.body.isReadyToEat = false
    }

    //looks up id, then updates object body
    await Fruit.findByIdAndUpdate(req.params.fruitId, req.body)
    // res.send('update')
    // res.send(req.body)
    res.redirect('/fruits')

})

//deletes the object and redirects to the fruits index
app.delete('/fruits/:fruitId', async (req, res) => {
    await Fruit.findByIdAndDelete(req.params.fruitId)
    // res.send(req.params.fruit)
    res.redirect('/fruits')
})

//creates fruit show route
app.get('/fruits/:fruitId', async (req, res) => {
    const foundFruit = await Fruit.findById(req.params.fruitId)
    // res.send(
    //     `This route renders a fruit show page for ${foundFruit}`
    // )
    res.render('fruits/show.ejs', {
        fruit:foundFruit,
        })
});























app.listen(PORT, () =>{
    console.log('Listening on PORT 3001');
});