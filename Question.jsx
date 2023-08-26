import React from "react"
import {decode} from 'html-entities'

function Question(props){
    const {question} = props
    const decodedQuestion = decode(question)
    return(
        <h2 className="question-title">{decodedQuestion}</h2>
    )
}

export default Question