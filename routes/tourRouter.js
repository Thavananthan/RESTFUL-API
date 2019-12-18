const express=require('express');
const tourController=require('./../controllers/tourController'); 

const router=express.Router();

router.get('/',tourController.getAllTours); 
router.get('/:id',tourController.getTour);
router.post('/addTour',tourController.createTour);
router.patch('/updateTour/:id',tourController.updateTour);
router.delete('/deleteTour/:id',tourController.deleteTour);

module.exports=router;