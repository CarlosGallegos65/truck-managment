// utilities
import jwt from 'jsonwebtoken';
import { generateJWT } from '../helpers/tokens.js';

// models
import User from '../models/user.js';
import Truck from '../models/truck.js';
import Petition from '../models/petition.js';

// validations
import {validateProfile} from '../validations/userValidations.js';
import {validateRegister} from '../validations/truckValidations.js';
import { validateOutput } from '../validations/outputValidations.js';
import { formatDate } from '../helpers/formatDates.js';

// Load home page
const history = async (req, res) => {
    const {_token} = req.cookies;
    const session = jwt.verify(_token, process.env.JWT_SECRET);

    // Serach all petitions
    let outputs = await Petition.find({user_id: session.id});
    outputs = outputs.filter(output => output.status == 'finished');

    const finishedOutputs = outputs.map(obj => {
        const {vehicle, plate, petition, output, arrived, status} = obj;
                const newData = {
                    vehicle,
                    plate,
                    petition: formatDate(petition),
                    output: formatDate(output),
                    arrived: formatDate(arrived),
                    status
                }
    
        return newData;
    });

    res.render('manage/history', {
        title: 'History',
        csrfToken: req.csrfToken(),
        session,
        outputs: finishedOutputs
    });
}

// Load home page
const outputs = async (req, res) => {
    const {_token} = req.cookies;
    const session = jwt.verify(_token, process.env.JWT_SECRET);

    // Serach all petitions
    let outputs = await Petition.find({user_id: session.id});
    outputs = outputs.filter(output => output.status != 'finished');

    const activeOutputs = outputs.map(obj => {
        const {vehicle, plate, petition, output, arrived, status} = obj;
                const newData = {
                    vehicle,
                    plate,
                    petition: formatDate(petition),
                    output: output != null ? formatDate(output) : "Pending",
                    arrived: arrived != null ? formatDate(arrived): "Pending",
                    status
                }
    
        return newData;
    });

    res.render('manage/manage-outputs', {
        title: 'Outputs',
        csrfToken: req.csrfToken(),
        session,
        outputs: activeOutputs
    });
}

// Outputs form
const outputsForm = async (req, res) => {
    const {_token} = req.cookies;
    const session = jwt.verify(_token, process.env.JWT_SECRET);

    const trucks = await Truck.find({user_id: session.id, available: true}, '-user_id');

    res.render('manage/add-output', {
        title: 'Add Output',
        csrfToken: req.csrfToken(),
        session,
        trucks
    });
}

// Add new output
const addOutput = async (req, res) => {
    const {_token} = req.cookies;
    const session = jwt.verify(_token, process.env.JWT_SECRET);

    // Extract id vechicle
    const {vehicle} = req.body;

    let errors = await validateOutput(req);

    const trucks = await Truck.find({user_id: session.id, available: true}, '-user_id');

    // Vehicle is required
    if(!errors.isEmpty()) {
        return res.render('manage/add-output', {
            title: 'Add Output',
            csrfToken: req.csrfToken(),
            errors: errors.array(),
            session,
            trucks
        });
    }

    const truck = await Truck.findById(vehicle);

    // If the truck doesn't exists
    if(!truck) {
        return res.render('manage/add-output', {
            title: 'Add Output',
            csrfToken: req.csrfToken(),
            errors: [{msg: 'Doesn\'t exists this truck'}],
            session,
            trucks
        });
    }

    const date = new Date();

    // Assign data to the petition
    const petition = new Petition({
        vehicle: truck.brand,
        plate: truck.plate,
        petition: date,
        output: null,
        arrived: null,
        user_id: session.id
    });

    try {
        // Save petition
        truck.available = false;

        await Promise.all([
            truck.save(),
            petition.save()
        ]);
        
        res.redirect('/manage/manage-outputs');

    } catch (error) {
        return res.render('manage/add-output', {
            title: 'Add Output',
            csrfToken: req.csrfToken(),
            errors: [{msg: error}],
            session,
            trucks
        });
    }
}

// Outputs form
const trucksForm = (req, res) => {
    const {_token} = req.cookies;

    res.render('manage/add-truck', {
        title: 'Add Truck',
        csrfToken: req.csrfToken(),
        session: jwt.verify(_token, process.env.JWT_SECRET)
    });
}

