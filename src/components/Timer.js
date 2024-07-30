import React, { useState, useEffect } from 'react';
import moment from 'moment';
import "./Timer.css";

const Timer = () => {
    const [timeLeft, setTimeLeft] = useState(0); // Time left in seconds
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [inputMinutes, setInputMinutes] = useState(15); // Default input value in minutes

    useEffect(() => {
        let timer;
        if (isActive && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
        }
        return () => clearInterval(timer);
    }, [isActive, timeLeft]);

    const startTimer = () => {
        const duration = inputMinutes * 60; // Convert minutes to seconds
        setTimeLeft(duration);
        setIsActive(true);
        setIsPaused(false);
    };

    const stopTimer = () => {
        setIsActive(false);
        setIsPaused(false);
    };

    const pauseTimer = () => {
        setIsPaused(true);
        setIsActive(false);
    };

    const resumeTimer = () => {
        setIsPaused(false);
        setIsActive(true);
    };

    const resetTimer = () => {
        setTimeLeft(0);
        setIsActive(false);
        setIsPaused(false);
    };

    const handleInputChange = (event) => {
        setInputMinutes(event.target.value);
    };

    const formatTime = (seconds) => {
        const duration = moment.duration(seconds, 'seconds');
        return `${String(duration.hours()).padStart(2, '0')}:${String(duration.minutes()).padStart(2, '0')}:${String(duration.seconds()).padStart(2, '0')}`;
    };

    return (
        <>
            <div className="container mx-auto flex justify-center items-center">
                <div className="timer-display">Timer: {formatTime(timeLeft)}</div>
                <button style={{ marginLeft: '8px' }} onClick={isPaused ? resumeTimer : pauseTimer} className="btn">
                    <i className={isPaused ? 'fas fa-play' : 'fas fa-pause'}></i>
                </button>
            </div>
            <div className="container mx-auto flex justify-center items-center">
                <input
                    style={{ padding:'0px 0px 0px 5px', color: 'black',width:'40px' ,marginRight:'10px' }}
                    type="number"
                    value={inputMinutes}
                    onChange={handleInputChange}
                    className="input"
                    min="1"
                    placeholder="Minutes"
                />
                <button onClick={startTimer} className="btn">Start</button>
            </div>
        </>
    );
};

export default Timer;
