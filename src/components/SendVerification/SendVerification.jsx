import { Col, Form, Row } from 'antd'
import { getAlertMessage } from '../../utils/AlertUtils'
import useNotification from '../../hooks/UseNotification'
import { emailVerification } from '../../server/UserService'
import styles from './SendVerification.module.css'

const SendVerification = () => {
    const { alertError, alertSuccess } = useNotification();

    const handleSubmit = async () => {
        await emailVerification()
            .then(() => {
                alertSuccess("An email has been sent to your email address. Please check your inbox.")
            })
            .catch((error) => {
                let errorMessage = getAlertMessage(error.code);
                alertError(errorMessage);
            });
    }
    return (
        <Row className={styles.container}>
            <Col className={styles.containerColumn}>
                <h1 className={styles.verifyHeader}>Send Verification Email</h1>
                <p className={styles.verifyDescription}>Verify your email address to use all features of the app.</p>
                <Form
                    name='promoForm'
                    onFinish={handleSubmit}
                >
                    <button type="submit" className={styles.verifyButton}>Send</button>
                </Form>
            </Col>
        </Row>
    )
}

export default SendVerification