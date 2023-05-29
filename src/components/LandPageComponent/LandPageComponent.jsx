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
                            Discover a world of <b><span className={styles.highlight}> 3D</span></b> models and services
                        </div> 
                }
                {
                        <div className={styles.description}>
                            <span className={styles.highlight}><b>Get</b></span> or <span className={styles.highlight}><b>Buy</b></span> <b>professional 3D modeling and printing services from TRINDER</b>
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
                    src={"/images/logo.png"}
                    alt="frekans wave"
                />
            </Col>
        </Row>
    )
};

export default LandPage;