import { Input, Grid, Card, CardContent, CardMedia, Typography, Button, ThemeProvider, createTheme } from "@mui/material"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import ContractAddress from "./contracts/contract-address.json"
import GameFactory from "./contracts/GameFactory.json"
import Game from "./contracts/Game.json"
import { Center } from "@react-three/drei"

const MarketPlace = () => {
  const [account, setAccount] = useState("")
  const [gameAddress, setGameAddress] = useState([])
  const [searchInput, setSearchInput] = useState("") // State for the search input

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  useEffect(() => {
    web3Handler()
  }, [])

  const web3Handler = async () => {
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
      const gameAddresses = await gameFactory.getGameAddresses()
      setGameAddress(gameAddresses)
    } catch (error) {
      console.error("Error loading contracts:", error)
    }
  }

  const DisplayGames = () => {
    const filteredGames = gameAddress.filter(game =>
      game.toLowerCase().includes(searchInput.toLowerCase())
    );

    return (
      <Grid container spacing={2} sx={{ justifyContent: "center", height: "100vh", overflowY: "auto", backgroundColor: "#1e1e1e" }}>
        {filteredGames.map((game, index) => (
          <Grid item key={index}>
            <GameCard gameAddress={game} />
          </Grid>
        ))}
      </Grid>
    )
  }

  const playGame = async (gameAddress) => {
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

        setGame({
          name,
          price: ethers.utils.formatEther(price),
          address: gameAddress,
          thumbnail: thumbnail,
        })
        setLoading(false)
      }
      loadGame()
    }, [gameAddress])

    return (
      <Card sx={{ width: 300, margin: 2, background: "#2d2d30", color: 'white', borderRadius: 5,
       '&:hover': {background: "black" , color: "white" ,  scale: "1.05"}
    }}>
        <CardMedia component="img" height="140" image={game.thumbnail} alt="Random Image" />
        <CardContent>
          {loading ? (
            <Typography variant="body1">Loading...</Typography>
          ) : (
            <div>
              <Typography variant="h6" ><b>{game.name}</b></Typography>
              <Typography variant="body2"  sx={{fontSize: "12px", color:"gray"}}>{(game.address).slice(0,6) + "..." + (game.address).slice(-7,-1)}</Typography>
              <Typography variant="body1" sx={{color: "lightgreen",fontSize: "14px", marginTop:"5px"}}>{game.price*10**18} TBNB</Typography>
              <Button sx={{ bgcolor: "primary" , borderRadius: 3, width: "100%", marginTop: "12px",
            '&:hover': {bgcolor: "green" , color: "white" ,  scale: "1.05"}
            }} variant="contained" color="primary" onClick={() => playGame(game.address)}>
                <b>Play</b>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card sx={{ borderRadius: 0 }}>
      <Card sx={{ borderRadius: 0, background: "black", color: "white", height: 80, padding: 2, fontSize: 20 }}>
        <b>BNBCraft <b style={{ color: "lightgreen" }}>Store</b>  </b>
        <Input
          disableUnderline={true}
          sx={{
            marginLeft: "250px",
            color: "white",
            disableUnderline: true,
            height: 40,
            width: "600px",
            padding: 2,
            background: "#2d2d30",
            borderRadius: "20px"
          }}
          type="text"
          placeholder="🔎 Search Address"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </Card>
      <DisplayGames />
    </Card>
  )
}

export default MarketPlace
