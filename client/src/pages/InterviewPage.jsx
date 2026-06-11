import React, { useState } from "react";
import Step1StepUp from "../components/Step1StepUp";
import Step2Interview from "../components/Step2Interview";
import Step3InterviewRep from "../components/Step3InterviewRep";
import InterviewReport from "./InterviewReport";
import InterviewHistory from "./InterviewHistory";
function InterviewPage() {
    const [step, setStep] = useState(1);
    const [interviewData, setInterviewData] = useState(null);
    const [reportData, setReportData] = useState(null);

    return (
        <div className="min-h-screen bg-gray-500">
            {step === 1 && (
                <Step1StepUp
                    onStart={(data) => {
                        setInterviewData(data);
                        setStep(2);
                    }}
                />
            )}

            {step === 2 && (
                <Step2Interview
                    interviewData={interviewData}
                    onFinish={(report) => {
                        setReportData(report);
                        setStep(3);
                    }}
                />
            )}

            {step === 3 && (
                <Step3InterviewRep report={reportData} />
            )}
        </div>
    );
}

export default InterviewPage;