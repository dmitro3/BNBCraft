import React, { useEffect, useState,useContext } from 'react';
import { Canvas, useLoader } from '@react-three/fiber'
import { Center } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { PivotControls } from './pivotControls/index.tsx'
import { GlobalContext } from './GlobalContext.jsx'

const Model = ({ assetLink, assetIdentifer, collision, fixed, worldMatrix,setAssetIdentifier }) => {
    const { state, dispatch } = useContext(GlobalContext)
    const { currentObjectIdentifier } = state

    const gltf = useLoader(GLTFLoader, assetLink);
    const [hovered, setHovered] = useState(false)

    useEffect(() => {
      document.body.style.cursor = hovered ? 'grab' : 'auto'
    }, [hovered])

    return (
      <PivotControls assetIdentifier={assetIdentifer} collision={collision} fixedM={fixed} worldMatrix={worldMatrix}>
        <Center top position={[2, 0, 2]}>
          <primitive object={gltf.scene.clone()}
            onClick={(e) => {
              dispatch({
                type: "SET_CURRENT_OBJECT",
                payload: {
                  assetIdentifier: assetIdentifer
                }
              })

              dispatch({
                type: "SET_CURRENT_OBJECT_IDENTIFIER",
                payload: assetIdentifer
              })

              console.log(currentObjectIdentifier, "currentObjectIdentifier")
              e.stopPropagation()
            }}
            onPointerEnter={() => setHovered(true)}
            onPointerOut={() => setHovered(false)} >
              </primitive>
        </Center>
      </PivotControls>)
  };

export default Model;