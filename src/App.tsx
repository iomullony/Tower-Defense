import React, { useState, useEffect, useRef } from 'react';
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import Tower from './components/Tower';

const fieldSize = 30; // Pixels for each field

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gold, setGold] = useState(100);
  const [selectedTower, setSelectedTower] = useState<string | null>(null); // Explicitly set the type for selectedTower
  const [nextWaveFrame, setNextWaveFrame] = useState(250);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [towers, setTowers] = useState<Tower[]>([]); // Array of towers

  const canvasRef = useRef<HTMLCanvasElement>(null); // Add HTMLCanvasElement type

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

  useEffect(() => {
    const canvas = canvasRef.current!;
    const context = canvas.getContext('2d');
  
    if (context) {
      const draw = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
  
        // Draw each tower
        towers.forEach((tower) => {
          tower.draw(context, fieldSize);
        });
  
        // Continue the drawing loop
        requestAnimationFrame(draw);
      };
  
      // Start the drawing loop
      draw();
    }
  }, [towers, canvasRef, fieldSize]);
  
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
    </div>
  );
}

export default App;
