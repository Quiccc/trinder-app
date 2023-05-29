import { Button, Col, Row } from "antd";
import { useEffect, useState } from "react";
import AdvertCard from "../AdvertCard/AdvertCard";
import styles from './AdvertGrid.module.css';
import { getAdverts } from '../../server/AdvertService';
const AdvertGrid = ({ data }) => {
    const [adverts, setAdverts] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [lastIndex, setLastIndex] = useState(null);
    const [count, setCount] = useState(0);

    const handleLoadMore = () => {
        setLastIndex(adverts[adverts.length - 1].advert_id)
        setPageNumber(pageNumber + 1);
    }
    useEffect(() => {
        getAdverts(pageNumber, 12, lastIndex, data).then((res) => {
            setAdverts([...adverts, ...res.adverts])
            setCount(res.count)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNumber])

    useEffect(() => {
        getAdverts(0, 12, null, data).then((res) => {
            setAdverts(res.adverts)
            setCount(res.count)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    return (
        <Col>
            <Row wrap={true} className={styles.advertCardContainer} justify='center' align='middle'>
                {
                    adverts?.map((advert, index) => {
                        return (
                            <Col xxl={5} xl={5} lg={5} md={10} sm={10} xs={18} align='middle' key={index}>
                                <AdvertCard advert={advert} />
                            </Col>
                        )
                    })
                }
            </Row>
            {
                count > adverts.length &&
                <Row justify="center">
                    <Button className={styles.loadMoreButton} onClick={handleLoadMore}>Show More Adverts</Button>
                </Row>
            }

        </Col>
    )
};

export default AdvertGrid;