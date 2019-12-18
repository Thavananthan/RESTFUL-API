const mongooes=require('mongoose');
const validator=require('validator');
const slugify=require('slugify');

const tourSchema= new mongooes.Schema({
    name:{
        type:String,
        required:[true,'A tour must have a name'],
        unique:true,
        trim:true,
        maxlength:[30,'A tour name must have less or equal then 40 characters'],
        minlength:[10,'A tour name must have more or equal then 10 characters'],
        

    },
    slug:String,
    province:{
       type:String,
       required:[true,'A tour must have a province']
    },
    district:{
      type:String,
      required:[true,'A tour must have a district']
    },
    tourType:{
        type:String,
        required:[true,'A tour must have a places type']
    },
    ratingAverage:{
        type:Number,
        default:4.5,
        min:[1,'Rating must be above 1.0'],
        max:[5,'Rating must be below 5.0'],
    },
    ratingsQuantity:{
        type:Number,
        default:0
    },
    summary:{
        type:String,
        trim:true, 
        required:[true,'A tour have a description']
    },
    description:{
        type:String,
        trim:true
    },
    imageCover:{
        type:String,
        required:[true,'A tour have a image cover']
    },
    images:[String],
    createAt:{
       type:Date,
       default:Date.now()
    },
    startDates:[Date],
    // startLocation:{
    //     //GeoJson
    //     type:{
    //         type:String,
    //         default:'Point',
    //         enum:['Point']
    //     },
    //     coordinates:[Number],
    //     address:String,
    //     description:String 
    // },
    //  locations:[
    //      {
    //          type:{
    //              type:String,
    //              default:'Point',
    //              enum:['Point']
    //          },
    //          coordinates:[Number],
    //          address:String,
    //          description:String,
    //          day:Number
    //      }
    //  ]


});

//DOCUMENT MIDDLEWARE:runs before.save() and create()
tourSchema.pre('save',function(next){
    this.slug=slugify(this.name,{lower:true});
    next();
})

const Tour =mongooes.model('Tour',tourSchema);
module.exports=Tour;