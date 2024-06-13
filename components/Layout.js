import styles from "./Layout.module.scss";
import NavBar from './NavBar';
 
export default function Layout({ children }) {
  return (
    <>
      <NavBar />
      <main className={styles.main}>{children}</main >
    </>
  )
}
