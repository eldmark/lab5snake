function Food({ position }) {
  return (
    <div
      className="food-cell"
      style={{
        gridColumnStart: position.x + 1,
        gridRowStart: position.y + 1,
      }}
    />
  );
}

export default Food;
