import { useRef, useState, useContext } from 'react'
import { useEffect } from 'react'
import { GlobalContext, GlobalContextProvider } from './GlobalContext.jsx'

import * as THREE from 'three'
import { Canvas, useLoader } from '@react-three/fiber'
import { useControls } from 'leva'
import { useGLTF, GizmoHelper, GizmoViewport, OrbitControls, Center } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { PivotControls } from './pivotControls/index.tsx'
import objJSON from './objectMaster.json'
import  Green  from '../Green.tsx'
// softShadows()

export default function App() {
  return (
    <GlobalContextProvider>
      <Scene />
    </GlobalContextProvider>
  )
}

// for testing https://gateway.pinata.cloud/ipfs/Qmdq16KoUGqckw3dX8c9VzX4WAvkxfXasCQV8k7Zzc1rTr

function Scene() {
  const [isGreenVisible, setIsGreenVisible] = useState(true);

  const ref = useRef()
  // const { attach } = useControls({ attach: false })
  const { state, dispatch } = useContext(GlobalContext)
  const { objectMaster } = state

  const Model = ({ assetLink, assetIdentifer, collision, fixed, worldMatrix }) => {
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

              setId(assetIdentifer)
            }}
            onPointerEnter={(e) => setHovered(true)}
            onPointerOut={(e) => setHovered(false)} />
        </Center>
      </PivotControls>)
  };

  function setId(id) {
    setAssetIdentifer(id)
  }

  // Add Object
  const [assetIdentifer, setAssetIdentifer] = useState('chest0')
  const [assetLink, setAssetLink] = useState('https://gateway.pinata.cloud/ipfs/Qmdq16KoUGqckw3dX8c9VzX4WAvkxfXasCQV8k7Zzc1rTr')

  const AddAction = () => {
    const AddAction = {
      type: "ADD_OBJECT",
      payload: {
        link: assetLink,
        assetIdentifier: assetIdentifer,
        assetLink: assetLink,
        position: new THREE.Vector3(0, 0, 0),
        quaternion: new THREE.Quaternion(0, 0, 0, 0),
        scale: new THREE.Vector3(1, 1, 1),
        worldMatrix: new THREE.Matrix4(),
        collision: 'no', // no, yes, box, hull, trimesh (yes=box)
        fixed: false // true, false
      }
    }

    dispatch(AddAction)
  }

  // Delete Object
  const DeleteAction = (assetIdentifier) => {
    const DeleteAction = {
      type: "DELETE_OBJECT",
      payload: {
        assetIdentifier: assetIdentifier
      }
    }

    dispatch(DeleteAction)
  }

  // Load objectMaster.json
  const LoadObjectMaster = () => {
    // Should be a fetch request or load on upload

    objJSON.map((object) => {
      const AddAction = {
        type: "ADD_OBJECT",
        payload: {
          asset: <Model assetIdentifer={object.assetIdentifier} assetLink={object.assetLink} />,
          link: object.assetLink,
          assetIdentifier: object.assetIdentifier,
          assetLink: object.assetLink,
          position: new THREE.Vector3(object.position.x, object.position.y, object.position.z),
          quaternion: new THREE.Quaternion(object.quaternion.x, object.quaternion.y, object.quaternion.z, object.quaternion.w),
          scale: new THREE.Vector3(object.scale.x, object.scale.y, object.scale.z),
          worldMatrix: new THREE.Matrix4().fromArray(object.worldMatrix.elements),
          collision: object.collision,
          fixed: object.fixed
        }
      }

      dispatch(AddAction)
    })
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: "70%" }}>
        <Canvas shadows raycaster={{ params: { Line: { threshold: 0.15 } } }} camera={{ position: [-10, 10, 10], fov: 20 }} id='objectScene'>
          {/* Objects Append Here */}
          {
            <>
              {
                objectMaster.map((object) => {
                  return <Model
                    assetIdentifer={object.assetIdentifier}
                    assetLink={object.assetLink}
                    collision={object.collision}
                    fixed={object.fixed}
                    worldMatrix={object.worldMatrix}
                  />
                  // return object.asset
                })
              }
            </>
          }
          <ambientLight intensity={0.5} />
          <directionalLight
            castShadow
            position={[2.5, 5, 5]}
            intensity={1.5}
            shadow-mapSize={[1024, 1024]}>
            {/* <orthographicCamera attach="shadow-camera" args={[-5, 5, 5, -5, 1, 50]} /> */}
          </directionalLight>

          <mesh scale={20}
            receiveShadow
            rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry />
            <shadowMaterial transparent opacity={0.2} />
          </mesh>

          <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
            <GizmoViewport labelColor="white" axisHeadScale={1} />
          </GizmoHelper>
          <OrbitControls makeDefault />
        </Canvas>
      </div>

      {/* Panel */}
      <div style={{ width: "30%" }}>
      <button onClick={() => setIsGreenVisible(!isGreenVisible)}>
          Import from Greenfield
        </button>
        {isGreenVisible && <Green />}
        <div className='panel' style={{ height: "10vh" }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Add Panel */}
            <div style={{ border: '1px solid black', padding: '10px', marginBottom: "10px" }}>
              <h2>Add Object</h2>
              <input type='text' placeholder='Asset Identifier' onChange={(e) => setAssetIdentifer(e.target.value)} value={assetIdentifer} />
              <input type='text' placeholder='Asset Link' onChange={(e) => setAssetLink(e.target.value)} value={assetLink} />
              <button onClick={AddAction}>Add</button>
            </div>

            {/* Delete Panel */}
            <div style={{ border: '1px solid black', padding: '10px', marginBottom: "10px" }}>
              <h2>Delete Object</h2>
              <input type='text' placeholder='Asset Identifier' onChange={(e) => setAssetIdentifer(e.target.value)} value = {assetIdentifer} />
              <button onClick={() => DeleteAction(assetIdentifer)}>Delete</button>
            </div>

            {/* Object Master */}
            <div style={{ border: '1px solid black', padding: '10px', marginBottom: "10px" }}>
              <h2>Object Master</h2>
              <button onClick={LoadObjectMaster}>Load</button>
              <button
                onClick={() => {
                  const a = document.createElement("a");
                  const file = new Blob([JSON.stringify(objectMaster)], { type: 'application/json' });
                  a.href = URL.createObjectURL(file);
                  a.download = 'objectMaster.json';
                  a.click();
                }}
              >Download</button>
              <h3>Object Count: {objectMaster.length}</h3>
              <ul style={{ overflowY: "scroll", height: "40vh" }}>
                {
                  objectMaster.map((object) => {
                    return <div style={{ padding: "4px", border: "2px solid white" }}>
                      <li>Asset: <span style={{ color: "red" }}>{object.assetIdentifier}</span></li>
                      <li>Position: <ul>
                        <li>x: <span style={{ color: "blue" }}>{object.position.x}</span></li>
                        <li>y: <span style={{ color: "blue" }}>{object.position.y}</span></li>
                        <li>z: <span style={{ color: "blue" }}>{object.position.z}</span></li>
                      </ul>
                      </li>
                      <li>Quaternion: <ul>
                        <li>x: <span style={{ color: "blue" }}>{object.quaternion.x}</span></li>
                        <li>y: <span style={{ color: "blue" }}>{object.quaternion.y}</span></li>
                        <li>z: <span style={{ color: "blue" }}>{object.quaternion.z}</span></li>
                        <li>w: <span style={{ color: "blue" }}>{object.quaternion.w}</span></li>
                      </ul>
                      </li>
                      <li>Scale:  <ul>
                        <li>x: <span style={{ color: "blue" }}>{object.scale.x}</span></li>
                        <li>y: <span style={{ color: "blue" }}>{object.scale.y}</span></li>
                        <li>z: <span style={{ color: "blue" }}>{object.scale.z}</span></li>
                      </ul>
                      </li>
                    </div>
                  })
                }
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}