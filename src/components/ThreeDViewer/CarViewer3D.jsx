import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float, Html } from '@react-three/drei';
import { 
  RotateCw, 
  Eye, 
  Sparkles, 
  Layers, 
  Volume2, 
  Activity, 
  Disc, 
  Flame, 
  Zap, 
  Sliders, 
  Maximize2,
  Film,
  Box,
  Play,
  Pause,
  Compass,
  Gauge,
  ShieldCheck,
  Check
} from 'lucide-react';
import * as THREE from 'three';
import './CarViewer3D.css';

// ==========================================
// 🚗 HIGH-FIDELITY 3D BMW / SUPERCAR MODEL
// ==========================================
function DetailedCar3D({ 
  color, 
  finish = 'metallic', 
  caliperColor = '#0055ff', 
  headlights = true, 
  hazards = false, 
  wireframe = false, 
  tint = 0.4,
  onHotspotClick,
  activeHotspot
}) {
  const group = useRef();

  const roughness = finish === 'matte' ? 0.65 : finish === 'carbon' ? 0.35 : 0.14;
  const metalness = finish === 'matte' ? 0.3 : finish === 'carbon' ? 0.8 : 0.94;
  const clearcoat = finish === 'matte' ? 0 : 1.0;

  return (
    <group ref={group} position={[0, -0.2, 0]} scale={[1.25, 1.25, 1.25]}>
      {/* Lower Monocoque Chassis */}
      <mesh position={[0, 0.38, 0]} castShadow>
        <boxGeometry args={[4.45, 0.44, 1.96]} />
        <meshPhysicalMaterial 
          color={color} 
          metalness={metalness} 
          roughness={roughness} 
          clearcoat={clearcoat}
          clearcoatRoughness={0.06}
          wireframe={wireframe} 
        />
      </mesh>

      {/* Aerodynamic Flared Side Skirts */}
      <mesh position={[0, 0.18, 0.98]} castShadow>
        <boxGeometry args={[2.8, 0.08, 0.08]} />
        <meshStandardMaterial color="#08090b" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0, 0.18, -0.98]} castShadow>
        <boxGeometry args={[2.8, 0.08, 0.08]} />
        <meshStandardMaterial color="#08090b" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* BMW Powerdome Contoured Hood */}
      <mesh position={[1.48, 0.52, 0]} rotation={[0, 0, -0.09]} castShadow>
        <boxGeometry args={[1.56, 0.30, 1.86]} />
        <meshPhysicalMaterial 
          color={color} 
          metalness={metalness} 
          roughness={roughness} 
          clearcoat={clearcoat} 
          wireframe={wireframe} 
        />
      </mesh>
      <mesh position={[1.45, 0.64, 0]} rotation={[0, 0, -0.09]} castShadow>
        <boxGeometry args={[1.3, 0.06, 0.65]} />
        <meshPhysicalMaterial color={color} metalness={metalness} roughness={roughness} />
      </mesh>

      {/* Iconic Twin Kidney Grilles */}
      <mesh position={[2.28, 0.36, 0.28]} rotation={[0, 0.08, 0]}>
        <boxGeometry args={[0.08, 0.28, 0.42]} />
        <meshStandardMaterial color="#08090b" roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh position={[2.29, 0.36, 0.28]} rotation={[0, 0.08, 0]}>
        <boxGeometry args={[0.04, 0.30, 0.44]} />
        <meshStandardMaterial 
          color="#00f2ff" 
          emissive={headlights ? "#00c8ff" : "#112233"} 
          emissiveIntensity={headlights ? 1.8 : 0} 
          wireframe={true} 
        />
      </mesh>

      <mesh position={[2.28, 0.36, -0.28]} rotation={[0, -0.08, 0]}>
        <boxGeometry args={[0.08, 0.28, 0.42]} />
        <meshStandardMaterial color="#08090b" roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh position={[2.29, 0.36, -0.28]} rotation={[0, -0.08, 0]}>
        <boxGeometry args={[0.04, 0.30, 0.44]} />
        <meshStandardMaterial 
          color="#00f2ff" 
          emissive={headlights ? "#00c8ff" : "#112233"} 
          emissiveIntensity={headlights ? 1.8 : 0} 
          wireframe={true} 
        />
      </mesh>

      {/* BMW Laserlight LED Headlights */}
      <mesh position={[2.14, 0.48, 0.68]} rotation={[0, 0.22, 0]}>
        <boxGeometry args={[0.28, 0.12, 0.46]} />
        <meshStandardMaterial color="#080808" roughness={0.1} />
      </mesh>
      <mesh position={[2.24, 0.48, 0.62]}>
        <boxGeometry args={[0.04, 0.08, 0.14]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive={headlights ? "#cce5ff" : hazards ? "#ff9900" : "#222222"} 
          emissiveIntensity={headlights || hazards ? 3.5 : 0} 
        />
      </mesh>
      <mesh position={[2.21, 0.48, 0.76]}>
        <boxGeometry args={[0.04, 0.08, 0.14]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive={headlights ? "#cce5ff" : hazards ? "#ff9900" : "#222222"} 
          emissiveIntensity={headlights || hazards ? 3.5 : 0} 
        />
      </mesh>

      <mesh position={[2.14, 0.48, -0.68]} rotation={[0, -0.22, 0]}>
        <boxGeometry args={[0.28, 0.12, 0.46]} />
        <meshStandardMaterial color="#080808" roughness={0.1} />
      </mesh>
      <mesh position={[2.24, 0.48, -0.62]}>
        <boxGeometry args={[0.04, 0.08, 0.14]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive={headlights ? "#cce5ff" : hazards ? "#ff9900" : "#222222"} 
          emissiveIntensity={headlights || hazards ? 3.5 : 0} 
        />
      </mesh>
      <mesh position={[2.21, 0.48, -0.76]}>
        <boxGeometry args={[0.04, 0.08, 0.14]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive={headlights ? "#cce5ff" : hazards ? "#ff9900" : "#222222"} 
          emissiveIntensity={headlights || hazards ? 3.5 : 0} 
        />
      </mesh>

      {/* Front Carbon Fiber Splitter */}
      <mesh position={[2.24, 0.12, 0]}>
        <boxGeometry args={[0.32, 0.04, 1.98]} />
        <meshStandardMaterial color="#0a0a0c" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Cabin, Pillars & Glass */}
      <mesh position={[-0.18, 0.88, 0]} castShadow>
        <boxGeometry args={[2.34, 0.64, 1.58]} />
        <meshPhysicalMaterial color={color} metalness={metalness} roughness={roughness} clearcoat={clearcoat} wireframe={wireframe} />
      </mesh>

      {/* Tinted Aero Windshield */}
      <mesh position={[0.79, 0.86, 0]} rotation={[0, 0, -0.64]}>
        <boxGeometry args={[0.94, 0.04, 1.52]} />
        <meshPhysicalMaterial 
          color="#040608" 
          transmission={tint} 
          opacity={0.94} 
          transparent 
          roughness={0.04} 
          metalness={0.9} 
          wireframe={wireframe}
        />
      </mesh>

      {/* Rear Window Glass */}
      <mesh position={[-1.22, 0.86, 0]} rotation={[0, 0, 0.60]}>
        <boxGeometry args={[0.98, 0.04, 1.48]} />
        <meshPhysicalMaterial 
          color="#040608" 
          transmission={tint * 0.8} 
          opacity={0.96} 
          transparent 
          roughness={0.04} 
          metalness={0.9} 
          wireframe={wireframe}
        />
      </mesh>

      {/* Rear L-Shaped OLED Taillights */}
      <mesh position={[-2.22, 0.52, 0.66]}>
        <boxGeometry args={[0.08, 0.12, 0.50]} />
        <meshStandardMaterial 
          color="#ff001e" 
          emissive="#ff0022" 
          emissiveIntensity={headlights ? 3.5 : hazards ? 2.5 : 0.8} 
        />
      </mesh>
      <mesh position={[-2.22, 0.52, -0.66]}>
        <boxGeometry args={[0.08, 0.12, 0.50]} />
        <meshStandardMaterial 
          color="#ff001e" 
          emissive="#ff0022" 
          emissiveIntensity={headlights ? 3.5 : hazards ? 2.5 : 0.8} 
        />
      </mesh>

      {/* Rear Carbon Diffuser & Quad Titanium Exhaust */}
      <mesh position={[-2.14, 0.16, 0]}>
        <boxGeometry args={[0.38, 0.24, 1.76]} />
        <meshStandardMaterial color="#07080a" roughness={0.3} metalness={0.7} />
      </mesh>

      <mesh position={[-2.32, 0.18, 0.52]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.065, 0.065, 0.18, 16]} />
        <meshStandardMaterial color="#2b313a" metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[-2.32, 0.18, 0.68]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.065, 0.065, 0.18, 16]} />
        <meshStandardMaterial color="#2b313a" metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[-2.32, 0.18, -0.52]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.065, 0.065, 0.18, 16]} />
        <meshStandardMaterial color="#2b313a" metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[-2.32, 0.18, -0.68]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.065, 0.065, 0.18, 16]} />
        <meshStandardMaterial color="#2b313a" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* 4 M-Sport Alloy Wheels with Dynamic Caliper Colors */}
      {[
        [1.42, 0.36, 0.96, 1],
        [1.42, 0.36, -0.96, -1],
        [-1.42, 0.36, 0.96, 1],
        [-1.42, 0.36, -0.96, -1]
      ].map(([x, y, z, sign], idx) => (
        <group key={idx} position={[x, y, z]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.38, 0.38, 0.28, 24]} />
            <meshStandardMaterial color="#111215" roughness={0.8} wireframe={wireframe} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.27, 0.27, 0.29, 10]} />
            <meshStandardMaterial color="#e0e4ea" metalness={0.95} roughness={0.15} />
          </mesh>
          {/* Ceramic Brake Caliper */}
          <mesh position={[sign * 0.12, 0.12, sign * 0.02]}>
            <boxGeometry args={[0.16, 0.12, 0.10]} />
            <meshStandardMaterial color={caliperColor} metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* ==========================================
          📍 INTERACTIVE 3D HOTSPOT PINS
         ========================================== */}
      <Html position={[1.4, 0.85, 0]}>
        <button 
          className={`hotspot-3d-pin ${activeHotspot === 'engine' ? 'active-pin' : ''}`}
          onClick={(e) => { e.stopPropagation(); onHotspotClick('engine'); }}
          title="Engine Specs"
        >
          <Zap size={13} />
          <span className="hotspot-pin-label">Engine</span>
        </button>
      </Html>

      <Html position={[1.42, 0.5, 1.15]}>
        <button 
          className={`hotspot-3d-pin ${activeHotspot === 'brakes' ? 'active-pin' : ''}`}
          onClick={(e) => { e.stopPropagation(); onHotspotClick('brakes'); }}
          title="Ceramic Brakes"
        >
          <Disc size={13} />
          <span className="hotspot-pin-label">Brakes</span>
        </button>
      </Html>

      <Html position={[2.3, 0.25, 0]}>
        <button 
          className={`hotspot-3d-pin ${activeHotspot === 'aero' ? 'active-pin' : ''}`}
          onClick={(e) => { e.stopPropagation(); onHotspotClick('aero'); }}
          title="Active Aerodynamics"
        >
          <Activity size={13} />
          <span className="hotspot-pin-label">Aero</span>
        </button>
      </Html>

      <Html position={[-2.3, 0.4, 0.6]}>
        <button 
          className={`hotspot-3d-pin ${activeHotspot === 'exhaust' ? 'active-pin' : ''}`}
          onClick={(e) => { e.stopPropagation(); onHotspotClick('exhaust'); }}
          title="Quad Exhaust"
        >
          <Flame size={13} />
          <span className="hotspot-pin-label">Exhaust</span>
        </button>
      </Html>
    </group>
  );
}

