const router = require('express').Router();
const Student = require('../models/db');
const multer = require('multer');
const path = require('path');

var myfilename;
var updatefilename;
const options = multer.diskStorage({
    destination : function(req, file, cb) 
    {
        cb(null, './uploads')
    },
    filename : function(req, file, cb)
    {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: options });

router.get('/', (req, res) => {
    res.render('form');
});
router.get('/showdata', (req, res) => {
    Student.find((err, data) => {
        if(err) throw err;
        res.render('show', {data: data});
    });
});
router.get('/delete/:id', (req, res) => {
    Student.findByIdAndDelete(req.params.id, (err, data) => {
        if(err) throw err;
        res.redirect('/showdata');
    });
});
router.get('/update/:id', (req, res) => {
    Student.findById(req.params.id, (err, data) => {
        if(err) throw err;
        res.render('update', {data: data});
    });
});
router.post('/login', (req, res) => {
    Student.findOne({name: req.body.name, password: req.body.password}, (err, res) => {
        if(err) throw err;
        if(res)
        {
            res.send("Valid User");
        }
        else
        {
            res.send("Invalid User");
        }
    });
});
router.post('/edit', upload.single('updatepic'), (req, res) => {
    if(req.body.insert == 'Upload')
    {
        updatefilename = req.file.filename;
        res.send("New File Uploaded...");
    }
    else if(req.body.insert == 'Update')
    {
        var data1 = {
            rno: req.body.rno,
            name: req.body.name,
            age: req.body.age,
            password: req.body.password,
            pic: updatefilename
        }
        var data2 = {
            rno: req.body.rno,
            name: req.body.name,
            age: req.body.age,
            password: req.body.password,
            pic: req.body.pic
        }
        if(!req.body.pic)
        {
            Student.findByIdAndUpdate(req.body.id, data2,(err) => {
                if(err) throw err;
                res.redirect('/showdata');
            });
        }
        else
        {
            Student.findByIdAndUpdate(req.body.id, data1,(err) => {
                if(err) throw err;
                myfilename = "";
                res.redirect('/showdata');
            });
        }
    }
});
router.post('/insert', upload.single('myfile'), (req, res) => {
    if(req.body.insert == 'UPLOAD')
    {
        myfilename = req.file.filename;
        res.send("Uploaded Successfully as " + myfilename);
    }
    else if(req.body.insert == 'INSERT')
    {
        var insert_data = new Student({
            rno: req.body.rno,
            name: req.body.name,
            age: req.body.age,
            password: req.body.password,
            pic: myfilename
        });
        insert_data.save((err, data) => {
            if(err) throw err;
            res.send("Inserted Successfully...");
        });
    }
});

module.exports = router;