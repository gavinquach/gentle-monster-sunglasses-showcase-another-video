import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import {
    AdditiveBlending,
    BufferAttribute,
    BufferGeometry,
    Color,
    PointsMaterial,
} from "three";

import galaxyparticles from "../images/galaxyparticles.png";

export default function SpinningGalaxy({ innerColor, outerColor, ...props }) {
    const galaxyRef = useRef();
    const galaxyParticleImg = useTexture(galaxyparticles);

    const galaxyObject = {
        innerGeometry: null,
        outerGeometry: null,
        particleMaterialInner: null,
        particleMaterialOuter: null,
    };

    useFrame((_, delta) => {
        if (galaxyRef.current) {
            galaxyRef.current.rotation.y += delta * 0.05;
        }
    });

    const getRandomFloat = (min, max) => {
        return Math.random() * (max - min) + min;
    };

    const particleParams = {
        count: 50000,
        radius: 2,
        branches: 5,
        spin: 3,
        randomness: 0.3,
        randomnessPower: 3,
    };

    // Geometry for particle
    galaxyObject.outerGeometry = new BufferGeometry();

    // Particle materials
    galaxyObject.particleMaterialInner = new PointsMaterial({
        size: 0.03,
        sizeAttenuation: true,
        blending: AdditiveBlending,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
    });
    galaxyObject.particleMaterialOuter = new PointsMaterial({
        size: 0.1,
        sizeAttenuation: true,
        depthWrite: false,
        depthTest: false,
        blending: AdditiveBlending,
        vertexColors: true,
        transparent: true,
        opacity: 1,
        map: galaxyParticleImg
    });

    // Create particle data
    const positions = new Float32Array(particleParams.count * 3);
    const colors = new Float32Array(particleParams.count * 3);
    const colorsInside = new Color(innerColor);
    const colorsOutside = new Color(outerColor);

    for (let i = 0; i < particleParams.count; i++) {
        const i3 = i * 3;

        const radius = Math.random() * particleParams.radius;
        const spinAngle = radius * particleParams.spin;
        const branchAngle =
            ((i % particleParams.branches) / particleParams.branches) * Math.PI * 2;

        // const randomX = Math.random() * (Math.random() < 0.5 ? 1 : - 1) * particleParams.randomness
        // const randomY = Math.random() * (getRandomFloat(0.0, 2.0)) * particleParams.randomness
        // const randomZ = Math.random() * (Math.random() < 0.5 ? 1 : -1) * particleParams.randomness

        const randomX =
            Math.pow(Math.random(), particleParams.randomnessPower) *
            (Math.random() < 0.5 ? 1 : -1) *
            particleParams.randomness *
            radius;
        const randomY =
            Math.pow(Math.random(), particleParams.randomnessPower) *
            getRandomFloat(-1, 1) *
            particleParams.randomness *
            radius;
        const randomZ =
            Math.pow(Math.random(), particleParams.randomnessPower) *
            (Math.random() < 0.5 ? 1 : -1) *
            particleParams.randomness *
            radius;

        // Position of the particles
        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

        // Color of the particles, mix between two colors
        const mixedColor = colorsInside.clone();
        mixedColor.lerp(colorsOutside, radius / particleParams.radius);

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
    }

    // Add particle data to galaxyOparticleMaterialOuterbject.outerGeometry
    galaxyObject.outerGeometry.setAttribute(
        "position",
        new BufferAttribute(positions, 3)
    );
    galaxyObject.outerGeometry.setAttribute(
        "color",
        new BufferAttribute(colors, 3)
    );

    // Geometry for inner particle galaxy
    galaxyObject.innerGeometry = new BufferGeometry();

    // Create particle data
    const innerPositions = new Float32Array(particleParams.count * 3);

    for (let i = 0; i < particleParams.count; i++) {
        const i3 = i * 3;

        const radius = Math.random() * particleParams.radius * 0.3;
        const spinAngle = radius * 1000;
        const branchAngle =
            ((i % particleParams.branches) / particleParams.branches) * Math.PI * 2;

        const randomX =
            Math.random() *
            (Math.random() < 0.5 ? 1 : -1) *
            particleParams.randomness *
            radius;
        const randomY =
            Math.random() *
            getRandomFloat(0.0, 2.0) *
            particleParams.randomness *
            radius;
        const randomZ =
            Math.random() *
            (Math.random() < 0.5 ? 1 : -1) *
            particleParams.randomness *
            radius;

        // Position of the particles
        innerPositions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        innerPositions[i3 + 1] = randomY;
        innerPositions[i3 + 2] =
            Math.sin(branchAngle + spinAngle) * radius + randomZ;
    }

    // Add particle data to galaxyObject.outerGeometry
    galaxyObject.innerGeometry.setAttribute(
        "position",
        new BufferAttribute(innerPositions, 3)
    );
    galaxyObject.innerGeometry.setAttribute(
        "color",
        new BufferAttribute(colors, 3)
    );

    return (
        <group ref={galaxyRef} {...props} dispose={null}>
            <group scale={0.5}>
                <points
                    geometry={galaxyObject.innerGeometry}
                    material={galaxyObject.particleMaterialInner}
                    dispose={null}
                />
                <points
                    geometry={galaxyObject.outerGeometry}
                    material={galaxyObject.particleMaterialOuter}
                    rotation={[Math.PI * 0.04, 0, 0]}
                    dispose={null}
                />
            </group>
        </group>
    );
}
