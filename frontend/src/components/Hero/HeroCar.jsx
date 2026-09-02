import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Float } from '@react-three/drei';
import { Volume2, Sparkles, Eye, RotateCw } from 'lucide-react';
import * as THREE from 'three';
import './HeroCar.css';

// Realistic BMW M-Performance 3D Car Body
function BMWCarModel({ color = "#102a5c", mousePos, headlights = true, wheelSpin = true }) {
  const group = useRef();
  const wheelFL = useRef();
  const wheelFR = useRef();
  const wheelRL = useRef();
  const wheelRR = useRef();

  // Smooth lerp mouse tracking & wheel rotation animation
  useFrame((state, delta) => {
    if (group.current) {
      const targetRotationY = -0.45 + (mousePos.current.x * 0.45);
      const targetRotationX = (mousePos.current.y * 0.18);
      
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotationY, delta * 2.5);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRotationX, delta * 2.5);
    }

    if (wheelSpin) {
      const spinDelta = delta * 4;
      if (wheelFL.current) wheelFL.current.rotation.z -= spinDelta;
      if (wheelFR.current) wheelFR.current.rotation.z -= spinDelta;
      if (wheelRL.current) wheelRL.current.rotation.z -= spinDelta;
      if (wheelRR.current) wheelRR.current.rotation.z -= spinDelta;
    }
  });

  return (
    <group ref={group} position={[0, -0.4, 0]} scale={[1.18, 1.18, 1.18]}>
      {/* --- 1. CHASSIS & AERODYNAMIC LOWER BODY --- */}
      {/* Lower Main Monocoque */}
      <mesh position={[0, 0.38, 0]} castShadow>
        <boxGeometry args={[4.45, 0.44, 1.96]} />
        <meshPhysicalMaterial 
          color={color} 
          metalness={0.92} 
          roughness={0.14} 
          clearcoat={1.0}
          clearcoatRoughness={0.08}
        />
      </mesh>

      {/* Flared M-Sport Side Skirts */}
      <mesh position={[0, 0.18, 0.98]} castShadow>
        <boxGeometry args={[2.8, 0.08, 0.08]} />
        <meshStandardMaterial color="#0a0a0c" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.18, -0.98]} castShadow>
        <boxGeometry args={[2.8, 0.08, 0.08]} />
        <meshStandardMaterial color="#0a0a0c" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* --- 2. BMW POWERDOME CONTOURED HOOD --- */}
      <mesh position={[1.48, 0.52, 0]} rotation={[0, 0, -0.09]} castShadow>
        <boxGeometry args={[1.56, 0.30, 1.86]} />
        <meshPhysicalMaterial 
          color={color} 
          metalness={0.92} 
          roughness={0.14} 
          clearcoat={1.0}
        />
      </mesh>
      {/* Powerdome Center Bulge */}
      <mesh position={[1.45, 0.64, 0]} rotation={[0, 0, -0.09]} castShadow>
        <boxGeometry args={[1.3, 0.06, 0.65]} />
        <meshPhysicalMaterial color={color} metalness={0.94} roughness={0.12} />
      </mesh>

      {/* --- 3. ICONIC BMW TWIN KIDNEY GRILLES --- */}
      {/* Left Kidney Grille */}
      <mesh position={[2.28, 0.36, 0.28]} rotation={[0, 0.08, 0]}>
        <boxGeometry args={[0.08, 0.28, 0.42]} />
        <meshStandardMaterial color="#08090b" roughness={0.2} metalness={0.9} />
      </mesh>
      {/* Left Grille Illuminated LED Contour */}
      <mesh position={[2.29, 0.36, 0.28]} rotation={[0, 0.08, 0]}>
        <boxGeometry args={[0.04, 0.30, 0.44]} />
        <meshStandardMaterial 
          color="#00f2ff" 
          emissive={headlights ? "#00c8ff" : "#112233"} 
          emissiveIntensity={headlights ? 1.8 : 0} 
          wireframe={true} 
        />
      </mesh>

      {/* Right Kidney Grille */}
      <mesh position={[2.28, 0.36, -0.28]} rotation={[0, -0.08, 0]}>
        <boxGeometry args={[0.08, 0.28, 0.42]} />
        <meshStandardMaterial color="#08090b" roughness={0.2} metalness={0.9} />
      </mesh>
      {/* Right Grille Illuminated LED Contour */}
      <mesh position={[2.29, 0.36, -0.28]} rotation={[0, -0.08, 0]}>
        <boxGeometry args={[0.04, 0.30, 0.44]} />
        <meshStandardMaterial 
          color="#00f2ff" 
          emissive={headlights ? "#00c8ff" : "#112233"} 
          emissiveIntensity={headlights ? 1.8 : 0} 
          wireframe={true} 
        />
      </mesh>

      {/* BMW Roundel Bonnet Badge */}
      <mesh position={[2.18, 0.61, 0]} rotation={[0, 0, -0.15]}>
        <cylinderGeometry args={[0.07, 0.07, 0.02, 16]} />
        <meshStandardMaterial color="#0066b1" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* --- 4. BMW LASERLIGHT HEADLIGHTS (Iconic DRL Angel Eyes) --- */}
      {/* Left Laser Headlight Housing */}
      <mesh position={[2.14, 0.48, 0.68]} rotation={[0, 0.22, 0]}>
        <boxGeometry args={[0.28, 0.12, 0.46]} />
        <meshStandardMaterial color="#080808" roughness={0.1} />
      </mesh>
      {/* Left Dual Angel Eye Optics */}
      <mesh position={[2.24, 0.48, 0.62]}>
        <boxGeometry args={[0.04, 0.08, 0.14]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive={headlights ? "#b0e0ff" : "#222222"} 
          emissiveIntensity={headlights ? 4.0 : 0} 
        />
      </mesh>
      <mesh position={[2.21, 0.48, 0.76]}>
        <boxGeometry args={[0.04, 0.08, 0.14]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive={headlights ? "#b0e0ff" : "#222222"} 
          emissiveIntensity={headlights ? 4.0 : 0} 
        />
      </mesh>

      {/* Right Laser Headlight Housing */}
      <mesh position={[2.14, 0.48, -0.68]} rotation={[0, -0.22, 0]}>
        <boxGeometry args={[0.28, 0.12, 0.46]} />
        <meshStandardMaterial color="#080808" roughness={0.1} />
      </mesh>
      {/* Right Dual Angel Eye Optics */}
      <mesh position={[2.24, 0.48, -0.62]}>
        <boxGeometry args={[0.04, 0.08, 0.14]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive={headlights ? "#b0e0ff" : "#222222"} 
          emissiveIntensity={headlights ? 4.0 : 0} 
        />
      </mesh>
      <mesh position={[2.21, 0.48, -0.76]}>
        <boxGeometry args={[0.04, 0.08, 0.14]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive={headlights ? "#b0e0ff" : "#222222"} 
          emissiveIntensity={headlights ? 4.0 : 0} 
        />
      </mesh>

      {/* Front Carbon Fiber Splitter & Large Air Inlets */}
      <mesh position={[2.24, 0.12, 0]}>
        <boxGeometry args={[0.32, 0.04, 1.98]} />
        <meshStandardMaterial color="#0a0a0c" roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh position={[2.16, 0.24, 0.68]}>
        <boxGeometry args={[0.18, 0.22, 0.42]} />
        <meshStandardMaterial color="#050505" roughness={0.9} />
      </mesh>
      <mesh position={[2.16, 0.24, -0.68]}>
        <boxGeometry args={[0.18, 0.22, 0.42]} />
        <meshStandardMaterial color="#050505" roughness={0.9} />
      </mesh>

      {/* --- 5. CABIN, CARBON ROOF & HOFMEISTER KINK --- */}
      {/* Carbon Fiber Roof Panel */}
      <mesh position={[-0.2, 1.18, 0]} castShadow>
        <boxGeometry args={[1.82, 0.04, 1.44]} />
        <meshStandardMaterial color="#08080a" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Upper Cockpit Pillars */}
      <mesh position={[-0.18, 0.88, 0]} castShadow>
        <boxGeometry args={[2.34, 0.64, 1.58]} />
        <meshPhysicalMaterial color={color} metalness={0.92} roughness={0.14} clearcoat={1.0} />
      </mesh>

      {/* Windshield (Raked Aero Glass) */}
      <mesh position={[0.79, 0.86, 0]} rotation={[0, 0, -0.64]}>
        <boxGeometry args={[0.94, 0.04, 1.52]} />
        <meshPhysicalMaterial 
          color="#040608" 
          transmission={0.45} 
          opacity={0.92} 
          transparent 
          roughness={0.04} 
          metalness={0.9} 
        />
      </mesh>

      {/* Rear Window Glass */}
      <mesh position={[-1.22, 0.86, 0]} rotation={[0, 0, 0.60]}>
        <boxGeometry args={[0.98, 0.04, 1.48]} />
        <meshPhysicalMaterial 
          color="#040608" 
          transmission={0.35} 
          opacity={0.95} 
          transparent 
          roughness={0.04} 
          metalness={0.9} 
        />
      </mesh>

      {/* M-Twin Stalk Aerodynamic Wing Mirrors */}
      <mesh position={[0.82, 0.72, 0.94]} rotation={[0, 0.2, 0]}>
        <boxGeometry args={[0.16, 0.12, 0.26]} />
        <meshStandardMaterial color="#060709" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.82, 0.72, -0.94]} rotation={[0, -0.2, 0]}>
        <boxGeometry args={[0.16, 0.12, 0.26]} />
        <meshStandardMaterial color="#060709" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* --- 6. REAR END: L-SHAPED TAILLIGHTS, DUCKTAIL SPOILER & QUAD EXHAUST --- */}
      {/* Ducktail Trunk Spoiler */}
      <mesh position={[-2.18, 0.74, 0]} rotation={[0, 0, 0.12]}>
        <boxGeometry args={[0.26, 0.04, 1.62]} />
        <meshStandardMaterial color="#060709" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Left 3D L-Shaped OLED Taillight */}
      <mesh position={[-2.22, 0.52, 0.66]}>
        <boxGeometry args={[0.08, 0.12, 0.50]} />
        <meshStandardMaterial 
          color="#ff001e" 
          emissive="#ff0022" 
          emissiveIntensity={headlights ? 3.5 : 0.8} 
        />
      </mesh>
      {/* Right 3D L-Shaped OLED Taillight */}
      <mesh position={[-2.22, 0.52, -0.66]}>
        <boxGeometry args={[0.08, 0.12, 0.50]} />
        <meshStandardMaterial 
          color="#ff001e" 
          emissive="#ff0022" 
          emissiveIntensity={headlights ? 3.5 : 0.8} 
        />
      </mesh>

      {/* Rear Carbon Diffuser */}
      <mesh position={[-2.14, 0.16, 0]}>
        <boxGeometry args={[0.38, 0.24, 1.76]} />
        <meshStandardMaterial color="#07080a" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Quad M-Sport Titanium Exhaust Pipes */}
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

      {/* --- 7. M-SPORT ALLOY WHEELS WITH M-BLUE CALIPERS --- */}
      {/* Front-Left Wheel */}
      <group position={[1.42, 0.36, 0.96]} ref={wheelFL}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 0.28, 24]} />
          <meshStandardMaterial color="#111215" roughness={0.8} />
        </mesh>
        {/* Diamond Cut Spoke Face */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.27, 0.27, 0.29, 10]} />
          <meshStandardMaterial color="#e0e4ea" metalness={0.95} roughness={0.15} />
        </mesh>
        {/* M-Sport Blue Brake Caliper */}
        <mesh position={[0.12, 0.12, -0.02]}>
          <boxGeometry args={[0.16, 0.12, 0.10]} />
          <meshStandardMaterial color="#0055ff" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Front-Right Wheel */}
      <group position={[1.42, 0.36, -0.96]} ref={wheelFR}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 0.28, 24]} />
          <meshStandardMaterial color="#111215" roughness={0.8} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.27, 0.27, 0.29, 10]} />
          <meshStandardMaterial color="#e0e4ea" metalness={0.95} roughness={0.15} />
        </mesh>
        <mesh position={[0.12, 0.12, 0.02]}>
          <boxGeometry args={[0.16, 0.12, 0.10]} />
          <meshStandardMaterial color="#0055ff" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Rear-Left Wheel */}
      <group position={[-1.42, 0.36, 0.96]} ref={wheelRL}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 0.30, 24]} />
          <meshStandardMaterial color="#111215" roughness={0.8} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.27, 0.27, 0.31, 10]} />
          <meshStandardMaterial color="#e0e4ea" metalness={0.95} roughness={0.15} />
        </mesh>
        <mesh position={[-0.12, 0.12, -0.02]}>
          <boxGeometry args={[0.16, 0.12, 0.10]} />
          <meshStandardMaterial color="#0055ff" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Rear-Right Wheel */}
      <group position={[-1.42, 0.36, -0.96]} ref={wheelRR}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 0.30, 24]} />
          <meshStandardMaterial color="#111215" roughness={0.8} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.27, 0.27, 0.31, 10]} />
          <meshStandardMaterial color="#e0e4ea" metalness={0.95} roughness={0.15} />
        </mesh>
        <mesh position={[-0.12, 0.12, 0.02]}>
          <boxGeometry args={[0.16, 0.12, 0.10]} />
          <meshStandardMaterial color="#0055ff" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

