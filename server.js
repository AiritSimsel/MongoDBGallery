const express = require ('express');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const aggregation = require('aggregation');

mongoose.connect('mongodb://localhost:27017/wishListDB', {useUnifiedTopology: true});

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static('images'));

imageSchema = new mongoose.Schema ({
    imageDescription: String,
    image: String,
    wish: String
});

imageModel = mongoose.model('Image', imageSchema)    // create image out of the imageSchema, andmebaasi tekib automaatselt images

//setting multer
let upload = new multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {   // cb = callback
            cb(null, './images');
        },
        filename: function(req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
        }
    })
});

app.get('/admin', (req, res) => {
    res.render('admin');
});

app.post('/upload', upload.single('userFile'), (req, res) => {     //inputi kasti nimi name="userFile"
    console.log(req.file);

    let newImage = new imageModel();
    newImage.imageDescription = req.body.description;
    newImage.image = req.file.filename;
    newImage.wish = req.body.wish;

    newImage.save((error, document) => {
        if(!error) {
            console.log('file saved');
            res.redirect('/');
        } else {
            console.log(error);
        }
    });
});   

app.get('/', (req, res) => {
    imageModel.find()
    .then(document => {
        console.log(document);
        res.render('index', {item: document});
    });
});

app.get('/random', (req, res) => {
    imageModel.find().then((document) => {
  
      const randomWish = Math.floor(Math.random() * document.length);
      let random_wish = document[randomWish];
  
      console.log(random_wish);
  
      res.render('random', { item: random_wish });    
    });
  });
                    
      
const port = 5000;

app. listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
