import mongoose from 'mongoose';
const { Schema } = mongoose;

const GigSchema = new Schema({
  userId:{
    type:String,
    require:true
  },
  title:{
    type:String,
    require:true
  },
  desc:{
    type:String,
    require:true
  },
  totalStars:{
    type:Number,
    default:0
  },
  starNumber:{
    type:Number,
    default:0
  },
  cat:{
    type:String,
    require:true
  },
  priceMin:{
    type:Number,
    require:true
  },
  priceMax:{
    type:Number,
    require:true
  },
  status:{
    type:String,
    enum: ['available', 'in_progress', 'completed'],
    default: 'available'
  },
  cover:{
    type:String,
    require:true
  },
  images:{
    type:[String],
    require:false
  },
  // Optional document stored in database (not Cloudinary)
  document: {
    data: { type: Buffer, required: false },
    contentType: { type: String, required: false },
    filename: { type: String, required: false },
    size: { type: Number, required: false },
  },
  hasDocument: {
    type: Boolean,
    default: false,
  },
  deliveryTime:{
    type:Number,
    require:true
  },
  pages:{
    type:Number,
    required:false,
    default:1,
  },
  pricePerPage:{
    type:Number,
    required:false,
    default:0,
  },
  discountEnabled:{
    type:Boolean,
    required:false,
    default:false,
  },
  discountAmount:{
    type:Number,
    required:false,
    default:0,
  },
  discountCondition:{
    type:String,
    required:false,
    default:"",
  },
  likedBy:{
    type:[String],
    required:false,
    default:[],
  },
  sales:{
    type:Number,
    default:0,
  },
},{
timestamps:true
});

export default mongoose.model("Gig",GigSchema)