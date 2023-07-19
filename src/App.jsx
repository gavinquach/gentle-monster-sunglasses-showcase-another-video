import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Preload, Stars } from "@react-three/drei";
import { gsap } from "gsap";

import { video } from "./videos";
import { Glasses } from "./components/Glasses";
import { SwitchArrows } from "./components/SwitchArrows/SwitchArrows";
import { Screen } from "./components/VideoPlayer/Screen";
import { InfoButton } from "./components/InfoButton/InfoButton";
import { InfoBox } from "./components/InfoBox/InfoBox";
// import { MatrixRain } from "./components/MatrixRain/MatrixRain";

import { isShowingInfo, typeWriterIndex, viewingNumber } from "./global.js";

const info = {
    0: {
        name: "Nada 01",
        description: `Discover the NADA 01 sunglasses from Gentle Monster’s
        2023 Collection. Featuring a simple black frame and a cat-eye
        version of the square silhouette, the iconic metal detail on
        the temples adds a touch of sophistication to this piece.
   `,
    },
    1: {
        name: "Duda 02(G)",
        description: `Duda 02(G) is an aviator silhouetted silver metal frame
        with 99.9% UV protected grey gradient lenses. The design is highlighted
        by the elegantly flowing lines of the front and temples.`,
    },
    2: {
        name: "Duda 02(G)",
        description: `Duda 02(G) is an aviator silhouetted silver metal frame
        with 99.9% UV protected grey gradient lenses. The design is highlighted
        by the elegantly flowing lines of the front and temples.`,
    }
};

export default function App() {
    const groupRef = useRef();
    const glassesRef = useRef([]);
    const playingAnimation = useRef(false);

    const typeWriter = () => {
        if (!isShowingInfo.showing) return;

        const name = info[viewingNumber.number]?.name || null;
        const description = info[viewingNumber.number]?.description || null;

        document.getElementById("infoBoxName").innerHTML = name || "Unknown";

        if (description === null) {
            document.getElementById("paragraph").innerHTML = "N/A";
            return;
        }

        if (typeWriterIndex.index < description.length) {
            document.getElementById("paragraph").innerHTML += description.charAt(typeWriterIndex.index);
            typeWriterIndex.index++;

            // lower the timeout to make the typing faster
            setTimeout(typeWriter, 20);
        }
    };

    const closeInfoBox = () => {
        isShowingInfo.showing = false;
        document.getElementById("infoBox").style.display = "none";
        typeWriterIndex.index = 0;
        document.getElementById("paragraph").innerHTML = "";
    };

    const toggleShowInfo = () => {
        if (playingAnimation.current) return false;

        isShowingInfo.showing = !isShowingInfo.showing;
        if (!isShowingInfo.showing) {
            document.getElementById("infoBox").style.display = "none";
            document.getElementById("paragraph").innerHTML = "";
            typeWriterIndex.index = 0;
        } else {
            document.getElementById("infoBox").style.display = "block";
            document.getElementById("infoButton").style.color = "gray";
            spinSunglasses();
        }
        typeWriter();
    };

    const prepareAnimation = (direction) => {
        if (playingAnimation.current) return false;
        if (direction === "left") {
            if (viewingNumber.number === 0) return false;
        } else {
            if (viewingNumber.number === groupRef.current.children.length - 1)
                return false;
        }

        closeInfoBox();
        document.getElementById("infoButton").style.color = "gray";

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
                viewingNumber.number -= 1;
                playingAnimation.current = false;
                document.getElementById("infoButton").style.color = "black";
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
                viewingNumber.number += 1;
                playingAnimation.current = false;
                document.getElementById("infoButton").style.color = "black";
            },
        });
    };

    const spinSunglasses = () => {
        if (playingAnimation.current) return;

        playingAnimation.current = true;
        gsap.to(glassesRef.current[viewingNumber.number].rotation, {
            duration: 1,
            y: Math.PI,
            ease: "power2.inOut",
            onComplete: () => {
                gsap.to(glassesRef.current[viewingNumber.number].rotation, {
                    duration: 1,
                    y: 0,
                    ease: "power2.inOut",
                    onComplete: () => {
                        playingAnimation.current = false;
                        document.getElementById("infoButton").style.color = "black";
                    },
                }).delay(1);
            },
        });
    };

    return (
        <Suspense fallback={null}>
            <SwitchArrows direction="left" onClick={handleLeftClick} />
            <SwitchArrows direction="right" onClick={handleRightClick} />
            {/* <MatrixRain /> */}

            <InfoButton onClick={toggleShowInfo} />
            <InfoBox />

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

                <Glasses ref={groupRef} name="sunglasses" glassesRef={glassesRef} />

                <group position={[0, 1, -2]} rotation={[0, Math.PI, 0]} scale={1.6}>
                    <Screen src={video} />
                </group>

                <Preload all />
            </Canvas>
        </Suspense>
    );
}
