
import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import CreateAdvertDetailsBuyer from '../CreateAdvertDetails/CreateAdvertDetailsBuyer';
import CreateAdvertDetailsSellerModel from '../CreateAdvertDetails/CreateAdvertDetailsSellerModel';
import CreateAdvertDetailsSellerService from '../CreateAdvertDetails/CreateAdvertDetailsSellerService';
import styles from './CreateAdvert.module.css';

const CreateAdvert = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [screenId, setScreenId] = useState(0); //0 - choose advert type, 1 - advert sell service, 2 - advert sell model, 3 - advert buy
    //Check if url is post or post/details
    useEffect(() => {
        if (location.pathname === '/post/details/advert-service') {
            setScreenId(1);
        } else if (location.pathname === '/post/details/advert-model') {
            setScreenId(2);
        } else if (location.pathname === '/post/details/advert-request') {
            setScreenId(3);
        } else {
            setScreenId(0);
        }
    }, [location]);
    return (
        <div>
            {
                screenId === 0 && (<Col justify='center' align='middle' className={styles.contentContainer}>
                    <Col justify='center' align='middle' className={styles.title}>
                        <h1>Choose Advert Type</h1>
                    </Col>
                    <Col>
                        <Row justify='center' align='middle' >
                            <Col span={3.5} className={styles.advertTypeChooseCard} onClick={() => { navigate('/post/details/advert-service', { state: { type: 'sell_service' } }) }}>
                                <Col justify='center' align='middle'>
                                    <p className={styles.advertTypeChooseCardTitle}>Sell Service</p>
                                    <p className={styles.advertTypeChooseCardText}>If you have a 3D Printer</p>
                                    <p className={styles.advertTypeChooseCardText}>and want to sell your service</p>
                                </Col>
                            </Col>
                            <Col span={3.5} className={styles.advertTypeChooseCard} onClick={() => { navigate('/post/details/advert-model', { state: { type: 'sell_model' } }) }}>
                                <Col>
                                    <p className={styles.advertTypeChooseCardTitle}>Sell Model</p>
                                    <p className={styles.advertTypeChooseCardText}>If you have a 3D Model</p>
                                    <p className={styles.advertTypeChooseCardText}>and want to sell it</p>
                                </Col>
                            </Col>
                            <Col span={3.5} className={styles.advertTypeChooseCard} onClick={() => { navigate('/post/details/advert-request', { state: { type: 'buy' } }) }}>
                                <Col>
                                    <p className={styles.advertTypeChooseCardTitle}>Model Request</p>
                                    <p className={styles.advertTypeChooseCardText}>If you want to buy a 3D Model</p>
                                    <p className={styles.advertTypeChooseCardText}>and want to request it</p>
                                </Col>
                            </Col>
                        </Row>
                    </Col>
                </Col>)
            }
            {
                screenId === 1 && (<CreateAdvertDetailsSellerService />)
            }
            {
                screenId === 2 && (<CreateAdvertDetailsSellerModel />)
            }
            {
                screenId === 3 && (<CreateAdvertDetailsBuyer />)
            }
        </div>
    );
};

export default CreateAdvert;