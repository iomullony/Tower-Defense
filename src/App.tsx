import React, { useState, useEffect, useRef } from 'react';
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

import Tower from './components/Tower';
import Monster from './components/Monster';
import MonsterPath from './components/MonsterPath';

const fieldSize = 30; // Pixels for each field
const waveFrame = 250;
const towerCost = 20;

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
  const [monsterPath, setMonsterPath] = useState<MonsterPath[] | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const generateMonsterPath = React.useMemo(() =>  {
    // Define your path data here
    const pathData = [
      { position: { x: 0, y: 0 }, nextPosition: { x: 1, y: 0 } },
      { position: { x: 1, y: 0 }, nextPosition: { x: 2, y: 0 } },
      { position: { x: 2, y: 0 }, nextPosition: { x: 3, y: 0 } },
      { position: { x: 3, y: 0 }, nextPosition: { x: 4, y: 0 } },
      { position: { x: 4, y: 0 }, nextPosition: { x: 5, y: 0 } },
      { position: { x: 5, y: 0 }, nextPosition: { x: 5, y: 1 } },

      { position: { x: 5, y: 1 }, nextPosition: { x: 5, y: 2 } },
      { position: { x: 5, y: 2 }, nextPosition: { x: 5, y: 3 } },
      { position: { x: 5, y: 3 }, nextPosition: { x: 5, y: 4 } },
      { position: { x: 5, y: 4 }, nextPosition: { x: 5, y: 5 } },
      { position: { x: 5, y: 5 }, nextPosition: { x: 5, y: 6 } },
      { position: { x: 5, y: 6 }, nextPosition: { x: 5, y: 7 } },
      { position: { x: 5, y: 7 }, nextPosition: { x: 5, y: 8 } },
      { position: { x: 5, y: 8 }, nextPosition: { x: 5, y: 9 } },
      { position: { x: 5, y: 9 }, nextPosition: { x: 5, y: 10 } },
      { position: { x: 5, y: 10 }, nextPosition: { x: 5, y: 11 } },
      { position: { x: 5, y: 11 }, nextPosition: { x: 5, y: 12 } },
      { position: { x: 5, y: 12 }, nextPosition: { x: 5, y: 13 } },
      
      { position: { x: 5, y: 13 }, nextPosition: { x: 6, y: 13 } },
      { position: { x: 6, y: 13 }, nextPosition: { x: 7, y: 13 } },
      { position: { x: 7, y: 13 }, nextPosition: { x: 8, y: 13 } },
      { position: { x: 8, y: 13 }, nextPosition: { x: 9, y: 13 } },
      { position: { x: 9, y: 13 }, nextPosition: { x: 10, y: 13 } },
      { position: { x: 10, y: 13 }, nextPosition: { x: 11, y: 13 } },

      { position: { x: 11, y: 13 }, nextPosition: { x: 11, y: 12 } },
      { position: { x: 11, y: 12 }, nextPosition: { x: 11, y: 11 } },
      { position: { x: 11, y: 11 }, nextPosition: { x: 11, y: 10 } },
      { position: { x: 11, y: 10 }, nextPosition: { x: 11, y: 9 } },
      { position: { x: 11, y: 9 }, nextPosition: { x: 11, y: 8 } },
      { position: { x: 11, y: 8 }, nextPosition: { x: 11, y: 7 } },
      { position: { x: 11, y: 7 }, nextPosition: { x: 11, y: 6 } },
      { position: { x: 11, y: 6 }, nextPosition: { x: 11, y: 5 } },
      { position: { x: 11, y: 5 }, nextPosition: { x: 11, y: 4 } },
      { position: { x: 11, y: 4 }, nextPosition: { x: 11, y: 3 } },
      { position: { x: 11, y: 3 }, nextPosition: { x: 11, y: 2 } },
      { position: { x: 11, y: 2 }, nextPosition: { x: 11, y: 1 } },
      
      { position: { x: 11, y: 1 }, nextPosition: { x: 12, y: 1 } },
      { position: { x: 12, y: 1 }, nextPosition: { x: 13, y: 1 } },
      { position: { x: 13, y: 1 }, nextPosition: { x: 14, y: 1 } },
      { position: { x: 14, y: 1 }, nextPosition: { x: 15, y: 1 } },
      { position: { x: 15, y: 1 }, nextPosition: { x: 16, y: 1 } },
      { position: { x: 16, y: 1 }, nextPosition: { x: 17, y: 1 } },
      
      { position: { x: 17, y: 1 }, nextPosition: { x: 17, y: 2 } },
      { position: { x: 17, y: 2 }, nextPosition: { x: 17, y: 3 } },
      { position: { x: 17, y: 3 }, nextPosition: { x: 17, y: 4 } },
      { position: { x: 17, y: 4 }, nextPosition: { x: 17, y: 5 } },
      { position: { x: 17, y: 5 }, nextPosition: { x: 17, y: 6 } },
      { position: { x: 17, y: 6 }, nextPosition: { x: 17, y: 7 } },
      { position: { x: 17, y: 7 }, nextPosition: { x: 17, y: 8 } },
      { position: { x: 17, y: 8 }, nextPosition: { x: 17, y: 9 } },
      { position: { x: 17, y: 9 }, nextPosition: { x: 17, y: 10 } },
      { position: { x: 17, y: 10 }, nextPosition: { x: 17, y: 11 } },
      
      { position: { x: 17, y: 11 }, nextPosition: { x: 18, y: 11 } },
      { position: { x: 18, y: 11 }, nextPosition: { x: 19, y: 11 } },
      { position: { x: 19, y: 11 }, nextPosition: { x: 20, y: 11 } },
      { position: { x: 20, y: 11 }, nextPosition: { x: 21, y: 11 } },
      { position: { x: 21, y: 11 }, nextPosition: { x: 22, y: 11 } },
      { position: { x: 22, y: 11 }, nextPosition: { x: 23, y: 11 } },
      { position: { x: 23, y: 11 }, nextPosition: { x: 24, y: 11 } },
    ];
  
    setMonsterPath(pathData);
    return pathData;
  }, []);

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
  
    // Check if the clicked grid position is part of the monster path
    if (isGridPositionOnPath(gridX, gridY)) {
      alert('Cannot place tower on the monster path!');
      return;
    }
  
    // Check if enough gold is present
    if (gold >= towerCost && selectedTower) {
      // Deduct gold
      setGold((prevGold) => prevGold - towerCost);
  
      // Create and add a new tower to the array
      const newTower = new Tower(selectedTower, gridX, gridY);
      setTowers((prevTowers) => [...prevTowers, newTower]);
    } else {
      alert('Not enough gold or tower not selected to build a tower!');
    }
  };
  
  // Function to check if a grid position is on the monster path
  const isGridPositionOnPath = (gridX: number, gridY: number): boolean => {
    if (!monsterPath) {
      return false;
    }
  
    return monsterPath.some((pathSegment) => {
      const { x, y } = pathSegment.position;
      const nextX = pathSegment.nextPosition?.x || x;
      const nextY = pathSegment.nextPosition?.y || y;
  
      // Check if the grid position is within the bounding box of the path segment
      return gridX >= Math.min(x, nextX) && gridX <= Math.max(x, nextX) &&
        gridY >= Math.min(y, nextY) && gridY <= Math.max(y, nextY);
    });
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

  const startNextLevel = () => {
    setCurrentLevel((prevLevel) => prevLevel + 1);
    setInitialNextWaveFrame(waveFrame); // Set the initial value for nextWaveFrame
    startTime.current = Date.now(); // Update startTime for the new level
    createMonstersForLevel(currentLevel + 1);
    setNextWaveFrame(waveFrame); // Reset the nextWaveFrame
  };
  
  // Call this function in createMonstersForLevel
  const createMonstersForLevel = (level: number) => {
    const numberOfMonsters = level * 2 + 5;
    const baseMonsterSpeed = 0.4;
    const delayRange = { min: 800, max: 1000 };
  
    const createMonsterWithDelay = (index: number, speed: number) => {
      setTimeout(() => {
        const pathCopy = [...generateMonsterPath];
        const newMonster = new Monster(pathCopy, speed);
        setMonsters((prevMonsters) => [...prevMonsters, newMonster]);
      }, index * (Math.random() * (delayRange.max - delayRange.min) + delayRange.min));
    };
  
    for (let i = 1; i <= numberOfMonsters; i++) {
      const monsterSpeed = baseMonsterSpeed + level * 0.01;
      createMonsterWithDelay(i, monsterSpeed);
    }
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

      if (!gameStarted) {
        return;
      }

      animationFrameId = requestAnimationFrame(draw);
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the path
      if (monsterPath) {
        context.strokeStyle = 'gray';
        context.lineWidth = fieldSize;

        context.beginPath();
        monsterPath.forEach((pathSegment, index) => {
          const { x, y } = pathSegment.position;

          if (index === 0) {
            context.moveTo(x * fieldSize, y * fieldSize + fieldSize / 2);
          } else {
            context.lineTo(x * fieldSize + fieldSize / 2, y * fieldSize + fieldSize / 2);
          }

          if (pathSegment.nextPosition) {
            const { x: nextX, y: nextY } = pathSegment.nextPosition;

            // Draw horizontal line
            context.lineTo(nextX * fieldSize + fieldSize / 2, y * fieldSize + fieldSize / 2);

            // Draw vertical line
            context.lineTo(nextX * fieldSize + fieldSize / 2, nextY * fieldSize + fieldSize / 2);

            // If it's the last segment, connect back to the bottom-center of the last square
            if (index === monsterPath.length - 1) {
              context.lineTo(nextX * fieldSize + fieldSize / 2, nextY * fieldSize + fieldSize);
            }
          }
        });
        context.stroke();
      }

      towers.forEach((tower) => {
        tower.draw(context, fieldSize);
      });

      monsters.forEach((monster) => {
        monster.update(100);
      });

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
  }, [gameStarted, nextWaveFrame, initialNextWaveFrame, monsters, towers, canvasRef, fieldSize, currentLevel, monsterPath]);

  useEffect(() => {
    if (nextWaveFrame === 0) {
      // timeout to take a second to go to the next level
      setTimeout(() => {
        startNextLevel();
      }, 1000);
    }
  }, [nextWaveFrame]);
  
 
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
      {gameStarted && (
        <button onClick={startNextLevel}>Next Wave</button>
      )}
    </div>
  );
}

export default App;
