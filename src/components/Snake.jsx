function Snake({ segments }) {
  return (
    <>
      {segments.map((segment, index) => (
        <div
          className={index === 0 ? 'snake-cell snake-head' : 'snake-cell'}
          style={{
            gridColumnStart: segment.x + 1,
            gridRowStart: segment.y + 1,
          }}
          key={`${segment.x}-${segment.y}-${index}`}
        />
      ))}
    </>
  );
}

export default Snake;
