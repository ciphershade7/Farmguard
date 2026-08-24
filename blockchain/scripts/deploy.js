const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying FarmGuardLedger with account:", deployer.address);

  const FarmGuardLedger = await hre.ethers.getContractFactory("FarmGuardLedger");
  const contract = await FarmGuardLedger.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("FarmGuardLedger deployed to:", address);

  const deployment = {
    address,
    deployerAddress: deployer.address,
    network: hre.network.name,
    deployedAt: new Date().toISOString(),
  };

  const outPath = path.join(__dirname, "..", "deployment.json");
  fs.writeFileSync(outPath, JSON.stringify(deployment, null, 2));
  console.log("Wrote deployment info to", outPath);
  console.log("\nThe Node.js backend (server/blockchainClient.js) reads this file");
  console.log("plus the compiled ABI to talk to the contract. Restart the backend");
  console.log("after redeploying so it picks up the new address.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
