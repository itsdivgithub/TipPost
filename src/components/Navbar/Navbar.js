import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.scss";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

function Navbar() {
  const { isConnected } = useAccount();

  return (
    <nav className={styles.Navbar}>
      <h3>TIP-POST</h3>
      <div
        className={styles.Links}
        style={isConnected ? { width: "32%" } : null}
      >
        {/*}  {isAuthenticated && isRegisteredUser ? ( */}
        {isConnected ? <Link to={"/posts"}>Posts</Link> : null}
        {/*isConnected ? <Link to={"/messages"}>Messages</Link> : null */}
        {/*} ) : null} */}
        <ConnectButton
          showBalance={false}
          chainStatus={{ smallScreen: "icon", largeScreen: "icon" }}
          accountStatus={{
            smallScreen: "avatar",
            largeScreen: "full",
          }}
        />
      </div>
    </nav>
  );
}

export default Navbar;
