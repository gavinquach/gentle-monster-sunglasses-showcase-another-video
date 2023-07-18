import { forwardRef, useCallback, useRef } from "react";
import {
    AdditiveBlending,
    BufferAttribute,
    BufferGeometry,
    Clock,
    MeshBasicMaterial,
    PointsMaterial,
    TextureLoader,
    Vector3,
} from "three";
import { gsap } from "gsap";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { Cloud } from "@react-three/drei";
import { LightningStrike, UnrealBloomPass } from "three-stdlib";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

import galaxyparticles from "../images/galaxyparticles.png";
import ShowcaseWrapper from "./ShowcaseWrapper";
import CazalSunglasses from "./Models/CazalSunglasses";
import DarkSunglasses from "./Models/DarkSunglasses";
import WhiteSunglasses from "./Models/WhiteSunglasses";

import { viewingNumber } from "../global.js";

extend({ UnrealBloomPass });

/**
 * Particles
 */
const particlesGeometry = new BufferGeometry(1, 32, 32);
const count = 5000;
const colors = new Float32Array(count * 3);
const positions = new Float32Array(count * 3);
const colorAttr = new BufferAttribute(colors, 3);
const positionAttr = new BufferAttribute(positions, 3);

for (let i = 0; i < count * 3; i++) {
    // Math.random() - 0.5 to have a random value between -0.5 and +0.5
    positions[i] = (Math.random() - 0.5) * 5;
    colors[i] = 1;
}

// Create the Three.js BufferAttribute and specify that each information is composed of 3 values
particlesGeometry.setAttribute("position", positionAttr);
particlesGeometry.setAttribute("color", colorAttr);

const textureLoader = new TextureLoader();
const galaxyParticleImg = textureLoader.load(galaxyparticles);

const particlesMaterial = new PointsMaterial();
particlesMaterial.size = 0.06;
particlesMaterial.sizeAttenuation = true;
particlesMaterial.map = galaxyParticleImg;
particlesMaterial.transparent = true;
particlesMaterial.opacity = 0;
particlesMaterial.depthTest = false;
particlesMaterial.depthWrite = false;
particlesMaterial.blending = AdditiveBlending;
particlesMaterial.vertexColors = true;

// Lightning
let rayDirection = new Vector3();
let rayLength = 0;
let vec1 = new Vector3();
let vec2 = new Vector3();
const rayParams = {
    radius0: 0.2,
    radius1: 0.1,
    minRadius: 0.3,
    maxIterations: 7,

    timeScale: 0.15,
    propagationTimeFactor: 0.2,
    vanishingTimeFactor: 0.9,
    subrayPeriod: 0.4,
    subrayDutyCycle: 0.4,

    maxSubrayRecursion: 3,
    ramification: 3,
    recursionProbability: 0.4,

    roughness: 1,
    straightness: 0.95,

    onSubrayCreation: (segment, parentSubray, childSubray, lightningStrike) => {
        lightningStrike.subrayConePosition(
            segment,
            parentSubray,
            childSubray,
            0.6,
            0.6,
            0.5
        );

        // Plane projection
        rayLength = lightningStrike.rayParameters.sourceOffset.y;
        vec1.subVectors(
            childSubray.pos1,
            lightningStrike.rayParameters.sourceOffset
        );
        let proj = rayDirection.dot(vec1);
        vec2.copy(rayDirection).multiplyScalar(proj);
        vec1.sub(vec2);

        let scale = proj / rayLength > 0.5 ? rayLength / proj : 1;
        vec2.multiplyScalar(scale);
        vec1.add(vec2);
        childSubray.pos1.addVectors(
            vec1,
            lightningStrike.rayParameters.sourceOffset
        );
    },
};

const lightningStrike = new LightningStrike(rayParams);
const lightningMaterial = new MeshBasicMaterial({
    color: 0x00aaff,
    transparent: true,
    opacity: 1.0,
});

