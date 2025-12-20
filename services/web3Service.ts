import { ethers } from 'ethers';

// Contract Addresses
const CONTRACT_ADDRESS = "0x88f3de49C37D55C4Cef0C9c2aC66842559AF57aB"; 
const MARKET_CONTRACT_ADDRESS = "0x4850735BAe827f7cD1337e592956d992Dc3253ec";
const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"; // Base Mainnet USDC

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function allowance(address owner, address spender) public view returns (uint256)",
  "function balanceOf(address account) public view returns (uint256)",
  "function decimals() public view returns (uint8)"
];

const VAULT_ABI = [
  "function deposit(uint256 amount) external",
  "function withdraw(string calldata asset, uint256 amount) external",
  "function getBalance(address user, string calldata asset) external view returns (uint256)"
];

const MARKET_ABI = [
  "function buyShares(uint256 marketId, bool isNo, uint256 amount) external",
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
    return { provider, signer, address, isConnected: true };
  } catch (error) {
    console.error("Connection error:", error);
    return null;
  }
};

export const getWalletUSDCBalance = async (signer: any, address: string): Promise<number> => {
  try {
    const usdcContract = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, signer);
    const balanceWei = await usdcContract.balanceOf(address);
    return parseFloat(ethers.formatUnits(balanceWei, 6));
  } catch (error) {
    return 0;
  }
};

export const depositFunds = async (
  amount: number, 
  signer: any, 
  onStatus?: (status: string) => void
): Promise<boolean> => {
  try {
    const usdcContract = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, signer);
    const vaultContract = new ethers.Contract(CONTRACT_ADDRESS, VAULT_ABI, signer);
    const amountWei = ethers.parseUnits(amount.toString(), 6);
    const address = await signer.getAddress();

    if (onStatus) onStatus("Checking USDC allowance...");
    const currentAllowance = await usdcContract.allowance(address, CONTRACT_ADDRESS);

    if (currentAllowance < amountWei) {
      if (onStatus) onStatus("Step 1/2: Approving USDC...");
      const approveTx = await usdcContract.approve(CONTRACT_ADDRESS, amountWei);
      // Wait for approval to be mined
      await approveTx.wait(); 
      if (onStatus) onStatus("Approval confirmed! Starting Step 2...");
    }

    if (onStatus) onStatus("Step 2/2: Depositing funds to Contract...");
    const tx = await vaultContract.deposit(amountWei);
    // Wait for deposit to be mined
    await tx.wait();
    
    if (onStatus) onStatus("Deposit successful!");
    return true;
  } catch (error: any) {
    console.error("Deposit error:", error);
    if (onStatus) onStatus("Transaction failed.");
    return false;
  }
};

export const withdrawFunds = async (amount: number, signer: any): Promise<boolean> => {
  try {
    const vaultContract = new ethers.Contract(CONTRACT_ADDRESS, VAULT_ABI, signer);
    const amountWei = ethers.parseUnits(amount.toString(), 6);
    const tx = await vaultContract.withdraw("USDC", amountWei);
    await tx.wait();
    return true;
  } catch (error) {
    return false;
  }
};

export const buyShares = async (
  marketId: string, 
  outcome: string, 
  amount: number, 
  signer: any,
  onStatus?: (status: string) => void
): Promise<boolean> => {
  try {
    const usdcContract = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, signer);
    const marketContract = new ethers.Contract(MARKET_CONTRACT_ADDRESS, MARKET_ABI, signer);
    const amountWei = ethers.parseUnits(amount.toString(), 6);
    const isNo = outcome === 'NO';
    const numericId = parseInt(marketId);
    const address = await signer.getAddress();

    const allowance = await usdcContract.allowance(address, MARKET_CONTRACT_ADDRESS);
    if (allowance < amountWei) {
      if (onStatus) onStatus("Approving USDC for Market...");
      const appTx = await usdcContract.approve(MARKET_CONTRACT_ADDRESS, amountWei);
      await appTx.wait();
    }

    if (onStatus) onStatus(`Placing bet on ${outcome}...`);
    const tx = await marketContract.buyShares(numericId, isNo, amountWei);
    await tx.wait();
    return true;
  } catch (error) {
    return false;
  }
};
