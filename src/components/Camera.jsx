import { PerspectiveCamera } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

export const Camera = () => {
    // increase fov for screens with width less than 90% of the height
    const size = useThree((state) => state.size);

    return (
        <PerspectiveCamera
            makeDefault
            position={[0, 2.27, 4]}
            fov={size.width < size.height * 0.9 ? 70 : 30}
            near={0.01}
            far={200}
        />
    );
}