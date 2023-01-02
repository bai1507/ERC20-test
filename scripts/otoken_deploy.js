const { run, network } = require("hardhat");
const hre = require("hardhat");

async function main() {
  console.log("Deploying contract。。。");
  //合约名不是文件名
  //npx hardhat run scripts/RPdeployNFT.js
  //npx hardhat run scripts/RPdeployNFT.js --network goerli
  const OutToken = await hre.ethers.getContractFactory("OutToken");
  const otoken = await OutToken.deploy();
  await otoken.deployed();
  console.log(`Deployed contract to : ${otoken.address}`);
  //verify contract
  if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for block txes。。。。");
    await otoken.deployTransaction.wait(3);
    await verify(otoken.address, []);
  }
}

async function verify(contractAddress, args) {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!");
    } else {
      console.log(e);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
