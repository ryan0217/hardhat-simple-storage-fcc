import { ethers, network, run } from "hardhat"

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000)
  const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60
  const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS

  const lockedAmount = 1 || ethers.utils.parseEther("1")

  console.log("Deploying contract...")
  const Lock = await ethers.getContractFactory("Lock")
  const lock = await Lock.deploy(unlockTime, { value: lockedAmount })

  await lock.deployed()

  console.log(
    `Lock with 1 WEI and unlock timestamp ${unlockTime} deployed to ${lock.address}`
  )

  if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for block transaction...")
    await lock.deployTransaction.wait(2)
    await verify(lock.address, [unlockTime])
  }

  const currentValue = await lock.unlockTime()
  console.log(`Current Value: ${currentValue}`)
  const transactionResponse = await lock.setUnlockTime(2333)
  await transactionResponse.wait(1)
  const updatedValue = await lock.unlockTime()
  console.log(`Updated Value: ${updatedValue}`)
}

async function verify(contractAddress: string, constructorArguments: any[]) {
  console.log("Verifying contract...")
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments,
    })
  } catch (error: any) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!")
    } else {
      console.log(error)
    }
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
