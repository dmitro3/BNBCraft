import { useRef, useState, useContext } from 'react'
import { useEffect } from 'react'
import { GlobalContext, GlobalContextProvider } from './GlobalContext.jsx'
import * as THREE from 'three'
import { Canvas, useLoader } from '@react-three/fiber'
import { useControls } from 'leva'
import { useGLTF, GizmoHelper, GizmoViewport, OrbitControls, Center } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { PivotControls } from './pivotControls/index.tsx'
import Swal from 'sweetalert2';

import { ethers } from 'ethers';
import GameFactory from '../contracts/GameFactory.json';
import ContractAddress from '../contracts/contract-address.json';


import objJSON from './objectMaster.json'
import Green from '../Green.tsx'
import EnvironmentControls from './EnvironmentControls.jsx'
import PlayerControls from './PlayerControls.jsx'
import ObjectControls from './ObjectControls.jsx'
import Model from './Model.jsx'

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

  const [stateEnv, setStateEnv] = useState(
    {
      Environment: {
        gravity: 0,
        friction: 0.5,
        sky_color: '#000000',
        ambient_light: 0.5,
        stars: false
      },
      Player: {
        speed: 10,
        mass: 50,
        size: 1,
        jump: 0.5
      },
      Object: {
        assetLink: 'https://gateway.pinata.cloud/ipfs/Qmdq16KoUGqckw3dX8c9VzX4WAvkxfXasCQV8k7Zzc1rTr',
        fixed: false,
        followPlayer: false,
        initialVelocity: 1,
        mass: 1,
        colliders: 'No',
        OnClick: "",
        OnHover: "",
        OnCollision: ""
      }
    });

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
        scaleFactor: 1,

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
          initialVelocity: new THREE.Vector3(object.initialVelocity.x, object.initialVelocity.y, object.initialVelocity.z),
          followPlayer: object.followPlayer,
          scaleFactor: object.scaleFactor,

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

  const [account, setAccount] = useState('');
  const [signer, setSigner] = useState(null);
  const [factoryContract, setFactoryContract] = useState(null);
  const [gameAddress, setGameAddress] = useState('');

  const web3Handler = async (e) => {

    try {

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);

      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x15EB' }],
      })
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setSigner(signer);

      // window.ethereum.on('chainChanged', async (chainId) => {
      //   // window.location.reload();
      // })

      window.ethereum.on('accountsChanged', async function (accounts) {
        setAccount(accounts[0])
        await web3Handler()
      })

      const factoryContract_ = new ethers.Contract(ContractAddress.GameFactory, GameFactory.abi, signer)
      setFactoryContract(factoryContract_);

      const { value: gameName } = await Swal.fire({
        title: 'Enter Game Name',
        input: 'text',
        inputLabel: 'Game Name',
        inputPlaceholder: 'Enter your game name',
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'You need to enter a game name!'
          }
        }
      })

      if (gameName) {
        const { value: gamePrice } = await Swal.fire({
          title: 'Enter Game Price',
          input: 'number',
          inputLabel: 'Game Price',
          inputPlaceholder: 'Enter the price of your game',
          inputAttributes: {
            min: 0
          },
          showCancelButton: true,
          inputValidator: (value) => {
            if (!value) {
              return 'You need to enter a game price!'
            }
          }
        })



        if (gamePrice) {
          const tx = await factoryContract_.createGame(gameName, "google.com", gamePrice, ["one", "two"]);
          await tx.wait();

          const gameContractAddress = await factoryContract_.getGameAddresses();
          setGameAddress(gameContractAddress[gameContractAddress.length - 1]);

          Swal.fire({
            title: 'Game Published!',
            text: `Game Address: ${gameContractAddress[gameContractAddress.length - 1]}`,
            icon: 'success',
            confirmButtonText: 'Open Game',
          }).then((result) => {
            if (result.isConfirmed) {
              window.open(gameContractAddress[gameContractAddress.length - 1], '_blank');
            }
          });
        }
      }
    } catch (error) {
      console.error('Error in web3Handler:', error);
    }
  };

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
                    web3Handler()
                  }
                  }>
                  <span className='me-1 bi bi-cloud-arrow-up align-text-top'></span>
                  Publish</button>
              </div>
            </div>
          </div>
          <div style={{ height: (height === "20%" ? "80%" : "100%") }}>
            <Canvas shadows raycaster={{ params: { Line: { threshold: 0.15 } } }} camera={{ position: [-10, 10, 10], fov: 20 }} id='objectScene'>
              <color attach="background" args={[stateEnv.Environment.sky_color]} />
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
                          setAssetIdentifer={setAssetIdentifer}
                        />
                      else
                        return <>

                        </>
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
          <div className="accordion accordion-flush" id="accordionFlushExample">
            <EnvironmentControls stateEnv={stateEnv} setStateEnv={setStateEnv} />
            <PlayerControls stateEnv={stateEnv} setStateEnv={setStateEnv} />
            <ObjectControls stateEnv={stateEnv} setStateEnv={setStateEnv} currentObjectIdentifer={currentObjectIdentifer} />
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseFour" aria-expanded="false" aria-controls="flush-collapseFour">
                  Location & Orientation
                </button>
              </h2>
              <div id="flush-collapseFour" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                <div className="accordion-body">
                  <div className='row m-0 p-0'>
                    <div className="col-12">
                      <h6>Position</h6>
                    </div>
                    <div className="col-4">
                      <label for="x" className="form-label">X</label>
                      <input type="text" className="form-control" id="x" placeholder="0" disabled />
                    </div>
                    <div className="col-4">
                      <label for="y" className="form-label">Y</label>
                      <input type="text" className="form-control" id="y" placeholder="0" disabled />
                    </div>
                    <div className="col-4">
                      <label for="z" className="form-label">Z</label>
                      <input type="text" className="form-control" id="z" placeholder="0" disabled />
                    </div>
                  </div>
                  <div className='row m-0 p-0 mt-3'>
                    <div className="col-12">
                      <h6>Quaternion</h6>
                    </div>
                    <div className="col-3">
                      <label for="quaternion_x" className="form-label
                      ">Q_X</label>
                      <input type="text" className="form-control" id="quaternion_x" placeholder="0" disabled />
                    </div>
                    <div className="col-3">
                      <label for="quaternion_y" className="form-label
                      ">Q_Y</label>
                      <input type="text" className="form-control" id="quaternion_y" placeholder="0" disabled />
                    </div>
                    <div className="col-3">
                      <label for="quaternion_z" className="form-label
                      ">Q_Z</label>
                      <input type="text" className="form-control" id="quaternion_z" placeholder="0" disabled />
                    </div>
                    <div className="col-3">
                      <label for="quaternion_w" className="form-label
                      ">Q_W</label>
                      <input type="text" className="form-control" id="quaternion_w" placeholder="0" disabled />
                    </div>
                  </div>
                  <div className='row m-0 p-0 mt-3'>
                    <div className="col-12">
                      <h6>Scale</h6>
                    </div>
                    <div className="col-4">
                      <label for="scale_x" className="form-label
                      ">S_X</label>
                      <input type="text" className="form-control" id="scale_x" placeholder="1" disabled />
                    </div>
                    <div className="col-4">
                      <label for="scale_y" className="form-label
                      ">S_Y</label>
                      <input type="text" className="form-control" id="scale_y" placeholder="1" disabled />
                    </div>
                    <div className="col-4">
                      <label for="scale_z" className="form-label
                      ">S_Z</label>
                      <input type="text" className="form-control" id="scale_z" placeholder="1" disabled />
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