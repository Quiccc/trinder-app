import { Col, Row } from 'antd'
import { Link } from 'react-router-dom';
import { auth } from '../../server/config/FirebaseConfig';
import styles from './LandPage.module.css'

const LandPage = () => {
    return (
        <Row className={styles.landPageContainer} align='middle'  >
            <Col xxl={10} lg={10} md={24} sm={24} xs={24} className={styles.container}>
                {
                        <div className={styles.mottoContainer}>
                            Discover the world of <b><span className={styles.highlight}> 3D Printing</span></b> with Trinder.
                        </div> 
                }
                {
                        <div className={styles.description}>
                            <span className={styles.highlight}><b>Sell</b></span> <b>your products or</b> <span className={styles.highlight}><b>Purchase</b></span> <b>professionally produced prints from enthusiasts TODAY.</b>
                        </div> 
                }
    
                <div className={styles.buttonContainer}>
                    {
                        auth.currentUser ?
                            <>
                                <Link to={'/forum'} className={styles.userFrequencyButton}>Forum</Link>
                            </>
                            :
                            <>
                                <Link to={'/login'} className={styles.mottoLoginButton}>Login</Link>
                                <Link to={'/register'} className={styles.registerButton}>Register</Link>
                                <Link to={'/forum'} className={styles.frequencyButton}>Forum</Link>
                            </>
                    }

                </div>
            </Col>
            <Col xxl={10} lg={10} md={24} sm={24} xs={24} className={styles.humanContainer}>
            <img
                    className={styles.heroImage}
                    src={"/images/printer-3.gif"}
                    alt="frekans wave"
                />
            </Col>
        </Row>
    )
};

export default LandPage;