// ==========================================
// 🏍️ HIGH-FIDELITY 3D SUPERBIKE MODEL
// ==========================================
function DetailedBike3D({ color, finish = 'metallic', caliperColor = '#ff6b00', headlights = true, wireframe = false }) {
  return (
    <group position={[0, -0.15, 0]} scale={[1.4, 1.4, 1.4]}>
      {/* Tubular Trellis Frame */}
      <mesh position={[0, 0.65, 0]}>
        <boxGeometry args={[1.6, 0.45, 0.35]} />
        <meshStandardMaterial color="#1a1a1f" metalness={0.8} roughness={0.3} wireframe={wireframe} />
      </mesh>

      {/* Sculpted Fuel Tank */}
      <mesh position={[0.2, 0.95, 0]} rotation={[0, 0, -0.12]}>
        <boxGeometry args={[0.95, 0.42, 0.55]} />
        <meshPhysicalMaterial 
          color={color} 
          metalness={finish === 'matte' ? 0.2 : 0.9} 
          roughness={finish === 'matte' ? 0.65 : 0.15} 
          clearcoat={finish === 'matte' ? 0 : 1.0}
        />
      </mesh>

      {/* Aerodynamic Front Fairings & Windscreen */}
      <mesh position={[0.75, 1.05, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.55, 0.45, 0.48]} />
        <meshPhysicalMaterial color={color} metalness={0.9} roughness={0.18} />
      </mesh>
      <mesh position={[0.9, 1.2, 0]} rotation={[0, 0, -0.45]}>
        <boxGeometry args={[0.35, 0.03, 0.36]} />
        <meshPhysicalMaterial color="#06090e" transmission={0.5} transparent opacity={0.9} roughness={0.05} />
      </mesh>

      {/* Dual Projector LED Headlights */}
      <mesh position={[0.98, 0.96, 0.14]}>
        <boxGeometry args={[0.08, 0.10, 0.12]} />
        <meshStandardMaterial color="#ffffff" emissive={headlights ? "#00f0ff" : "#111111"} emissiveIntensity={headlights ? 3.5 : 0} />
      </mesh>
      <mesh position={[0.98, 0.96, -0.14]}>
        <boxGeometry args={[0.08, 0.10, 0.12]} />
        <meshStandardMaterial color="#ffffff" emissive={headlights ? "#00f0ff" : "#111111"} emissiveIntensity={headlights ? 3.5 : 0} />
      </mesh>

      {/* Golden Inverted Front USD Forks */}
      <mesh position={[0.85, 0.65, 0.2]} rotation={[0, 0, -0.35]}>
        <cylinderGeometry args={[0.04, 0.04, 0.9, 16]} />
        <meshStandardMaterial color="#d4af37" metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[0.85, 0.65, -0.2]} rotation={[0, 0, -0.35]}>
        <cylinderGeometry args={[0.04, 0.04, 0.9, 16]} />
        <meshStandardMaterial color="#d4af37" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Front Spoked Wheel */}
      <group position={[1.15, 0.38, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 0.14, 24]} />
          <meshStandardMaterial color="#111215" roughness={0.8} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.15, 12]} />
          <meshStandardMaterial color="#e0e4ea" metalness={0.95} roughness={0.1} />
        </mesh>
        {/* Brake Caliper */}
        <mesh position={[0.08, 0.12, 0.09]}>
          <boxGeometry args={[0.12, 0.08, 0.06]} />
          <meshStandardMaterial color={caliperColor} metalness={0.8} />
        </mesh>
      </group>

      {/* Rear Wheel with Monoshock */}
      <group position={[-1.05, 0.38, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 0.22, 24]} />
          <meshStandardMaterial color="#111215" roughness={0.8} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.23, 12]} />
          <meshStandardMaterial color="#e0e4ea" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>

      {/* High-Mounted Carbon Canister Exhaust */}
      <mesh position={[-0.6, 0.55, 0.28]} rotation={[0, 0.1, 0.25]}>
        <cylinderGeometry args={[0.07, 0.07, 0.8, 16]} />
        <meshStandardMaterial color="#1a1c20" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

