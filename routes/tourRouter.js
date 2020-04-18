const express=require('express');
const tourController=require('./../controllers/tourController'); 
const reviewRouter=require('./../routes/reviewRoutes');
const authController=require('./../controllers/authController');
const router=express.Router();


//POST/tour/1324fade/reviews
//GET/tour/1324fad4/reviews
//GET/tour/1324fad4/reviews/94887fda

// router.post('/:tourId/reviews',authController.protect,
//             authController.restictTo('user'),
//             reviewController.createReviews
//             ); 

router.use('/:tourId/reviews',reviewRouter); 

router.get('/',tourController.getAllTours); 
router.get('/:id',tourController.getTour);
router.post('/addTour',tourController.uploadTourImages,tourController.resizeTourImages,tourController.createTour);
router.patch('/updateTour/:id',tourController.uploadTourImages,tourController.resizeTourImages,tourController.updateTour);
router.delete('/deleteTour/:id',tourController.deleteTour);





module.exports=router;