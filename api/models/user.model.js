import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  username:{
    type:String,
    required:true,
    unique:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true,
  },
  img:{
    type:String,//store url
    required:false,
  },
  country:{
    type:String,
    required:true,
  },
  nationality:{
    type:String,
    required:false,
  },
  phone:{
    type:String,
    required:false,
  },
  desc:{
    type:String,
    required:false,
  },
  fullName:{
    type:String,
    required:false,
  },
  bio:{
    type:String,
    required:false,
    maxlength: 1000,
  },
  education:{
    type:[new Schema({
      institution: { type:String, required:true },
      qualification: { type:String, required:true },
      grade: { type:String, required:false },
      start: { type:String, required:false },
      end: { type:String, required:false },
      location: { type:String, required:false },
    }, { _id:false })],
    required:false,
    default:[],
  },
  social:{
    type: new Schema({
      linkedin: { type:String, required:false },
      twitter: { type:String, required:false },
      github: { type:String, required:false },
      website: { type:String, required:false },
    }, { _id: false }),
    required:false,
    default:{}
  },
  hobbies:{
    type:[String],
    required:false,
    default:[],
  },
  experience:{
    type:[String],
    required:false,
    default:[],
  },
  certifications:{
    type:[new Schema({
      title: { type:String, required:true },
      issuer: { type:String, required:false },
      url: { type:String, required:false },
      issuedOn: { type:String, required:false },
      credentialId: { type:String, required:false },
    }, { _id:false })],
    required:false,
    default:[],
  },
  isSeller:{
    type:Boolean,
    default:false,
    required:true,
  },
  verified:{
    type:Boolean,
    default:false,
  },
},{
timestamps:true
});

export default mongoose.model("user",userSchema)