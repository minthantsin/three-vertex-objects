import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { WiredBox } from "../utils/WiredBox";
import { BasicLayerTilesExample } from "./BasicLayerTilesExample";

ReactDOM.render(
  <Canvas
    dpr={window.devicePixelRatio}
    camera={{ position: [0, 350, 500], near: 1, far: 8000 }}
  >
    <WiredBox width={640} height={20} depth={400} />
    <Suspense fallback={null}>
      <BasicLayerTilesExample />
    </Suspense>
  </Canvas>,
  document.getElementById("root")
);