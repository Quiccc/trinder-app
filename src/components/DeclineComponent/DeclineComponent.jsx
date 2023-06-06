import { Col, Result } from 'antd'
import { Link } from 'react-router-dom'
import styles from './DeclineComponent.module.css'

const DeclineComponent = () => {
    return (
        <>
            <Col className={styles.cancelContainer}>
                <Result
                    status="warning"
                    title="There would be a problem with your payment. Please try again."
                    extra={
                        <Link to={'/'} className={styles.headerPagination} key='home'>Home</Link>
                    }
                />
            </Col>
        </>
    )
}

export default DeclineComponent