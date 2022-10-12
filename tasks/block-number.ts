import { task } from "hardhat/config"

export default task(
  "block-number",
  "Prints the current block number",
  async (taskArgs, hre) => {
    const blockNumber = await hre.ethers.provider.getBlockNumber()
    console.log(`Block number: ${blockNumber}`)
  }
)
