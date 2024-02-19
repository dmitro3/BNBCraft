import { Canvas, useFrame } from "@react-three/fiber"
import { Loader, PointerLockControls, KeyboardControls, Text, PresentationControls, Stars } from "@react-three/drei"
import { Debug, Physics, RigidBody } from "@react-three/rapier"
import { Player } from "./Player"
// import { Model } from "./Show2"
import { Suspense, useEffect } from "react"
import { useState } from "react"
import { ethers } from "ethers"
import PlayerStatus from './contracts/PlayerStatus.json';
import { useSharedState } from './sharedState';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useLoader } from '@react-three/fiber'
import { BigNumber } from "ethers"
import { useRef } from "react"
import data from './test.json';
import { Scene } from "three"


// Controls: WASD + left click

const Model = ({ file , object }) => {
  const gltf = useLoader(GLTFLoader, file)
  return (<primitive 
    key={object.assetIdentifier}
    object={gltf.scene.clone()} 
    scale={[object.scale.x,object.scale.y,object.scale.z]} 
    position={[object.position.x,object.position.y,object.position.z]}
    />)
}

export default function App() {
  const queryParams = new URLSearchParams(window.location.search)
  const address = queryParams.get("market") || "loading..."

  const [account, setAccount] = useState('');
  const { user, setUser } = useSharedState();

  const [playerContract, setPlayerContract] = useState();
  
  let [objects] = useState([])
  const [world_settings, setWorldSettings] = useState({})
  const [light] = useState([])
  const load = () => {
    data.map((object) => {
      if(object.type === "environment"){
        setWorldSettings(object)
      }
      else if(object.type === "light"){
        light.push(object)
      }
      else if(objects.includes(object) === false){
        objects.push(object)
      }
    }
  )}

  const web3Handler = async () => {
    // Use Mist/MetaMask's provider
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0]);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setAccount(accounts[0]);
    setUser(String(accounts[0]))    // displaying user address

    const signer = provider.getSigner();

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    })

    window.ethereum.on('accountsChanged', async function (accounts) {
      setAccount(accounts[0])
      setUser((account))
      await web3Handler()
    })
    loadContracts(signer, accounts[0])

  };

  const loadContracts = async (signer, account) => {
    try {
      const address = "0xF2a3b5A2C86cfF9D8De2056418773B6a71cE03A4"
      console.log(address, " address")
      const playerContract = await new ethers.Contract(address, PlayerStatus.abi, signer)
      console.log(playerContract, "playerContract")
      setPlayerContract(playerContract)

    } catch (error) {
      console.error('Error loading contracts:', error);
      // Handle the error (e.g., show a message to the user)
    }
  };



  useEffect(() => {
    web3Handler()
    load()
  }, [])

  return (<>
    <KeyboardControls
      map={[
        { name: "forward", keys: ["ArrowUp", "w", "W"] },
        { name: "backward", keys: ["ArrowDown", "s", "S"] },
        { name: "left", keys: ["ArrowLeft", "a", "A"] },
        { name: "right", keys: ["ArrowRight", "d", "D"] },
        { name: "jump", keys: ["Space"] },
      ]}>

      <Suspense>
        <Canvas camera={{ fov: 45 }} shadows>
          <ambientLight intensity={world_settings.ambient_light} />
          <color attach="background" args={[world_settings.sky_color]} />

          {world_settings.stars && <Stars depth={100} />}
          {
            light && light.map((light) => {
              return (
                <pointLight key={light.assetIdentifier} 
                position={[light.position.x, light.position.y, light.position.z]} 
                intensity={light.intensity} 
                color={light.color}
                />
              )
            })
          }
          <Physics gravity={[0, -world_settings.gravity, 0]}>
            <Debug/>
            {objects && objects.map((object) => {
              if(object.colliders!="no") {
              return(
            <RigidBody 
            onClick={() => {
              if(object.onClick!="none")
              playerContract.completeTask(object.onClick)
            }}
            onCollisionEnter={() => {
              if(object.onCollision!="none")
              playerContract.completeTask(object.onCollision)
            }}
            onIntersectionEnter={() => {
              if(object.onSensorEnter!="none")
              playerContract.completeTask(object.onSensorEnter)
            }}
            onIntersectionExit={() => {
              if(object.onSensorExit!="none")
              playerContract.completeTask(object.onSensorExit) 
            }}
            sensor={object.sensor}
            key={object.assetIdentifier} 
            type={object.fixed ? "fixed" : "dynamic"} 
            colliders={object.colliders}
            mass={1} > 
              <Model key={object.assetIdentifier} object={object} file={object.assetLink} />
               </RigidBody>
               )}

              else {
                return(
                  <Model key={object.assetIdentifier} object={object} file={object.assetLink} />
            )}
            })}
            <Player 
            speed={world_settings.player_speed}
            mass={world_settings.player_mass}
            jump={world_settings.player_jump}
            size={world_settings.player_size}
            flycontrol={world_settings.flycontrol}
            />
          </Physics>


          <PointerLockControls />
        </Canvas>
      </Suspense>
      <Loader />
    </KeyboardControls>
  </>
  )
}
