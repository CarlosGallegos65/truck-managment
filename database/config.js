import mongoose from 'mongoose';

// Method that establish a connection with MongoDB
const dbConnection = async() => {

    try {
        await mongoose.set('strictQuery', true);
        await mongoose.connect(process.env.MONGO_CONN);

        console.log('Connection was established');
    } catch (error) {
        throw new Error(`Connection could not be established. ERROR: ${error}`);
    }
}

export {
    dbConnection
}