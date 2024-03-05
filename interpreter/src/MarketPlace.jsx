// get all the games from GameFactory contract
import { Grid, Card, CardContent, CardMedia, Typography, Button, ThemeProvider, createTheme } from "@mui/material"

import { useEffect, useState } from "react"
import { ethers } from "ethers"
import ContractAddress from "./contracts/contract-address.json"
import GameFactory from "./contracts/GameFactory.json"
import Game from "./contracts/Game.json"

const MarketPlace = () => {
  const [account, setAccount] = useState("")
  const [gameAddress, setGameAddress] = useState([])

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  useEffect(() => {
    // get all the games from GameFactory contract
    web3Handler()
  }, [])

  const web3Handler = async () => {
    // Use Mist/MetaMask's provider
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
    setAccount(accounts[0])
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setAccount(accounts[0])

    const signer = provider.getSigner()

    window.ethereum.on("chainChanged", (chainId) => {
      window.location.reload()
    })

    window.ethereum.on("accountsChanged", async function (accounts) {
      setAccount(accounts[0])
      await web3Handler()
    })
    loadContracts(signer, accounts[0])
  }

  const loadContracts = async (signer, account) => {
    try {
      const gameFactory = new ethers.Contract(ContractAddress.GameFactory, GameFactory.abi, signer)

      const gameAdresses = await gameFactory.getGameAddresses()

      setGameAddress(gameAdresses)
      console.log(gameAdresses)
    } catch (error) {
      console.error("Error loading contracts:", error)
    }
  }

  const DisplayGames = () => {
    return (
      <Grid container spacing={2} sx={{ height: "100vh", overflowY: "auto" , backgroundColor: "#1e1e1e"}}>
        {gameAddress.map((game, index) => (
          <Grid item key={index} >
            <GameCard gameAddress={game} />
          </Grid>
        ))}
      </Grid>

    )
  }

  const playGame = async (gameAddress) => {
    // route to localhost:3000/?game=gameAddress
    window.location.href = `?game=${gameAddress}`
  }

  const GameCard = ({ gameAddress }) => {
    const [game, setGame] = useState({ name: "", price: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      const loadGame = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const gameContract = new ethers.Contract(gameAddress, Game.abi, signer)

        const name = await gameContract.name()
        const price = await gameContract.price()
        const thumbnail = await gameContract.thumbnail()
        //const totalBuyers = await gameContract.getTotalBuyers()

        setGame({
          name,
          price: ethers.utils.formatEther(price),
          address: gameAddress,
          thumbnail: thumbnail,
          //totalBuyers: totalBuyers.toNumber(),
        })
        setLoading(false)
      }
      loadGame()
    }, [gameAddress])

    const randomImageURL = "https://images.wondershare.com/virtulook/articles/random-background-generator-2.jpg"

    return (
      
      <Card sx={{ width: 300, margin: 2 , background: "#2d2d30" , color: 'white' , borderRadius: 5,
       '&:hover': {background: "black" , color: "white" , boxShadow: "0 0 10px 2px white", scale: "1.05"}
    }}
       >
        <CardMedia component="img" height="140" image={game.thumbnail} alt="Random Image" />
        <CardContent>
          {loading ? (
            <Typography variant="body1">Loading...</Typography>
          ) : (
            <div >
              <Typography variant="h6" inline><b>{game.name}</b></Typography>
              <Typography variant="body2" inline sx={{fontSize: "12px", color:"gray"}}>{(game.address).slice(0,6) + "..." + (game.address).slice(-7,-1)}</Typography>

              <Typography variant="body1" sx={{color: "lightgreen",fontSize: "14px", marginTop:"5px"}}>{game.price*10**18} TBNB</Typography>
              <Typography variant="body2" >Played by {game.totalBuyers ? game.totalBuyers : 0} users</Typography>
              <Button sx={{ bgcolor: "green" , borderRadius: 3, width: "100%", marginTop: "12px"}} variant="contained" color="primary" onClick={() => playGame(game.address)}>
                <b>Play</b>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card >
      <Card sx={{ background: "black" , color: "white" , height:80, padding: 2 , fontSize: 30}}><b>BNBCraft Store</b></Card>
      <DisplayGames />
    </Card>
  )
}
export default MarketPlace
