const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const { generateMessage } = require('../controller/Maincontroller');


// MongoDB connection setup
const uri = "mongodb://localhost:27017";
const dbName = "ipLab";
const client = new MongoClient(uri);

// Connect to MongoDB
async function connectMongoDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}

// Connect to MongoDB when the server starts
connectMongoDB();

// Routes
const adminCollection = client.db(dbName).collection("quizAdmin");
const userCollection = client.db(dbName).collection("quizUsers");
const quizCollection = client.db(dbName).collection("quiz");
const resultsCollection = client.db(dbName).collection("quizResults");

// Admin login route
router.post("/admin/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const data = await generateMessage(username, password, 'quizAdmin');
        res.json({ message: data });
    } catch (error) {
        console.error("Error generating message:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// User login route
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const data = await generateMessage(username, password, 'quizUsers');
        res.json({ message: "Login Successful" });
    } catch (error) {
        console.error("Error generating message:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// User signup route
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await userCollection.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        } else {
            const newUser = await userCollection.insertOne({ username, password });
            res.status(201).json({ message: 'User signup successful' });
        }
    } catch (error) {
        console.error("Error signing up:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to add a question to the quiz
router.post('/admin/addQuestion', async (req, res) => {
    try {
        const { question, answer, choice1, choice2, choice3, choice4 } = req.body;
        const newQuestion = await quizCollection.insertOne({ question, answer, choice1, choice2, choice3, choice4 });
        res.status(201).json({ message: 'Question added to quiz' });
    } catch (error) {
        console.error("Error adding question:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to fetch random quiz questions
router.get('/quiz/random', async (req, res) => {
    try {
        const randomQuestions = await quizCollection.aggregate([{ $sample: { size: 10 } }]).toArray();
        res.json(randomQuestions);
    } catch (error) {
        console.error("Error fetching random questions:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to update user score
router.post('/user/updateScore', async (req, res) => {
    const { username, password, score } = req.body;
    try {
        // Update user's score
        const result = await resultsCollection.insertOne({ username, password , score  });
        res.status(201).json({ message: 'User score updated successfully', result });
    } catch (error) {
        console.error("Error updating user score:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to fetch quiz results
router.get('/quiz/results', async (req, res) => {
    try {
        const quizResults = await resultsCollection.find({}).toArray();
        res.json(quizResults);
    } catch (error) {
        console.error("Error fetching quiz results:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;