// Manage Trucks
const trucks = async (req, res) => {
    const {_token} = req.cookies;
    const session = jwt.verify(_token, process.env.JWT_SECRET);

    try {
        const trucks = await Truck.find({user_id: session.id});

        res.render('manage/manage-trucks', {
            title: 'Trucks',
            csrfToken: req.csrfToken(),
            session,
            trucks
        });
    } catch (error) {
        console.log(error);
    }

}

// Save a new truck
const addTruck = async (req, res) => {
    const {_token} = req.cookies;
    let {plate} = req.body;
    const session = jwt.verify(_token, process.env.JWT_SECRET);
    plate = plate.toUpperCase();

    let errors = await validateRegister(req);

    if(!errors.isEmpty()) {
        return res.render('manage/add-truck', {
            title: 'Add Truck',
            csrfToken: req.csrfToken(),
            errors: errors.array(),
            session
        });
    }

    const truck = await Truck.findOne({plate});

    if(truck) {
        return res.render('manage/add-truck', {
            title: 'Add Truck',
            csrfToken: req.csrfToken(),
            errors: [{msg: 'This plate is alredy registered'}],
            session: jwt.verify(_token, process.env.JWT_SECRET)
        });
    }

    try {
        const truck = new Truck(req.body);

        // Relate with the current user
        truck.user_id = session.id;
        truck.plate = plate;
        await truck.save();
        res.redirect('/manage/manage-trucks');
    } catch (error) {
        console.error(error);
    }
}

// Delete Truck
const deleteTruck = async (req, res) => {
    const {id} = req.params;

    try {
        const {model} = await Truck.findById(id);
        await Truck.findByIdAndRemove(id);
        res.status(200).json({msg: `Your ${model} has been deleted`});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'It couldn\'t delete the truck'});
    }

}

// Form update truck
const updateTruckForm = async (req, res) => {
    
    const {id} = req.params;
    
    try {
        const truck = await Truck.findById(id, '-__v -_id');
        res.status(200).json(truck);
    } catch (error) {
        res.status(400).json({msg: 'This truck doesn\'t exists'});
    }
}

// Form update truck
const updateTruck = async (req, res) => {
    
    try {    
        const {id} = req.params;

        let errors = await validateRegister(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        req.body.plate = req.body.plate.toUpperCase();
        await Truck.findByIdAndUpdate(id, req.body);
        res.status(200).json({msg: 'Your truck has been upgraded.'});

    } catch (errors) {
        res.status(400).json(errors);
    }
}

// Load profile page
const profile = async (req, res) => {
    const {_token} = req.cookies;

    res.render('manage/profile', {
        title: 'Profile',
        csrfToken: req.csrfToken(),
        session: jwt.verify(_token, process.env.JWT_SECRET)
    });
}

// Change image
const imgProfile = async (req, res, next) => {
    const {_token} = req.cookies;
    const session = jwt.verify(_token, process.env.JWT_SECRET);

    try {
        // Update image user
        await User.findByIdAndUpdate(session.id, {img: req.file.filename});

        // Authenticate user
        session.img = req.file.filename;
        const token = generateJWT({id: session.id, name: session.name, email: session.email, img: session.img});

        // Update current token
        res.cookie('_token', token, {
            httpOnly: true
        });

        next();

    } catch (error) {
        console.error(error);
    }
}

// Change profile data
const updateProfile = async (req, res) => {
    const {_token} = req.cookies;
    const session = jwt.verify(_token, process.env.JWT_SECRET);
    let errors = await validateProfile(req);

    if(!errors.isEmpty()) {
        return res.render('manage/profile', {
            title: 'Profile',
            csrfToken: req.csrfToken(),
            errors: errors.array(),
            session
        });
    }

    try {
        // Update name
        await User.findByIdAndUpdate(session.id, {name: req.body.name});

        // Authenticate user
        session.name = req.body.name;
        const token = generateJWT({id: session.id, name: session.name, email: session.email, img: session.img});

        // Update current token
        res.cookie('_token', token, {
            httpOnly: true
        });
        
        res.redirect('/manage/profile');
    } catch (error) {
        console.error(error);
    }
}

export {
    history,
    outputs,
    outputsForm,
    addOutput,
    trucksForm,
    trucks,
    addTruck,
    deleteTruck,
    updateTruckForm,
    updateTruck,
    profile,
    imgProfile,
    updateProfile
}