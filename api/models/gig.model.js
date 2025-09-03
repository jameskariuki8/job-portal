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
  deliveryTime:{
    type:Number,
    require:true
  },
  sales:{
    type:Number,
    default:0,
  },
},{
timestamps:true
});

export default mongoose.model("Gig",GigSchema)