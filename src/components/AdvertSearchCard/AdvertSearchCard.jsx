import { Col, Row } from "antd";
import { useNavigate } from "react-router";
import styles from './AdvertSearchCard.module.css';
const AdvertSearchCard = ({ advert }) => {
    const navigate = useNavigate();

    return (
        <Col align="middle" className={styles.cardContainer} span={23} onClick={() => { 
            navigate(`/advert/${advert?.advert_id}`);
        }}>
            {
                advert?.is_premium &&
                <div className={styles.cardPremium}>
                    Premium
                </div>
            }
                <div className={styles.cardType + ' ' + (advert?.type === 'Model Request' ? styles.navyBlue : "")}>
                    {advert?.type}
                </div>
            <img
                className={styles.advertImage}
                src={advert?.image || 'images/no_image.png'}
                alt={advert?.title} />
            <Col style={{ textAlign: 'left' }}>
                <p className={styles.cardPrice} >{advert?.price} TL</p>
                <p className={styles.cardTitle} >{advert?.title}</p>
                <Row justify="space-between">
                    <p className={styles.cardSubheaders} >{advert?.location}</p>
                    <p className={styles.cardSubheaders} >{advert?.date}</p>
                </Row>
            </Col>
        </Col>
    )
};

export default AdvertSearchCard;