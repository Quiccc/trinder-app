import { Button, Col, Row } from "antd";
import { Fragment, useEffect, useState } from "react";
import AdvertCard from "../AdvertCard/AdvertCard";
import styles from './AdvertGrid.module.css';
import { getAdverts } from '../../server/AdvertService';
import PremiumAdvertCard from "../PremiumAdvertCard/PremiumAdvertCard";
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
            let newAdverts = [...adverts, ...res.adverts]
            setAdverts(newAdverts.filter((advert, index, self) => index === self.findIndex((t) => (t.advert_id === advert.advert_id))))
            setCount(res.count)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNumber])

    useEffect(() => {
        getAdverts(0, 12, null, data).then((res) => {
            //Delete the duplicate adverts with the advert_id
            setAdverts(res.adverts.filter((advert, index, self) => index === self.findIndex((t) => (t.advert_id === advert.advert_id))))
            setCount(res.count)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    return (
        <Col>
            <Row wrap={true} className={styles.advertCardContainer} justify='center' align='middle'>
                {
                    adverts?.map((advert, index) => {
                        if (index === 1) {
                            return (
                                <Fragment key={index}>
                                    <Col xxl={5} xl={5} lg={5} md={10} sm={10} xs={18} align='middle' key={index}>
                                        <PremiumAdvertCard />
                                    </Col>
                                    <Col xxl={5} xl={5} lg={5} md={10} sm={10} xs={18} align='middle' key={index}>
                                        <AdvertCard advert={advert} />
                                    </Col>
                                </Fragment>


                            )
                        }
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