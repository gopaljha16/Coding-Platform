export const renderArray = (ctx, visualizationData, currentStep) => {
  if (!visualizationData) return;

  const { array, highlights } = visualizationData;

  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const elementWidth = Math.min(50, width / array.length);
  const elementHeight = 50;
  const startX = (width - elementWidth * array.length) / 2;
  const startY = height / 2 - elementHeight / 2;

  ctx.clearRect(0, 0, width, height);
  ctx.font = '20px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  array.forEach((value, index) => {
    const x = startX + index * elementWidth;
    const y = startY;

    // Check if this index is highlighted
    const highlight = highlights.find(h => h.index === index);
    ctx.fillStyle = highlight ? highlight.color : '#555';

    ctx.fillRect(x, y, elementWidth - 5, elementHeight);
    ctx.fillStyle = '#fff';
    ctx.fillText(value, x + (elementWidth - 5) / 2, y + elementHeight / 2);
  });
};

export const renderLinkedList = (ctx, visualizationData, currentStep) => {
  // Placeholder implementation
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = '#fff';
  ctx.font = '24px Arial';
  ctx.fillText('Linked List visualization not implemented yet', ctx.canvas.width / 2, ctx.canvas.height / 2);
};
