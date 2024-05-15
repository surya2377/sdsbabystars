const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejs = require('ejs');
const path = require('path');
const ejsMate = require('ejs-mate');
const adminModel = require('./models/adminModel.js');
const galleryModel = require('./models/gallery.js');
const contactModel = require('./models/contact.js');
const helmet = require('helmet');
const fs = require('fs');
require('dotenv').config();
// const {upload, uploadMultiple} = require('./middleware/multer.js');
// const {getStorage, ref, uploadBytesResumable} = require("firebase/storage")
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'images');
    },
    filename: function (req, file, cb){
        console.log(file);
        cb(null, Date.now() +  path.extname(file.originalname));
    }
})
const upload = multer({storage: storage});

// mongoose.connect(process.env.db_url)
// const db = mongoose.connection;
// db.on("error",console.error.bind(console,'connection error:'));
// db.once("open",()=>{
//     console.log("Database Connected");
// })

mongoose.connect('mongodb+srv://sdsbabystar:sdsbabystar@cluster0.egs5eae.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(()=>console.log("Database Connected"))
    .catch((err)=>console.log("Error occured in Database", err))

    app.engine('ejs',ejsMate);
    app.set('view engine','ejs');
    app.set('views',path.join(__dirname, 'views'))
    app.use(express.urlencoded({extended: true}));
    app.use(express.static(path.join(__dirname,'public')));

    app.use(express.json());

    app.use(helmet({
        referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
    }));

    app.get("/",(req,res) =>{
        res.render('index');
    })

    app.post("/login", async (req, res) => {
        const { name, password } = req.body;
        
        try {
            const user = await adminModel.findOne({ name });
    
            if (!user) {
                return res.status(400).send({
                    success: false,
                    message: "User not found",
                });
            }
    
            if (user.password !== password) {
                res.render('incorrect');
                return res.status(400).send({
                    success: false,
                    message: "Incorrect password",
                });
            }
            const data = await contactModel.find();
            res.render("admin", {data});
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send({
                success: false,
                message: "Internal server error",
            });
        }
    });

app.post('/upload', upload.single('photo'), async(req,res)=>{
    const saveImage = new galleryModel({
        image:{
            data: fs.readFileSync('images/',req.file.filename),
            contentType:'image/png'
        }
    })
    saveImage.save()
     .then((res)=>console.log('image is saved'))
     .catch((err)=>console.log(err));
})

app.post('/contact' ,async(req,res)=>{
    const contact = new contactModel(req.body);
    contact.save();
    res.send('form submitted successfully, we will respond you soon through email');
})

app.post('/delete', async (req, res) => {
    try {
        const id = req.body.id;
        await contactModel.findByIdAndDelete(id);
        const data = await contactModel.find();
        res.render('admin', {data});
    } catch (err) {
        res.status(500).send(err);
    }
});

app.listen(8080, ()=>{
    console.log("Server Running");
})