import { ethers } from 'ethers';

// !!! IMPORTANT: UPDATE THIS ADDRESS AFTER DEPLOYING ON REMIX !!!
// After deploying MarketVault.sol, copy the contract address and paste it here
const CONTRACT_ADDRESS = "0x88f3de49C37D55C4Cef0C9c2aC66842559AF57aB"; 

// Update this after deploying StakingPool.sol
const STAKING_CONTRACT_ADDRESS: string = "0xF8eBa2d70754540CB7e5780C784DaF5F11131e5d"; 

// Update this after deploying PredictionMarket.sol
const MARKET_CONTRACT_ADDRESS: string = "0x4850735BAe827f7cD1337e592956d992Dc3253ec";

// USDC Address on Base Network
// Base Mainnet: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
// Base Sepolia (Testnet): 0x036CbD53842c5426634e7929541eC2318f3dCF7e
// NOTE: Ensure this matches the address you used when Deploying the Contract
const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"; 

// Standard ERC20 ABI
const ERC20_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function allowance(address owner, address spender) public view returns (uint256)",
  "function balanceOf(address account) public view returns (uint256)",
  "function decimals() public view returns (uint8)"
];

// MarketVault Contract ABI (Must match the contract provided)
const VAULT_ABI = [
  "function deposit(uint256 amount) external",
  "function withdraw(string calldata asset, uint256 amount) external",
  "function getBalance(address user, string calldata asset) external view returns (uint256)",
  "function adminWithdraw(string calldata asset) external"
];

// StakingPool Contract ABI (Updated for 2-step unstake)
const STAKING_ABI = [
  "function stake(uint256 amount) external",
  "function requestUnstake(uint256 amount) external",
  "function completeUnstake() external",
  "function claimRewards() external",
  "function getStaked(address user) external view returns (uint256)",
  "function getPendingUnstake(address user) external view returns (uint256 amount, uint256 unlockTime)",
  "function pendingRewards(address user) external view returns (uint256)"
];

// PredictionMarket ABI
const MARKET_ABI = [
  "function buyShares(uint256 marketId, bool isNo, uint256 amount) external",
  "function createMarket(string memory _question, uint256 _duration) external",
  "function claimWinnings(uint256 marketId) external"
];

declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface Web3State {
  provider: any;
  signer: any;
  address: string;
  isConnected: boolean;
}

export const connectWallet = async (): Promise<Web3State | null> => {
  if (!window.ethereum) {
    alert("Wallet not found! Please install MetaMask or Coinbase Wallet.");
    return null;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    
    // Log network for debugging
    const network = await provider.getNetwork();
    console.log("Connected to chain ID:", network.chainId);

    return {
      provider,
      signer,
      address,
      isConnected: true
    };
  } catch (error) {
    console.error("Connection Error:", error);
    return null;
  }
};

export const depositFunds = async (amount: number, signer: any): Promise<boolean> => {
  try {
    // 1. Initialize Contract Objects
    const usdcContract = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, signer);
    const vaultContract = new ethers.Contract(CONTRACT_ADDRESS, VAULT_ABI, signer);

    // 2. Get decimals (USDC is usually 6)
    let decimals = 6;
    try {
        decimals = await usdcContract.decimals();
    } catch (e) {
        console.warn("Could not fetch decimals, defaulting to 6");
    }
    
    // 3. Convert amount to BigInt
    const amountWei = ethers.parseUnits(amount.toString(), decimals);

    // 4. Approve (Allow Vault to spend funds)
    console.log(`Approving ${amount} USDC...`);
    const approveTx = await usdcContract.approve(CONTRACT_ADDRESS, amountWei);
    await approveTx.wait();
    console.log("Approval successful.");

    // 5. Call Deposit on Vault
    console.log("Depositing funds into Vault...");
    // Function name is `deposit` in your contract
    const tx = await vaultContract.deposit(amountWei);
    await tx.wait();
    console.log("Deposit successful.");
    
    return true;
  } catch (error: any) {
    console.error("Deposit Error:", error);
    
    const isSimulation = confirm(`Transaction Failed (Error: ${error.info?.error?.message || error.message}). \n\nDo you want to SIMULATE success to test the UI?`);
    if (isSimulation) {
        await new Promise(r => setTimeout(r, 1000));
        return true;
    }
    return false;
  }
};

export const withdrawFunds = async (amount: number, signer: any): Promise<boolean> => {
  try {
    const vaultContract = new ethers.Contract(CONTRACT_ADDRESS, VAULT_ABI, signer);
    
    // Default USDC 6 decimals
    const amountWei = ethers.parseUnits(amount.toString(), 6);

    console.log(`Withdrawing ${amount} USDC...`);
    // Function name is `withdraw` and takes "USDC" as asset argument
    const tx = await vaultContract.withdraw("USDC", amountWei);
    await tx.wait();
    console.log("Withdrawal successful.");
    return true;
  } catch (error: any) {
    console.error("Withdrawal Error:", error);
    
    const isSimulation = confirm(`Transaction Failed (Error: ${error.info?.error?.message || error.message}). \n\nDo you want to SIMULATE success to test the UI?`);
    if (isSimulation) {
        await new Promise(r => setTimeout(r, 1000));
        return true;
    }
    return false;
  }
};

// --- STAKING FUNCTIONS ---

