const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const {jwtAuthMiddleware, generateToken,jwtAuthMiddlewareCookies} = require('../jwt')
const path = require('path');


// POST route to add a person
router.post('/signup', async (req, res) =>{
    try{
        const data = req.body // Assuming the request body contains the User data

        // Check if a user with the same Email  already exists
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            return res.status(400).json({ error: 'User with the same email already exists' });
        }

        // Create a new User document using the Mongoose model
        const newUser = new User(data);

        // Save the new user to the database
        const response = await newUser.save();
        console.log('User Added to db(saved)');

        const payload = {
            id: response.id
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);


            // res.status(200).json({response:response})
        res.status(200).json({response: response, token: token});
        res.redirect('/');

        // res.cookie("token",token,{httpOnly:true}).status(200).json({response: response, token: token});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

router.get('/signup', async(req,res)=>{
    // __dirname is a special variable that holds the directory where the current script resides
    const filePath = path.join(__dirname,'../public', 'signup.html');
    // console.log(filePath)
    
    // Send the HTML file as a response
    res.sendFile(filePath);
})


// Login Route
router.post('/login', async(req, res) => {
    try{
        // Extract email and password from request body
        const {email, password} = req.body;

        // Check if email or password is missing
        if (!email || !password) {
            return res.status(400).json({ error: 'email and password are required' });
        }

        // Find the user by email
        const user = await User.findOne({email: email});

        // If user does not exist or password does not match, return error
        if( !user || !(await user.comparePassword(password))){
            return res.status(401).json({error: 'Invalid email or Password'});
        }

        // generate Token 
        const payload = {
            id: user.id,
        }
        const token = generateToken(payload);

        // return token as response
        res.cookie("token",token,{httpOnly:true}).redirect('/')
        // res.cookie("token",token,{httpOnly:true}).json({token})
        // res.redirect('/');
        // res.json({token})
        // res.status(200).json({Succes: "Login Succesfylly", token:token})
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//login form rotes
router.get('/login', async(req,res)=>{
    // __dirname is a special variable that holds the directory where the current script resides
    const filePath = path.join(__dirname,'../public', 'login.html');
    // console.log(filePath)
    
    // Send the HTML file as a response
    res.sendFile(filePath);
})



// Get List of all users 
router.get('/',jwtAuthMiddlewareCookies, async (req, res) => {
    // console.log(req.cookies.token);
    try {
        // Find user from token and get role
        
        const userData = req.user;
        const userId = userData.id;
        const user = await User.findById(userId);

        // console.log(user.gender);

        // Find all users 
        const FemaleUsers = await User.find({ gender: 'female' }).exec();
        const MaleUsers = await User.find({ gender: 'male' }).exec();

        if(user.gender==='female'){
            // Return the list of candidates
            res.status(200).json(MaleUsers);
        }

        if(user.gender==='male'){
            // Return the list of candidates
            res.status(200).json(FemaleUsers);
        }

        // Return the list of candidates
        // res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get List of all users 
// router.get('/',jwtAuthMiddleware, async (req, res) => {
//     // console.log(req.cookies.token);
//     try {
//         // Find user from token and get role
        
//         const userData = req.user;
//         const userId = userData.id;
//         const user = await User.findById(userId);

//         console.log(user.gender);

//         // Find all users 
//         const FemaleUsers = await User.find({ gender: 'female' }).exec();
//         const MaleUsers = await User.find({ gender: 'male' }).exec();

//         if(user.gender==='female'){
//             // Return the list of candidates
//             res.status(200).json(MaleUsers);
//         }

//         if(user.gender==='male'){
//             // Return the list of candidates
//             res.status(200).json(FemaleUsers);
//         }

//         // Return the list of candidates
//         // res.status(200).json(users);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

router.post('/logout', async (req, res) => {
    // cookie name is 'token'
    res.status(200).clearCookie('token').redirect('/'); // Clear the cookie named 'token'
    // res.status(200).send('Logged out successfully').redirect('/');
});

router.get('/logout', async (req, res) => {
   // __dirname is a special variable that holds the directory where the current script resides
   const filePath = path.join(__dirname,'../public', 'logout.html');
   // console.log(filePath)
   
   // Send the HTML file as a response
   res.sendFile(filePath);
});


module.exports = router;