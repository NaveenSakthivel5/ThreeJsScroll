import React, { useEffect, useRef, useState } from 'react';

const ThreeJsVideo2 = () => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const tickingRef = useRef(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          const video = videoRef.current;
          const container = containerRef.current;
          if (!video || !container) return;

          const rect = container.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const scrollY = window.scrollY;

          if (rect.top <= 0) {
            setIsSticky(true);
          } else {
            setIsSticky(false);
          }

          if (rect.top <= windowHeight && rect.bottom >= 0) {
            const scrollStart = scrollY + rect.top - windowHeight;
            const scrollEnd = scrollY + rect.bottom;
            const scrollRange = scrollEnd - scrollStart;

            const videoDuration = video.duration;
            const scrollRelativeToVideo = (scrollY - scrollStart) / scrollRange;
            const easedTime = easeInOutQuad(scrollRelativeToVideo);
            const newTime = videoDuration * Math.min(Math.max(easedTime, 0), 1);

            video.currentTime = newTime;
          }

          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          window.addEventListener('scroll', handleScroll);
        } else {
          window.removeEventListener('scroll', handleScroll);
        }
      });
    }, {
      threshold: 0.1,
    });

    observer.observe(containerRef.current);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const easeInOutQuad = (t) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  };

  return (
    <div ref={containerRef} style={{ minHeight: '100vh', position: 'relative' }}>
      <video
        ref={videoRef}
        muted
        playsInline
        style={{
          width: '100%',
          height: 'auto',
          objectFit: 'cover',
          position: isSticky ? 'fixed' : 'relative',
          top: isSticky ? '0' : 'auto',
          left: isSticky ? '0' : 'auto',
          zIndex: isSticky ? 1000 : 'auto',
          transition: 'position 0.3s ease-in-out',
        }}
        preload="metadata"
      >
        <source src="/Gear3.webm" type="video/webm" />
      </video>
    </div>
  );
};

export default ThreeJsVideo2;
