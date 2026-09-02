import React, { useState, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Sparkles, 
  Film, 
  Layers, 
  Compass 
} from 'lucide-react';
import './HeroVideo.css';

// Cinematic High-Definition Videos from src/asset (served via public/videos/)
const HERO_VIDEOS = [
  {
    id: 'bmw-m4',
    title: 'BMW M4 Competition • Portimao Blue Edition',
    subtitle: '503 HP Track Dominance — M TwinPower Turbo',
    badge: '⚡ BMW M4 Competition',
    url: '/videos/BMW_M4_Competition_rotating_202608201410.mp4',
    poster: '/images/BMW_M4_Competition_Blue_Edition.jfif'
  },
  {
    id: 'dodge-hellcat',
    title: 'Dodge Challenger SRT Hellcat • Supercharged V8',
    subtitle: '717 Horsepower of Raw American Muscle',
    badge: '🔥 Dodge SRT Hellcat',
    url: '/videos/Dodge_Challenger_rotating_on_green_202608201411.mp4',
    poster: '/images/Dodge_SRT_Hellcat.jfif'
  },
  {
    id: 'ford-mustang',
    title: 'Ford Mustang Shelby GT500 • Predator Racing Heritage',
    subtitle: 'Supercharged V8 Performance with Active Track Aero',
    badge: '🐎 Mustang Shelby GT500',
    url: '/videos/Ford_Mustang_rotating_on_green_202608201411.mp4',
    poster: '/images/SHELBY_GT_500.jfif'
  },
  {
    id: 'porsche-gt3',
    title: 'Porsche 911 GT3 RS • Pure Precision',
    subtitle: 'Track-Bred Engineering — Raw & Relentless',
    badge: '🏁 Porsche GT3 RS',
    url: '/videos/Porsche_911_GT3_RS.mp4',
    poster: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'ducati-panigale',
    title: 'Ducati Panigale V4 • Italian Fury',
    subtitle: 'Two Wheels of Pure Adrenaline & MotoGP Aero',
    badge: '🏍️ Ducati Panigale V4',
    url: '/videos/Ducati_Panigale_V4.mp4',
    poster: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'mercedes-c300',
    title: 'Mercedes-Benz C-Class 300 • Executive Luxury',
    subtitle: 'Sophistication Meets Supreme Suspension Comfort',
    badge: '⭐ Mercedes C300',
    url: '/videos/Mercedes_Benz_C_Class_300.mp4',
    poster: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'thar-roxx',
    title: 'Mahindra Thar Roxx • 4x4 Off-Road Beast',
    subtitle: 'Conquer Every Terrain — 4XPLOR Terrain Mastery',
    badge: '🌍 Thar Roxx 4x4',
    url: '/videos/Mahindra_Thar_Roxx_OffRoad.mp4',
    poster: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80'
  }
];

export function HeroVideo({ customVideoUrl, customPoster }) {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const currentVideo = HERO_VIDEOS[activeVideoIndex];
  const videoSrc = customVideoUrl || currentVideo.url;
  const posterSrc = customPoster || currentVideo.poster;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <div 
      className="hero-video-wrapper"
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Outer Glow & Ambient Lighting */}
      <div className="hero-video-glow" />

      {/* Main Video Frame */}
      <div className="hero-video-frame">
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="hero-video-element"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Cinematic Film Vignette & Gradient Overlays */}
        <div className="hero-video-overlay-gradient" />
        <div className="hero-video-scanline" />

        {/* Top Video HUD Information */}
        <div className="hero-video-top-hud">
          <div className="video-badge-pill">
            <span className="video-live-recording-dot" />
            <span>{currentVideo.badge}</span>
          </div>

          <div className="video-quality-tag">
            <Sparkles size={13} className="text-accent" />
            <span>4K CINEMATIC</span>
          </div>
        </div>

        {/* Center Big Play Button (shown when paused or hovered) */}
        {!isPlaying && (
          <button className="video-center-play-btn animate-scale-up" onClick={togglePlay}>
            <Play size={28} className="play-icon-offset" />
          </button>
        )}

        {/* Bottom Floating Control Bar */}
        <div className={`hero-video-bottom-hud ${isHovered || !isPlaying ? 'hud-visible' : ''}`}>
          <div className="video-info-block">
            <h3 className="video-hud-title">{currentVideo.title}</h3>
            <p className="video-hud-sub">{currentVideo.subtitle}</p>
          </div>

          <div className="video-actions-group">
            {/* Play/Pause Button */}
            <button className="video-ctrl-btn" onClick={togglePlay} title={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>

            {/* Mute/Unmute Button */}
            <button className="video-ctrl-btn" onClick={toggleMute} title={isMuted ? "Unmute Audio" : "Mute Audio"}>
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            {/* Fullscreen Button */}
            <button className="video-ctrl-btn" onClick={toggleFullscreen} title="Fullscreen Cinema">
              <Maximize2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Cinematic Scene Switcher Selector */}
      <div className="video-scene-selector">
        <span className="scene-selector-label">
          <Film size={14} className="text-accent" />
          <span>Cinematic Scene:</span>
        </span>
        <div className="scene-pills-list">
          {HERO_VIDEOS.map((vid, idx) => (
            <button
              key={vid.id}
              className={`scene-pill ${activeVideoIndex === idx ? 'active-scene-pill' : ''}`}
              onClick={() => {
                setActiveVideoIndex(idx);
                setIsPlaying(true);
              }}
            >
              {vid.badge}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HeroVideo;
