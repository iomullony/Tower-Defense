import React, { useState, useEffect, useRef } from 'react';
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

import Tower from './components/Tower';
import Monster from './components/Monster';
import MonsterPath from './components/MonsterPath';

const fieldSize = 30; // Pixels for each field
const waveFrame = 20;

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gold, setGold] = useState(100);
  const [selectedTower, setSelectedTower] = useState<string | null>(null); // Explicitly set the type for selectedTower
  const [nextWaveFrame, setNextWaveFrame] = useState(waveFrame);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [towers, setTowers] = useState<Tower[]>([]); // Array of towers
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const startTime = useRef<number>(0);
  const [initialNextWaveFrame, setInitialNextWaveFrame] = useState<number>(waveFrame);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleTowerSelection = (value: React.SetStateAction<string | null>) => {
    if (!gameStarted) {
      alert('Please start the game first!');
      return;
    }
    setSelectedTower(value);
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!gameStarted) {
      alert('Please start the game first!');
      return;
    }
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Calculate the grid position based on field size
    const gridX = Math.floor(mouseX / fieldSize);
    const gridY = Math.floor(mouseY / fieldSize);

    // Check if enough gold is present
    const towerCost = 20; // Set an appropriate cost for towers
    if (gold >= towerCost && selectedTower) { // Check if selectedTower is not null
      // Deduct gold
      setGold((prevGold) => prevGold - towerCost);

      // Create and add a new tower to the array
      const newTower = new Tower(selectedTower, gridX, gridY);
      setTowers((prevTowers) => [...prevTowers, newTower]);
    } else {
      alert('Not enough gold or tower not selected to build a tower!');
    }
  };
  
  const startStopGame = () => {
    if (!gameStarted) {
      setInitialNextWaveFrame(nextWaveFrame); // Store the initial value when the game starts
      startTime.current = Date.now();
    }
    setGameStarted((prevGameStarted) => !prevGameStarted);
    if (currentLevel == 1 && nextWaveFrame == waveFrame) {
      createMonstersForLevel(1);
    }
  };
  
  const createMonstersForLevel = (level: number) => {
    const numberOfMonsters = level * 2;
  
    const createMonsterWithDelay = (index: number) => {
      setTimeout(() => {  
        const monsterPath: MonsterPath[] = [
          { position: { x: 0, y: 0 }, nextPosition: { x: 1, y: 0 } },
          { position: { x: 1, y: 0 }, nextPosition: { x: 2, y: 0 } },
          { position: { x: 2, y: 0 }, nextPosition: { x: 3, y: 0 } },
          { position: { x: 3, y: 0 }, nextPosition: { x: 4, y: 0 } },
          { position: { x: 4, y: 0 }, nextPosition: { x: 5, y: 0 } },
          { position: { x: 5, y: 0 }, nextPosition: { x: 6, y: 0 } },
          { position: { x: 6, y: 0 }, nextPosition: { x: 6, y: 1 } },
          { position: { x: 6, y: 1 }, nextPosition: { x: 6, y: 2 } },
          { position: { x: 6, y: 2 }, nextPosition: { x: 6, y: 3 } },
          { position: { x: 6, y: 3 }, nextPosition: { x: 6, y: 4 } },
          { position: { x: 6, y: 4 }, nextPosition: { x: 6, y: 5 } },
          { position: { x: 6, y: 5 }, nextPosition: { x: 7, y: 5 } },
          { position: { x: 7, y: 5 }, nextPosition: { x: 8, y: 5 } },
          { position: { x: 8, y: 5 }, nextPosition: { x: 9, y: 5 } },
          { position: { x: 9, y: 5 }, nextPosition: { x: 10, y: 5 } },
          { position: { x: 10, y: 5 }, nextPosition: { x: 11, y: 5 } },
          { position: { x: 11, y: 5 }, nextPosition: null },
        ];
  
        const newMonster = new Monster(monsterPath);
        setMonsters((prevMonsters) => [...prevMonsters, newMonster]);
      }, index * 1000); // Adjust the delay (1000 milliseconds = 1 second)
    };
  
    for (let i = 0; i < numberOfMonsters; i++) {
      createMonsterWithDelay(i);
    }
  };
  
  const startNextLevel = () => {
    setCurrentLevel((prevLevel) => prevLevel + 1);
    setInitialNextWaveFrame(waveFrame); // Set the initial value for nextWaveFrame
    startTime.current = Date.now(); // Update startTime for the new level
    createMonstersForLevel(currentLevel + 1);
    setNextWaveFrame(waveFrame); // Reset the nextWaveFrame
  };

  useEffect(() => {
    // console.log('Component is mounted and rendered.');
    const canvas = canvasRef.current!;
    const context = canvas?.getContext('2d');
  
    if (!context) {
      console.error('Could not get 2D rendering context.');
      return;
    }
  
    let animationFrameId: number;
    let intervalId: NodeJS.Timeout;
  
    const draw = () => {
      // console.log('Drawing...');
      animationFrameId = requestAnimationFrame(draw);
      context.clearRect(0, 0, canvas.width, canvas.height);
    
      towers.forEach((tower) => {
        tower.draw(context, fieldSize);
      });
    
      // Update monsters separately
      monsters.forEach((monster) => {
        monster.update(100, 0.5);
      });
    
      // Display monsters after updating them
      monsters.forEach((monster) => {
        monster.display(context, fieldSize);
      });
    
      const filteredMonsters = monsters.filter((monster) => monster.path.length > 0);
      setMonsters((prevMonsters) => filteredMonsters);
    
      if (gameStarted && nextWaveFrame > 0) {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime.current;
        const secondsPassed = Math.floor(elapsedTime / 1000);
    
        setNextWaveFrame((prevNextWaveFrame) => Math.max(0, initialNextWaveFrame - secondsPassed * 5));
      }
    };
    
    animationFrameId = requestAnimationFrame(draw);
  
    intervalId = setInterval(() => {
      if (gameStarted) {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime.current;
        const secondsPassed = Math.floor(elapsedTime / 1000);
  
        setNextWaveFrame((prevNextWaveFrame) => Math.max(0, initialNextWaveFrame - secondsPassed * 5));
      }
    }, 1000);
  
    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(intervalId);
    };
  }, [gameStarted, nextWaveFrame, initialNextWaveFrame, monsters, towers, canvasRef, fieldSize, currentLevel]);
  
  return (
    <div className="main">
      <h1>My Tower Defense</h1>
      <p>Game Started: {gameStarted.toString()}</p>
      <p>Gold: {gold}</p>
      <p>Selected Tower: {selectedTower}</p>
      <p>Next Wave Frame: {nextWaveFrame}</p>
      <p>Current Level: {currentLevel}</p>
      <button onClick={startStopGame}>{gameStarted ? 'Stop Game' : 'Start Game'}</button>

      {gameStarted && (
        <ToggleButtonGroup type="radio" name="towers" defaultValue={null} onChange={handleTowerSelection}>
          <ToggleButton value="regular" id={'Regular'}>
            Regular Tower
          </ToggleButton>
          <ToggleButton value="ice" id={'Ice'}>
            Ice Tower
          </ToggleButton>
          <ToggleButton value="fire" id={'Fire'}>
            Fire Tower
          </ToggleButton>
        </ToggleButtonGroup>
      )}
      <br></br>
      <canvas ref={canvasRef} width={fieldSize * 25} height={fieldSize * 15} onClick={handleCanvasClick}></canvas>
      <br></br>
      {nextWaveFrame === 0 && gameStarted && (
        <button onClick={startNextLevel}>Start Next Level</button>
      )}
    </div>
  );
}

export default App;
