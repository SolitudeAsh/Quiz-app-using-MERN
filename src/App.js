// App.js

import React, { useState, useEffect } from 'react';
import './App.css'
import ResultsPage  from './ResultsPage';

export default function App() {
    const [currentPage, setCurrentPage] = useState("home");
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [choice1, setChoice1] = useState("");
    const [choice2, setChoice2] = useState("");
    const [choice3, setChoice3] = useState("");
    const [choice4, setChoice4] = useState("");
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    const [questionData, setQuestionData] = useState([]);
    const [quizStarted, setQuizStarted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(10);
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);

    // Timer logic
    useEffect(() => {
        let interval;
        if (quizStarted && timer > 0) {
            interval = setInterval(() => {
                setTimer(prevTime => prevTime - 1);
            }, 1000);
        } else if (quizStarted && timer === 0) {
            handleTimeout(); // Call function to handle timeout
        }
        return () => clearInterval(interval);
    }, [quizStarted, timer]);

    useEffect(() => {
        fetchRandomQuestions();
    }, []);

    const handleAdminClick = () => {
        setCurrentPage("adminLogin");
    };

    const handleUserClick = () => {
        setCurrentPage("userOptions");
    };

    // Handle timeout
    const handleTimeout = () => {
        handleAnswer(null, null); // Move to the next question with no selected answer
    };

    const handleLogin = () => {
        if (currentPage === "adminLogin") {
            adminLogin();
        } else if (currentPage === "userLogin") {
            userLogin();
        }
    };

    const handleSignup = () => {
        fetch('http://localhost:5000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password }),
        })
            .then(res => res.json())
            .then(data => { 
                setMessage(data.message); 
                console.log(data.message);
                if (data.message === 'User signup successful') {
                    setIsUserLoggedIn(true);
                    setCurrentPage("userDashboard");
                }
            })
            .catch(error => console.error('Error:', error));
    };

    const handleAddQuestion = () => {
        fetch('http://localhost:5000/admin/addQuestion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question, answer, choice1, choice2, choice3, choice4 }),
        })
            .then(res => res.json())
            .then(data => { setMessage(data.message); console.log(data.message);alert("Quiz added to the database")})
            .catch(error => console.error('Error:', error));
    };

    const adminLogin = () => {
        fetch('http://localhost:5000/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password }),
        })
            .then(res => res.json())
            .then(data => { 
                setMessage(data.message); 
                console.log(data.message); 
                if(data.message === 'Admin') {
                    setIsAdminLoggedIn(true);
                    setCurrentPage("renderAdminDashboard");
                }
            })
            .catch(error => console.error('Error:', error));
    };

    const userLogin = () => {
        fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password }),
        })
            .then(res => res.json())
            .then(data => { 
                setMessage(data.message); 
                console.log(data.message);
                if (data.message !== 'incorrect username or password') {
                    setIsUserLoggedIn(true);
                    setCurrentPage("userDashboard");
                }
            })
            .catch(error => console.error('Error:', error));
    };

    const fetchRandomQuestions = () => {
        fetch('http://localhost:5000/quiz/random')
            .then(res => res.json())
            .then(data => {
                setQuestionData(data);
            })
            .catch(error => console.error('Error fetching questions:', error));
    };

    const handleStartQuiz = () => {
        setQuizStarted(true);
        setTimer(10);
        setScore(0);
        setCurrentQuestionIndex(0);
    };

    const renderHomePage = () => {
        return (
            <center>
                <div className="d1">
                    <h2>Welcome to Quiz</h2>
                    <button onClick={handleAdminClick}>Admin</button>
                    <button onClick={handleUserClick}>User</button>
                </div>
            </center>
        );
    };

    const renderUserOptions = () => {
        return (
            <center>
                <div className="d1">
                    <h2>User Options</h2>
                    <button onClick={() => setCurrentPage("userLogin")}>Login</button>
                    <button onClick={() => setCurrentPage("userSignup")}>Signup</button>
                    <button onClick={() => setCurrentPage("home")}>Back</button>
                </div>
            </center>
        );
    };

    const renderAdminLoginPage = () => {
        return (
            <center>
                <div className="d1">
                    <h2>Login</h2>
                    <label>Username: <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} /></label><br /><br />
                    <label>Password: <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label><br /><br />
                    <button onClick={() => setCurrentPage("home")}>Back</button>
                    <button onClick={handleLogin}>Login</button>
                    
                </div>
            </center>
        );
    };

    const renderUserLoginPage = () => {
        return (
            <center>
                <div className="d1">
                    <h2>Login</h2>
                    <label>Username: <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} /></label><br /><br />
                    <label>Password: <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label><br /><br />
                    <button onClick={() => setCurrentPage("userOptions")}>Back</button>
                    <button onClick={handleLogin}>Login</button>
                </div>
            </center>
        );
    };

    const renderSignupPage = () => {
        return (
            <center>
                <div className="d1">
                    <h2>Signup</h2>
                    <label>Username: <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} /></label><br /><br />
                    <label>Password: <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label><br /><br />
                    <button onClick={() => setCurrentPage("userOptions")}>Back</button>
                    <button onClick={handleSignup}>Signup</button>
                </div>
            </center>
        );
    };

    const renderAddQuestionPage = () => {
        return (
            <center>
                <div className="addQuiz">
                    <h2>Add Quiz</h2>
                    <label>Question: <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} /></label><br /><br />
                    <label>Answer: <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} /></label><br /><br />
                    <label>Choice 1: <input type="text" value={choice1} onChange={(e) => setChoice1(e.target.value)} /></label><br /><br />
                    <label>Choice 2: <input type="text" value={choice2} onChange={(e) => setChoice2(e.target.value)} /></label><br /><br />
                    <label>Choice 3: <input type="text" value={choice3} onChange={(e) => setChoice3(e.target.value)} /></label><br /><br />
                    <label>Choice 4: <input type="text" value={choice4} onChange={(e) => setChoice4(e.target.value)} /></label><br /><br />
                    <button onClick={() => setCurrentPage("adminLogin")}>Back</button>
                    <button onClick={handleAddQuestion}>Add Question</button>
                </div>
            </center>
        );
    };

    // const renderQuizQuestion = () => {
    //     const currentQuestion = questionData[currentQuestionIndex];
    //     if (!currentQuestion) {
    //         return null;
    //     }
    //     const choices = [currentQuestion.choice1, currentQuestion.choice2, currentQuestion.choice3, currentQuestion.choice4];
    //     const correctAnswer = currentQuestion.answer;
    //     return (
    //         <div>
    //             <h3 id ="qno">Question No: {currentQuestionIndex + 1}/10</h3>
    //             <h3>{currentQuestion.question}</h3>
    //             {choices.map((choice, index) => {
    //                 const isCorrect = choice === correctAnswer;
    //                 const buttonStyle = selectedAnswerIndex === index ? (isCorrect ? 'correct' : 'incorrect') : 'default';
    //                 return (
    //                     <button key={index} className={buttonStyle} onClick={() => handleAnswer(choice, index)}>{choice}</button>
    //                 );
    //             })}
    //         </div>
    //     );
    // };

    const renderQuizQuestion = () => {
        const currentQuestion = questionData[currentQuestionIndex];
        if (!currentQuestion) {
            return null;
        }
        const choices = [currentQuestion.choice1, currentQuestion.choice2, currentQuestion.choice3, currentQuestion.choice4];
        const correctAnswer = currentQuestion.answer;
        return (
            <div>
                <h3 id="qno">Question No: {currentQuestionIndex + 1}/10</h3>
                <h3>{currentQuestion.question}</h3>
                {choices.map((choice, index) => {
                    const isCorrect = choice === correctAnswer;
                    const buttonStyle = selectedAnswerIndex === index ? (isCorrect ? 'correct' : 'incorrect') : 'default';
                    return (
                        <button key={index} className={buttonStyle} onClick={() => handleAnswer(choice, index)}>{choice}</button>
                    );
                })}
            </div>
        );
    };

    // const handleAnswer = (selectedAnswer, selectedIndex) => {
    //     const currentQuestion = questionData[currentQuestionIndex];
    //     let isCorrect = false;
    //     if (selectedAnswer === currentQuestion.answer) {
    //         // Increment score if answer is correct
    //         setScore(prevScore => prevScore + 1);
    //         isCorrect = true;
    //     }
    //     // Update the UI to show the correct and incorrect answers
    //     setQuestionData(prevQuestionData => {
    //         const updatedQuestionData = [...prevQuestionData];
    //         updatedQuestionData[currentQuestionIndex] = { ...currentQuestion, selectedAnswer, isCorrect };
    //         return updatedQuestionData;
    //     });

    //     // Set the selected answer index
    //     setSelectedAnswerIndex(selectedIndex);

    //     // Delay the transition to the next question
    //     setTimeout(() => {
    //         if (currentQuestionIndex === 9) {
    //             // Stop the quiz
    //             setQuizStarted(false);
    //             // Display the score
    //             setCurrentPage("quizResult");
    //         } else {
    //             // Move to the next question
    //             setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    //             // Reset selected answer index
    //             setSelectedAnswerIndex(null);
    //         }
    //     }, 1000);
    // };

    const handleAnswer = (selectedAnswer, selectedIndex) => {
        const currentQuestion = questionData[currentQuestionIndex];
        let isCorrect = false;
        if (selectedAnswer === currentQuestion.answer) {
            // Increment score if answer is correct
            setScore(prevScore => prevScore + 1);
            isCorrect = true;
        }
        // Update the UI to show the correct and incorrect answers
        setQuestionData(prevQuestionData => {
            const updatedQuestionData = [...prevQuestionData];
            updatedQuestionData[currentQuestionIndex] = { ...currentQuestion, selectedAnswer, isCorrect };
            return updatedQuestionData;
        });

        // Set the selected answer index
        setSelectedAnswerIndex(selectedIndex);

        // Delay the transition to the next question
        setTimeout(() => {
            if (currentQuestionIndex === 9) {
                // Stop the quiz
                setQuizStarted(false);
                // Display the score
                setCurrentPage("quizResult");
                // Update user data with score
                updateScore();
            } else {
                // Move to the next question
                setCurrentQuestionIndex(prevIndex => prevIndex + 1);
                // Reset selected answer index
                setSelectedAnswerIndex(null);
                // Reset timer for the next question
                setTimer(10);
            }
        }, 1000);
    };

    // Function to update user score
    const updateScore = () => {
        // Fetch endpoint to update user score
        fetch('http://localhost:5000/user/updateScore', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, score }), // Pass username, password, and score
        })
            .then(res => res.json())
            .then(data => {
                console.log(data.message);
            })
            .catch(error => console.error('Error updating user score:', error));
    };

    const renderAdminDashboard = () => {
        return(
            <center>
                <h3>Admin Dashboard</h3>
                {isAdminLoggedIn && ( // Conditionally render the "Add Question" button
                    <div>
                        <button onClick={() => setCurrentPage("addQuestion")}>Add Question</button>
                        <button onClick={() => setCurrentPage("viewResults")}>View Results</button>
                    </div>
                )}
                <button className="adminBack" onClick={() => setCurrentPage("adminLogin")} style={{ position: 'absolute', bottom: 10, left: 10 }}>Back</button> {/* Back button */}
            </center>
        )
    }

    const handleGoBack = () => {
        setCurrentPage("renderAdminDashboard");
    };

    const renderUserDashboard = () => {
        return (
            <center>
                <div className='quizPage'>
                    <h2>QUIZ TIME</h2>
                    <button className="quizBack" onClick={() => setCurrentPage("home")}>Back</button>
                    {!quizStarted && (
                        <button className="quizStart" onClick={handleStartQuiz}>Start Quiz</button>
                    )}
                    {quizStarted && <h3 id="timer">Timer : {timer}</h3>}
                    {quizStarted && renderQuizQuestion()}
                </div>
            </center>
        );
    };

    const QuizResultPage = () => {
        return (
            <center>
                <div>
                    <h2>You Scored {score} out of 10</h2>
                    <button onClick={() => setCurrentPage("home")}>Back to Home</button>
                </div>
            </center>
        );
    };

    return (
        <>
            {currentPage === "home" && renderHomePage()}
            {currentPage === "adminLogin" && renderAdminLoginPage()}
            {currentPage === "userOptions" && renderUserOptions()}
            {currentPage === "userLogin" && renderUserLoginPage()}
            {currentPage === "userSignup" && renderSignupPage()}
            {isAdminLoggedIn && currentPage === "renderAdminDashboard" && renderAdminDashboard()} {/* Updated this line */}
            {isAdminLoggedIn && currentPage === "addQuestion" && renderAddQuestionPage()}
            {isUserLoggedIn && currentPage === "userDashboard" && renderUserDashboard()}
            {currentPage === "quizResult" && <QuizResultPage/>}
            {isAdminLoggedIn && currentPage === "viewResults" && <ResultsPage goBack={handleGoBack}/>}
        </>
    );
}