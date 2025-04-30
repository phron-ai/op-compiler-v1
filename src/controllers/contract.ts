import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";
// import { ethers } from "ethers";
import contractService from "../services/contract";
import { addToQueue } from "../utils/requestQueue";
import { checkBytecodeMatch, EXPLORER_APIS } from "../utils/verify"
import { cleanSourceCode } from "../utils"


const contractController = {
    compile: async (req: any, res: any) => {
        addToQueue(req, res, async (req, res) => {
            try {
                const { contractCode } = req.body;
                if (!contractCode) {
                    return res.status(400).json({ success: false, message: "Source code is required." });
                }
                const response = await contractService.compile(contractCode);

                if (response.result.error) {
                    res.json({ success: false, error: response.result.error });
                    return;
                }
                res.json({ success: true, abi: response.result.abi, bytecode: response.result.bytecode, contractName: response.contractName });
            } catch (error: any) {
                res.json({ success: false, error: error.message });
                console.error("compile Error:", error.message);
            }
        });
    },
    testContrat: async (req: any, res: any) => {
        addToQueue(req, res, async (req, res) => {
            try {
                const { testCode, contractCode } = req.body;
                const result = await contractService.testCode(testCode, contractCode);
                res.json(result);
            } catch (error: any) {
                res.json({ success: false, error: error.message });
            }
        }
        );
    },

    verify: async (req: any, res: any) => {
        addToQueue(req, res, async (req, res) => {


            const contractFilePath = path.join(__dirname, "../../contracts", `TempContract.sol`);
            try {

                // console.log("verify contract", req.body)
                const { contractAddress, contractCode, abi, chainId, constructorArgs } = req.body;
                console.log("verify contract", EXPLORER_APIS[chainId].name, chainId, contractAddress, constructorArgs)


                if (!contractAddress || !contractCode || !abi || !chainId) {
                    return res.status(400).json({ error: "Missing required parameters." });
                }


                // Save contract code to a temporary file
                //const contractFilePath = `contracts/TempContract.sol`;
                fs.mkdirSync(path.dirname(contractFilePath), { recursive: true });
                fs.writeFileSync(contractFilePath, cleanSourceCode(contractCode));

                console.log(`Verifying contract on chain ID ${chainId}...`);

                // Check if bytecode matches before verification
                try {
                    const deployedBytecode = await checkBytecodeMatch(
                        contractAddress,
                        chainId
                    );
                    console.log(`✅ Bytecode match check passed.`);
                } catch (error: any) {
                    console.error("❌ Bytecode mismatch:", error.message);
                    if (fs.existsSync(contractFilePath)) {
                        fs.unlinkSync(contractFilePath);
                    }
                    return res.status(400).json({
                        error:
                            "Bytecode mismatch. Ensure you are verifying the correct contract.",
                    });
                }

                // Recompile the contract before verification
                console.log("🔄 Forcing recompilation...");
                exec(
                    "npx hardhat clean && npx hardhat compile --force",
                    (compileError, compileStdout, compileStderr) => {
                        if (compileError) {
                            console.error("❌ Compilation Error:", compileStderr);
                            return res
                                .status(500)
                                .json({ error: "Compilation failed", details: compileStderr });
                        }

                        console.log("✅ Compilation successful.");

                        // Construct the Hardhat verification command
                        const verifyCommand = `npx hardhat verify --network ${EXPLORER_APIS[chainId].name} ${contractAddress} ${constructorArgs.length > 0 ? constructorArgs.join(" ") : ""}`;

                        exec(verifyCommand, (error, stdout, stderr) => {
                            if (error) {
                                console.error("❌ Verification Error:", stderr);
                                const regex = /Reason: Already Verified|already verified/i


                                if (fs.existsSync(contractFilePath)) {
                                    fs.unlinkSync(contractFilePath);
                                }

                                if (regex.test(stderr)) {
                                    return res
                                        .json({ success: true, message: "Contract verified successfully!", });

                                } else {

                                    return res
                                        .json({ success: false, error: "Contract verification failed", details: stderr });
                                }
                            }

                            console.log("✅ Contract Verified:", stdout);
                            if (fs.existsSync(contractFilePath)) {
                                fs.unlinkSync(contractFilePath);
                            }
                            res.json({
                                success: true,
                                message: "Contract verified successfully!",
                                output: stdout,
                            });
                        });
                    }
                );
            } catch (error: any) {
                console.error("❌ Server Error:", error);
                if (fs.existsSync(contractFilePath)) {
                    fs.unlinkSync(contractFilePath);
                }
                res.json({ success: false, error: "Internal server error" });
            }

        }
        );
    }
}

export default contractController;