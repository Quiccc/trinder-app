import { Button, Col, Row } from "antd";
import { useEffect, useState } from "react";
import styles from './AdvertSearchGrid.module.css';
import { searchAdverts } from '../../server/AdvertService';
import AdvertSearchCard from "../AdvertSearchCard/AdvertSearchCard";

const AdvertSearchGrid = ({ data, handleResult }) => {
    const [adverts, setAdverts] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [count, setCount] = useState(0);
    
    const handleLoadMore = () => {
        setPageNumber(pageNumber + 1);  
    }
    useEffect(() => {
        searchAdverts(pageNumber,12,data).then((res) => {
            handleResult(res.count)
            setAdverts([...adverts, ...res.adverts])
            setCount(res.count)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNumber])

    useEffect(() => {
        searchAdverts(0,12,data).then((res) => {
            handleResult(res.count)
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
                                <AdvertSearchCard advert={advert} />
                            </Col>
                        )
                    })
                }
            </Row>
            {
                count > adverts.length &&
                <Row justify="center">
                    <Button className={styles.loadMoreButton} onClick={handleLoadMore}>Load More</Button>
                </Row>
            }
        </Col>
    )
};

export default AdvertSearchGrid;