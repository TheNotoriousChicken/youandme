let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // Unified move handler for both mouse and touch events
    const handleMove = (e) => {
      // Prevent default behavior for touch events if needed
      if (e.type === 'touchmove') {
        e.preventDefault();
      }
      
      // Get client coordinates whether it's touch or mouse
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      if (!this.rotating) {
        this.mouseX = clientX;
        this.mouseY = clientY;
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      const dirX = clientX - this.mouseTouchX;
      const dirY = clientY - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      
      if (dirLength > 5) { // Only update if drag is significant
        const dirNormalizedX = dirX / dirLength;
        const dirNormalizedY = dirY / dirLength;
        const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
        let degrees = 180 * angle / Math.PI;
        degrees = (360 + Math.round(degrees)) % 360;
        
        if (this.rotating) {
          this.rotation = degrees;
        }
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    // Attach move events
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove, { passive: false });

    const handleStart = (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;
      paper.style.zIndex = highestZ;
      highestZ += 1;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      this.mouseTouchX = clientX;
      this.mouseTouchY = clientY;
      this.prevMouseX = clientX;
      this.prevMouseY = clientY;

      // For right-click or multi-touch, set rotating to true
      if (e.button === 2 || (e.touches && e.touches.length > 1)) {
        this.rotating = true;
      }
    };

    // Attach start events
    paper.addEventListener('mousedown', handleStart);
    paper.addEventListener('touchstart', handleStart);

    // End handler for mouseup and touchend/cancel
    const handleEnd = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };

    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchend', handleEnd);
    window.addEventListener('touchcancel', handleEnd);
  }
}

// Initialize all elements with class "paper"
const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
