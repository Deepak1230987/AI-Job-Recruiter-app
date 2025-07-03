"use client"
import React, { useState, useEffect } from 'react'
import { InterviewDataContext } from '../contexts/InterviewDataContext'

const InterviewLayout = ({children}) => {
    const [interviewInfo, setInterviewInfo] = useState(null)

    // Load interview data from localStorage on component mount
    useEffect(() => {
        const savedInterviewInfo = localStorage.getItem('interviewInfo');
        if (savedInterviewInfo) {
            try {
                const parsedData = JSON.parse(savedInterviewInfo);
                setInterviewInfo(parsedData);
            } catch (error) {
                console.error('Error parsing saved interview data:', error);
                localStorage.removeItem('interviewInfo'); // Clean up corrupted data
            }
        }
    }, []);

    // Save interview data to localStorage whenever it changes
    const updateInterviewInfo = (newData) => {
        setInterviewInfo(newData);
        if (newData) {
            localStorage.setItem('interviewInfo', JSON.stringify(newData));
        } else {
            localStorage.removeItem('interviewInfo');
        }
    };

  return (
    <InterviewDataContext.Provider value={{interviewInfo, setInterviewInfo: updateInterviewInfo}}>
  <div>
    {children}
  </div>
  </InterviewDataContext.Provider>
  )
}


export default InterviewLayout