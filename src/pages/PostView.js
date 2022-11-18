import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Moralis from "moralis-v1";
import { Store } from "react-notifications-component";
import { Button, Form, InputGroup } from "react-bootstrap";
import styles from "./styles/PostView.module.scss";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import ContentLoader from "react-content-loader";
import axios from "axios";
import { useAccount, useSigner, erc20ABI } from "wagmi";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { ethers } from "ethers";

export const PostView = () => {
  const { post_id } = useParams();
  const [data, setData] = useState("");
  const { address, isConnected, isDisconnected } = useAccount();
  const [tipTokenAddress, setTipTokenAddress] = useState("");
  const [tipTokenSymbol, setTipTokenSymbol] = useState("");
  const { data: signer } = useSigner();
  const [tipTokenName, setTipTokenName] = useState("");
  const [tipTokenDecimal, setTipTokenDecimal] = useState("");
  const [tipTokenAmount, setTipTokenAmount] = useState("");
  const [IPFSdata, setIPFSData] = useState("");
  const [isSendingButton, setIsSendingButton] = useState(true);
  const [tokenData, setTokenData] = useState([]);

  useEffect(() => {
    const loadMoralis = async () => {
      await Moralis.start({
        appId: process.env.REACT_APP_APPLICATION_ID,
        serverUrl: process.env.REACT_APP_SERVER_URL,
      });
    };
    loadMoralis();
    QueryData();
  }, []);

  const QueryData = async () => {
    const PostTestData = Moralis.Object.extend("PostTestData");
    console.log("checking ...");
    const postTestDataquery = new Moralis.Query(PostTestData);

    postTestDataquery.get(post_id.toString()).then(
      async (Dataquery) => {
        fetch(`${Dataquery.attributes.postIPFSdata}`)
          .then((response) => response.json())
          .then((data) => setIPFSData(data));

        setData(Dataquery);
      },
      (error) => {
        sendNotification("Invalid post ID", "Post ID was not found", "danger");
      }
    );
  };

  const sendNotification = (title, message, type) => {
    Store.addNotification({
      title: title,
      message: message,
      type: type,
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],

      dismiss: {
        duration: 5000,
        onScreen: true,
        pauseOnHover: true,
        showIcon: true,
      },
    });
  };

  useEffect(() => {
    if (isConnected) {
      fecthToken();
    }
  }, [address]);

  const fecthToken = () => {
    const options = {
      method: "GET",
      url: `https://deep-index.moralis.io/api/v2/${address}/erc20`,
      params: { chain: "0x13881" },
      headers: {
        accept: "application/json",
        "X-API-Key": process.env.REACT_APP_MORALIS_KEY,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        setTokenData(response.data);
        //  console.log(response.data);
      })
      .catch(function (error) {
        sendNotification(
          "Token balance error",
          "Failed to fetch token balance",
          "danger"
        );
        console.error(error);
      });
  };
  const resetData = () => {
    setTipTokenSymbol("");
    setTipTokenName("");
    setTipTokenAddress("");
    setTipTokenDecimal("");
    setTipTokenAmount("");
  };
  const TipPost = async () => {
    if (!IPFSdata) {
      sendNotification(
        "Contract has not been loaded",
        "Failed to load contract",
        "danger"
      );
      return;
    } else if (tipTokenAddress.length < 42) {
      sendNotification("Failed to send tip", "Provide token address", "danger");
      return;
    } else if (tipTokenAmount <= 0) {
      sendNotification(
        "Tip amount must be > 0",
        "Provide a vlaid tip amount",
        "danger"
      );
      return;
    }
    setIsSendingButton(false);
    const ERC20Contract = new ethers.Contract(
      tipTokenAddress,
      erc20ABI,
      signer
    );
    const sentvalue = ethers.utils.parseUnits(
      tipTokenAmount,
      Number(tipTokenDecimal)
    );
    const tokentransfer = await ERC20Contract.transfer(
      IPFSdata.properties.authors[0].authoraddress,
      sentvalue
    );
    await tokentransfer.wait();
    sendNotification(
      "Successfully tipped",
      "Your tip was sent successfully",
      "success"
    );
    setIsSendingButton(true);
    resetData();
  };

  return (
    <div>
      <div className={styles.PostbarDivHolder}>
        <div style={{ float: "right" }}>
          <ConnectButton
            // showBalance={false}
            // chainStatus={{ smallScreen: "icon", largeScreen: "icon" }}
            accountStatus={{
              smallScreen: "avatar",
              largeScreen: "full",
            }}
          />
        </div>
        <div style={{ padding: "2em" }}></div>
        <div style={{ float: "left" }}>
          id:{" "}
          <span style={{ fontSize: "19px", fontWeight: "200" }}>{post_id}</span>
        </div>
        <div style={{ padding: "2em" }}></div>
        <div>
          {IPFSdata && IPFSdata.image ? (
            <img
              height="300px"
              width="80%"
              src={IPFSdata.image.replace(
                "ipfs://",
                "https://nftstorage.link/ipfs/"
              )}
            />
          ) : null}
        </div>
        <div style={{ paddingTop: "4em" }}>
          <h3>
            Name :{" "}
            {IPFSdata ? (
              <span style={{ fontSize: "20px", fontWeight: "200" }}>
                {IPFSdata.name}
              </span>
            ) : (
              <ContentLoader
                speed={2}
                width={400}
                height={20}
                viewBox="0 0 400 150"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
              >
                <rect x="25" y="15" rx="5" ry="5" width="220" height="10" />
              </ContentLoader>
            )}{" "}
          </h3>
        </div>
        <div style={{ padding: "1.5em 0em" }}>
          <h4>
            Description :{" "}
            {IPFSdata ? (
              <span style={{ fontSize: "20px", fontWeight: "200" }}>
                {IPFSdata.description}
              </span>
            ) : (
              <ContentLoader
                speed={2}
                width={400}
                height={20}
                viewBox="0 0 400 150"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
              >
                <rect x="25" y="15" rx="5" ry="5" width="220" height="10" />
              </ContentLoader>
            )}{" "}
          </h4>
        </div>
        <div>
          <h3>
            creator :{" "}
            {IPFSdata ? (
              <span style={{ fontSize: "20px", fontWeight: "200" }}>
                {IPFSdata.properties.authors[0].authoraddress}
              </span>
            ) : (
              <ContentLoader
                speed={2}
                width={400}
                height={20}
                viewBox="0 0 400 150"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
              >
                <rect x="25" y="15" rx="5" ry="5" width="220" height="10" />
              </ContentLoader>
            )}{" "}
          </h3>
        </div>

        <div style={{ margin: "2em 0em" }} className={styles.TipSection}>
          <DropdownButton
            id="dropdown-basic-button"
            disabled={isDisconnected}
            title={tipTokenName ? tipTokenName : "Select Token"}
          >
            <div style={{ overflow: "auto" }}>
              {tokenData &&
                tokenData.map((data, index) => {
                  return (
                    <div key={index}>
                      <OverlayTrigger
                        key="left"
                        placement="left"
                        overlay={
                          <Tooltip id={`tooltip-left`}>
                            {(data.balance * 10 ** -data.decimals).toFixed(7)}{" "}
                            <strong>{tipTokenName}</strong>
                          </Tooltip>
                        }
                      >
                        <Dropdown.Item
                          onClick={() => {
                            setTipTokenSymbol(data.symbol);
                            setTipTokenName(data.name);
                            setTipTokenAddress(data.token_address);
                            setTipTokenDecimal(data.decimals);
                          }}
                        >
                          {data.name}
                        </Dropdown.Item>
                      </OverlayTrigger>
                    </div>
                  );
                })}
              {tokenData.length <= 0 ? (
                <Dropdown.Item>No Tokens</Dropdown.Item>
              ) : null}
            </div>
          </DropdownButton>
          <InputGroup className="mb-3">
            <Form.Control
              style={{ textAlign: "right" }}
              spellCheck={false}
              value={tipTokenAmount}
              onChange={(e) => {
                const re = /^\d*(\.)?(\d{0,10})?$/;
                if (e.target.value === "" || re.test(e.target.value)) {
                  setTipTokenAmount(e.target.value);
                }
              }}
              className={styles.removeBoxShadow}
              placeholder="0.01"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </InputGroup>

          <Button
            style={{ height: "100%", width: "30%" }}
            disabled={!isSendingButton}
            onClick={isSendingButton ? TipPost : null}
            variant="outline-primary"
          >
            {isSendingButton ? "Tip" : "Tipping"}
          </Button>
        </div>
      </div>
    </div>
  );
};
