import React, { useState, useEffect } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import Typography from "@mui/material/Typography";
import { CreatepostModal } from "../components/CreatepostModal/CreatepostModal";
import Navbar from "../components/Navbar/Navbar";
import { Postbar } from "../components/Postbar/Postbar";
import styles from "./styles/Post.module.scss";
import { NFTStorage } from "nft.storage";
import { useAccount, useSigner } from "wagmi";
import Moralis from "moralis-v1";
import { Store } from "react-notifications-component";
import { ethers } from "ethers";
import { BlogNFTABI, BlogNFTAddress } from "./utils";
import { useNavigate } from "react-router-dom";

export const Posts = () => {
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const { address, isConnected } = useAccount();
  const { data: signer } = useSigner();
  const [postName, setPostName] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [postBanner, setPostBanner] = useState("");
  const [imageBanner, setImageBanner] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFileObject, setImageFileObject] = useState();
  const [tippostable, setTipPostAble] = useState();
  const [data, setData] = useState([]);
  const [isLoadingButton, setLoadingButton] = useState(false);

  const navigate = useNavigate();
  const resetPostDetails = () => {
    setPostName("");
    setPostDescription("");
    setImageUrl("");
  };

  /************** NFT STORAGE CLIENT ******************* */
  const NFT_STORAGE_TOKEN = process.env.REACT_APP_NFT_STORAGE_TOKEN;
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

  useEffect(() => {
    if (isConnected) {
      const loadMoralis = async () => {
        await Moralis.start({
          appId: process.env.REACT_APP_APPLICATION_ID,
          serverUrl: process.env.REACT_APP_SERVER_URL,
        });
      };
      loadMoralis();
      QueryData();
    }
  }, []);

  const hiddenFileInput = React.useRef(null);
  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };
  const handleChange = async (event) => {
    const fileUploaded = event.target.files[0];
    const imageData = new Blob([fileUploaded]);
    setImageFileObject(imageData);
    const cid = await client.storeBlob(imageData);
    setImageUrl(`https://ipfs.io/ipfs/${cid}`);
    /*
    var reader = new FileReader();
    reader.readAsDataURL(fileUploaded);

    reader.onload = () => {
      setImageBanner(reader.result);
      setPostBanner(reader.result);
      console.log("successfully uploaded image");
    };
    reader.onerror = (error) => {
      console.log("Error: ", error);
    };
*/
  };
  const handleOndragOver = (event) => {
    event.preventDefault();
  };
  const handleOndrop = async (event) => {
    //prevent the browser from opening the image
    event.preventDefault();
    event.stopPropagation(); //let's grab the image file
    const fileUploaded = event.dataTransfer.files[0];
    const imageData = new Blob([fileUploaded]);
    setImageFileObject(imageData);
    const cid = await client.storeBlob(imageData);
    setImageUrl(`https://ipfs.io/ipfs/${cid}`);

    /*
    var reader = new FileReader();
    reader.readAsDataURL(fileUploaded);

    reader.onload = () => {
      setImageBanner(reader.result);
      setPostBanner(reader.result);
      console.log("Sucessfully uploaded image"); //base64encoded string
    };
    reader.onerror = (error) => {
      console.log("Error: ", error);
    };
    */
  };

  const Mint = async (tokenUri) => {
    const BlogNFTContract = new ethers.Contract(
      BlogNFTAddress,
      BlogNFTABI,
      signer
    );
    try {
      const createtoken = await BlogNFTContract.createToken(tokenUri);
      await createtoken.wait();
      resetPostDetails();
      setLoadingButton(false);
      setShowCreatePostModal(false);
      sendNotification(
        "Post minted",
        "successfully minted your post",
        "success"
      );
      return;
    } catch (e) {
      sendNotification("Mint failed", "failed to mint your post", "danger");
      setLoadingButton(false);
      return;
    }
  };

  const SavePost = async () => {
    if (!isConnected) {
      return;
    }
    if (imageFileObject && postName && postDescription) {
      setLoadingButton(true);
      const postStructure = {
        image: imageFileObject,
        name: postName,
        description: postDescription,
        properties: {
          type: "blog-post",
          authors: [{ authoraddress: address }],
          details: {
            tippable: tippostable,
          },
        },
      };

      const metadata = await client.store(postStructure);
      console.log(
        "Metadata URI: ",
        metadata.url.replace("ipfs://", "https://nftstorage.link/ipfs/")
      );

      const ipfsdata = metadata.url.replace(
        "ipfs://",
        "https://nftstorage.link/ipfs/"
      );
      Mint(ipfsdata);
      const PostTestData = Moralis.Object.extend("PostTestData");
      const postTestData = new PostTestData();
      postTestData.set("postTitle", postName);
      postTestData.set("postDescription", postDescription);
      postTestData.set("postBanner", imageUrl);
      postTestData.set("postCreator", address);
      postTestData.set("postIPFSdata", ipfsdata);
      postTestData.save().then(
        (postTestData) => {
          sendNotification(
            "Successfully created post",
            "successfully created and saved post data to IPFS",
            "success"
          );

          console.log("New object created with objectId: " + postTestData.id);
          console.log(
            "New object created with route : " + `/posts/${postTestData.id}`
          );
        },
        (error) => {
          sendNotification(
            "Failed to create post",
            "Failed to successfully create post, try again",
            "danger"
          );
          // Execute any logic that should take place if the save fails.
          // error is a Moralis.Error with an error code and message.
          console.log(
            "Failed to create new object, with error code: " + error.message
          );
        }
      );
    } else if (!imageFileObject) {
      sendNotification(
        "There must be a valid Image",
        "Failed to successfully create post, try again",
        "danger"
      );
    } else if (!postName) {
      sendNotification(
        "There must be a valid Name",
        "Failed to successfully create post, try again",
        "danger"
      );
    } else if (!postDescription) {
      sendNotification(
        "There must be a valid Description",
        "Failed to successfully create post, try again",
        "danger"
      );
    }
  };
  useEffect(() => {
    if (isConnected) {
      QueryData();
    }
  }, [address, showCreatePostModal]);

  const QueryData = async () => {
    const PostTestData = Moralis.Object.extend("PostTestData");
    const postTestData = new PostTestData();
    const postTestDataquery = new Moralis.Query(postTestData);
    postTestDataquery.equalTo("postCreator", address);
    const addressQuery = await postTestDataquery.find();
    setData(addressQuery);
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
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div className={styles.PostbarDivHolder} style={{ margin: "0em auto" }}>
        <button
          className={styles.buttonFIX}
          onClick={() => {
            if (isConnected) {
              setShowCreatePostModal(true);
              console.log("create post modal");
            } else {
              navigate("/");
            }
          }}
          style={{ float: "right", marginTop: "1.7em" }}
        >
          <svg
            width="20px"
            height="20px"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          &nbsp; Create Post
        </button>
      </div>
      <div style={{ padding: "3em" }}></div>
      <div className={styles.PostbarDivHolder}>
        {data && data.length > 0 ? (
          <div>
            {data.map((datas) => {
              return (
                <Postbar
                  key={datas.id}
                  postname={datas.attributes.postTitle}
                  postid={datas.id}
                  postdescription={datas.attributes.postDescription}
                />
              );
            })}
          </div>
        ) : (
          <div>You have no post, create post</div>
        )}
      </div>
      {/******************* Create post section **********************/}
      <CreatepostModal
        onHide={() => setShowCreatePostModal(false)}
        show={showCreatePostModal}
      >
        <div className={styles.ModalInfo}>
          {/*********************  Title  ************************/}
          <div className={styles.TitleField}>
            <div className={styles.displayFlex}>
              <Typography sx={{ fontSize: 19, fontWeight: 100 }}>
                Title
              </Typography>
              {/*} <Badge bg="secondary">required</Badge> */}
            </div>
            <InputGroup className="mb-3">
              <Form.Control
                spellCheck={false}
                value={postName}
                onChange={(e) => setPostName(e.target.value)}
                className={styles.removeBoxShadow}
                placeholder="My Post Title"
                aria-label="Username"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
          </div>
          {/*************************** Description ******************/}
          <div className={styles.TitleField}>
            <div className={styles.displayFlex}>
              <Typography sx={{ fontSize: 19, fontWeight: 100 }}>
                Description
              </Typography>
              {/*} <Badge bg="secondary">required</Badge> */}
            </div>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Control
                value={postDescription}
                placeholder="My Post Description"
                onChange={(e) => setPostDescription(e.target.value)}
                className={styles.removeBoxShadow}
                as="textarea"
                rows={3}
              />
            </Form.Group>
          </div>

          {/**************************** Banner Pic ************/}

          <div className="TitleField">
            <div>
              <Typography sx={{ fontSize: 19, fontWeight: 100 }}>
                Project Banner
              </Typography>
            </div>
            <input
              type="file"
              ref={hiddenFileInput}
              onChange={handleChange}
              style={{ display: "none" }}
            />
            <div
              onClick={handleClick}
              onDragOver={handleOndragOver}
              onDrop={handleOndrop}
              className={styles.bannerDiv}
            >
              {!imageUrl ? (
                <>
                  <span>Drag and Drop Image or Click to Browse File</span>
                  <span>Recommended: 500 x 200 px in jpg or png</span>
                </>
              ) : (
                <img alt="_" width="400px" height="180px" src={imageUrl} />
              )}
            </div>
          </div>
        </div>
        <div className={styles.ButtonGroupSave}>
          <Button
            disabled={isLoadingButton}
            onClick={!isLoadingButton ? SavePost : null}
            variant="outline-primary"
          >
            {isLoadingButton ? "Creating post…" : "Create and Mint Post"}
          </Button>
          <Button
            onClick={() => {
              setShowCreatePostModal(false);
            }}
            variant="outline-danger"
          >
            Cancel
          </Button>
        </div>
      </CreatepostModal>
    </div>
  );
};