const BMW_COLOR_PALETTE = [
  { name: 'Tanzanite Blue', hex: '#0f244c' },
  { name: 'Isle of Man Green', hex: '#0c3b28' },
  { name: 'Toronto Red', hex: '#a61717' },
  { name: 'Sao Paulo Yellow', hex: '#c4b000' },
  { name: 'Frozen Black Metallic', hex: '#090a0c' },
  { name: 'Alpine White', hex: '#f0f2f5' }
];

export function HeroCar() {
  const [selectedColor, setSelectedColor] = useState(BMW_COLOR_PALETTE[0].hex);
  const [headlightsOn, setHeadlightsOn] = useState(true);
  const [wheelSpin, setWheelSpin] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isRevving, setIsRevving] = useState(false);

  const mousePos = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const rect = currentTarget.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((clientY - rect.top) / rect.height) * 2 - 1);
    mousePos.current = { x, y };
  };

  // Web Audio Synthetic Engine Rev Sound
  const playRevSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(65, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.4);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 1.2);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.2);

      setIsRevving(true);
      setTimeout(() => setIsRevving(false), 1200);
    } catch (e) {
      console.warn('Audio not available');
    }
  };

  if (hasError) {
    return (
      <div className="hero-car-fallback">
        <img 
          src="https://images.unsplash.com/photo-1555353540-64580b51c258?auto=format&fit=crop&w=1000&q=80" 
          alt="BMW X5 M-Performance" 
          className="fallback-car-img"
        />
      </div>
    );
  }

  return (
    <div className="hero-car-wrapper" onMouseMove={handleMouseMove}>
      <div className="hero-canvas-container">
        <Canvas
          shadows
          camera={{ position: [5.2, 2.3, 4.5], fov: 42 }}
          onError={() => setHasError(true)}
          gl={{ antialias: true, alpha: true }}
        >
          {/* Studio Lighting Rig */}
          <ambientLight intensity={0.65} />
          
          {/* Key Light */}
          <directionalLight 
            position={[8, 10, 6]} 
            intensity={1.8} 
            castShadow 
            shadow-mapSize={[1024, 1024]} 
          />
          
          {/* Cyan Fill Light */}
          <directionalLight position={[-8, 6, -5]} intensity={0.9} color="#80d0ff" />
          
          {/* Warm Rim Light */}
          <directionalLight position={[0, -2, -6]} intensity={0.6} color="#ff9040" />

          {/* Underbody Neon Glow */}
          <pointLight position={[0, 0.2, 0]} intensity={1.5} color={selectedColor} distance={3.5} />

          <Suspense fallback={null}>
            <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.25}>
              <BMWCarModel 
                color={selectedColor} 
                mousePos={mousePos} 
                headlights={headlightsOn} 
                wheelSpin={wheelSpin}
              />
            </Float>
            
            <ContactShadows 
              position={[0, -0.42, 0]} 
              opacity={0.75} 
              scale={11} 
              blur={2.4} 
              far={4.5} 
              color="#000000"
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Floating 3D Control Badges */}
      <div className="hero-3d-hud">
        {/* Model Spec Badge */}
        <div className="hud-badge hud-model-badge">
          <div className="hud-badge-icon">
            <Sparkles size={14} className="text-accent" />
          </div>
          <div>
            <div className="hud-badge-title">BMW X5 M-Performance</div>
            <div className="hud-badge-sub">3.0L TwinPower Turbo • 375 HP</div>
          </div>
        </div>

        {/* Engine Rev Sound Button */}
        <button 
          className={`hud-rev-btn ${isRevving ? 'revving-active' : ''}`}
          onClick={playRevSound}
          title="Start / Rev Engine"
        >
          <Volume2 size={16} />
          <span>{isRevving ? 'V8 Roaring...' : 'Start Engine'}</span>
        </button>

        {/* Headlight & Wheel Spin Toggle */}
        <div className="hud-quick-toggles">
          <button 
            className={`hud-toggle-btn ${headlightsOn ? 'active' : ''}`}
            onClick={() => setHeadlightsOn(!headlightsOn)}
            title="Toggle Laserlights"
          >
            <Eye size={14} />
            <span>Lights</span>
          </button>
          <button 
            className={`hud-toggle-btn ${wheelSpin ? 'active' : ''}`}
            onClick={() => setWheelSpin(!wheelSpin)}
            title="Toggle Wheel Rotation"
          >
            <RotateCw size={14} />
            <span>Spin</span>
          </button>
        </div>
      </div>

      {/* Interactive BMW Color Switcher */}
      <div className="car-color-selector">
        <span className="color-selector-label">M Paint:</span>
        <div className="color-dots">
          {BMW_COLOR_PALETTE.map((c) => (
            <button
              key={c.hex}
              className={`color-dot ${selectedColor === c.hex ? 'active-dot' : ''}`}
              style={{ backgroundColor: c.hex }}
              onClick={() => setSelectedColor(c.hex)}
              title={c.name}
              aria-label={c.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HeroCar;
