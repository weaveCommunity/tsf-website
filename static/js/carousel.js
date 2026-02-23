document.addEventListener("DOMContentLoaded", function () {
  const carousels = document.querySelectorAll(".auto-carousel");

  carousels.forEach(carousel => {
    const track = carousel.querySelector(".auto-carousel-track");
    if (!track) return;

    const items = track.querySelectorAll(".auto-carousel-item");
    if (items.length === 0) return;

    const visible = parseInt(carousel.dataset.visible || "3", 10);
    const speed = parseInt(carousel.dataset.speed || "30", 10); // ms between steps
    const stepPx = 1; // pixels per step; lower = smoother/slower

    // 1. Set item widths so exactly "visible" items fit in the container
    function setItemWidths() {
      const containerWidth = carousel.clientWidth;
      const itemWidth = containerWidth / visible;
      items.forEach(item => {
        item.style.minWidth = itemWidth + "px";
        item.style.maxWidth = itemWidth + "px";
      });
    }

    setItemWidths();

    // 2. We will scroll the track by translateX continuously
    let x = 0;
    let trackWidth = track.scrollWidth; // full width of both sets

    function step() {
      x -= stepPx;

      // When we've scrolled half the track width, snap back by half
      // because the second half is an exact duplicate of the first.
      const halfWidth = trackWidth / 2;

      if (Math.abs(x) >= halfWidth) {
        // Move forward by halfWidth to keep things in range,
        // but visually nothing changes because content repeats.
        x += halfWidth;
      }

      track.style.transform = "translateX(" + x + "px)";
    }

    let timer = setInterval(step, speed);

    // Optional: pause on hover
    carousel.addEventListener("mouseenter", () => clearInterval(timer));
    carousel.addEventListener("mouseleave", () => {
      timer = setInterval(step, speed);
    });

    // 3. On resize, recompute widths and trackWidth
    window.addEventListener("resize", () => {
      setItemWidths();
      // Wait for layout to settle, then recompute scrollWidth
      requestAnimationFrame(() => {
        trackWidth = track.scrollWidth;
      });
    });
  });
});
