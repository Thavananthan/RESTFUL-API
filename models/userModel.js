const crypto=require('crypto');
const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please tell us your name ']
    },
    email:{
        type:String,
        required:[true,'Please provide your mail'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'Please provide valid email'],
    },
    photo:String,
    role:{
        type:String,
        enum:['user','guide','admin'],
        default:'user'
    },
    password:{
        type:String,
        required:[true,'Please provide a password'],
        minlength:8,
        select:false
    },
    password_confirm:{
        type:String,
        required:[true,'Please confirm your password'],
        validate:{
            //this only work on create and save
            validator:function(el){
                return el=== this.password;
            },
            message:'Password are not the same!'
        }
    },

    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetExpires:Date,
    active:{
        type:Boolean,
        default:true,
        select:false,
    }

});

userSchema.pre('save', async function(next){
    //Only run this function if password was actually modified
    if(!this.isModified('password')) return next();

    //hash the password with cost of 12
    this.password= await bcrypt.hash(this.password,12);

    //Delete password_confrim
    this.password_confirm=undefined;
});

userSchema.pre('save', function(next){
    if(!this.isModified('password')||this.isNew) return next();

    this.passwordChangedAt=Date.now() - 1000;
    next();
});   

userSchema.pre(/^find/, function(next){
    //this points to the current query
    this.find({active:{ $ne:false}});
    next();
});
userSchema.methods.correctPassword = async function(
    candidatePassword,
    userPassword
){
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter= function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimestamp= parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );

        return JWTTimestamp < changedTimestamp;
    }
    return false;
}


userSchema.methods.createPasswordResetToken= function(){
    const restToken=crypto.randomBytes(32).toString('hex');
    
    this.passwordResetToken= crypto
         .createHash('sha256')
         .update(restToken)
         .digest('hex');
     console.log({restToken},this.passwordResetToken);

    this.passwordResetExpires= Date.now() + 10 * 60 * 1000;
    return restToken;    
};

const User=mongoose.model('User',userSchema);
module.exports=User;
  
 