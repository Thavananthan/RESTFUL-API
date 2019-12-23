const multer=require('multer');
const sharp=require('sharp');
const Tour=require('./../models/tourModel');
const catchAsync=require('./../utils/catchAsync');


const multerStorage=multer.memoryStorage(); 

const multerFilter =(req,file,cb) =>{
    if(file.mimetype.startsWith('image')){
        cb(null,true);
    }else{
        cb(new AppError('Not an image! Please upload only images!',400),false);
    }
}


const upload=multer({
    storage:multerStorage,
    fileFilter:multerFilter
});

exports.uploadTourImages= upload.fields([
    {name:'imageCover',maxCount:1},
    {name:'images',maxCount:3}
]);

exports.resizeTourImages= catchAsync(async(req,res,next) => {
    if(!req.files.imageCover || !req.files.images) return next();
    console.log( await req.body.imageCover);

    //1) Cover Image
      req.body.imageCover=`tour-${req.params.id}-${Date.now()}-cober.jpeg`;
      
    await sharp(req.files.imageCover[0].buffer)
     .resize(2000,1333)
     .toFormat('jpeg')
     .jpeg({quality:90})
     .toFile(`public/images/tours/${req.body.imageCover}`);
    
     
     next();
});
 
exports.createTour = catchAsync(async(req, res) => {
 const newTour=  await Tour.create(req.body);

    res.status(201).json({
        status:'success',
        date:{
            tour:newTour
        }
    });
});

exports.getAllTours= catchAsync( async(req, res) =>{
   //BUILD QUERY
   //1) Filtering
   const queryObj={...req.query};
   const excludedFields=['page','sort','limit','fields'];
   excludedFields.forEach(el => delete queryObj[el]);


   //Advanced filtering
//    let quertStr=JSON.stringify(queryObj);
//    quertStr=quertStr.replace(/\b(gte||gt||lte||lt)\b/g, match =>`$${match}`);
  
    //console.log(req.query,queryObj);
    let query = Tour.find(queryObj);

    //2) Sorting
    if(req.query.sort){
        const sortBy=req.query.sort.split(',').join(' ');
        query=query.sort(sortBy);
    }else{
        query=query.sort('-createAt');
    }

    const tours=  await query;
   

   res.status(200).json({
        status:'success',
        results:tours.length,
        data:{
            tours
        }
   })

});

exports.getTour=catchAsync( async(req, res) =>{
    const tour=await Tour.findById(req.params.id).populate('reviews');

    res.status(200).json({
        status:'success',
        data:{
            tour
        }
    });
});

exports.updateTour= catchAsync(async(req,res) =>{
    const tour= await Tour.findByIdAndUpdate(req.params.id, req.body,{
        new:true,
        runValidators: true
    }); 

    res.status(200).json({
        status:'success',
        data:{
            tour:tour
        }
    });
});

exports.deleteTour= catchAsync( async(req, res)=>{
    await Tour.findByIdAndDelete(req.params.id);

       res.json({
           status:'success',
           data:null
       });
});