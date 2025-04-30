import axios from "axios"
import dotenv from "dotenv";
dotenv.config();


export const EXPLORER_APIS: any = {
    1: {
        name: "mainnet",
        url: "https://api.etherscan.io",
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
    137: {
        name: "Polygon",
        url: "https://api.polygonscan.com",
        apiKey: process.env.POLYGONSCAN_API_KEY,
    },
    56: {
        name: "BSC",
        url: "https://api.bscscan.com",
        apiKey: process.env.BSCSCAN_API_KEY,
    },
    42161: {
        name: "Arbitrum",
        url: "https://api.arbiscan.io",
        apiKey: process.env.ARBITRUMSCAN_API_KEY,
    },
    17000: {
        name: "holesky",
        url: "https://api-holesky.etherscan.io",
        apiKey: process.env.ETHERSCAN_HOLESKY_API_KEY || "",
    },
    421614: {
        name: "arbitrumSepolia",
        url: "https://api-sepolia.arbiscan.io",
        apiKey: process.env.ETHERSCAN_ARBITRUM_SEPOLIA_API_KEY || ""
    },
    97: {
        name: "bscTestnet",
        url: "https://api-testnet.bscscan.com",
        apiKey: process.env.BSCSCAN_API_KEY || ""
    },
    80094: {
        name: "BERA",
        apiURL: "https://api.berascan.com",
        apiKey: process.env.BERASCAN_API_KEY || ""
    },
    11155111: {
        name: "sepolia",
        url: "https://api-sepolia.etherscan.io",
        apiKey: process.env.ETHERSCAN_API_KEY || ""  
    }
   
};

export async function checkBytecodeMatch(contractAddress: any, chainId: any) {
    const explorer = EXPLORER_APIS[chainId];

    if (!explorer) {
        throw new Error(`Unsupported chain ID: ${chainId}`);
    }

    try {
        console.log(`Fetching deployed bytecode from ${explorer.name} explorer...`);

        const response = await axios.get(`${explorer.url}/api`, {
            params: {
                module: "proxy",
                action: "eth_getCode",
                address: contractAddress,
                apikey: explorer.apiKey,
            },
        });

        const deployedBytecode = response.data.result;

        if (!deployedBytecode || deployedBytecode === "0x") {
            throw new Error(
                "Deployed bytecode is empty. Ensure the contract is deployed."
            );
        }

        console.log(`Deployed bytecode: ${deployedBytecode.slice(0, 20)}...`);

        return deployedBytecode;
    } catch (error) {
        console.error("Error fetching deployed bytecode:", error);
        throw new Error("Failed to fetch deployed bytecode");
    }
}