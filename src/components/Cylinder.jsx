import { useTexture } from "@react-three/drei";

export default function Cylinder({ ...props }) {
    const height = 1.7;
    const galaxyMap = useTexture("/milky-way-g8b1427ee1_1920.jpg");

    return (
        <group {...props} dispose={null}>
            <mesh position={[0, height * 0.5, 0]} rotation={[0, Math.PI, 0]}>
                <cylinderGeometry args={[0.4, 0.4, height, 64]} />
                <meshLambertMaterial
                    map={galaxyMap}
                    emissiveMap={galaxyMap}
                    emissiveIntensity={2}
                />
            </mesh>
        </group>
    );
}
