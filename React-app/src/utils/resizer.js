export function initializeResizer() {
  const resizer = document.querySelector('.resizer');
  const leftSide = resizer.previousElementSibling;
  const rightSide = resizer.nextElementSibling;
  const container = resizer.parentNode;

  let x = 0;
  let leftWidth = 0;

  const updateResizerPosition = () => {
    const leftRect = leftSide.getBoundingClientRect();
    resizer.style.left = `${leftRect.right}px`;
  };

  const mouseDownHandler = function(e) {
    x = e.clientX;
    leftWidth = leftSide.getBoundingClientRect().width;
    
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
    resizer.classList.add('dragging');
  };

  const mouseMoveHandler = function(e) {
    const dx = e.clientX - x;
    const containerWidth = container.getBoundingClientRect().width;
    const newLeftWidth = ((leftWidth + dx) * 100) / containerWidth;

    if (newLeftWidth > 20 && newLeftWidth < 80) {
      leftSide.style.width = `${newLeftWidth}%`;
      rightSide.style.width = `${100 - newLeftWidth}%`;
      updateResizerPosition();
    }
  };

  const mouseUpHandler = function() {
    resizer.classList.remove('dragging');
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  };

  // Set initial position
  updateResizerPosition();

  // Update position on window resize
  window.addEventListener('resize', updateResizerPosition);

  // Attach the handler
  resizer.addEventListener('mousedown', mouseDownHandler);
} 