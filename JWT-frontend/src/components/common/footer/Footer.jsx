import styles from './Footer.module.css'

function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className={styles.container}>
            <hr />
            <p>Copyright {currentYear} </p>
        </footer>
    )
}

export default Footer;