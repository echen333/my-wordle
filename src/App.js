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
    // DIFFERENCE BETWEEN CONST AND FUNCTION
    const handleType = (event) => {
      console.log(event.key)
      if (gameOver) {
        return;
      }
      if (event.key === 'Enter'){
        if (currentGuess.length >= 5) {
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

      if(65<=event.which && event.which<=90 && currentGuess.length<5){
        setCurrentGuess(oldGuess => oldGuess + event.key)
        console.log(currentGuess, currentGuess.length)
        return;
        // if(currentGuess.length < 5) {
        //   const tmp = currentGuess + event.key;
        //   setCurrentGuess(tmp);
        //   console.log(currentGuess)
        // }
      }
      return;
    }
    window.addEventListener('keydown', handleType)
    // (event) => {
      
    // });
  }, [currentGuess, guesses, gameOver, answer]);


  return (
    <div className="App">
      {
        guesses.map((guess, i) => {
          const isCurrentGuess = i === guesses.findIndex( x => x==null)
          return <Line key={i} guess={isCurrentGuess?currentGuess:(guess ?? '')}  answer={answer} isFinal={!isCurrentGuess}/>
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
