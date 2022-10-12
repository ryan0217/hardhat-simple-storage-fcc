import { ethers } from "ethers"
import { task } from "hardhat/config"

export default task(
  "accounts",
  "Prints the list of accounts",
  async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners()
    for (const account of accounts) {
      const balance = ethers.utils.formatEther(await account.getBalance())
      console.log(account.address, `${balance}ETH`)
    }
  }
)
