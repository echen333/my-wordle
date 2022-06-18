import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

const API_URL = "https://raw.githubusercontent.com/tabatkins/wordle-list/main/words"

function App() {
  const [answer, setAnswer] = useState('');
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);

  useEffect( () => {
    async function go_fetch() {
      const response = await fetch(API_URL);
      const data = await response.text();
      var cells = data.split('\n').map(function (el) { return el.split(/\s+/); });
      setAnswer(cells[Math.floor(Math.random()*5)][0]);
    }
    go_fetch();
    
  }, [])

  useEffect( () => {
    let fired = false;
    // DIFFERENCE BETWEEN CONST AND FUNCTION?
    const handleType = (event) => {
      if (gameOver) {
        console.log("GAME OVER")
        return;
      }
      // if(!fired) {
        // fired = true;
        // do something
        // if(event.repeat)
        // return;
      console.log(event.key)
      if (event.key === 'Enter'){
        if (currentGuess.length === 5) {
          if(currentGuess === answer || guesses.findIndex(x => x===null) === -1){
            setGameOver(true);
          }
          // const tmp = guesses;
          const tmp = [...guesses];
          tmp[guesses.findIndex(x => x==null)] = currentGuess;
          setGuesses(tmp);
          setCurrentGuess('');
        }
        return;
      }
      if (event.key === 'Backspace') {
        setCurrentGuess(currentGuess.slice(0,-1));
        return;
      } 

      if (event.keyCode >= 65 && event.keyCode <= 90 && currentGuess.length<5) {
        setCurrentGuess(oldGuess => oldGuess + event.key)
        console.log(currentGuess, currentGuess.length)
        return;
      }
      return;
      // }
    }
    window.addEventListener('keyup', handleType)

    return () => {
      window.removeEventListener('keyup', handleType)
    }
  }, [currentGuess, guesses, gameOver, answer]);


  return (
    <div className="App">
      {
        guesses.map((guess, i) => {
          const isCurrentGuess = i === guesses.findIndex( x => x==null)
          const isTmp = i >= guesses.findIndex( x=> x===null)
          return <Line key={i} guess={isCurrentGuess?currentGuess:(guess ?? '')}  answer={answer} isFinal={!isTmp}/>
        })
        // means passes empty string if null
      }
    </div>
  );
}

//key

function Line({guess, answer, isFinal}) {
  let tiles = [];
  for(let i=0;i<5;i++){
    let cl_name="tile";
    if (isFinal) {
      if(guess[i] === answer[i]){
        cl_name = "tile-correct"
      }
      else if(answer.includes(guess[i])){
        cl_name = "tile-almost"
      }
      else {
        cl_name = "tile-incorrect"
      }
    }
    tiles.push(<div key={i} className={cl_name}>
      {guess[i]}
    </div>)
  
  }

  return <div className="line">
    {tiles}
  </div>
}

export default App;
