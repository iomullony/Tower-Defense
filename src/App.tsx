import React, { useState, useEffect, useRef } from 'react';
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

import Tower from './components/Tower';
import Monster from './components/Monster';
import MonsterPath from './components/MonsterPath';

const fieldSize = 30; // Pixels for each field

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gold, setGold] = useState(100);
  const [selectedTower, setSelectedTower] = useState<string | null>(null); // Explicitly set the type for selectedTower
  const [nextWaveFrame, setNextWaveFrame] = useState(250);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [towers, setTowers] = useState<Tower[]>([]); // Array of towers
  const [monsters, setMonsters] = useState<Monster[]>([]);

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
    setGameStarted((prevGameStarted) => !prevGameStarted);
  };
  
  const createMonstersForLevel = (level: number) => {
    const numberOfMonsters = level * 2;
    const monstersForLevel: Monster[] = [];

    for (let i = 0; i < numberOfMonsters; i++) {
      const monsterPath: MonsterPath[] = [
        { position: { x: 0, y: 0 }, nextPosition: { x: 1, y: 0 } },
        { position: { x: 1, y: 0 }, nextPosition: { x: 2, y: 0 } },
        // Add more positions as needed for a longer path
        { position: { x: 2, y: 0 }, nextPosition: { x: 2, y: 1 } },
        { position: { x: 2, y: 1 }, nextPosition: { x: 1, y: 1 } },
        { position: { x: 1, y: 1 }, nextPosition: null },
      ];

      const newMonster = new Monster(monsterPath);
      monstersForLevel.push(newMonster);
    }

    setMonsters((prevMonsters) => [...prevMonsters, ...monstersForLevel]);
  };

  const startNextLevel = () => {
    setCurrentLevel((prevLevel) => prevLevel + 1); // Increase the level
    createMonstersForLevel(currentLevel + 1); // Start the new level
    setNextWaveFrame(250); // Reset the nextWaveFrame
  };

  useEffect(() => {
    const canvas = canvasRef.current!;
    const context = canvas.getContext('2d');
  
    if (!context) {
      return;
    }
  
    let animationFrameId: number;
    let intervalId: NodeJS.Timeout;
  
    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    
      towers.forEach((tower) => {
        tower.draw(context, fieldSize);
      });
    
      // Update monsters
      monsters.forEach((monster) => {
        monster.update();
      });
    
      // Display monsters
      monsters.forEach((monster) => {
        monster.display(context, fieldSize);
      });
    
      // Filter out monsters with no path after updating
      const filteredMonsters = monsters.filter((monster) => monster.path.length > 0);
      setMonsters(filteredMonsters);
    
      // Decrease nextWaveFrame every second
      if (gameStarted && nextWaveFrame > 0) {
        setNextWaveFrame((prevNextWaveFrame) => Math.max(0, prevNextWaveFrame - 5));
      }
    
      // Request the next animation frame
      animationFrameId = requestAnimationFrame(draw);
    };
    
    // Start the drawing loop
    // animationFrameId = requestAnimationFrame(draw);
  
    // Decrease nextWaveFrame every second
    intervalId = setInterval(() => {
      if (gameStarted && nextWaveFrame > 0) {
        setNextWaveFrame((prevNextWaveFrame) => prevNextWaveFrame - 5); // Decrease every second
      }
    }, 1000);
  
    return () => {
      cancelAnimationFrame(animationFrameId); // Cleanup when the component unmounts
      clearInterval(intervalId); // Cleanup the interval
    };
  }, [gameStarted, nextWaveFrame, monsters, towers, canvasRef, fieldSize, currentLevel]);
  
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
      <canvas ref={canvasRef} width={fieldSize * 10} height={fieldSize * 10} onClick={handleCanvasClick}></canvas>
      <br></br>
      {nextWaveFrame === 0 && (
        <button onClick={startNextLevel}>Start Next Level</button>
      )}
    </div>
  );
}

export default App;
