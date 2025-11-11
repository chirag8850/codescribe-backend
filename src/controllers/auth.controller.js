import { User } from '../models/user.model.js';
import { HTTP_STATUS } from '../utils/constants.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';


const signupController = (req, res) => {
    const { username, name, email, password, avatar } = req.body;  
    // check proper keys are present with spelling
    

}

const loginController = (req, res) => {
    res.send('Login successful');
}

const logoutController = (req, res) => {
    res.send('Logout successful');
}


export { loginController, logoutController, signupController };