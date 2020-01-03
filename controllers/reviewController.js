const Review = require('./../models/reviewModel');
const catchAsync=require('./../utils/catchAsync');
const factory =require('./handlerFactory');


exports.getAllReviews = catchAsync( async (req, res, next ) => {
    let filter={};
    if(req.params.tourId) filter ={tour:req.params.tourId};
    
    const reviews= await Review.find(filter);

    res.status(200).json({
        status:'success',
        results:reviews.length,
        data:{
            reviews
        }
    });
});


//allowed the nested route
exports.setTourUserId = catchAsync(async(req,res,next) =>{
    if(!req.body.tour) req.body.tour=req.params.tourId;
    if(!req.body.user) req.body.user=req.user.id;
    next();
});

exports.createReviews = factory.createOne(Review);
exports.getOneReview= factory.getOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
