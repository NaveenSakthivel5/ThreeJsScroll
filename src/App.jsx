import React from 'react';
import PageOne from './PageOne';
import PageTwo from './PageTwo';
import './App.css';
import ThreeJsVideoScroll from './ThreeJsVideoScroll';
import ThreeJsVideo2 from './ThreeJsVideo2';
import ScrollControlledVideo from './ScrollControlledVideo';

function App() {
  return (
    <div className="app-container">
      <PageOne />
      <PageOne/>
      <PageOne/>
      {/* <ScrollControlledVideo/> */}
      <ThreeJsVideoScroll/>
      {/* <ThreeJsVideo2 /> */}
      <PageTwo />
      <PageTwo/>
      <PageOne/>
      <PageOne/>
      <PageOne/>
      <PageTwo/>
      
    </div>
  );
}

export default App;
