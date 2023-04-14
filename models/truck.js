import {Schema, model, isValidObjectId} from 'mongoose';

const TruckSchema = new Schema({
    brand: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    plate: {
        type: String,
        max: 7,
        required: true,
        unique: true
    },
    available: {
        type: Boolean,
        required: true,
        default: true
    },
    user_id: {
        type: String,
        required: true
    }
});

const Truck = model('truck', TruckSchema);
export default Truck;