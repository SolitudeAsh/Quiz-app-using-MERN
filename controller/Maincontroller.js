const { connect } = require('../model/Mainmodel');

async function generateMessage(username, password, collection) {
    try {
        const db = await connect();
        const usersCollection = db.collection(collection);
        const user = await usersCollection.findOne({ username });
        
        if (!user) { 
            return 'incorrect username or password'; // Return error message if user not found         
        }
        
        if (user.password !== password) {  
            return 'incorrect username or password'; // Return error message if password is incorrect   
        }
        
        console.log("Success. ", user.username + " " + user.password);
        return user.username;
    } catch (error) {
        console.log("Error logging in:", error);
        throw error;
    }
} 

module.exports = { generateMessage };
