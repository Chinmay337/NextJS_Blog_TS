import styles from "./layout.module.css";

const Layout: React.FC<Props> = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};

export default Layout;
