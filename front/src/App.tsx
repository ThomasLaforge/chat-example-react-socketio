import { useEffect, useState } from 'react'
import './App.css'
import { socket } from './modules/socket'

function App() {
  const [grid, setGrid] = useState<(null | 'X' | 'O')[][]>([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ])
  const [gameInfo, setGameInfo] = useState<string>('En attente de joueurs')

  useEffect(() => {
    socket.off('startGame')
    socket.off('played')
    socket.off('win')
    socket.off('lost')

    socket.on('startGame', (isPlayerToPlay: boolean) => {
      setGameInfo(isPlayerToPlay ? "C'est à vous de jouer" : "C'est à votre adversaire de jouer")
    })

    socket.on('played', (newGrid: (null | 'X' | 'O')[][], isPlayerToPlay: boolean) => {
      setGrid(newGrid)
      setGameInfo(isPlayerToPlay ? "C'est à vous de jouer" : "C'est à votre adversaire de jouer")
    })

    socket.on('win', () => {
      setGameInfo('Vous avez gagné')
    })

    socket.on('lost', () => {
      setGameInfo('Vous avez perdu')
    })

    return () => {
      socket.off('startGame')
      socket.off('played')
      socket.off('win')
      socket.off('lost')
    }
  }, [])

  const handleClickCell = (i: number, j: number) => {
    if (gameInfo === "C'est à vous de jouer") {
      socket.emit('play', i, j)
    }
  }

  return (
    <div>
      <div>
        <div>{gameInfo}</div>
        <div className="grid">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((cell, cellIndex) => (
                <div key={cellIndex} onClick={() => handleClickCell(rowIndex, cellIndex)} className="cell">
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
