
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import "dotenv/config"; // Load environment variables from .env

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.16", // Updated to match OpenZeppelin
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    networks: {
        mainnet: {
            url: "https://eth.drpc.org",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 1
        },
        holesky: {  // ✅ Use "holesky", NOT "17000"
            url: "https://endpoints.omniatech.io/v1/eth/holesky/public",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 17000,
        },
        arbitrumSepolia: {
            url: "https://arbitrum-sepolia.drpc.org",    
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 421614,
        },
        bscTestnet: {
            url: "https://data-seed-prebsc-1-s1.binance.org:8545", // BNB Testnet RPC URL
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 97, // BNB Testnet Chain ID
        },
        BSC: {
            chainId: 56,
            url: "https://bsc-dataseed.binance.org",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
        },
        polygon: {
            chainId: 137,
            url: "https://polygon-rpc.com",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
        },
       sepolia: {  
            chainId: 11155111,
            url: "https://ethereum-sepolia-rpc.publicnode.com",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
        }

    },
    etherscan: {
        apiKey: {
            holesky: process.env.HOLESKY_API_KEY || "",
            arbitrumSepolia: process.env.ETHERSCAN_ARBITRUM_SEPOLIA_API_KEY || "",
            bscTestnet: process.env.BSCSCAN_API_KEY || "",
            mainnet: process.env.HOLESKY_API_KEY || "",
            BSC: process.env.BSCSCAN_API_KEY || "",
            BERA:process.env.BERASCAN_API_KEY || "",
            polygon:process.env.POLYGON_API_KEY || "",
            sepolia:  process.env.HOLESKY_API_KEY || "",
        },
        customChains: [
            {
                network: "holesky",
                chainId: 17000,
                urls: {
                    apiURL: "https://api-holesky.etherscan.io/api",  
                    browserURL: "https://holesky.etherscan.io",
                },
            },
            {
                network: "arbitrumSepolia",
                chainId: 421614,
                urls: {
                    apiURL: "https://api-sepolia.arbiscan.io/api",
                    browserURL: "https://sepolia.arbiscan.io"
                },
            },
            {
                network: "bscTestnet",
                chainId: 97,
                urls: {
                    apiURL: "https://api-testnet.bscscan.com/api",
                    browserURL: "https://testnet.bscscan.com"
                },
            },
            {
                network: "BSC",
                chainId: 56,
                urls: {
                    apiURL: "https://api.bscscan.com/api",
                    browserURL: "https://bscscan.com"
                },
            },
            {
                network: "BERA",
                chainId: 80094,
                urls: {
                    apiURL: "https://api.berascan.com/api",
                    browserURL: "https://berascan.com"
                },
            },
            {
                network: "polygon",
                chainId: 137,
                urls: {
                    apiURL: "https://api.polygonscan.com/api",
                    browserURL: "https://polygonscan.com"
                },
            },
            {
                network: "sepolia",
                chainId: 11155111,
                urls: {
                    apiURL: "https://api-sepolia.etherscan.io/api",
                    browserURL: "https://sepolia.etherscan.io/"
                },
            }

        ],
    },

paths: {
    sources: "./contracts",
        artifacts: "./artifacts",
            cache: "./cache",
    },
};

export default config;

