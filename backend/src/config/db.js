import mongoose from 'mongoose';


export const connectDB = async () => {
    try {
        await mongoose.connect(
            process.env.MONGODB_CONNECTIONSTRING
        );
        console.log("connected successful");
    } catch ( error) { 

        console.error("connected failed", error);
        process.exit(1);//exit with error
    }
};