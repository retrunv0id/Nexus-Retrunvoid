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
import abi from "../abiNft.json";
import { NEXUSNFT } from "../NEXUSNFT";

const Nft = () => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const [totalMinted, setTotalMinted] = React.useState(0n);
  const { isConnected, address } = useAccount();

  const contractConfig = {
    address: "0x8C76bFa94eC1681f668af6baaB2B1a348Be90Dd0",
    abi: abi,
    enabled: true,
    chainId: NEXUSNFT.chainId,
  };

  const { data: isClaimedData } = useContractRead({
    ...contractConfig,
    functionName: "hasMinted",
    args: [address],
    watch: true,
  });

  const { config: contractWriteConfig } = usePrepareContractWrite({
    ...contractConfig,
    functionName: "mint",
    args: [],
    value: "600000000000000",
    enabled: !isClaimedData,
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

  return (
    <Container>
      <ToastContainer />
      <Row>
        <Col>
        <h1 className="fonx">✹ N E X U S ✹</h1>
          <div className="product-info">
            <h1>MINT NFT</h1>
            <ConnectButton showBalance={false} chainStatus="name" />
            {mounted && isConnected && !txSuccess && !isClaimedData && (
              <button
                className="connectButton"
                disabled={!mint || isMintLoading || isMintStarted}
                data-mint-loading={isMintLoading}
                data-mint-started={isMintStarted}
                onClick={() => mint?.()}
              >
                {isMintLoading && "Waiting for approval"}
                {isMintStarted && "Minting..."}
                {!isMintLoading && !isMintStarted && "Mint"}
              </button>
            )}
            {isClaimedData && <p>You have already claimed this NFT.</p>}
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
            {isClaimedData && <p>Only 1 Wallet Token To Mint</p>}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Nft;