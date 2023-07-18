import { forwardRef } from "react";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

import ShowcaseWrapper from "./ShowcaseWrapper";
import CazalSunglasses from "./Models/CazalSunglasses";
import DarkSunglasses from "./Models/DarkSunglasses";
import WhiteSunglasses from "./Models/WhiteSunglasses";

export const Glasses = forwardRef((props, ref) => {
    return (
        <>
            <group ref={ref} {...props}>
                <ShowcaseWrapper order={0} innerColor="#ff2020" outerColor="#2877ff">
                    <WhiteSunglasses />
                </ShowcaseWrapper>
                <ShowcaseWrapper order={1} innerColor="#b61d1d" outerColor="#f7ea31">
                    <DarkSunglasses />
                </ShowcaseWrapper>
                <ShowcaseWrapper order={2} innerColor="#9948DD" outerColor="#1C3277">
                    <CazalSunglasses />
                </ShowcaseWrapper>
            </group>

            <EffectComposer>
                <Bloom intensity={0.8} mipmapBlur />
            </EffectComposer>
        </>
    );
});