export const Glasses = forwardRef((props, ref) => {
    const cloudRef = useRef();
    const lightningStrikeRef = useRef();
    const explosionSphereRef = useRef();
    const explosionParticleRef = useRef();
    const runningAnimation = useRef(false);
    const glassesRef = useRef([]);

    const camera = useThree((state) => state.camera);

    useFrame((state) => {
        // Update lightning strike
        lightningStrike.update(state.clock.elapsedTime * 4);
    });

    const shakeCamera = (camera, intensity, duration) => {
        const startPosition = camera.position.clone();
        const randomVector = new Vector3();

        const clock = new Clock();
        const shake = () => {
            const elapsedTime = clock.getElapsedTime();
            const t = Math.min(1, elapsedTime / duration);

            randomVector
                .set(
                    Math.random() * 2 - 1,
                    Math.random() * 2 - 1,
                    Math.random() * 2 - 1
                )
                .multiplyScalar(intensity * (1 - t));

            camera.position.copy(startPosition).add(randomVector);

            if (t < 1) {
                requestAnimationFrame(shake);
            }
        };

        shake();
    };

    const runAnimation = useCallback((itemNumber) => {
        if (
            !explosionParticleRef.current ||
            runningAnimation.current ||
            viewingNumber.number !== itemNumber
        )
            return;
        runningAnimation.current = true;

        gsap.to(camera.position, {
            duration: 1,
            x: camera.position.x > 0 ? -1 : 1,
            y: 2.3,
            z: 2.2,
            ease: "power1.inOut",
            onComplete: () => {
                shakeCamera(camera, 0.02, 4);

                explosionParticleRef.current.material.opacity = 1;
                gsap.to(explosionParticleRef.current.scale, {
                    x: 10,
                    y: 10,
                    z: 10,
                    duration: 1,
                    ease: "power3.inOut",
                    onComplete: () => {
                        explosionParticleRef.current.scale.set(0, 0, 0);
                        explosionParticleRef.current.material.opacity = 0;
                        lightningStrikeRef.current.scale.set(0.07, 0.07, 0.07);
                    },
                });
                gsap.to(explosionSphereRef.current.scale, {
                    x: 1,
                    y: 1,
                    z: 1,
                    duration: 1.3,
                    ease: "power3.inOut",
                    onComplete: () => {
                        // cloudRef.current.scale.set(0.3, 0.3, 0.3);
                        glassesRef.current[itemNumber].scale.set(0, 0, 0);

                        gsap.to(explosionSphereRef.current.material, {
                            opacity: 0,
                            duration: 1,
                            ease: "linear.inOut",
                            onComplete: () => {
                                explosionSphereRef.current.scale.set(0, 0, 0);
                                explosionSphereRef.current.material.opacity = 1;
                                gsap.to(lightningStrikeRef.current.material, {
                                    opacity: 0,
                                    duration: 2,
                                    ease: "power3.inOut",
                                    onComplete: () => {
                                        lightningStrikeRef.current.scale.set(0, 0, 0);
                                        lightningStrikeRef.current.material.opacity = 1;
                                        runningAnimation.current = false;

                                        gsap.to(glassesRef.current[itemNumber].scale, {
                                            x: 1,
                                            y: 1,
                                            z: 1,
                                            duration: 1,
                                            ease: "power1.inOut",
                                        }).delay(1);
                                    },
                                });
                                // gsap.to(cloudRef.current.scale, {
                                //     x: 0,
                                //     y: 0,
                                //     z: 0,
                                //     duration: 2,
                                //     ease: "power3.inOut",
                                // });
                            },
                        });
                    },
                });
            },
        });
    }, [camera]);

    return (
        <>
            <group ref={ref} {...props}>
                <ShowcaseWrapper order={0} innerColor="#ff2020" outerColor="#2877ff">
                    <WhiteSunglasses
                        ref={(el) => (glassesRef.current[0] = el)}
                        onClick={() => runAnimation(0)}
                    />
                </ShowcaseWrapper>
                <ShowcaseWrapper order={1} innerColor="#b61d1d" outerColor="#f7ea31">
                    <DarkSunglasses
                        ref={(el) => (glassesRef.current[1] = el)}
                        onClick={() => runAnimation(1)}
                    />
                </ShowcaseWrapper>
                <ShowcaseWrapper order={2} innerColor="#9948DD" outerColor="#1C3277">
                    <CazalSunglasses
                        ref={(el) => (glassesRef.current[2] = el)}
                        onClick={() => runAnimation(2)}
                    />
                </ShowcaseWrapper>
            </group>

            <points
                ref={explosionParticleRef}
                position={[0, 2.5, 0]}
                scale={0}
                geometry={particlesGeometry}
                material={particlesMaterial}
                dispose={null}
            />
                <mesh
                    ref={lightningStrikeRef}
                    scale={0}
                    geometry={lightningStrike}
                    material={lightningMaterial}
                    position={[1.5, 2.55, 0]}
                    rotation={[0, 0, Math.PI * 0.5]}
                />
            <group ref={cloudRef} position={[0, 2.5, 0]} scale={0}>
                <Cloud
                    color={0x1338be}
                    opacity={0.2}
                    speed={0.1} // Rotation speed
                    width={5} // Width of the full cloud
                    depth={0.1} // Z-dir depth
                    segments={10} // Number of particles
                />
                <Cloud
                    color={0xb042ff}
                    opacity={0.2}
                    speed={0.1} // Rotation speed
                    width={5} // Width of the full cloud
                    depth={0.1} // Z-dir depth
                    segments={10} // Number of particles
                />
            </group>
            <mesh ref={explosionSphereRef} position={[0, 2.5, 0]} scale={0}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshBasicMaterial
                    color={[5, 5, 5]}
                    toneMapped={false}
                    transparent
                    opacity={1}
                />
            </mesh>

            <EffectComposer>
                <Bloom intensity={2.0} mipmapBlur />
            </EffectComposer>
        </>
    );
});
