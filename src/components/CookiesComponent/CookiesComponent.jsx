import CookieConsent from "react-cookie-consent";
import styles from './CookiesComponent.module.css'

const CookiesComponent = () => {
    return (
        <CookieConsent
            buttonText="Accept Cookies"
            expires={365}
            containerClasses={styles.cookieContainer}
            buttonClasses={styles.cookiesButton}
            contentClasses={styles.content}
        >
                <div>
                    We use cookies to analyze site usage, remember your visit preferences, and report site usage statistics. For more information about cookies, please read our <a href='/privacy-policy'>Cookie Policy</a>.
                </div>
        </CookieConsent>
    )
}

export default CookiesComponent