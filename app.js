const express=require('express');
const morgan=require('morgan');
const helmet=require('helmet');
const hpp=require('hpp');
const bodyParser = require('body-parser');
const mongoSanitize=require('express-mongo-sanitize');
const xss=require('xss-clean');
const rateLimit=require('express-rate-limit');
const compression=require('compression');
const cors = require('cors');

const userRouter=require('./routes/userRouter');
const tourRouter=require('./routes/tourRouter');
const AppError=require('./utils/appError');
const golobalErrorController=require('./controllers/errorController');
const reviewRouter=require('./routes/reviewRoutes');


const app=express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//Global Middelware
   // set security HTTP headers
   app.use(helmet());

   app.use(cors());
   //Development logging
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
}

//Limit requsets from same API
const limiter=rateLimit({
    max:1000,
    windowMs:60 *60 *1000,
    message:'Too many requests from this IP,please try again in an hour!'
});


app.all((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','*');

    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT','POST','PATCH','DELETE','GET');
        return res.status(200).json({});
    }

    next();

});


app.use('/api',limiter);

//Body parser, reading data from body into req.body
app.use(express.json())

//Data sanitization against NoSQL query Injection
app.use(mongoSanitize());

//Data sanitization againts XSS
app.use(xss());

//Prevent parameter pollution
app.use(hpp());

//Serving static files
app.use(express.static(`${__dirname}/public`));

app.use(compression());

//Test middleware 
app.use((req,res,next)=>{
  req.requestTime=new Date().toISOString();
  //console.log(req.headers); 
  next();
})


//ROUTERS
app.use('/api/slvist/user',userRouter);
app.use('/api/slvist/tour',tourRouter);
app.use('/api/slvist/reviews', reviewRouter);

app.get('/',(req,res)=>{
    res.status(200).json({ Message:'Hello from server side!'});
})

app.post('/',(req,res)=>{
    res.status(200).send('you can post something!')
})

app.all('*',(req,res,next)=>{
    
    next(new AppError(`i can't find ${req.originalUrl} on this server`,404));
})

app.use(golobalErrorController)



module.exports=app;