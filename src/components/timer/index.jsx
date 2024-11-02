import React, { useState, useEffect, useCallback } from "react";
import "./index.css";
import PropTypes from 'prop-types';


const Timer = ({ title, endTime, elapsedTime = 0}) => {

    /*----------------------*
    |                       |
    |      TIME LOGIC       |
    |                       |
    *----------------------*/

    // Max time is 59:59
    if (endTime > 3599) {
        throw new Error("Timer can only count down to less than an hour.");
    }

    //Correct presentation of the date
    const formatTime = (time) => {

        //Coverts int to string and adds "extra" 0s if needed
        const minutes = String(Math.floor(time / 60)).padStart(2, '0');
        const seconds = String(time % 60).padStart(2, '0');

        return `${minutes}:${seconds}`;
    };

    
    // Values to show user and update each second
    const [timeLeft, setTimeLeft] = useState(endTime - elapsedTime);
    const [timeElapsed, setTimeElapsed] = useState(elapsedTime);

    // bool - if component has started/is finished
    const [isOn, setIsOn] = useState(false);
    const timerEnded = timeLeft === 0;

    /*----------------------*
    |                       |
    |    BUTTONS LOGIC      |
    |                       |
    *----------------------*/

    // Start timer
    const startTimer = () => setIsOn(true);

    // Pause timer
    const pauseTimer = () => setIsOn(false);

    //uses callback to reset everything to initial values
    const resetTimer = useCallback(() => {
        setIsOn(false);
        setTimeLeft(endTime); 
        setTimeElapsed(0);
    }, [endTime]);

    /*--------------------------*
    |                           |
    |   CIRCLE/PROGRESS LOGIC   |
    |                           |
    *--------------------------*/

    const progress = (timeElapsed / endTime) * 100;


    /*----------------------*
    |                       |
    |      TIMER LOGIC      |
    |                       |
    *----------------------*/

    useEffect(() => {
        if (!isOn || timeLeft <= 0) return;
    
        // uses setInterval to update values
        const intervalId = setInterval(() => {
          setTimeLeft(prevTime => Math.max(prevTime - 1, 0));
          setTimeElapsed(prevElapsed => prevElapsed + 1);
        }, 1000);

        // Cleans up interval on component
        return () => clearInterval(intervalId);
    }, [isOn, timeLeft]);




    return (
        <div className="fullTimer">
        <svg viewBox="-24.5 31 50 50" >
          <circle className="backgroundCircle"
            cx="0"
            cy="0"
            r="16"
            fill="none"
            stroke="#545576"
            strokeWidth="1.5"/>
          <circle className={`${timerEnded ? "end-animation" : "progressCircle"}`}
            cx="0"
            cy="0"
            r="16"
            fill="none"
            stroke="#67cb88"
            strokeWidth="1.5"
            strokeDasharray="101" 
            strokeDashoffset={100 - progress} />
        </svg>

        <div className="timer">
            <div className="mainElement">
            <h6 className="subtext"> {title} </h6>
            <h1 className="timer"> {formatTime(timeElapsed)} </h1>
            <h6 className="subtext"> {formatTime(timeLeft)} left </h6>
            <div className="buttonContainer">
                <button onClick={startTimer}> Start </button>
                <button onClick={pauseTimer}> Pause </button>
                <button onClick={resetTimer}> Reset </button>
            </div>
            </div>
        </div>
        </div>
    );
};


Timer.propTypes = {
    title: PropTypes.string.isRequired,
    endTime: PropTypes.number.isRequired,
    elapsedTime: PropTypes.number
};

export default Timer;