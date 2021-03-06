const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');




const uri = "mongodb://127.0.0.1:27017/test"
const atlasUrl = "mongodb+srv://tenx:10xxggwp@cluster0-rbzdx.mongodb.net/fcmdb?retryWrites=true"

mongoose.connect(atlasUrl,{
    useNewUrlParser: true
}, err=>{
    console.log(err);
});






const tokenRoute = require('./routes/api/fcm');


app.use(morgan('dev'));
app.use(bodyparser.urlencoded({extended : false}));
app.use(bodyparser.json());
app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method == 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});


app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');


//set up the start page
app.get('/',(req, res)=>
{
    res.render('index');
});
app.use('/fcm', tokenRoute);





//catch invalid addresss
app.use((req, res, next)=> {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});


//catch all error
app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error : {
            message: error.message
        }
    })
})


module.exports = app;