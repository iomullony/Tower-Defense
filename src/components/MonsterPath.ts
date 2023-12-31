interface MonsterPath {
  position: { x: number; y: number };
  nextPosition: { x: number; y: number } | null;
}

export default MonsterPath;