// ==========================================
// 🚀 MAIN 3D INTERACTIVE CAR VIEWER STUDIO
// ==========================================
export function CarViewer3D({ car, selectedColor, onColorChange, fallbackImage }) {
  // Mode: 'video' (360 Real Turntable Video) or 'canvas' (3D WebGL Configurator)
  const hasVideo = Boolean(car?.video3D);
  const [viewMode, setViewMode] = useState(hasVideo ? 'video' : 'canvas');

  // 3D Canvas Configurator states
  const [wireframe, setWireframe] = useState(false);
  const [headlights, setHeadlights] = useState(true);
  const [finish, setFinish] = useState('metallic');
  const [caliperColor, setCaliperColor] = useState('#0055ff');
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [isRevving, setIsRevving] = useState(false);
  const [rpm, setRpm] = useState(800);
  const [autoRotate, setAutoRotate] = useState(false);
  const controlsRef = useRef();

  // 360 Video Studio states
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [videoProgress, setVideoProgress] = useState(0); // 0 to 1
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);
  const [turntableAngle, setTurntableAngle] = useState(0); // 0 to 360 degrees
  const dragStartX = useRef(0);
  const dragStartTime = useRef(0);

  const isBike = car?.type === 'bike' || car?.type === 'scooter';

  const defaultColors = car?.colorOptions || [
    { name: 'Obsidian Black', hex: '#0c0d10' },
    { name: 'Alpine White', hex: '#f0f2f5' },
    { name: 'Phytonic Blue', hex: '#123b7a' },
    { name: 'Sunset Orange', hex: '#e05304' }
  ];

  const currentColor = selectedColor || defaultColors[0].hex;

  // Video time update listener
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.duration && !isDraggingVideo) {
        const progress = video.currentTime / video.duration;
        setVideoProgress(progress);
        setTurntableAngle(Math.round(progress * 360));
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [isDraggingVideo]);

  // Handle Playback Speed change
  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  // Toggle Video Play / Pause
  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      } else {
        videoRef.current.play();
        setIsVideoPlaying(true);
      }
    }
  };

  // Video Drag-to-Rotate / Scrubber
  const handleVideoMouseDown = (e) => {
    if (!videoRef.current || !videoRef.current.duration) return;
    setIsDraggingVideo(true);
    dragStartX.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    dragStartTime.current = videoRef.current.currentTime;
    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
    }
  };

  const handleVideoMouseMove = (e) => {
    if (!isDraggingVideo || !videoRef.current || !videoRef.current.duration) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = clientX - dragStartX.current;
    const sensitivity = 0.005; // speed of angle drag
    const duration = videoRef.current.duration;

    let newTime = dragStartTime.current + deltaX * sensitivity * duration;
    newTime = ((newTime % duration) + duration) % duration;

    videoRef.current.currentTime = newTime;
    const progress = newTime / duration;
    setVideoProgress(progress);
    setTurntableAngle(Math.round(progress * 360));
  };

  const handleVideoMouseUp = () => {
    if (isDraggingVideo) {
      setIsDraggingVideo(false);
      if (isVideoPlaying && videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    }
  };

  const handleScrubberChange = (e) => {
    const angle = Number(e.target.value);
    setTurntableAngle(angle);
    if (videoRef.current && videoRef.current.duration) {
      const targetTime = (angle / 360) * videoRef.current.duration;
      videoRef.current.currentTime = targetTime;
      setVideoProgress(angle / 360);
    }
  };

  // Web Audio Synthetic Rev Simulator
  const triggerRevSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = isBike ? 'triangle' : 'sawtooth';
      osc.frequency.setValueAtTime(isBike ? 90 : 60, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(isBike ? 480 : 360, ctx.currentTime + 0.35);
      osc.frequency.exponentialRampToValueAtTime(isBike ? 120 : 80, ctx.currentTime + 1.1);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.1);

      setIsRevving(true);
      setRpm(6800);
      setTimeout(() => {
        setIsRevving(false);
        setRpm(850);
      }, 1100);
    } catch (e) {
      console.warn('Audio not available');
    }
  };

  const setCameraView = (view) => {
    if (!controlsRef.current) return;
    if (view === 'front') controlsRef.current.object.position.set(5.2, 2.0, 4.0);
    else if (view === 'side') controlsRef.current.object.position.set(0.1, 1.4, 6.8);
    else if (view === 'rear') controlsRef.current.object.position.set(-5.5, 2.2, 3.8);
    else if (view === 'top') controlsRef.current.object.position.set(0.5, 7.5, 0.5);
    controlsRef.current.update();
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
      className="car-viewer-3d-wrapper" 
      ref={containerRef}
      onMouseMove={handleVideoMouseMove}
      onTouchMove={handleVideoMouseMove}
      onMouseUp={handleVideoMouseUp}
      onTouchEnd={handleVideoMouseUp}
    >
      {/* ==========================================
          🎛️ TOP DUAL-STUDIO SWITCHER HUD
         ========================================== */}
      <div className="viewer-top-hud">
        <div className="studio-mode-switcher-pill">
          {hasVideo && (
            <button
              className={`mode-pill-btn ${viewMode === 'video' ? 'active-mode' : ''}`}
              onClick={() => setViewMode('video')}
              title="360° Real Turntable Video"
            >
              <Film size={14} />
              <span>360° Real Turntable</span>
            </button>
          )}
          <button
            className={`mode-pill-btn ${viewMode === 'canvas' ? 'active-mode' : ''}`}
            onClick={() => setViewMode('canvas')}
            title="3D WebGL Configurator"
          >
            <Box size={14} />
            <span>3D Configurator</span>
          </button>
        </div>

        {/* Action Controls (Fullscreen, Hotspot toggle, etc.) */}
        <div className="viewer-top-actions">
          {viewMode === 'canvas' ? (
            <div className="camera-view-presets">
              <button onClick={() => setCameraView('front')} title="Front 3/4">Front</button>
              <button onClick={() => setCameraView('side')} title="Side Profile">Side</button>
              <button onClick={() => setCameraView('rear')} title="Rear Exhaust">Rear</button>
              <button onClick={() => setCameraView('top')} title="Aero Top">Top</button>
            </div>
          ) : (
            <div className="turntable-angle-badge">
              <Compass size={13} className="text-accent" />
              <span>{turntableAngle}° Angle</span>
            </div>
          )}

          <button 
            className="hud-action-icon-btn"
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
          >
            <Maximize2 size={15} />
          </button>
        </div>
      </div>

      {/* =========================================================
          🎬 MODE 1: 360° REAL TURNTABLE VIDEO INTERACTIVE STUDIO
         ========================================================= */}
      {viewMode === 'video' && hasVideo && (
        <div 
          className="viewer-video-studio-box"
          onMouseDown={handleVideoMouseDown}
          onTouchStart={handleVideoMouseDown}
        >
          {/* Ambient Glow */}
          <div className="turntable-glow-backdrop" style={{ background: `radial-gradient(circle at center, ${currentColor}33 0%, transparent 70%)` }} />

          {/* 360 Rotating Video */}
          <video
            ref={videoRef}
            src={car.video3D}
            poster={car.image || fallbackImage}
            autoPlay
            loop
            muted
            playsInline
            className={`turntable-video-element ${isDraggingVideo ? 'is-dragging' : ''}`}
          />

          {/* Interactive Spec Hotspot Overlay Pins */}
          <div className="video-hotspot-layer">
            <button 
              className={`video-hotspot-pin pin-engine ${activeHotspot === 'engine' ? 'active' : ''}`}
              onClick={(e) => { e.stopPropagation(); setActiveHotspot(activeHotspot === 'engine' ? null : 'engine'); }}
              title="Engine & Powertrain"
            >
              <Zap size={13} />
              <span>Engine</span>
            </button>

            <button 
              className={`video-hotspot-pin pin-brakes ${activeHotspot === 'brakes' ? 'active' : ''}`}
              onClick={(e) => { e.stopPropagation(); setActiveHotspot(activeHotspot === 'brakes' ? null : 'brakes'); }}
              title="Brakes & Wheels"
            >
              <Disc size={13} />
              <span>Brakes</span>
            </button>

            <button 
              className={`video-hotspot-pin pin-aero ${activeHotspot === 'aero' ? 'active' : ''}`}
              onClick={(e) => { e.stopPropagation(); setActiveHotspot(activeHotspot === 'aero' ? null : 'aero'); }}
              title="Aerodynamics"
            >
              <Activity size={13} />
              <span>Aero</span>
            </button>

            <button 
              className={`video-hotspot-pin pin-exhaust ${activeHotspot === 'exhaust' ? 'active' : ''}`}
              onClick={(e) => { e.stopPropagation(); setActiveHotspot(activeHotspot === 'exhaust' ? null : 'exhaust'); }}
              title="Exhaust System"
            >
              <Flame size={13} />
              <span>Exhaust</span>
            </button>
          </div>

          {/* Drag instruction overlay */}
          <div className="turntable-drag-hint">
            <RotateCw size={13} className="spin-slow" />
            <span>Drag horizontally or use slider below to rotate 360°</span>
          </div>

          {/* Interactive Hotspot Popup Card */}
          {activeHotspot && (
            <div className="hotspot-detail-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
              <button className="hotspot-close-btn" onClick={() => setActiveHotspot(null)}>×</button>
              {activeHotspot === 'engine' && (
                <>
                  <div className="hotspot-title"><Zap size={16} className="text-accent" /> {car?.specs?.power || 'Engine'} Powerplant</div>
                  <p className="hotspot-desc">{car?.description || 'High-output precision engineered engine delivering instant torque and thrilling top speed.'}</p>
                  <div className="hotspot-stat-row">
                    <span>0-100 km/h:</span> <strong>{car?.specs?.acceleration || '5.3s'}</strong>
                  </div>
                  <div className="hotspot-stat-row">
                    <span>Top Speed:</span> <strong>{car?.specs?.topSpeed || '250 km/h'}</strong>
                  </div>
                </>
              )}
              {activeHotspot === 'brakes' && (
                <>
                  <div className="hotspot-title"><Disc size={16} className="text-accent" /> High-Performance Brakes</div>
                  <p className="hotspot-desc">Multi-piston monobloc calipers with ventilated ceramic discs for instantaneous stopping power.</p>
                  <div className="hotspot-stat-row">
                    <span>Drivetrain:</span> <strong>{car?.specs?.drivetrain || 'All-Wheel Drive'}</strong>
                  </div>
                </>
              )}
              {activeHotspot === 'aero' && (
                <>
                  <div className="hotspot-title"><Activity size={16} className="text-accent" /> Active Track Aerodynamics</div>
                  <p className="hotspot-desc">Streamlined front splitters and sculpted side skirts optimized for high-speed stability and downforce.</p>
                  <div className="hotspot-stat-row">
                    <span>Category:</span> <strong>{car?.category || 'Premium'}</strong>
                  </div>
                </>
              )}
              {activeHotspot === 'exhaust' && (
                <>
                  <div className="hotspot-title"><Flame size={16} className="text-accent" /> Active Sport Tuned Exhaust</div>
                  <p className="hotspot-desc">Acoustically tuned sports exhaust delivering an intoxicating sound signature.</p>
                  <button className="hotspot-rev-trigger" onClick={triggerRevSound}>
                    <Volume2 size={14} /> Rev Sound Now
                  </button>
                </>
              )}
            </div>
          )}

          {/* Tachometer RPM Revving Widget */}
          <div className="viewer-tachometer-box" onClick={(e) => e.stopPropagation()}>
            <div className="tacho-header">
              <span className="tacho-label">ENGINE RPM</span>
              <span className="tacho-val">{rpm} <small>RPM</small></span>
            </div>
            <div className="tacho-bar-track">
              <div 
                className="tacho-bar-fill" 
                style={{ 
                  width: `${(rpm / 7500) * 100}%`,
                  backgroundColor: rpm > 5000 ? '#ff3b30' : 'var(--color-accent)'
                }} 
              />
            </div>
            <button 
              className={`tacho-rev-btn ${isRevving ? 'active-rev' : ''}`}
              onClick={triggerRevSound}
            >
              <Volume2 size={15} />
              <span>{isRevving ? 'Throttle Open!' : 'Rev Engine'}</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          🎨 MODE 2: 3D THREE.JS WEBGL CONFIGURATOR CANVAS
         ========================================================= */}
      {viewMode === 'canvas' && (
        <div className="viewer-canvas-box">
          <Canvas
            shadows
            camera={{ position: [5.4, 2.2, 4.4], fov: 44 }}
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={0.7} />
            <directionalLight position={[8, 12, 6]} intensity={2.0} castShadow />
            <directionalLight position={[-8, 6, -5]} intensity={0.9} color="#80d0ff" />
            <directionalLight position={[0, -2, -6]} intensity={0.6} color="#ff9040" />

            {/* Dynamic Underbody Floor Glow */}
            <pointLight position={[0, 0.1, 0]} intensity={1.8} color={currentColor} distance={3.8} />

            <Suspense fallback={null}>
              <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.2}>
                {isBike ? (
                  <DetailedBike3D 
                    color={currentColor} 
                    finish={finish} 
                    caliperColor={caliperColor} 
                    headlights={headlights} 
                    wireframe={wireframe} 
                  />
                ) : (
                  <DetailedCar3D 
                    color={currentColor} 
                    finish={finish} 
                    caliperColor={caliperColor} 
                    headlights={headlights} 
                    wireframe={wireframe} 
                    onHotspotClick={(id) => setActiveHotspot(activeHotspot === id ? null : id)}
                    activeHotspot={activeHotspot}
                  />
                )}
              </Float>

              <ContactShadows 
                position={[0, -0.42, 0]} 
                opacity={0.8} 
                scale={12} 
                blur={2.4} 
                far={4.8} 
                color="#000000" 
              />
            </Suspense>

            <OrbitControls 
              ref={controlsRef}
              enablePan={false} 
              enableZoom={true} 
              minDistance={3.2} 
              maxDistance={8.5} 
              maxPolarAngle={Math.PI / 2 - 0.05} 
              autoRotate={autoRotate}
              autoRotateSpeed={1.8}
            />
          </Canvas>

          {/* Hotspot Info Popup Overlay for 3D Canvas */}
          {activeHotspot && (
            <div className="hotspot-detail-card animate-fade-in">
              <button className="hotspot-close-btn" onClick={() => setActiveHotspot(null)}>×</button>
              {activeHotspot === 'engine' && (
                <>
                  <div className="hotspot-title"><Zap size={16} className="text-accent" /> {car?.specs?.power || '375 HP'} Powerplant</div>
                  <p className="hotspot-desc">High-revving performance unit with variable valve timing and forged internals.</p>
                  <div className="hotspot-stat-row">
                    <span>0-100 km/h:</span> <strong>{car?.specs?.acceleration || '5.3s'}</strong>
                  </div>
                </>
              )}
              {activeHotspot === 'brakes' && (
                <>
                  <div className="hotspot-title"><Disc size={16} className="text-accent" /> M-Compound Carbon Brakes</div>
                  <p className="hotspot-desc">Cross-drilled ventilated discs with monobloc calipers for zero fade.</p>
                  <div className="hotspot-stat-row">
                    <span>Caliper Color:</span> <strong style={{ color: caliperColor }}>Active Color</strong>
                  </div>
                </>
              )}
              {activeHotspot === 'aero' && (
                <>
                  <div className="hotspot-title"><Activity size={16} className="text-accent" /> Active Aerodynamics</div>
                  <p className="hotspot-desc">High-downforce front splitter with active cooling shutters for brake ventilation.</p>
                </>
              )}
              {activeHotspot === 'exhaust' && (
                <>
                  <div className="hotspot-title"><Flame size={16} className="text-accent" /> Quad Active Titanium Exhaust</div>
                  <p className="hotspot-desc">Electronically actuated exhaust flaps for intoxicating sound track in Sport+ mode.</p>
                  <button className="hotspot-rev-trigger" onClick={triggerRevSound}>
                    <Volume2 size={14} /> Rev Now
                  </button>
                </>
              )}
            </div>
          )}

          {/* Tachometer RPM Revving Widget */}
          <div className="viewer-tachometer-box">
            <div className="tacho-header">
              <span className="tacho-label">RPM GAUGE</span>
              <span className="tacho-val">{rpm} <small>RPM</small></span>
            </div>
            <div className="tacho-bar-track">
              <div 
                className="tacho-bar-fill" 
                style={{ 
                  width: `${(rpm / 7500) * 100}%`,
                  backgroundColor: rpm > 5000 ? '#ff3b30' : 'var(--color-accent)'
                }} 
              />
            </div>
            <button 
              className={`tacho-rev-btn ${isRevving ? 'active-rev' : ''}`}
              onClick={triggerRevSound}
            >
              <Volume2 size={15} />
              <span>{isRevving ? 'Throttle Open!' : 'Rev Engine'}</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          🎛️ BOTTOM INTERACTIVE CONTROLS BAR
         ========================================================= */}
      {viewMode === 'video' && hasVideo ? (
        /* 360 Video Turntable Scrubber & Playback Controls */
        <div className="turntable-bottom-controls-bar">
          <div className="turntable-scrub-row">
            <button 
              className="turntable-play-toggle-btn"
              onClick={toggleVideoPlay}
              title={isVideoPlaying ? "Pause Auto-Orbit" : "Resume Auto-Orbit"}
            >
              {isVideoPlaying ? <Pause size={15} /> : <Play size={15} fill="#ffffff" />}
              <span>{isVideoPlaying ? "Orbiting" : "Paused"}</span>
            </button>

            {/* 0 to 360 Degree Scrubber */}
            <div className="turntable-scrubber-container">
              <div className="scrubber-label-row">
                <span className="scrubber-title">360° Angle Scrub</span>
                <span className="scrubber-angle-text">{turntableAngle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={turntableAngle}
                onChange={handleScrubberChange}
                className="turntable-range-slider"
              />
            </div>

            {/* Orbit Speed Selector */}
            <div className="turntable-speed-group">
              <span className="speed-label">Speed:</span>
              {[0.5, 1.0, 1.5, 2.0].map((s) => (
                <button
                  key={s}
                  className={`speed-pill ${playbackSpeed === s ? 'active-speed' : ''}`}
                  onClick={() => handleSpeedChange(s)}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* 3D WebGL Customizer Studio Controls */
        <div className="viewer-customizer-panel">
          <div className="customizer-section-title">
            <Sliders size={16} className="text-accent" />
            <span>3D Vehicle Customization Studio</span>
          </div>

          {/* 1. Paint Finishes */}
          <div className="customizer-group">
            <label className="customizer-label">Paint Finish</label>
            <div className="finish-pill-group">
              {[
                { id: 'metallic', label: 'Metallic' },
                { id: 'matte', label: 'Frozen Matte' },
                { id: 'carbon', label: 'Carbon Weave' }
              ].map((f) => (
                <button
                  key={f.id}
                  className={`finish-pill ${finish === f.id ? 'active-finish' : ''}`}
                  onClick={() => setFinish(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Exterior Body Color */}
          <div className="customizer-group">
            <label className="customizer-label">Body Color</label>
            <div className="color-palette-grid">
              {defaultColors.map((c) => (
                <button
                  key={c.hex}
                  className={`studio-color-circle ${currentColor === c.hex ? 'active-color-circle' : ''}`}
                  style={{ backgroundColor: c.hex }}
                  onClick={() => onColorChange && onColorChange(c.hex)}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* 3. Caliper Colors */}
          <div className="customizer-group">
            <label className="customizer-label">Brake Caliper Color</label>
            <div className="caliper-color-row">
              {[
                { name: 'M-Sport Blue', hex: '#0055ff' },
                { name: 'Track Red', hex: '#e61919' },
                { name: 'Acid Green', hex: '#00e676' },
                { name: 'Gold Ceramic', hex: '#f1c40f' }
              ].map((cal) => (
                <button
                  key={cal.hex}
                  className={`caliper-swatch ${caliperColor === cal.hex ? 'active-caliper' : ''}`}
                  style={{ backgroundColor: cal.hex }}
                  onClick={() => setCaliperColor(cal.hex)}
                  title={cal.name}
                />
              ))}
            </div>
          </div>

          {/* 4. Quick Studio Toggles */}
          <div className="studio-feature-toggles">
            <button 
              className={`studio-toggle ${headlights ? 'active' : ''}`}
              onClick={() => setHeadlights(!headlights)}
            >
              <Eye size={15} />
              <span>LED Lights</span>
            </button>

            <button 
              className={`studio-toggle ${autoRotate ? 'active' : ''}`}
              onClick={() => setAutoRotate(!autoRotate)}
            >
              <RotateCw size={15} />
              <span>Auto Orbit</span>
            </button>

            <button 
              className={`studio-toggle ${wireframe ? 'active' : ''}`}
              onClick={() => setWireframe(!wireframe)}
            >
              <Layers size={15} />
              <span>Wireframe</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CarViewer3D;
