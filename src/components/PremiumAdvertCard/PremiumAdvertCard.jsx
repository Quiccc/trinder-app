import { Button, Col } from "antd";
import { useNavigate } from "react-router";
import styles from './PremiumAdvertCard.module.css';
const PremiumAdvertCard = () => {
    const navigate = useNavigate();

    return (
        <Col align="middle" className={styles.cardContainer} span={23} onClick={() => { 
        }}>
            <Col style={{ textAlign: 'center'}}>
                <p className={styles.cardTitle} >Would you like to see your ad here?</p>
                <p className={styles.cardSubtitle} >Premium ads sell <span className={styles.animationUse}>5x</span> faster than regular ads.</p>
                <Button className={styles.cardButton} onClick={() => navigate('/pricing')}>Buy Premium</Button>
            </Col>
        </Col>
    )
};

export default PremiumAdvertCard;