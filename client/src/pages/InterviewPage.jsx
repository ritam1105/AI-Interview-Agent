import React, { useState } from 'react'
import Step1StepUp from '../components/Step1StepUp'
import Step2Interview from '../components/Step2Interview'
import Step3InterviewRep from '../components/Step3InterviewRep'
import InterviewReport from './InterviewReport'

function InterviewPage() {
    const [step, setStep]=useState(1)
    const [interviewData,setInterviewData]=useState(null)
  return (
    <div className='min-h-screen bg-gray-500'>
        {step===1 && (
            <Step1StepUp onStart={(data)=>{
                setInterviewData(data);
                setStep(2)
            }}/>
        )}
        {step===2 && (
            <Step2Interview interviewData={interviewData} onFinish={(report)=>{
                InterviewReport(report);
                setStep(3)
            }}/>
        )}
        {step===3 && (
            <Step3InterviewRep report={interviewData}/>
        )}

    </div>
  )
}

export default InterviewPage