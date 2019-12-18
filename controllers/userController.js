const User=require('./../models/userModel');
const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/appError');

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
    // 1 create error if user Post password 
        if(req.body.password || req.body.password_confirm){
            return next(new AppError('This route is not for paasword update. Please use / updateMYpassword',400));
        } 

        //2  filter out unwanted fields name that are not allowed to be update
      const filteredBody= filterObj(req.body,'name','email'); 
      const updatedUser = await User.findByIdAndUpdate( req.user._id, filteredBody,{
          new:true,
          runValidators:true
      });

        //3 update user doucment
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