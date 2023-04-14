import {Schema, model} from 'mongoose';

const PetitionSchema = Schema({
    vehicle: {
        type: String,
        required: true
    },
    plate: {
        type: String,
        max: 7,
        required: true
    },
    petition: {
        type: Date,
        required: true
    },
    output: Date,
    arrived: Date,
    status: {
        type: String,
        required: true,
        default: 'pending'
    },
    user_id: {
        type: String,
        required: true
    }
});

const Petition = model('petition', PetitionSchema);
export default Petition;