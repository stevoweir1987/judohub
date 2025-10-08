import React, { useState, useEffect } from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';

const InddViewer = ({ url, title }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if the user is on a mobile device
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    setIsMobile(/android|ipad|iphone|ipod|iemobile|mobile/i.test(userAgent));
  }, []);

  const toggleFullscreen = () => {
    if (isMobile) {
      // On mobile, simulate fullscreen by hiding controls and maximizing view
      setShowControls(!showControls);
    } else {
      // On desktop, use actual fullscreen API
      setIsFullscreen(!isFullscreen);
    }
  };

  const exitFullscreen = () => {
    setIsFullscreen(false);
    setShowControls(true);
 };

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
 }, []);

  return (
    <div className={`bg-gray-800 rounded-lg border-gray-700 p-6 ${isFullscreen ? 'fixed inset-0 z-50 overflow-auto' : ''}`}>
      <div className={`flex justify-between items-center mb-4 ${isFullscreen ? 'sticky top-0 bg-gray-800 z-10 p-4 -m-6 -mt-4 rounded-t-lg' : ''}`}>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <div className="flex space-x-2">
          {!isMobile && (
            <button
              onClick={() => setShowControls(!showControls)}
              className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded"
            >
              {showControls ? 'Hide Controls' : 'Show Controls'}
            </button>
          )}
          <button
            onClick={toggleFullscreen}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
          >
            {isMobile ? 
              (showControls ? <Minimize2 size={18} /> : <Maximize2 size={18} />) : 
              (isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />)
            }
          </button>
          {(isFullscreen || (isMobile && !showControls)) && (
            <button
              onClick={exitFullscreen}
              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
      
      <div className={`${showControls ? 'h-96' : 'h-screen'} ${isFullscreen ? 'h-[calc(100vh-80px)]' : ''} relative`}>
        <iframe 
          src={url}
          className="w-full h-full border border-gray-600 rounded"
          title={title}
          allow="autoplay; fullscreen"
          allowFullScreen
        >
          <p>Your browser doesn't support iframes. <a href={url} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Click here to view the document</a></p>
        </iframe>
      </div>
      
      {showControls && !isMobile && (
        <div className="mt-4 text-sm text-gray-400">
          <p>Use the fullscreen button to view the document in full screen mode.</p>
          <p>Controls can be hidden to maximize viewing area.</p>
        </div>
      )}
      
      {isMobile && (
        <div className="mt-4 text-sm text-gray-400">
          <p>Tap the maximize button to expand the document view.</p>
          <p>Tap again to return to normal view.</p>
        </div>
      )}
    </div>
  );
};

export default InddViewer;
