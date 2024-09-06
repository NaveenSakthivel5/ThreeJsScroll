import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const VideoMesh = ({ videoRef }) => {
  const texture = useRef();

  useFrame(() => {
    if (videoRef.current && texture.current && videoRef.current.readyState >= 2) {
      texture.current.needsUpdate = true; // Ensure the texture updates smoothly
    }
  });

  return (
    <mesh>
      <planeGeometry args={[14, 8]} /> {/* Adjust video dimensions */}
      <meshBasicMaterial ref={texture} transparent={true} opacity={1}>
        <videoTexture
          attach="map"
          args={[videoRef.current]}
          encoding={THREE.sRGBEncoding}
        />
      </meshBasicMaterial>
    </mesh>
  );
};

const ScrollControlledVideo = ({ videoSrc }) => {
  const videoRef = useRef(null); // Ref for the video element
  const videoDuration = useRef(0); // Store the duration of the video
  const totalFrames = useRef(0); // Total frames in the video
  const framesPerScroll = 1; // Play one frame per scroll step

  // Set up video metadata and calculate total frames
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.onloadedmetadata = () => {
        videoDuration.current = videoRef.current.duration;

        // Assume a standard frame rate of 30 frames per second
        const fps = 30;
        totalFrames.current = Math.floor(videoDuration.current * fps);
      };
    }
  }, []);

  // Update video playback frame based on scroll position
  const updateVideoFrame = () => {
    const scrollTop = window.scrollY;
    const scrollHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercentage = scrollTop / scrollHeight;

    // Calculate the target frame based on the scroll position
    const targetFrame = Math.min(
      Math.floor(scrollPercentage * totalFrames.current),
      totalFrames.current - 1
    );

    // Calculate the corresponding time in the video for the target frame
    const fps = 30; // Assuming a frame rate of 30 fps
    const newTime = targetFrame / fps;

    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  // Scroll handler
  const handleScroll = () => {
    requestAnimationFrame(updateVideoFrame);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        src={videoSrc} // The uploaded video source
        style={{ display: 'none' }} // Hide the video element
        loop={false}
        muted
        playsInline
      />

      <Canvas
        style={{
          width: '100%',
          height: '70vh', // Height for the video
          position: 'sticky',
          top: '50%', // Stick to the center of the screen
          transform: 'translateY(-50%)', // Center it vertically
          zIndex: 100,
        }}
      >
        <VideoMesh videoRef={videoRef} />
      </Canvas>
    </>
  );
};

const App = () => {
  const videoSrc = '/GearRev.webm'; // Path to the uploaded video

  return (
    <div style={{ height: '200vh' }}>
      <ScrollControlledVideo videoSrc={videoSrc} />
      <div style={{ height: '100vh', visibility: 'hidden' }}></div>
    </div>
  );
};

export default App;
