import { LoadingOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import { useEffect } from 'react';
import { useState } from 'react';
import { checkOut, getIsUserPremium } from '../../server/PaymentService';
import styles from './PricingComponent.module.css';

const PricingComponent = () => {
    // const navigate = useNavigate();
    // const { alertError } = useNotification();
    const [loadingSecond, setLoadingSecond] = useState(false);
    const [isUserPremium, setIsUserPremium] = useState(false);
    // Navigate to the Stripe checkout page with the given price id
    const navigateToStripe = async (priceId) => {
        // Add your navigation logic here
        await checkOut(priceId);
    };

    useEffect(() => {
        getIsUserPremium().then((res) => {
            console.log(res);
            setIsUserPremium(res);
        });
    }, []);

    return (
        <>
            <Row className={styles.pricingContainer}>
                <h1 className={styles.pricingHeader}>Pricing</h1>
            </Row>
            <Row className={styles.cardContainerRow} align="middle">
                <Col className={styles.cardContainerColumn} span={24} justify="center" align="middle">
                    <h1 className={styles.title}>Pricing</h1>
                    <Row className={styles.pricingRow} justify="center" align="middle" wrap={true}>
                        {/* <Col xxl={5} xl={6} lg={8} md={8} sm={15} xs={18}>
                            <Col
                                className={styles.regularCard}
                                // key="price_1NBGexAASgC4i4iItHBKzhfG"
                                xxl={24}
                                xl={24}
                                lg={23}
                                md={23}
                                sm={23}
                                xs={23}
                                justify="center"
                            >
                                <p className={styles.regularCardDescriptionFirst}>Basic Package</p>
                                <p className={styles.regularCardAdvertPrice}>100 TL</p>
                                <p className={styles.regularCardUsageDate}>
                                    <b>Ad Duration: 1 Month</b>
                                </p>
                                <p className={styles.regularCardDescriptionSecond}>
                                    Reach up to <b>1000</b> potential customers
                                </p>
                                <p className={styles.regularCardTax}>Taxes are included</p>
                                <button
                                    className={styles.regularCardButton}
                                    onClick={() => {
                                        setLoadingThird(true);
                                        navigateToStripe('price_1NBGexAASgC4i4iItHBKzhfG');
                                    }}
                                >
                                    {loadingThird ? <LoadingOutlined /> : "Buy Now"}
                                </button>
                            </Col>
                        </Col> */}
                        <Col xxl={5} xl={6} lg={8} md={8} sm={15} xs={18}>
                            <Col
                                className={styles.popularCard}
                                key="price_1NBGexAASgC4i4iItHBKzhfG"
                                xxl={24}
                                xl={24}
                                lg={23}
                                md={23}
                                sm={23}
                                xs={23}
                                justify="center"
                            >
                                <p className={styles.firstTitle}>Premium Package</p>
                                <p className={styles.AdvertPrice}>100 TL</p>
                                <p className={styles.usageDate}>
                                    <b>Duration: 1 Month</b>
                                </p>
                                <p className={styles.descriptionFirst}>
                                    Reach up to <b>All</b> potential customers
                                </p>
                                <p className={styles.descriptionSecond}>
                                    <b>Unlimited</b> Advertisements
                                </p>
                                <p className={styles.descriptionSecond}>
                                    <b>Priority</b> on search    
                                </p>
                                <p className={styles.tax}>Taxes are included</p>
                                <button
                                    className={isUserPremium ? styles.popularCardButtonDisabled : styles.popularCardButton}
                                    disabled={isUserPremium}
                                    onClick={() => {
                                        setLoadingSecond(true);
                                        navigateToStripe('price_1NBGexAASgC4i4iItHBKzhfG');
                                    }}
                                >
                                    {loadingSecond ? <LoadingOutlined /> : "Buy Now"}
                                </button>
                            </Col>
                        </Col>
                        {/* <Col xxl={5} xl={6} lg={8} md={8} sm={15} xs={18}>
                            <Col
                                className={styles.regularCard}
                                key="price_1NBGexAASgC4i4iINDnjoX8v"
                                xxl={24}
                                xl={24}
                                lg={23}
                                md={23}
                                sm={23}
                                xs={23}
                                justify="center"
                            >
                                <p className={styles.regularCardDescriptionFirst}>Ultimate Package</p>
                                <p className={styles.regularCardAdvertPrice}>1000 TL</p>
                                <p className={styles.regularCardUsageDate}>
                                    <b>Ad Duration: 12 Months</b>
                                </p>
                                <p className={styles.regularCardDescriptionSecond}>
                                    Reach up to <b>10000</b> potential customers
                                </p>
                                <p className={styles.regularCardTax}>Taxes are included</p>
                                <button
                                    className={styles.regularCardButton}
                                    onClick={() => {
                                        setLoadingThird(true);
                                        navigateToStripe('price_1NBGexAASgC4i4iINDnjoX8v');
                                    }}
                                >
                                    {loadingThird ? <LoadingOutlined /> : "Buy Now"}
                                </button>
                            </Col>
                        </Col> */}
                    </Row>
                </Col>
            </Row>
        </>
    );
};

export default PricingComponent;
