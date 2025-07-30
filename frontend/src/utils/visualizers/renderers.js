export const renderArray = (canvas, visualizationData, currentStep) => {
  if (!canvas || !visualizationData || !(canvas instanceof window.HTMLCanvasElement)) return;

  const ctx = canvas.getContext('2d');
  const { array, highlights } = visualizationData;

  if (!array || array.length === 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#6B7280';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('No data to visualize', canvas.width / 2, canvas.height / 2);
    return;
  }

  const width = canvas.width;
  const height = canvas.height;
  const elementWidth = Math.min(80, (width - 100) / array.length);
  const elementHeight = 60;
  const startX = (width - elementWidth * array.length) / 2;
  const startY = height / 2 - elementHeight / 2;

  ctx.clearRect(0, 0, width, height);

  array.forEach((value, index) => {
    const x = startX + index * elementWidth;
    const y = startY;

    const highlight = highlights?.find(h => h.index === index);
    const color = highlight?.color || '#374151';

    // Draw shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(x + 3, y + 3, elementWidth - 8, elementHeight);

    // Draw element
    ctx.fillStyle = color;
    ctx.fillRect(x, y, elementWidth - 8, elementHeight);

    // Draw border
    ctx.strokeStyle = highlight ? '#FFFFFF' : '#6B7280';
    ctx.lineWidth = highlight ? 3 : 1;
    ctx.strokeRect(x, y, elementWidth - 8, elementHeight);

    // Draw value
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(value, x + (elementWidth - 8) / 2, y + elementHeight / 2);

    // Draw index
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText(index, x + (elementWidth - 8) / 2, y + elementHeight + 15);
  });
};

export const renderLinkedList = (canvas, visualizationData) => {
  // Placeholder for linked list rendering
};
