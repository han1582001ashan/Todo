import Task from "../models/Task.js";


export const getAllTasks = async (request, response) => {
const {filter='today'}= request.query;
const now = new Date();
let startDate;
switch(filter){
    case 'today':{
        startDate= new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
    }
    case "week":{
        const mondayDate = now.getDate()- (now.getDay()-1)-(now.getDay()===0?7:0);
        startDate= new Date(now.getFullYear(), now.getMonth(), mondayDate);
        break;
    }
    case "month":{
        startDate= new Date(now.getFullYear, now.getMonth(), 1);
        break;
    }
    case "all":
        default:{
            startDate=null;
        }
}
const query= startDate ? {createdAt: {$gte: startDate}}:{};



    try {
      
        const result = await Task.aggregate([

            {$match: query}, 
            {
                $facet:{
                    tasks:[{$sort: {createdAt:-1}}],
                    activeCount:[{$match:{status:"active"}}, {$count:"count"}],
                    completeCount:[{$match:{status: "complete"}}, {$count:"count"}],
                },
            },

        ]);
        const tasks= result[0].tasks;
        const activeCount= result[0].activeCount[0]?.count || 0;
        const completeCount= result[0].completeCount[0]?.count||0;

        response.status(200).json({tasks, activeCount, completeCount});
    } catch (error) {
        console.error("call find error", error);
        response.status(500).json({ message: "Lỗi Hệ Thống" })
    }
};
export const createTask = async (request, response) => {
    try {
        const { title } = request.body;
        const task = new Task({ title });
        const newTask = await task.save();
        response.status(201).json(newTask);

    } catch (error) {
        console.error("create error", error);
        response.status(500).json({ message: "Lỗi Hệ Thống" })
    }
};
export const deleteTask = async (request, response) => {
    try {

        const deleteTask = await Task.findByIdAndDelete(request.params.id);
        if (!deleteTask) {
            return response.status(404).json({ message: "Nhiệm vụ không tồn tại" });
        }
        response.status(200).json(deleteTask);

    } catch (error) {

    }
};
export const updateTask = async (request, response) => {
    try {
        const { title, status, completeAt } = request.body;
        const updateTask = await Task.findByIdAndUpdate(
            request.params.id, {
            title, status, completeAt
        }, { new: true }

        );
        if (!updateTask) {
            return response.status(404).json({ message: "Nhiệm vụ không tồn tại" });
        }
        response.status(200).json(updateTask);


    } catch (error) {
        console.error("Update error", error);
        response.status(500).json({ message: "Lỗi Hệ Thống" })
    }
};
