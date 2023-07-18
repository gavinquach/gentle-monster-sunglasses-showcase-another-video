import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Preload, Stars } from "@react-three/drei";
import { gsap } from "gsap";

import { video } from "./videos";
import { Glasses } from "./components/Glasses";
import SwitchArrows from "./components/SwitchArrows/SwitchArrows";
import Screen from "./components/VideoPlayer/Screen";

import { viewingNumber } from "./global.js";

export default function App() {
    const groupRef = useRef();
    const playingAnimation = useRef(false);
    const viewingNumberRef = useRef(0);

    const prepareAnimation = (direction) => {
        if (playingAnimation.current) return false;
        if (direction === "left") {
            if (viewingNumberRef.current === 0) return false;
        } else {
            if (viewingNumberRef.current === groupRef.current.children.length - 1)
                return false;
        }

        // set playing animation to true
        playingAnimation.current = true;

        return true;
    };

    const handleLeftClick = () => {
        if (!prepareAnimation("left")) return;

        gsap.to(groupRef.current.position, {
            duration: 1,
            x: groupRef.current.position.x + 3,
            ease: "power2.inOut",
            onComplete: () => {
                viewingNumberRef.current -= 1;
                playingAnimation.current = false;
                viewingNumber.number = viewingNumberRef.current;
            },
        });
    };

    const handleRightClick = () => {
        if (!prepareAnimation("right")) return;

        gsap.to(groupRef.current.position, {
            duration: 1,
            x: groupRef.current.position.x - 3,
            ease: "power2.inOut",
            onComplete: () => {
                viewingNumberRef.current += 1;
                playingAnimation.current = false;
                viewingNumber.number = viewingNumberRef.current;
            },
        });
    };

    return (
        <Suspense fallback={null}>
            <SwitchArrows direction="left" onClick={handleLeftClick} />
            <SwitchArrows direction="right" onClick={handleRightClick} />

            <Canvas
                shadows="accumulative"
                dpr={[1, 1.5]}
                camera={{ position: [0, 2.27, 4], fov: 30, near: 0.01, far: 200 }}
            >
                <color attach="background" args={["#0b0b0b"]} />
                <Environment files={"/umhlanga_sunrise_2k.hdr"} />
                <Stars
                    radius={50}
                    depth={50}
                    count={5000}
                    factor={4}
                    saturation={0}
                    fade
                    speed={1}
                />

                <directionalLight
                    castShadow
                    position={[100, 75, 100]}
                    shadow-normalBias={0.04}
                />
                <ambientLight intensity={0.3} />

                <OrbitControls
                    makeDefault
                    target={[0, 2.5, 0]}
                    enablePan={false}
                    minPolarAngle={Math.PI * 0.1}
                    maxPolarAngle={Math.PI / 1.4}
                    // minAzimuthAngle={-Math.PI / 4}
                    // maxAzimuthAngle={Math.PI / 4}
                    minDistance={0.5}
                    maxDistance={2.7}
                />

                <Glasses ref={groupRef} name="sunglasses" />

                <group position={[0, 1, -2]} rotation={[0, Math.PI, 0]} scale={1.6}>
                    <Screen src={video} />
                </group>

                <Preload all />
            </Canvas>
        </Suspense>
    );
}
