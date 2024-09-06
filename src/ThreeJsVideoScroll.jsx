import React, { useEffect, useRef } from 'react';

const ThreeJsVideoScroll = () => {
  const videoRef = useRef(null);
  const lastFrameTime = useRef(0);  // Track the time of the last frame
  const targetVideoTime = useRef(0);  // Target video time for easing
  const currentVideoTime = useRef(0);  // Current video time for easing

  useEffect(() => {
    const handleMetadataLoaded = () => {
      const video = videoRef.current;
      const fps = 60;  // Target frames per second
      const fpsInterval = 1000 / fps;

      // Custom easing function for smoother easing
      const easeInOutQuad = (t) => {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      };

      const updateVideoFrame = (now) => {
        if (now - lastFrameTime.current >= fpsInterval) {
          lastFrameTime.current = now;

          const scrollPosition = window.scrollY;
          const scrollHeight = document.body.scrollHeight - window.innerHeight;
          const videoDuration = video.duration;

          // Calculate target time based on scroll position
          targetVideoTime.current = (scrollPosition / scrollHeight) * videoDuration;

          // Apply easing to the video time transition
          const delta = targetVideoTime.current - currentVideoTime.current;
          const easingFactor = 0.2;  // Increase this value for faster easing
          currentVideoTime.current += delta * easeInOutQuad(easingFactor);

          // Ensure the video time is within bounds
          if (currentVideoTime.current < 0) {
            currentVideoTime.current = 0;
          } else if (currentVideoTime.current > videoDuration) {
            currentVideoTime.current = videoDuration;
          }

          video.currentTime = currentVideoTime.current;  // Update the video time
        }

        requestAnimationFrame(updateVideoFrame);  // Continue the loop
      };

      // Start the animation loop for scroll
      requestAnimationFrame(updateVideoFrame);
    };

    const video = videoRef.current;
    if (video) {
      video.addEventListener('loadedmetadata', handleMetadataLoaded);
    }

    // Clean up event listeners on unmount
    return () => {
      if (video) video.removeEventListener('loadedmetadata', handleMetadataLoaded);
    };
  }, []);

  return (
    <video id="background-video-1" ref={videoRef} muted playsInline style={{ width: '100%', height: 'auto' }}>
      {/* Update the video source to GearRev.webm */}
      <source src="/GearRev.webm" type="video/webm" />
    </video>
  );
};

export default ThreeJsVideoScroll;
