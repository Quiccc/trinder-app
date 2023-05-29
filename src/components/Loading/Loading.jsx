import { Col, Row } from 'antd'
import styles from './Loading.module.css'

const Loading = ({ payment }) => {
    return (
        <Row className={styles.loadingContainer} justify='center' align='middle'>
            <Col className={styles.container} align='middle'>
                {payment &&
                    <Row justify='center' className={styles.payment}>
                        Please do not leave the page, the process is being completed.
                    </Row>
                }
                <img className={styles.loading} src="/images/loading.gif" alt="loading" />
            </Col>
        </Row>
    )
}

export default Loading