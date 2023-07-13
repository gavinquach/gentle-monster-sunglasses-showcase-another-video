import { lazy } from "react";
import { Float } from "@react-three/drei";

const Cylinder = lazy(() => import("./Cylinder"));
const SpinningGalaxy = lazy(() => import("./SpinningGalaxy"));

export default function ShowcaseWrapper({
    order = 0,
    innerColor = "#9948DD",
    outerColor = "#1C3277",
    children,
    ...props
}) {
    return (
        <group position-x={3 * order} {...props} dispose={null}>
            <Float
                position-y={2.5}
                speed={2.5}
                floatIntensity={2}
                floatingRange={[-0.05, 0.05]}
            >
                {children}
            </Float>

            <Cylinder />
            <SpinningGalaxy
                position-y={1.75}
                innerColor={innerColor}
                outerColor={outerColor}
            />
        </group>
    );
}
