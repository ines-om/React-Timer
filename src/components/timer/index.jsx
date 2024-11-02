import React, { useState, useEffect, useCallback } from "react";
import "./index.css";
import PropTypes from 'prop-types';


const Timer = ({ title, endTime, elapsedTime = 0}) => {

    /*--------------------*
    |     TIME FORMAT     |
    *--------------------*/

    /**
     * Checks if endTime is within stated limits (max 59:59)
     * @returns exception if not
     */
    if (endTime > 3599) {
        throw new Error("Timer can only count down to less than an hour.");
    }

    /**
     * 
     * @param {*} time 
     * @returns date in the correct format HH:MM
     */
    const formatTime = (time) => {

        //Coverts time to string, adding "extra" 0s if needed
        const minutes = String(Math.floor(time / 60)).padStart(2, '0');
        const seconds = String(time % 60).padStart(2, '0');

        return `${minutes}:${seconds}`;
    };


    /*----------------------*
    |   NEEDED VARIABLES    |
    *----------------------*/
    
    /**
     * Values to show user and update each second
     */
    const [timeLeft, setTimeLeft] = useState(endTime - elapsedTime);
    const [timeElapsed, setTimeElapsed] = useState(elapsedTime);

    /**
     * Keeps track of if timer is in use
     */
    const [isOn, setIsOn] = useState(false);

    /**
     * Checks if countdown has finished
     */
    const timerEnded = timeLeft === 0;


    /*----------------------*
    |    BUTTONS LOGIC      |
    *----------------------*/

    /**
     * Starts timer - defines isOn bool as true
     */
    const startTimer = () => setIsOn(true);

    /**
     * Pauses timer - defines isOn bool as false
     */
    const pauseTimer = () => setIsOn(false);

    /**
     *  Resets Timer - Sets timeElapsed as 0,
     *                 defines timer as not in use
     */
    const resetTimer = useCallback(() => {
        setIsOn(false);
        setTimeLeft(endTime); 
        setTimeElapsed(0);
    }, [endTime]);


    /*--------------------------*
    |   CIRCLE/PROGRESS LOGIC   |
    *--------------------------*/

    /**
     * Calculates progress - turns it into a percentage
     */
    const progress = (timeElapsed / endTime) * 100;


    /**
    * Timer Logic
    */
    useEffect(() => {
        //Doesn't change anything if timer is off
        if (!isOn || timeLeft <= 0) return;
    
        // updates time values each second if timer is working
        const intervalId = setInterval(() => {
          setTimeLeft(prevTime => Math.max(prevTime - 1, 0));
          setTimeElapsed(prevElapsed => prevElapsed + 1);
        }, 1000);

        // Cleans up previous values when a state change occurs
        return () => clearInterval(intervalId);
    }, [isOn, timeLeft]);


    return (
        <div className="fullTimer">
        
        //Circle Component
        <svg viewBox="-24.5 31 50 50" >
          <circle className="backgroundCircle"
            cx="0"
            cy="0"
            r="16"
            fill="none"
            stroke="#545576"
            strokeWidth="1.5"/>
          <circle className={`${timerEnded ? "end-animation" : `${timeElapsed === 0 ? "hidden" : "progressCircle"}`}`}
            cx="0"
            cy="0"
            r="16"
            fill="none"
            stroke="#67cb88"
            strokeWidth="1.5"
            strokeDasharray="101" 
            strokeDashoffset={100 - progress} />
        </svg>

        // Timer layout - Text, Countdown and Buttons
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