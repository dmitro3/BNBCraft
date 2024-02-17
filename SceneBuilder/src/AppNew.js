import React, { useState, useRef } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import { OrbitControls, GizmoHelper, GizmoViewport, PivotControls } from '@react-three/drei';

const Model = ({ url }) => {
  const gltf = useLoader(GLTFLoader, url);
  return <primitive object={gltf.scene} />;
};

const App = () => {
  const [models, setModels] = useState([]);
  const modelUrlRef = useRef();

  const handleAddModel = () => {
    const url = modelUrlRef.current.value;
    setModels((prevModels) => [...prevModels, { id: Date.now(), url }]);
    modelUrlRef.current.value = '';
  };

  return (
    <>
      <h1>3D Model Viewer</h1>
      <input type="text" ref={modelUrlRef} placeholder="Enter 3D Model URL" />
      <button onClick={handleAddModel}>Add Model</button>

      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        
        {models.map((model) => (
            <PivotControls>
          <Model key={model.id} url={model.url} />
          </PivotControls>
        ))}
        
        <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
            <GizmoViewport labelColor="white" axisHeadScale={1} />
          </GizmoHelper>
      </Canvas>
    </>
  );
};

export default App;
