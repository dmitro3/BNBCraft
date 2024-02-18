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
import Green from '../Green.tsx'

export default function App() {
  return (
    <GlobalContextProvider>
      <Scene />
    </GlobalContextProvider>
  )
}

function Scene() {
  const [isGreenVisible, setIsGreenVisible] = useState(true);

  const [height, setHeight] = useState("20%");
  const ref = useRef()
  const { state, dispatch } = useContext(GlobalContext)
  const { objectMaster, currentObjectIdentifer } = state

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
        // Asset Information
        assetIdentifier: assetIdentifer,
        assetLink: assetLink,

        // Location and Orientation
        position: new THREE.Vector3(0, 0, 0),
        quaternion: new THREE.Quaternion(0, 0, 0, 0),
        scale: new THREE.Vector3(1, 1, 1),
        worldMatrix: new THREE.Matrix4(),
        initialVelocity: new THREE.Vector3(0, 0, 0),
        followPlayer: false,

        // State
        fixed: false,
        mass: 1,
        colliders: 'no',

        // Methods
        OnClick: "",
        OnHover: "",
        OnCollision: ""
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

  // Change Object
  const ChangeAction = (data) => {
    const ChangeAction = {
      type: "CHANGE_OBJECT",
      payload: data
    }

    dispatch(ChangeAction)
  }

  // Change Environment
  const ChangeEnvironment = (data) => {
    const ChangeAction = {
      type: "CHANGE_ENVIRONMENT",
      payload: data
    }

    dispatch(ChangeAction)
  }

  // Add Light
  const AddLight = (data) => {
    const AddAction = {
      type: "ADD_LIGHT",
      payload: data
    }

    dispatch(AddAction)
  }

  // Delete Light
  const DeleteLight = (data) => {
    const DeleteAction = {
      type: "DELETE_LIGHT",
      payload: data
    }

    dispatch(DeleteAction)
  }

  // Change Light
  const ChangeLight = (data) => {
    const ChangeAction = {
      type: "CHANGE_LIGHT",
      payload: data
    }

    dispatch(ChangeAction)
  }

  // Load Object Master
  const LoadObjectMaster = () => {
    objJSON.map((object) => {
      const AddAction = {
        type: "ADD_OBJECT",
        payload: {
          // Asset Information
          assetIdentifier: object.assetIdentifier,
          assetLink: object.assetLink,

          // Location and Orientation
          position: new THREE.Vector3(object.position.x, object.position.y, object.position.z),
          quaternion: new THREE.Quaternion(object.quaternion.x, object.quaternion.y, object.quaternion.z, object.quaternion.w),
          scale: new THREE.Vector3(object.scale.x, object.scale.y, object.scale.z),
          worldMatrix: new THREE.Matrix4().fromArray(object.worldMatrix.elements),

          // State
          fixed: object.fixed,
          mass: object.mass,
          colliders: object.colliders,

          // Methods
          OnClick: object.OnClick,
          OnHover: object.OnHover,
          OnCollision: object.OnCollision
        }
      }

      dispatch(AddAction)
    })
  }

  return (
    <div className='d-flex flex-column vh-100'>
      <div className='row m-0 w-100 overflow-auto'>
        <div className='col-9 d-flex flex-column p-0 m-0 vh-100'>
          <div className='d-flex flex-row bg-success' style={{ height: "5%" }}>
            {/* Create a horizontal list of items in the following order: <Title> <Load World> <Export World> <Test> <Publish> */}
            <div className='col-3'>
              <h3 className='text-light ms-2'>BnB Hackathon</h3>
            </div>
            <div className='col-3'></div>
            <div className='col-6 text-end'>
              <div className='m-0' style={{ padding: "1.5px" }}>
                <button className='mx-1 px-2 p-1 my-0'
                  onClick={() => {
                    LoadObjectMaster()
                  }
                  }>
                  <span className='me-1 bi bi-folder-symlink align-text-top'></span>
                  Load World</button>
                <button className='mx-1 px-2 p-1 my-0'
                  onClick={() => {
                    LoadObjectMaster()
                  }
                  }>
                  <span className='me-1 bi bi-cloud-arrow-down align-text-top'></span>
                  Export World</button>
                <button className='mx-1 px-2 p-1 my-0'
                  onClick={() => {
                    LoadObjectMaster()
                  }
                  }>
                  <span className='me-1 bi bi-play-circle align-text-top'></span>
                  Test</button>
                <button className='mx-1 px-2 p-1 my-0'
                  onClick={() => {
                    LoadObjectMaster()
                  }
                  }>
                  <span className='me-1 bi bi-cloud-arrow-up align-text-top'></span>
                  Publish</button>
              </div>
            </div>
          </div>
          <div style={{ height: (height === "20%" ? "80%" : "100%") }}>
            <Canvas shadows raycaster={{ params: { Line: { threshold: 0.15 } } }} camera={{ position: [-10, 10, 10], fov: 20 }} id='objectScene'>
              {
                <>
                  {
                    objectMaster.map((object) => {
                      if (object.type === "object")
                        return <Model
                          assetIdentifer={object.assetIdentifier}
                          assetLink={object.assetLink}
                          collision={object.collision}
                          fixed={object.fixed}
                          worldMatrix={object.worldMatrix}
                        />
                      else
                        return <></>
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

          <div className='bg-primary overflow-auto w-100' style={{ height: height }}>
            <div className='row m-0 pb-1'>
              <button className='m-0 p-0 border-0 text-light' style={{ borderRadius: "0px" }}
                onClick={() => {
                  if (height === "20%")
                    setHeight("3.4%")
                  else
                    setHeight("20%")
                }}>
                {
                  (height === "20%" ? <span className='bi bi-chevron-double-up'></span> : <span className='bi bi-chevron-double-down'></span>)
                }
              </button>
            </div>
            <div className='row m-0 p-0'>

            </div>
          </div>

        </div>

        {/* Panel */}
        <div className='col-3 text-light bg-danger vh-100 p-0 overflow-auto'>
          <div class="accordion accordion-flush" id="accordionFlushExample">
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                  Environment
                </button>
              </h2>
              <div id="flush-collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                <div class="accordion-body">
                  {/* Create a form with gravity, friction, sky_color(color), ambient_light, stars(checkbox) */}
                  <div className='row m-0 p-0'>
                    <div className='col-6'>
                      <label for="gravity" class="form-label">Gravity</label>
                      <input type="number" class="form-control" id="gravity" placeholder="0" />
                    </div>
                    <div className='col-6'>
                      <label for="friction" class="form-label">Friction</label>
                      <input type="number" class="form-control" id="friction" placeholder="0.5" />
                    </div>
                    <div className='col-6'>
                      <label for="sky_color" class="form-label">Sky Color</label>
                      <input type="color" class="form-control" id="sky_color" placeholder="black" />
                    </div>
                    <div className='col-6'>
                      <label for="ambient_light" class="form-label
                      ">Ambient Light</label>
                      <input type="number" class="form-control" id="ambient_light" placeholder="0.5" />
                    </div>
                    <div className='col-12'>
                      <div class="form-check
                        ">
                        <input class="form-check-input" type="checkbox" value="" id="stars" />
                        <label class="form-check-label" for="stars">Stars</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                  Player
                </button>
              </h2>
              <div id="flush-collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                <div class="accordion-body">
                  {/* Create for player speed, mass, size, jump */}
                  <div className='row m-0 p-0'>
                    <div className='col-6'>
                      <label for="player_speed" class="form-label">Speed</label>
                      <input type="number" class="form-control" id="player_speed" placeholder="0.5" />
                    </div>
                    <div className='col-6'>
                      <label for="player_mass" class="form-label">Mass</label>
                      <input type="number" class="form-control" id="player_mass" placeholder="1" />
                    </div>
                    <div className='col-6'>
                      <label for="player_size" class="form-label">Size</label>
                      <input type="number" class="form-control" id="player_size" placeholder="1" />
                    </div>
                    <div className='col-6'>
                      <label for="player_jump" class="form-label">Jump</label>
                      <input type="number" class="form-control" id="player_jump" placeholder="1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                  Object {"(" + (currentObjectIdentifer? currentObjectIdentifer: "None Selected") + ")"}
                </button>
              </h2>
              <div id="flush-collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                <div class="accordion-body">
                  {/* Create for assetLink, fixed, mass, colliders, [col-12] OnClick, OnHover, OnCollision */}
                  <div className='row m-0 p-0'>
                    <div className='col-12'>
                      <label for="assetLink" class="form-label">Asset Link</label>
                      <input type="text" class="form-control" id="assetLink" placeholder="https://gateway.pinata.cloud/ipfs/Qmdq16KoUGqckw3dX8c9VzX4WAvkxfXasCQV8k7Zzc1rTr" />
                    </div>
                    <div className='col-12 pt-3 text-start m-auto'>
                      <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                        <label class="form-check-label" for="flexSwitchCheckDefault">Fix The Object</label>
                      </div>
                    </div>
                    <div className='col-12 pt-2 mb-1 text-start m-auto'>
                      <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                        <label class="form-check-label" for="flexSwitchCheckDefault">Follow the player?</label>
                      </div>
                    </div>
                    <div className='col-6 pt-1'>
                      <label for="initial_velocity" class="form-label">Initial Velocity</label>
                      <input type="number" class="form-control" id="initial_velocity" placeholder="1" />
                    </div>
                    <div className='col-6'>
                      <label for="mass" class="form-label">Mass</label>
                      <input type="number" class="form-control" id="mass" placeholder="1" />
                    </div>
                    <div className='col-12 pt-2 mb-2'>
                      <label for="colliders" class="form-label">Colliders</label>
                      <select class="form-select" id="colliders">
                        <option selected>Choose...</option>
                        <option value="no">No</option>
                        <option value="cuboid">Cuboid</option>
                        <option value="hull">Hull</option>
                        <option value="ball">Ball</option>
                        <option value="trimesh">Trimesh</option>
                      </select>
                    </div>
                    <div className='col-12 mb-2'>
                      <label for="initialVelocity" class="form-label">Initial Velocity</label>
                      <input type="text" class="form-control" id="initialVelocity" placeholder="" />
                    </div>
                    <div className='col-12'>
                      <label for="OnClick" class="form-label">OnClick</label>
                      <input type="text" class="form-control" id="OnClick" placeholder="" />
                    </div>
                    <div className='col-12'>
                      <label for="OnHover" class="form-label">OnHover</label>
                      <input type="text" class="form-control" id="OnHover" placeholder="" />
                    </div>
                    <div className='col-12'>
                      <label for="OnCollision" class="form-label">OnCollision</label>
                      <input type="text" class="form-control" id="OnCollision" placeholder="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseFour" aria-expanded="false" aria-controls="flush-collapseFour">
                  Location & Orientation
                </button>
              </h2>
              <div id="flush-collapseFour" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                <div class="accordion-body">
                  <div className='row m-0 p-0'>
                    <div className="col-12">
                      <h6>Position</h6>
                    </div>
                    <div className="col-4">
                      <label for="x" class="form-label">X</label>
                      <input type="text" class="form-control" id="x" placeholder="0" disabled />
                    </div>
                    <div className="col-4">
                      <label for="y" class="form-label">Y</label>
                      <input type="text" class="form-control" id="y" placeholder="0" disabled />
                    </div>
                    <div className="col-4">
                      <label for="z" class="form-label">Z</label>
                      <input type="text" class="form-control" id="z" placeholder="0" disabled />
                    </div>
                  </div>
                  <div className='row m-0 p-0 mt-3'>
                    <div className="col-12">
                      <h6>Quaternion</h6>
                    </div>
                    <div className="col-3">
                      <label for="quaternion_x" class="form-label
                      ">Q_X</label>
                      <input type="text" class="form-control" id="quaternion_x" placeholder="0" disabled />
                    </div>
                    <div className="col-3">
                      <label for="quaternion_y" class="form-label
                      ">Q_Y</label>
                      <input type="text" class="form-control" id="quaternion_y" placeholder="0" disabled />
                    </div>
                    <div className="col-3">
                      <label for="quaternion_z" class="form-label
                      ">Q_Z</label>
                      <input type="text" class="form-control" id="quaternion_z" placeholder="0" disabled />
                    </div>
                    <div className="col-3">
                      <label for="quaternion_w" class="form-label
                      ">Q_W</label>
                      <input type="text" class="form-control" id="quaternion_w" placeholder="0" disabled />
                    </div>
                  </div>
                  <div className='row m-0 p-0 mt-3'>
                    <div className="col-12">
                      <h6>Scale</h6>
                    </div>
                    <div className="col-4">
                      <label for="scale_x" class="form-label
                      ">S_X</label>
                      <input type="text" class="form-control" id="scale_x" placeholder="1" disabled />
                    </div>
                    <div className="col-4">
                      <label for="scale_y" class="form-label
                      ">S_Y</label>
                      <input type="text" class="form-control" id="scale_y" placeholder="1" disabled />
                    </div>
                    <div className="col-4">
                      <label for="scale_z" class="form-label
                      ">S_Z</label>
                      <input type="text" class="form-control" id="scale_z" placeholder="1" disabled />
                    </div>
                  </div>
                </div>
              </div>


            </div>

          </div>
        </div>
      </div>
    </div>
  )
}