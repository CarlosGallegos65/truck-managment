import { generateID } from '../helpers/tokens.js';
import jwt from 'jsonwebtoken';
import Petition from '../models/petition.js';
import User from '../models/user.js';
import Truck from '../models/truck.js';

// Generate api key
const generateKey = async (req, res) => {
    const {_token} = req.cookies;
    const { id } = jwt.verify(_token, process.env.JWT_SECRET);
    const apiKey = generateID();

    // Find user and asign api key
    try {
        await User.findByIdAndUpdate(id, {key: apiKey});
        res.status(200).json({msg: "Api key generated", key: apiKey});
    } catch (error) {
        res.status(500).json({msg: "Something went wrong"});
    }
}

// Verify if the plate is valid
const verifyPlate = async (req, res) => {
    let { key, plate } = req.params;
    // Clean data
    key = key.trim();
    plate = plate.trim().toUpperCase();
    
    const user = await User.findOne({key});

    // user is empty
    if(!user) {
        return res.status(400).json({msg: "Api key not valid"});
    }

    const { id } = user;
    // Verify if the truck exists
    const truck = await Truck.findOne({user_id: id, plate});

    if(!truck) {
        return res.status(400).json({msg: "This truck doesn't exists"});
    }

    // Check if the truck it's authorized to go
    const petition = await Petition.findOne({
        user_id: id, 
        plate,
        $or: [
            {status: "pending"},
            {status: "process"},
        ]
    });

    if(!petition) {
        return res.status(200).json({msg: "This truck it's not authorized", authorized: false});
    }

    if(petition.output === null) {
        // Change petition to in process
        petition.output = new Date();
        petition.status = "process";
        await petition.save();
    } else if(petition.arrived === null) {
        // End petition to in process
        petition.arrived = new Date();
        petition.status = "finished";
        truck.available = true;
        
        await Promise.all([
            petition.save(),
            truck.save()
        ]);
    }

    res.status(200).json({msg: "Authorized", authorized: true});
}

export {
    generateKey,
    verifyPlate
}