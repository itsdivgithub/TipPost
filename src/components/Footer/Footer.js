import { SiDiscord, SiTwitter, SiGithub } from "react-icons/si";

import styles from "./Footer.module.scss";

export default function Footer({ activeSocial = true }) {
  return (
    <footer
      className={[styles.Footer, !activeSocial && styles.inactiveSocial].join(
        " "
      )}
    >
      <span className={styles.Copyright}>
        &copy; TIP POST {new Date().getFullYear()}
      </span>
      <div className={styles.tAndC}>
        <span>Terms</span>
        <span>Built by 0xProf</span>
      </div>
      <div className={styles.socials}>
        <a
          target={"_blank"}
          rel="noreferrer"
          href="https://twitter.com/praiseprof"
        >
          <SiTwitter size={25} fill="#0D76FB" />
        </a>
        <a target={"_blank"} rel="noreferrer" href="https://github.com/0xpr0f">
          <SiGithub size={25} fill="#0D76FB" />
        </a>
        <a
          target={"_blank"}
          rel="noreferrer"
          href="https://discord.gg/6vpVw3Jb"
        >
          <SiDiscord size={25} fill="#0D76FB" />
        </a>
      </div>
    </footer>
  );
}
