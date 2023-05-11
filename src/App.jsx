import { useState, useEffect } from 'react'
import React from "react";
import Die from './Die';
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import {useWindowSize} from 'react-use'


import './App.css'

function App() {
  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [rolls, setRolls] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [timePassed, setTimePassed] = useState(0);
  const {width, height} = useWindowSize()


  useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
    }
  }, [dice]);

  useEffect(() => {
    let timer;
    if (!tenzies) {
      timer = setInterval(() => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        setTimePassed(elapsed);
      }, 1000); //update every second
    }
    return () => clearInterval(timer);
  }, [tenzies, startTime]);

  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    return `${seconds % 60} seconds`;
  };

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function rollDice() {
    if (!tenzies) {
      setRolls((prevRolls) => prevRolls + 1);
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
    } else {
      setTenzies(false);
      setDice(allNewDice());
      setRolls(0);
      setStartTime(Date.now());
      setTimePassed(0);
    }
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));


 return (
  <main>
    {tenzies && <Confetti width={width} height={height}/>}
    <h1 className="title">Tenzies</h1>
    <p className="instructions">
      {tenzies
        ? (
          <>
            You won in <span className="pink-bold">{rolls} rolls</span> and in <span className="pink-bold">{formatTime(timePassed)}</span>!
          </>
        )
        : "Roll until all dice are the same. Click each die to freeze it at its current value between rolls."}
    </p>
    <div className="dice-container">
      {diceElements}
    </div>
    {!tenzies && <h3> Rolls: <span className="purple-bold">{rolls}</span></h3>}
    <button
      className="roll-dice-btn"
      onClick={rollDice}
    >
      {tenzies ? "New Game" : "Roll"}
    </button>
  </main>
)
}

export default App
