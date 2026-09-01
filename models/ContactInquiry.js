const mongoose=require("mongoose");
const schema=new mongoose.Schema({referenceNumber:{type:String,unique:true,index:true},name:{type:String,required:true,trim:true},email:{type:String,required:true,trim:true,lowercase:true},phone:{type:String,trim:true},subject:{type:String,required:true,trim:true},message:{type:String,required:true,trim:true,maxlength:5000},status:{type:String,enum:["new","in-progress","resolved"],default:"new",index:true},adminNotes:{type:String,trim:true,maxlength:5000}},{timestamps:true});
schema.pre("validate",function(){if(!this.referenceNumber)this.referenceNumber=`INQ-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;});
module.exports=mongoose.model("ContactInquiry",schema);
