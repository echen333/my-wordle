import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { BsGearFill } from 'react-icons/bs'
import { MdOutlineLeaderboard } from 'react-icons/md'

const API_URL = "https://raw.githubusercontent.com/xangregg/deepwordle/main/common.txt"

function App() {
  const [answer, setAnswer] = useState('');
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [wordBank, setWordBank] = useState([]);

  useEffect( () => {
    async function go_fetch() {
      const response = await fetch(API_URL);
      const data = await response.text();
      var cells = data.split('\n').map(function (el) { return el.split(/\s+/); });
      setAnswer(cells[Math.floor(Math.random()*cells.length)][0]);
      var wordArr = cells.map(x => x[0]);
      setWordBank(wordArr);
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
      // console.log(event.key)
      if (event.key === 'Enter'){
        if (currentGuess.length === 5 && wordBank.includes(currentGuess)) {
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
        return;
      }
      return;
    }
    window.addEventListener('keyup', handleType)

    return () => {
      window.removeEventListener('keyup', handleType)
    }
  }, [currentGuess, guesses, gameOver, answer, wordBank]);


  return (
    <div className="App">
      <Navbar/>
      {
        guesses.map((guess, i) => {
          const isCurrentGuess = i === guesses.findIndex( x => x==null)
          const isTmp = i >= guesses.findIndex( x=> x===null) && guesses.findIndex(x=>x===null) !== -1
          return <Line key={i} guess={isCurrentGuess?currentGuess:(guess ?? '')}  answer={answer} isFinal={!isTmp}/>
        })
        // means passes empty string if null
      }
      <Keyboard guesses={guesses} answer={answer}/>
    </div>
  );
}

function Navbar() {
  return <div>
    <div className='navbar'>
      <div className='center-nav'>
        Wordle 
      </div>
      <ul className='rIcons'>
        <li><MdOutlineLeaderboard size={20}/></li>
        <li><BsGearFill size={20}/></li> 
      </ul>
    </div>
    <hr></hr>
  </div>
}

function Line({guess, answer, isFinal}) {
  let tiles = [];
  for(let i=0;i<5;i++){
    let cl_name="tile";
    if (isFinal) {
      if(guess[i] === answer[i]){
        cl_name = "tile correct"
      }
      else if(answer.includes(guess[i])){
        cl_name = "tile almost"
      }
      else {
        cl_name = "tile incorrect"
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

function Keyboard( {guesses, answer} ) {
  let row1 = ['q','w','e','r','t','y','u','i','o','p'];
  let row2 = ['a','s','d','f','g','h','j','k','l'];
  let row3 = ['>','z','x','c','v','b','n','m', '<'];
  
  return <div className='keyboard'>
    <Row key={1} keys={row1} guesses={guesses} answer={answer}/>
    <Row key={2} keys={row2} guesses={guesses} answer={answer}/>
    <Row key={3} keys={row3} guesses={guesses} answer={answer}/>
    </div>
}

function Row({keys, guesses, answer}) {
  const ret = [];
  keys.forEach(x => {
    let revealed = false;
    let green = false;
    guesses.forEach(y => {
      if (y!=null && y.includes(x)) {
        console.log(y);
        revealed = true;
        for (let i=0;i<5;i++) {
          if(answer[i] === y[i] && answer[i] === x) {
            green = true;
          }
        }
      }
    })
    ret.push(<div className={ (revealed) ? ((!answer.includes(x))?"key bad": (green?"key great":"key good")):"key"}>{x}</div>)
  })
  return <div>
    {ret}
  </div>
}

export default App;
