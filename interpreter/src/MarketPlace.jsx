// get all the games from GameFactory contract
import { Grid, Card, CardContent, CardMedia, Typography, Button } from "@mui/material"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import ContractAddress from "./contracts/contract-address.json"
import GameFactory from "./contracts/GameFactory.json"
import Game from "./contracts/Game.json"

const MarketPlace = () => {
  const [account, setAccount] = useState("")
  const [gameAddress, setGameAddress] = useState([])

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
      <Grid container spacing={2} sx={{ maxHeight: "80vh", overflowY: "auto" }}>
        {gameAddress.map((game, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <GameCard gameAddress={game} />
          </Grid>
        ))}
      </Grid>
    )
  }

  const playGame = async (gameAddress) => {
    // route to localhost:3000/?game=gameAddress
    window.location.href = `/?game=${gameAddress}`
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
      <Card sx={{ maxWidth: 300, margin: 2 }}>
        <CardMedia component="img" height="140" image={game.thumbnail} alt="Random Image" />
        <CardContent>
          {loading ? (
            <Typography variant="body1">Loading...</Typography>
          ) : (
            <>
              <Typography variant="h6">{game.name}</Typography>
              <Typography variant="body1">{game.price} TBNB</Typography>
              <Typography variant="body2">Address: {game.address}</Typography>
              <Typography variant="body2">Buyers: {game.totalBuyers}</Typography>
              <Button variant="contained" color="primary" onClick={() => playGame(game.address)}>
                Play
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <h1>Market Place</h1>
      <p>Buy and sell your games here</p>

      <DisplayGames />
    </div>
  )
}
export default MarketPlace
