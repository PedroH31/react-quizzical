import React from "react"
import {decode} from 'html-entities'

function Answer(props){
    const {answers, selectAnswer, gameEnded} = props

    const styles = answer => {
        if (answer.isSelected) {
            return {
                backgroundColor: "#D6DBF5",
                border: "none"
            }
        }
        else {
            return {
                backgroundColor: "#F5F7FB",
                border: "1px solid #4D5B9E"
            }
        }
    }
    
    const endgameStyles = answer => {
      if (answer.isCorrectAnswer){
        return {
            backgroundColor: "#94D7A2",
            border: "none"
        }
        } else if(answer.isSelected && !answer.isCorrectAnswer){
            return {
                backgroundColor: "#F8BCBC",
                border: "none",
                opacity: "0.5"
            }
        } else if (!answer.isSelected){
            return {
                opacity: "0.5"
            }
        }
    }
    const answerElements = answers.map(answer => (
        
        <li 
            key={answer.id}
            className="question-option" 
            style={!gameEnded ? styles(answer) : endgameStyles(answer)}
            onClick={() => selectAnswer(answer.questionId, answer.id)}
        >{decode(answer.answer)}</li>
    ))

    return (
        <ul>
            {answerElements}
        </ul>
    )
}

export default Answer