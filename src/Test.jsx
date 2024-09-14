import React, { useState, useEffect, useRef } from "react";

const AnimatedCircles = () => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const cursorRef = useRef(null);
  const circlesRef = useRef([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCoords({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const circles = circlesRef.current;
    const cursor = cursorRef.current;

    const animateCircles = () => {
      let x = coords.x;
      let y = coords.y;

      if (cursor) {
        cursor.style.top = y + "px";
        cursor.style.left = x + "px";
      }

      circles.forEach((circle, index) => {
        if (circle) {
          circle.style.left = x - 12 + "px";
          circle.style.top = y - 12 + "px";

          circle.style.transform = `scale(${(circles.length - index) / circles.length})`;

          circle.x = x;
          circle.y = y;

          const nextCircle = circles[index + 1] || circles[0];
          x += (nextCircle.x - x) * 0.3;
          y += (nextCircle.y - y) * 0.3;
        }
      });

      requestAnimationFrame(animateCircles);
    };

    animateCircles();
  }, [coords]);

  return (
    <div>
      <div className="cursor" ref={cursorRef}></div>
      {[...Array(10)].map((_, index) => (
        <div
          key={index}
          className="circle"
          ref={(el) => (circlesRef.current[index] = el)}
          style={{ position: "absolute", backgroundColor: "white" }}
        />
      ))}
    </div>
  );
};

export default AnimatedCircles;
