import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import FloatingSnack from './FloatingSnack';

export default function Scene() {
  return (
    <div className="h-[300px] w-full">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <OrbitControls enableZoom={false} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <FloatingSnack />
      </Canvas>
    </div>
  );
}