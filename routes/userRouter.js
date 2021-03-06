const express=require('express');

const authController=require('./../controllers/authController')
const userController=require('./../controllers/userController');



const router=express.Router();

router.post('/signup',authController.signup);
router.post('/signin',authController.signin);

router.post('/forgotPassword',authController.forgotPassword);
router.patch('/resetPassword/:token',authController.resetPassword);
router.patch('/updateMYpassword',authController.protect,authController.updatePassword);
              
router.route('/').get(authController.protect,authController.restictTo('admin'),userController.getalluser);
router.get('/me',authController.protect,userController.getMe,userController.getUser);
router.patch('/updateMe',authController.protect,userController.uploadUserPhoto,userController.resizeUserPhoto,userController.updateMe);
router.delete('/deleteMe',authController.protect,userController.deleteMe);
router.delete('/:id',userController.deleteUser);
router.get('/:id',userController.getUser);






module.exports=router;