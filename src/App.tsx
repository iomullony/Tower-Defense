import React, { useState, useEffect, useRef } from 'react';
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import Tower from './components/Tower';
import MonsterPath from './components/MonsterPath';
import Monster from './components/Monster';

const fieldSize = 30; // Pixels for each field
const monsterSpeed = 1; // Adjust as needed
const monsterUpdateInterval = 100;

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gold, setGold] = useState(100);
  const [selectedTower, setSelectedTower] = useState<string | null>(null); // Explicitly set the type for selectedTower
  const [nextWaveFrame, setNextWaveFrame] = useState(250);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [towers, setTowers] = useState<Tower[]>([]); // Array of towers
  const [monsters, setMonsters] = useState<Monster[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null); // Add HTMLCanvasElement type

  const handleTowerSelection = (value: React.SetStateAction<string | null>) => {
    setSelectedTower(value);
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
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

    const newMonsterPath: MonsterPath[] = [
      { position: { x: 0, y: 0 }, nextPosition: { x: 1, y: 0 } },
      { position: { x: 1, y: 0 }, nextPosition: { x: 2, y: 0 } },
      { position: { x: 2, y: 0 }, nextPosition: { x: 3, y: 0 } },
      { position: { x: 3, y: 0 }, nextPosition: { x: 4, y: 0 } },
      { position: { x: 4, y: 0 }, nextPosition: null }, // last position is null
    ];

    const newMonster = new Monster(newMonsterPath);
    setMonsters((prevMonsters) => [...prevMonsters, newMonster]);

  };
  
  const startGame = () => {
    setGameStarted(true);
  };

  useEffect(() => {
    const canvas = canvasRef.current!;
    const context = canvas.getContext('2d');

    let animationFrameId: number;
    let monsterIntervalId: number;

    
    if (!canvas || !context) {
      console.error('Canvas or context is null or undefined.');
      return;
    }

    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw each tower
      towers.forEach((tower) => {
        tower.draw(context, fieldSize);
      });

      // C. Call the Monster.display method for each monster
      monsters.forEach((monster) => {
        monster.display(context, fieldSize);
      });

      // D. Update each monster's position with controlled speed
      monsters.forEach((monster) => {
        for (let i = 0; i < monsterSpeed; i++) {
          monster.update();
        }
      });

      // Continue the drawing loop
      animationFrameId = requestAnimationFrame(draw);
    };

    // B. Check if it's time to create new monsters based on nextWaveFrame
    const handleNextWave = () => {
      if (gameStarted && nextWaveFrame % 100 === 0) {
        const newMonsterPath: MonsterPath[] = [
          { position: { x: 0, y: 0 }, nextPosition: { x: 1, y: 0 } },
          { position: { x: 1, y: 0 }, nextPosition: { x: 2, y: 0 } },
          { position: { x: 2, y: 0 }, nextPosition: null }, // last position is null
        ];

        const newMonster = new Monster(newMonsterPath);
        setMonsters((prevMonsters) => [...prevMonsters, newMonster]);
      }
    };

    // Start the drawing loop
    draw();

    // Start the interval for updating monsters
    monsterIntervalId = setInterval(() => {
      handleNextWave();
    }, monsterUpdateInterval);

    // Cleanup functions
    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(monsterIntervalId);
    };
  }, [towers, monsters, gameStarted, nextWaveFrame]);

  return (
    <div className="main">
      <h1>My Tower Defense</h1>
      <p>Game Started: {gameStarted.toString()}</p>
      <p>Gold: {gold}</p>
      <p>Selected Tower: {selectedTower}</p>
      <p>Next Wave Frame: {nextWaveFrame}</p>
      <p>Current Level: {currentLevel}</p>
      <button onClick={startGame}>Start Game</button>

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
