import Food from './Food.jsx';
import Snake from './Snake.jsx';

function Board({ snake, food, boardSize }) {
  return (
    <div
      className="board"
      style={{
        gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
        gridTemplateRows: `repeat(${boardSize}, 1fr)`,
      }}
    >
      <Snake segments={snake} />
      {food && <Food position={food} />}
    </div>
  );
}

export default Board;
