import React, { useState, useEffect, useRef } from 'react';
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import Tower from './components/Tower';
import Monster from './components/Monster';
import MonsterPath from './components/MonsterPath';

const fieldSize = 30; // Pixels for each field

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastTimestampRef = useRef<number>(0);

  const [gameStarted, setGameStarted] = useState(true);
  const [gold, setGold] = useState(100);
  const [selectedTower, setSelectedTower] = useState<string | null>(null);
  const [nextWaveFrame, setNextWaveFrame] = useState(250);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [towers, setTowers] = useState<Tower[]>([]);
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const monsterPath = new MonsterPath([
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
  ]);

  const handleTowerSelection = (value: React.SetStateAction<string | null>) => {
    setSelectedTower(value);
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = event.target as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const gridX = Math.floor(mouseX / fieldSize);
    const gridY = Math.floor(mouseY / fieldSize);

    const towerCost = 20;
    if (gold >= towerCost && selectedTower) {
      setGold((prevGold) => prevGold - towerCost);

      const newTower = new Tower(selectedTower, gridX, gridY);
      setTowers((prevTowers) => [...prevTowers, newTower]);
    } else {
      alert('Not enough gold or tower not selected');
    }
  };

  const updateGame = (timestamp: number) => {
    const deltaTime = timestamp - lastTimestampRef.current;
    lastTimestampRef.current = timestamp;

    setTowers((prevTowers) => {
      return prevTowers.map((tower) => {
        // Update tower logic here
        return tower;
      });
    });

    setMonsters((prevMonsters) => {
      return prevMonsters.map((monster) => {
        monster.update(deltaTime);

        if (monster.path.positions.length === 0) {
          return undefined;
        }

        return monster;
      }).filter(Boolean) as Monster[];
    });

    // Check for other game state updates here
  };

  const updateLoop = () => {
    const timestamp = performance.now();
    updateGame(timestamp);
    requestAnimationFrame(updateLoop);
  };

  useEffect(() => {
    // Start the update loop
    updateLoop();

    // Clean up the loop on component unmount
    return () => {
      // Additional cleanup logic if needed
      cancelAnimationFrame(updateLoop);
    };
  }, [updateGame]);

  useEffect(() => {
    // Start the drawing loop
    const drawGame = () => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');

      if (context && canvas) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        towers.forEach((tower) => {
          tower.draw(context, fieldSize);
        });

        monsters.forEach((monster) => {
          monster.display(context, fieldSize);
        });
      }

      // Continue the drawing loop
      requestAnimationFrame(drawGame);
    };

    drawGame();

    // Cleanup the drawing loop on component unmount
    return () => {
      // Additional cleanup logic if needed
    };
  }, [towers, monsters, fieldSize]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (gameStarted && nextWaveFrame === 0) {
        const newMonster = new Monster(
          { x: 0, y: 0 },
          monsterPath
        );
        setMonsters((prevMonsters) => [...prevMonsters, newMonster]);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [gameStarted, nextWaveFrame, monsterPath]);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setNextWaveFrame((prevFrame) => Math.max(0, prevFrame - 30));
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  return (
    <div className="main">
      <h1>My Tower Defense</h1>
      <p>Game Started: {gameStarted.toString()}</p>
      <p>Gold: {gold}</p>
      <p>Selected Tower: {selectedTower}</p>
      <p>Next Wave Frame: {nextWaveFrame}</p>
      <p>Current Level: {currentLevel}</p>

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
      <br></br>
      <canvas ref={canvasRef} width={fieldSize * 10} height={fieldSize * 10} onClick={handleCanvasClick}></canvas>
    </div>
  );
}

export default App;
