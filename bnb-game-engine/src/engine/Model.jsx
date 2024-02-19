import React, { useEffect, useState,useContext } from 'react';
import { Canvas, useLoader } from '@react-three/fiber'
import { Center } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { PivotControls } from './pivotControls/index.tsx'
import { GlobalContext } from './GlobalContext.jsx'


const Model = ({ assetLink, assetIdentifer, collision, fixed, worldMatrix,setAssetIdentifier }) => {
    const { state, dispatch } = useContext(GlobalContext)
    const gltf = useLoader(GLTFLoader, assetLink);
    const [hovered, setHovered] = useState(false)

    useEffect(() => {
      document.body.style.cursor = hovered ? 'grab' : 'auto'
    }, [hovered])

    return (
      <PivotControls assetIdentifier={assetIdentifer} collision={collision} fixedM={fixed} worldMatrix={worldMatrix}>
        <Center top position={[2, 0, 2]}>
          <primitive object={gltf.scene.clone()}
            onClick={() => {
              dispatch({
                type: "SET_CURRENT_OBJECT",
                payload: {
                  assetIdentifier: assetIdentifer
                }
              })

                setAssetIdentifier(assetIdentifer)
            }}
            onPointerEnter={() => setHovered(true)}
            onPointerOut={() => setHovered(false)} />
        </Center>
      </PivotControls>)
  };

export default Model;