// antd
import { Col, Row } from 'antd'
// components
// react
import { useNavigate } from "react-router-dom";
import Navbar from '../Navbar/Navbar';
// style
import styles from './PageNotFoundComponent.module.css'

const PageNotFoundComponent = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <Navbar design={true} />
            <Row className={styles.innerContainer} justify='center'>
                <Col xxl={12} xl={12} lg={12} md={20} sm={20} xs={22} className={styles.imageContainer} align='middle'>
                    <img className={styles.pageNotFound} src="/images/page-not-found.jpg" alt="Page Not Found" />
                    <Row className={styles.buttonGroup} align='middle' justify='center'>
                        <button className={styles.goBackButton} onClick={() => { navigate(-1) }}>Go Back</button>
                        <button className={styles.homeButton} onClick={() => { navigate('/') }}>Home</button>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default PageNotFoundComponent