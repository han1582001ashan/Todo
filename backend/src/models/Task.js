import mongoose from "mongoose";

const taskSchema= new mongoose.Schema({
    
        title:{
            type: String,
            required: true,
            trim:true,
        },
        status:{
            type: String,
            emum: ["active", "complete"],
            default:"active"
        }, 
        completedAt:{
            type:Date,
            default:null
        }
    
},
{
    timestamps:true,//tu them createAt, deleteAt
}
);
const Task = mongoose.model("Task", taskSchema);
export default Task;