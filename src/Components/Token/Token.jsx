import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import abi from "../abiToken.json";
import { NEXUSTOKEN } from "../NEXUSTOKEN";

const Token = () => {
  const [mounted, setMounted] = React.useState(false);
  const [hasMinted, setHasMinted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const [totalMinted, setTotalMinted] = React.useState(0n);
  const { address, isConnected } = useAccount();

  const contractConfig = {
    address: "0xA3eFe7430E1cc3e1e12dF811fc5cF6D635E0B41F",
    abi: abi,
    enabled: true,
    chainId: NEXUSTOKEN.chainId,
  };

  const { data: isClaimedData } = useContractRead({
    ...contractConfig,
    functionName: "claimed",
    args: [address],
    watch: true,
  });

  React.useEffect(() => {
    setHasMinted(isClaimedData || false);
  }, [isClaimedData]);

  const { config: contractWriteConfig } = usePrepareContractWrite({
    ...contractConfig,
    functionName: "claimTokens",
    args: [],
    value: "6000000000000",
  });

  const {
    data: mintData,
    write: mint,
    isLoading: isMintLoading,
    isSuccess: isMintStarted,
    error: mintError,
  } = useContractWrite(contractWriteConfig);

  const { data: totalSupplyData } = useContractRead({
    ...contractConfig,
    functionName: "totalSupply",
    watch: true,
  });

  const {
    data: txData,
    isSuccess: txSuccess,
    error: txError,
  } = useWaitForTransaction({
    hash: mintData?.hash,
  });

  React.useEffect(() => {
    if (totalSupplyData) {
      setTotalMinted(totalSupplyData);
    }
  }, [totalSupplyData]);

  React.useEffect(() => {
    if (txSuccess) {
      setHasMinted(true);
      toast.success("Minting successful! Check your wallet.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, [txSuccess]);

  React.useEffect(() => {
    if (mintError) {
      toast.error(`Minting failed: ${mintError.message}`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, [mintError]);

  const handleMint = () => {
    if (hasMinted) {
      toast.error('Your wallet has already claimed tokens! Only one mint per wallet is allowed.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    mint?.();
  };

  return (
    <Container className="user-login-box">
      <ToastContainer />
      <Row>
        <Col>
          <div className="product-info">
            <h1>MINT TOKEN</h1>
            <ConnectButton showBalance={false} chainStatus="name" />
            {mounted && isConnected && !txSuccess && (
              <button
                className="connectButton"
                disabled={hasMinted || !mint || isMintLoading || isMintStarted}
                data-mint-loading={isMintLoading}
                data-mint-started={isMintStarted}
                onClick={handleMint}
              >
                {isMintLoading && "Waiting for Mint"}
                {isMintStarted && "Minting..."}
                {!isMintLoading && !isMintStarted && "Mint"}
              </button>
            )}
            {txSuccess && (
              <div>
                <a
                  style={{ margin: "40px auto" }}
                  href={`https://explorer.nexus.xyz/tx/${mintData?.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  NEXUS OS
                </a>
              </div>
            )}
            {isClaimedData && <p>You have already claimed Token </p>}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Token;
