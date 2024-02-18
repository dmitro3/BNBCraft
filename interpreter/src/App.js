import { Canvas, useFrame } from "@react-three/fiber"
import { Loader, PointerLockControls, KeyboardControls, Text, PresentationControls, Stars } from "@react-three/drei"
import { Debug, Physics, RigidBody } from "@react-three/rapier"
import { Player } from "./Player"
// import { Model } from "./Show2"
import { Suspense, useEffect } from "react"
import { Billboard } from "@react-three/drei"
import { Sky } from "@react-three/drei"
import { useState } from "react"
import { ethers } from "ethers"
import Market from './contracts/MarketPlace.json';
import { useSharedState } from './sharedState';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useLoader } from '@react-three/fiber'
import { BigNumber } from "ethers"
import { useRef } from "react"
import data from './test.json';
import { Scene } from "three"


// Controls: WASD + left click

const Model = ({ file }) => {
  console.log(file, "file")
  const gltf = useLoader(GLTFLoader, file)
  return (<primitive object={gltf.scene} scale={10} />)
}

export default function App() {
  console.log(data);
  const queryParams = new URLSearchParams(window.location.search)
  const address = queryParams.get("market") || "loading..."

  const [account, setAccount] = useState('');
  const [marketContract, setMarketContract] = useState(null);
  const { user, setUser } = useSharedState();
  const [marketname, setMarketName] = useState("loading...")
  const [products, setProducts] = useState([])
  const [marketdesc, setMarketDesc] = useState("loading...")

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
      // await web3Handler()
    })
    // loadContracts(signer, accounts[0])

  };

  const loadContracts = async (signer, account) => {
    try {
      console.log(address, " address")
      const marketContract_ = await new ethers.Contract(address, Market.abi, signer)
      console.log(marketContract_)
      // loadProducts(marketContract_)
      setMarketContract(marketContract_)
      setMarketName(await marketContract_.marketPlaceName())
      setProducts(await marketContract_.getProducts())
      setMarketDesc(await marketContract_.marketPlaceDescription())

    } catch (error) {
      console.error('Error loading contracts:', error);
      // Handle the error (e.g., show a message to the user)
    }
  };


  useEffect(() => {
    // web3Handler()
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
          <ambientLight intensity={0.5} />
          <color attach="background" args={["black"]} />
        {/* {data.map((object) => {
               return(
              <Model key={object.assetIdentifier}
              file={object.assetLink} 
              scale={[object.scale.x,object.scale.y,object.scale.z]} 
              position={[object.position.x,object.position.y,object.position.z]}
               />
               )
            })} */}


          <Stars depth={100} />
          <Physics gravity={[0, 0, 0]}>
            <Debug/>
            {data.map((object) => {
               return(
                <RigidBody key={object.assetIdentifier} type="Dynamic" mass={1} >
              <Model key={object.assetIdentifier}
              file={object.assetLink} 
              scale={[object.scale.x,object.scale.y,object.scale.z]} 
              position={[object.position.x,object.position.y,object.position.z]}
               />
               </RigidBody>
               )
            })}
            <Player />
          </Physics>


          <PointerLockControls />
          <ambientLight intensity={0.1} />
          <pointLight position={[0, 10, 0]} intensity={0.4} />
        </Canvas>
      </Suspense>
      <Loader />
    </KeyboardControls>
  </>
  )
}
