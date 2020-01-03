const express =require('express');
const reviewController= require('./../controllers/reviewController');
const authController=require('./../controllers/authController')

const router=express.Router({mergeParams:true});

//POST/tour/1324fade/reviews
//GET/tour/1324fad4/reviews
//POST/review

router.get('/',reviewController.getAllReviews);
router.post('/',authController.protect,authController.restictTo('user'),reviewController.setTourUserId,reviewController.createReviews);
router.delete('/:id',reviewController.deleteReview);
router.patch('/:id',reviewController.updateReview);
router.get('/:id',reviewController.getOneReview);

module.exports=router;