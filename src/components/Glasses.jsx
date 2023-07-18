import { forwardRef } from "react";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

import ShowcaseWrapper from "./ShowcaseWrapper";
import CazalSunglasses from "./Models/CazalSunglasses";
import DarkSunglasses from "./Models/DarkSunglasses";
import WhiteSunglasses from "./Models/WhiteSunglasses";

export const Glasses = forwardRef((props, ref) => {
    const { glassesRef } = props;
    return (
        <>
            <group ref={ref} {...props}>
                <ShowcaseWrapper order={0} innerColor="#ff2020" outerColor="#2877ff">
                    <WhiteSunglasses
                        ref={(el) => (glassesRef.current[0] = el)}
                    />
                </ShowcaseWrapper>
                <ShowcaseWrapper order={1} innerColor="#b61d1d" outerColor="#f7ea31">
                    <DarkSunglasses
                        ref={(el) => (glassesRef.current[1] = el)}
                    />
                </ShowcaseWrapper>
                <ShowcaseWrapper order={2} innerColor="#9948DD" outerColor="#1C3277">
                    <CazalSunglasses
                        ref={(el) => (glassesRef.current[2] = el)}
                    />
                </ShowcaseWrapper>
            </group>

            <EffectComposer>
                <Bloom intensity={0.8} mipmapBlur />
            </EffectComposer>
        </>
    );
});
