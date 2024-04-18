import { useEffect, useState } from 'react'
import './App.css'
import { socket } from './modules/socket'

function App() {
  const [endGameSentence, setEndGameSentence] = useState('')
  const [gameInfo, setGameInfo] = useState('En attente de joueurs')
  const [guessNumber, setGuessNumber] = useState("")

  useEffect(() => {
    socket.off('startGame')
    socket.off('hint')
    socket.off('endGame')

    socket.on('startGame', () => {
      console.log('start game')
      setGameInfo('Game started - find the number between 1 and 100')
    })

    socket.on('hint', (hint: string) => {
      setGameInfo(hint)
    })

    socket.on('endGame', (sentence: string) => {
      setEndGameSentence(sentence)
    })
    
    return () => {
      socket.off('startGame')
      socket.off('hint')
      socket.off('endGame')
    }
  }, [])

  const handleChangeGuessNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuessNumber(e.target.value)
  }

  const handleSendGuessNumber = () => {
    socket.emit('guessNumber', parseInt(guessNumber))
  }

  return (
    <div>
      {endGameSentence !== '' ? (
        <div>{endGameSentence}</div>
      ) : (
        <div>
          <div>{gameInfo}</div>
          <input 
            type="text" 
            value={guessNumber} 
            onChange={handleChangeGuessNumber} 
          />
          <button onClick={handleSendGuessNumber}>Try</button>
        </div>
      )}  
    </div>
  )
}

export default App
