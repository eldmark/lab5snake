function Snake({ segments }) {
  return (
    <>
      {segments.map((segment, index) => {
        const isHead = index === 0;
        const isWhiteSegment = !isHead && index % 3 === 0;
        const className = [
          'snake-cell',
          isHead ? 'snake-head' : '',
          isWhiteSegment ? 'snake-tail-white' : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <div
            className={className}
            style={{
              gridColumnStart: segment.x + 1,
              gridRowStart: segment.y + 1,
            }}
            key={`${segment.x}-${segment.y}-${index}`}
          />
        );
      })}
    </>
  );
}

export default Snake;
