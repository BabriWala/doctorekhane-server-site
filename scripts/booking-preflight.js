// Read-only deployment check. Never initializes models or creates indexes.
require('dotenv').config({quiet:true});
const mongoose = require('mongoose');
async function main() {
  await mongoose.connect(process.env.MONGODB_URI,{autoIndex:false});
  const db=mongoose.connection.db;
  const appointments=await db.collection('appointments').aggregate([
    {$match:{status:{$in:['pending','confirmed']}}},
    {$group:{_id:{doctor:'$doctor',day:{$dateToString:{date:'$appointmentDate',format:'%Y-%m-%d',timezone:'Asia/Dhaka'}},slot:'$timeSlot'},count:{$sum:1}}},
    {$match:{count:{$gt:1}}},{$count:'groups'}
  ]).toArray();
  const ambulances=await db.collection('ambulancerequests').aggregate([
    {$match:{status:{$in:['assigned','dispatched']},ambulance:{$type:'objectId'}}},
    {$group:{_id:'$ambulance',count:{$sum:1}}},{$match:{count:{$gt:1}}},{$count:'groups'}
  ]).toArray();
  let nonNormalized=0;
  for await(const item of db.collection('appointments').find({status:{$in:['pending','confirmed']}},{projection:{appointmentDate:1,timeSlot:1}})) {
    const day=item.appointmentDate.toLocaleDateString('en-CA',{timeZone:'Asia/Dhaka'});
    if(new Date(`${day}T${item.timeSlot}:00+06:00`).getTime()!==item.appointmentDate.getTime())nonNormalized++;
  }
  const report={duplicateAppointmentGroups:appointments[0]?.groups||0,duplicateAmbulanceGroups:ambulances[0]?.groups||0,activeAppointmentsNeedingNormalization:nonNormalized};
  console.log(JSON.stringify(report));
  if(Object.values(report).some(Boolean))process.exitCode=2;
}
main().catch(()=>{console.error('Preflight failed; inspect database connectivity and date types without exposing credentials.');process.exitCode=1;}).finally(()=>mongoose.disconnect());
