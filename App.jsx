import React from "react"
import Question from "./Question"
import Answer from "./Answer"
import {nanoid} from "nanoid"

function App(){
    const [gameStarted, setGameStarted] = React.useState(false)
    const [gameEnded, setGameEnded] = React.useState(false)
    const [quizData, setQuizData] = React.useState([])
    const [selectedAnswers, setSelectedAnswers] = React.useState(0)
    const [correctAnswers, setCorrectAnswers] = React.useState(0)

    function startGame(){
        setGameStarted(true)
    }

    function endGame(){
        setGameEnded(true)
    }

    function playAgain(){
        setQuizData([])
        setGameEnded(false)
    }
    
    React.useEffect(() => {
        if (gameEnded === false){
            async function getQuiz(){
                const res = await fetch("https://opentdb.com/api.php?amount=5&category=11&difficulty=hard&type=multiple")
                const data = await res.json()
                const quizWithId = data.results.map(quiz => {
                    return {
                        ...quiz, questionId: nanoid()
                    }
                })
    
                const updatedQuizData = quizWithId.map(quiz => {
                    return {
                        ...quiz,
                        correct_answer: getAnswerObject(quiz.correct_answer, quiz),
                        incorrect_answers: quiz.incorrect_answers.map(answer => {
                            return answer = getAnswerObject(answer, quiz)
                        }),
                    }
                })
                const updatedQuizDataWithAnswers = updatedQuizData.map(quiz => {
                        return {
                            ...quiz,
                            answers: getCompleteAnswersArray(quiz.incorrect_answers, quiz.correct_answer)
                        }
                    })
                setQuizData(updatedQuizDataWithAnswers)
            }
            getQuiz()
        }
    }, [gameEnded])

    React.useEffect(() => {
        let selectedAnswersCount = 0
        quizData.forEach((quiz => (
            quiz.answers.forEach(answer => {
                if (answer.isSelected){
                    return selectedAnswersCount += 1

                }
            })
        )))
        setSelectedAnswers(selectedAnswersCount)
    }, [quizData])

    React.useEffect(() => {
        let selectedCorrectAnswers = 0
        quizData.map(quiz => {
            quiz.answers.map(answer => {
                if (answer.isSelected && answer.isCorrectAnswer){
                    selectedCorrectAnswers += 1
                }
            })
        })
        setCorrectAnswers(selectedCorrectAnswers)
    }, [gameEnded])

    function checkAnswers(){
        if (selectedAnswers === quizData.length){
            endGame()
        }
    }

    function selectAnswer(questionId, answerId) {
        setQuizData((prevQuizData) => {
          return prevQuizData.map((quiz) => {
            if (quiz.questionId === questionId){
                const updatedAnswers = quiz.answers.map((answer) => {
                  if (answer.id === answerId) {
                    return { ...answer, isSelected: !answer.isSelected }
                  } 

                  return {...answer, isSelected: false}
                })
          
                return {
                      ...quiz,
                      answers: updatedAnswers,
                }
            }

            return quiz
          })
        })
      }

    function getAnswerObject(answer, quiz){
        return {
            key: nanoid(),
            answer: answer,
            id: nanoid(),
            questionId: quiz.questionId,
            isCorrectAnswer: answer === quiz.correct_answer ? true : false,
            isSelected: false
        }
    }

    const getCompleteAnswersArray = (incorrectAnswers, correctAnswer) => { // returns an array with all answers and the correct answer at a random index
        const newArray = [...(incorrectAnswers || [])]
        const randomIndex = Math.floor(Math.random() * (newArray.length + 1))
        newArray.splice(randomIndex, 0, correctAnswer)

        return newArray
    }

    const questionElements = quizData.map(quiz => (
        <section>
            <Question  
                key={nanoid()}
                question={quiz.question}
                />
            <Answer 
                answers={quiz.answers}
                selectAnswer={selectAnswer}
                gameEnded={gameEnded}
            />
            <hr/>
        </section>
    ))
    
    return(
        <main>
            {
                gameStarted ? 
                    <div>
                        {questionElements}

                        {!gameEnded && <button 
                            className="check-answers-btn btn"
                            onClick={checkAnswers}
                        >Check answers</button>}

                        {gameEnded && 
                        <div className="end-container">
                            <h3
                                className="end-message"
                            >You scored {correctAnswers}/{selectedAnswers} correct answers</h3>
                            <button 
                                className="play-again-btn btn"
                                onClick={playAgain}
                            >Play Again</button>
                        </div>}

                    </div>
                    :
                    <div className="intro-container">
                        <h2>Quizzical</h2>
                        <p>How many can you answer?</p>
                        <button 
                            className="start-quiz-btn btn"
                            onClick={startGame}
                        >Start quiz</button>
                    </div>
                    
            }
        </main>
    )
}

export default App