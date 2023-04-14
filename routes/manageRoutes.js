import express from 'express';
import { 
    history,
    outputs, 
    outputsForm,
    addOutput,
    trucks,
    trucksForm,
    addTruck,
    deleteTruck,
    updateTruckForm,
    updateTruck,
    profile, 
    imgProfile, 
    updateProfile} from '../controllers/manageController.js';
import routeProtect from '../middlewares/routeProtection.js';
import upload from '../middlewares/saveImage.js';

const router = express.Router();

router.get('/history', routeProtect, history);

// Get outputs page
router.get('/manage-outputs', routeProtect, outputs);

// Outputs
router.get('/add-output', routeProtect, outputsForm);
router.post('/add-output', routeProtect, addOutput);

// Trucks
router.get('/manage-trucks', routeProtect, trucks);

// Add trucks
router.get('/add-truck', routeProtect, trucksForm);
router.post('/add-truck', routeProtect, addTruck);

// Manipulate trucks
router.get('/delete-truck/:id', routeProtect, deleteTruck);

// Update trucks
router.get('/update-truck/:id', routeProtect, updateTruckForm);
router.post('/update-truck/:id', routeProtect, updateTruck);

// Get user profile
router.get('/profile', routeProtect, profile);
// Update image
router.post('/profile', routeProtect, upload.single('image'), imgProfile);
// Update user data
router.post('/profile/:id', routeProtect, updateProfile);

export default router;