# TIP-POST

## Project details

TIPPOST is a REFI crowdfunding application where creators can share their work (nft, image art, blog, talks) and get tipped by viewers who enjoy the content, the post are minted as NFT on the blockchain and can be burned, NFT.storage was used for storing the metadata of the nft and we also fetch the netdata to display the nft and it details.
### Project info

project created by itsdivgithub

- This project is built on top of NFT.storage to store the metadata of the posts created as individual NFTs.  

```js
const postStructure = {
        image: blob/file,
        name: string,
        description: string,
        properties: {
          type: "blog-post",
          authors: [{ authoraddress: string }],
          details: {
            tippable: bool,
          },
        },
      };
```


- This project is deployed on the polygon mumbai blockchain and takes advantage of the fast transaction time & low gas cost it has.

### Contract deployment

[contract on mumbai](https://mumbai.polygonscan.com/address/0x3D3A2148b288622Cabe65Fe9b65052D64361CEF8)


## Running the app

First, clone the repo with the following git command:

```
git clone https://github.com/itsdivgithub/TipPost.git
```

Second, open a terminal in the root directory of the project and run:

```
npm install
```

to install all the package dependencies for the project

Create a .env file in the root folder and populate it with the following variables:

```
REACT_APP_SERVER_URL =
REACT_APP_APPLICATION_ID =
REACT_APP_INFURA_ID =
REACT_APP_ALCHEMY_KEY =
REACT_APP_NFT_STORAGE_TOKEN =
REACT_APP_MORALIS_KEY =
```

Finally, run the development server:

```
npm start
```

or

```
yarn start
```
