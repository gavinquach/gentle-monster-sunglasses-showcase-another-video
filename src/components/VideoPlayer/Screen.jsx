import { Center, useVideoTexture } from "@react-three/drei";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import * as THREE from "three";

const CurvedPlane = lazy(() => import("./CurvedPlane"));

export const Screen = ({ src }) => {
    const [video, setVideo] = useState();

    const ratio = 16 / 9;
    const width = 5;
    const radius = 4;
    const z = 4;

    const r = useMemo(
        () => (video ? video.videoWidth / video.videoHeight : ratio),
        [video, ratio]
    );

    return (
        <Center top position-z={z}>
            <CurvedPlane width={width} height={width / r} radius={radius}>
                <Suspense
                    fallback={
                        <meshBasicMaterial color={0x000000} side={THREE.DoubleSide} />
                    }
                >
                    <VideoMaterial src={src} setVideo={setVideo} />
                </Suspense>
            </CurvedPlane>
        </Center>
    );
};

function VideoMaterial({ src, setVideo }) {
    const texture = useVideoTexture(src);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.x = -1;
    texture.offset.x = 1;

    useEffect(() => {
        setVideo?.(texture.image);
    }, [setVideo, texture.image]);

    return (
        <meshStandardMaterial
            side={THREE.DoubleSide}
            map={texture}
            transparent
            opacity={0.9}
        />
    );
}
