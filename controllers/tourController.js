const Tour=require('./../models/tourModel');
const catchAsync=require('./../utils/catchAsync');
 
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
    const tour=await Tour.findById(req.params.id);

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
        runValidators:true
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