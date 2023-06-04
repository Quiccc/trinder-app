import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal, Row } from 'antd'
import { useEffect, useState } from 'react';
import useNotification from '../../hooks/UseNotification';
import { cancelSubscription, getActiveSubscription } from '../../server/PaymentService';
import { getPremiumDetails } from '../../server/UserService';
import styles from './CancelPremium.module.css'

const { confirm } = Modal;

const CancelPremium = () => {
    const { alertSuccess } = useNotification();
    const [details, setDetails] = useState(null);
    const [activeSubscription, setActiveSubscription] = useState(null);
    const showConfirm = () => {
        confirm({
            title: "Do you want to cancel your premium membership?",
            icon: <ExclamationCircleOutlined />,
            content: "If you cancel your premium membership, you will not be able to access the premium features at the end of the current period.",
            okText: "Yes",
            cancelText: "No",
            async onOk() {
                await cancelSubscription(activeSubscription).then((res) => {
                    alertSuccess("Your premium membership has been canceled successfully.")
                });
                // await deleteUserFunc().then((res) => {
                //     alertSuccess(t('delete_successfully', { ns: 'app' }))
                //     setTimeout(() => {
                //         window.location.reload(true);
                //     }, 3500);
                // });
            },
            onCancel() {

            },
        });
    };
    useEffect(() => {
        getPremiumDetails().then((res) => {
            if (res){
                setDetails(res);
            }else {
                setDetails(null);
            }
        });
        getActiveSubscription().then((res) => {
            setActiveSubscription(res);
        });
    }, []);
    return (
        <Row className={styles.deleteUserContainer}>
            {
                details && <Row className={styles.firstDescription}>
                    <p>You have a premium membership until {details?.premiumEndDate}</p>
                </Row>
            }
            <Row className={styles.firstDescription}>
                <p>When you cancel your premium membership, you will not be able to access the premium features at the end of the current period.</p>
            </Row>
            {/* <ol className={styles.list}>
                <li>{t('warning_delete02', { ns: 'app' })}</li>
                <li>{t('warning_delete03', { ns: 'app' })}</li>
                <li>{t('warning_delete04', { ns: 'app' })}</li>
                <li>{t('warning_delete05', { ns: 'app' })}</li>
                <li>{t('warning_delete06', { ns: 'app' })}</li>
            </ol> */}
            <Row align='middle'>
                <button className={styles.confirmButton} onClick={showConfirm}>Yes, I want to cancel my premium membership</button>
            </Row>
        </Row>
    )
}

export default CancelPremium