export const getPendingUnstake = async (signer: any): Promise<{ amount: number, unlockTime: number }> => {
    try {
        const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_ABI, signer);
        const address = await signer.getAddress();
        
        const [amountWei, unlockTime] = await stakingContract.getPendingUnstake(address);
        const amount = parseFloat(ethers.formatUnits(amountWei, 6));
        
        return { amount, unlockTime: Number(unlockTime) };
    } catch (e) {
        console.warn("Failed to fetch pending unstake info", e);
        return { amount: 0, unlockTime: 0 };
    }
}

export const stakeFunds = async (amount: number, signer: any): Promise<boolean> => {
  try {
    if (STAKING_CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
        alert("Please deploy StakingPool.sol and update STAKING_CONTRACT_ADDRESS in services/web3Service.ts");
        return false;
    }

    const usdcContract = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, signer);
    const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_ABI, signer);
    
    const amountWei = ethers.parseUnits(amount.toString(), 6);

    console.log(`Approving ${amount} USDC for Staking...`);
    const approveTx = await usdcContract.approve(STAKING_CONTRACT_ADDRESS, amountWei);
    await approveTx.wait();

    console.log("Staking funds...");
    const tx = await stakingContract.stake(amountWei);
    await tx.wait();
    console.log("Staking successful.");
    return true;

  } catch (error: any) {
    console.error("Staking Error:", error);
    const isSimulation = confirm(`Transaction Failed (Error: ${error.info?.error?.message || error.message}). \n\nDo you want to SIMULATE success to test the UI?`);
    if (isSimulation) {
        await new Promise(r => setTimeout(r, 1000));
        return true;
    }
    return false;
  }
};

// Renamed to requestUnstake to match contract logic
export const requestUnstakeFunds = async (amount: number, signer: any): Promise<boolean> => {
  try {
     const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_ABI, signer);
     const amountWei = ethers.parseUnits(amount.toString(), 6);
     
     console.log("Requesting Unstake...");
     const tx = await stakingContract.requestUnstake(amountWei);
     await tx.wait();
     console.log("Unstake Request successful.");
     return true;
  } catch (error: any) {
    console.error("Request Unstake Error:", error);
    const isSimulation = confirm(`Transaction Failed (Error: ${error.info?.error?.message || error.message}). \n\nDo you want to SIMULATE success to test the UI?`);
    if (isSimulation) {
        await new Promise(r => setTimeout(r, 1000));
        return true;
    }
    return false;
  }
};

export const completeUnstakeFunds = async (signer: any): Promise<boolean> => {
    try {
       const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_ABI, signer);
       
       console.log("Completing Unstake...");
       const tx = await stakingContract.completeUnstake();
       await tx.wait();
       console.log("Funds withdrawn successfully.");
       return true;
    } catch (error: any) {
      console.error("Complete Unstake Error:", error);
      const isSimulation = confirm(`Transaction Failed (Error: ${error.info?.error?.message || error.message}). \n\nDo you want to SIMULATE success to test the UI?`);
      if (isSimulation) {
          await new Promise(r => setTimeout(r, 1000));
          return true;
      }
      return false;
    }
  };

export const claimRewards = async (signer: any): Promise<boolean> => {
  try {
     const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_ABI, signer);
     
     console.log("Claiming rewards...");
     const tx = await stakingContract.claimRewards();
     await tx.wait();
     console.log("Claim successful.");
     return true;
  } catch (error: any) {
    console.error("Claim Error:", error);
    const isSimulation = confirm(`Transaction Failed (Error: ${error.info?.error?.message || error.message}). \n\nDo you want to SIMULATE success to test the UI?`);
    if (isSimulation) {
        await new Promise(r => setTimeout(r, 1000));
        return true;
    }
    return false;
  }
};

// --- BETTING / MARKET FUNCTIONS ---

export const buyShares = async (marketId: string, outcome: 'YES' | 'NO', amount: number, signer: any): Promise<boolean> => {
  try {
    if (MARKET_CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
       console.warn("PredictionMarket contract not deployed. Simulating transaction.");
       throw new Error("Contract Address Not Set");
    }

    const usdcContract = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, signer);
    const marketContract = new ethers.Contract(MARKET_CONTRACT_ADDRESS, MARKET_ABI, signer);
    
    const amountWei = ethers.parseUnits(amount.toString(), 6);
    
    // Updated to boolean to match Solidity contract
    const isNo = outcome === 'NO' ? true : false;
    
    const numericId = parseInt(marketId); // Assuming IDs are numbers

    // 1. Approve
    console.log(`Approving ${amount} USDC for Betting...`);
    const approveTx = await usdcContract.approve(MARKET_CONTRACT_ADDRESS, amountWei);
    await approveTx.wait();

    // 2. Buy Shares
    console.log(`Buying ${outcome} shares...`);
    // isNo is now boolean
    const tx = await marketContract.buyShares(numericId, isNo, amountWei);
    await tx.wait();
    
    console.log("Bet placed successfully.");
    return true;

  } catch (error: any) {
    console.error("Betting Error:", error);
    const isSimulation = confirm(`Transaction Failed (Error: ${error.info?.error?.message || error.message}). \n\nDo you want to SIMULATE success to test the UI?`);
    if (isSimulation) {
        await new Promise(r => setTimeout(r, 1000));
        return true;
    }
    return false;
  }
};
