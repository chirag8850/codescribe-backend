const loginController = (req, res) => {
    res.send('Login successful');
}

const logoutController = (req, res) => {
    res.send('Logout successful');
}

const signupController = (req, res) => {
    res.send('Signup successful');
}

export { loginController, logoutController, signupController };