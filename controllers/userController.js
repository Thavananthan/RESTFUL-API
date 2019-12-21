const multer=require('multer');
const User=require('./../models/userModel');
const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/appError');

const  multerStorage =multer.diskStorage({
    destination:(req,file,cb) =>{
        cb(null,'public/images/users');
    },
    filename:(req,file,cb) =>{
        const ext=file.mimetype.split('/')[1];
        cb(null,`user-${req.user.id}-${Date.now()}.${ext}`);
    }
});

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

exports.uploadUserPhoto=upload.single('photo');

exports.resizeUserPhoto=(req,res,next) => {
    if(!req.file) return next();

}

const filterObj=(obj,...allowedFields)=>{
  const newObj={};
    Object.keys(obj).forEach(el=>{
        if(allowedFields.includes(el)) newObj[el]=obj[el];
    });
    return newObj;
}

exports.getalluser = catchAsync(async(req,res,next)=>{
    const users= await User.find();

    res.status(200).json({
        status:'success',
        result:users.length,
        data:{
           users
        }
        
    })
});

exports.updateMe =catchAsync(async(req,res,next)=>{

    console.log(req.file);
    console.log(req.body);
    
    
    // 1 create error if user Post password 
        if(req.body.password || req.body.password_confirm){
            return next(new AppError('This route is not for paasword update. Please use / updateMYpassword',400));
        } 

        //2  filter out unwanted fields name that are not allowed to be update
      const filteredBody= filterObj(req.body,'name','email'); 
      if(req.file) filteredBody.photo=req.file.filename;
    
       //3 update user doucment
      const updatedUser = await User.findByIdAndUpdate( req.user._id, filteredBody,{
          new:true,
          runValidators:true
      });

       
        res.status(200).json({
          status:'success',
            data:{
                user:updatedUser
            }
    })

});

// not deleting user from database only non access../ 
exports.deleteMe= catchAsync( async(req,res,next)=>{
        await User.findByIdAndUpdate(req.user.id,{active:false});

        res.status(204).json({
            status:'success',
            data:null
        });
});