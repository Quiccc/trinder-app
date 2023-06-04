
import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import useNotification from '../../hooks/UseNotification';
import { isCurrentUserVerified } from '../../server/UtilsService';
import CreateAdvertDetailsBuyer from '../CreateAdvertDetails/CreateAdvertDetailsBuyer';
import CreateAdvertDetailsSellerModel from '../CreateAdvertDetails/CreateAdvertDetailsSellerModel';
import CreateAdvertDetailsSellerService from '../CreateAdvertDetails/CreateAdvertDetailsSellerService';
import styles from './CreateAdvert.module.css';

const CreateAdvert = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { alertError } = useNotification();
    const [screenId, setScreenId] = useState(0); //0 - choose advert type, 1 - advert sell service, 2 - advert sell model, 3 - advert buy
    //Check if url is post or post/details
    useEffect(() => {
        isCurrentUserVerified().then((res) => {
            if (!res) {
                alertError("You need to verify your account to create an advert!");
            } else {
                if (location.pathname === '/new-advert/details/advert-service') {
                    setScreenId(1);
                } else if (location.pathname === '/new-advert/details/advert-model') {
                    setScreenId(2);
                } else if (location.pathname === '/new-advert/details/advert-request') {
                    setScreenId(3);
                } else {
                    setScreenId(0);
                }
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);
    useEffect(() => {
        isCurrentUserVerified().then((res) => {
            if(!res){
                alertError("You need to verify your account to create an advert!");
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div>
            {
                screenId === 0 && (<Col justify='center' align='middle' className={styles.contentContainer}>
                    <Col justify='center' align='middle' className={styles.title}>
                        <h1>Choose Advert Type</h1>
                    </Col>
                    <Col>
                        <Row justify='center' align='middle' >
                            <Col span={3.5} className={styles.advertTypeChooseCard} onClick={() => { navigate('/new-advert/details/advert-service', { state: { type: 'sell_service' } }) }}>
                                <Col justify='center' align='middle'>
                                    <p className={styles.advertTypeChooseCardTitle}>Printing Service</p>
                                    <p className={styles.advertTypeChooseCardText}>If you own a 3D printer</p>
                                    <p className={styles.advertTypeChooseCardText}>and want to receive printing orders.</p>
                                </Col>
                            </Col>
                            <Col span={3.5} className={styles.advertTypeChooseCard} onClick={() => { navigate('/new-advert/details/advert-model', { state: { type: 'sell_model' } }) }}>
                                <Col>
                                    <p className={styles.advertTypeChooseCardTitle}>Pre-made Model</p>
                                    <p className={styles.advertTypeChooseCardText}>If you have a 3D Model</p>
                                    <p className={styles.advertTypeChooseCardText}>and want to sell it</p>
                                </Col>
                            </Col>
                            <Col span={3.5} className={styles.advertTypeChooseCard} onClick={() => { navigate('/new-advert/details/advert-request', { state: { type: 'buy' } }) }}>
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