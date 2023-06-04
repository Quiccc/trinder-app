import { Col, Row } from 'antd'
import { CopyrightOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

const Footer = () => {

    return (
        <div id='footerContainerId' className={styles.footerContainer}>
            <Row className={styles.linkContainer} align="middle">
                <Col xxl={6} xl={6} lg={6} md={6} sm={24} xs={24}>
                    {/* <div className={styles.logoContainer}>
                        <img src="/images/logo.png" alt="frewell logo" />
                    </div> */}
                </Col>
                <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                    <Row align='middle' justify='space-between'>
                        <Link to={'/'} className={styles.footerPagination}>Home</Link>
                        <Link to={"/pricing"} className={styles.footerPagination}>Pricing</Link>
                        <Link to={"/about-us"} className={styles.footerPagination}>About Us</Link>
                        <Link to={"/contact-us"} className={styles.footerPagination}>Contact Us</Link>
                        <Link to={"/faq"} className={styles.footerPagination}>FAQ</Link>
                    </Row>
                </Col>
            </Row>
            <Row align='middle' className={styles.documentContainer}>
                <Col xxl={6} xl={6} lg={6} md={6} sm={0} xs={0}></Col>
                <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                    <Row justify='center'>
                        <Link to={'/privacy-policy'} className={styles.footerDocument}>Privacy Policy</Link>
                        <Link to={'/user-agreement'} className={styles.footerDocument}>User Agreement</Link>
                    </Row>
                    <Row className={styles.designedByContainer} wrap={false}>
                        <Row className={styles.designedBy} align='middle' justify='center' wrap={false}>
                            <img className={styles.allRightReserved} src="/images/logo_footer.png" alt="logo" />
                            <p className={styles.allRightReservedDescription}> <CopyrightOutlined /> 2023 TEDU. All rights reserved. </p>
                        </Row>
                    </Row>
                </Col>
                <Col xxl={6} xl={6} lg={6} md={6} sm={24} xs={24}></Col>
            </Row>
        </div>
    )
}

export default Footer