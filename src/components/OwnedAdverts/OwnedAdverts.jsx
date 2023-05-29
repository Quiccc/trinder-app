import { ArrowLeftOutlined } from '@ant-design/icons';
import { Col, Table, Button } from 'antd';
import { useEffect, useState } from 'react';
import { changeAdvertStatus, getOwnedAdverts } from '../../server/AdvertService';
import UpdateAdvertDetailsBuyer from '../UpdateAdvertDetails/UpdateAdvertDetailsBuyer';
import UpdateAdvertDetailsSellerModel from '../UpdateAdvertDetails/UpdateAdvertDetailsSellerModel';
import UpdateAdvertDetailsSellerService from '../UpdateAdvertDetails/UpdateAdvertDetailsSellerService';
import styles from './OwnedAdverts.module.css';

const OwnedAdverts = () => {
    const [data, setData] = useState([]);
    const [activePage, setActivePage] = useState(
        {
            type: null,
            advert: null,
            advertType: null
        }
    );
    const columns = [
        //Columns description,title,type,price
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => {
                return (
                    <div className={styles.titleWrapper}>
                        <p className={styles.title}>{record.title.substring(0, 25)} {record.title.length > 25 && "..."}</p>
                    </div>
                )
            }
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text, record) => {
                return (
                    <div className={styles.descriptionWrapper}>
                        <p className={styles.description}>{record.description.substring(0, 40)} {record.description.length > 40 && "..."}</p>
                    </div>
                )
            }
        },
        {
            title: 'Update',
            dataIndex: 'update',
            render: (text, record) => {
                return (
                    <Button className={styles.updateButton}
                    onClick={() => {
                        setActivePage({
                            type: "update",
                            advert: record,
                            advertType: record.type
                        })
                    }}>Update</Button>
                )
            },
        },
        {
            title: 'Status',
            dataIndex: 'active',
            render: (text, record) => {
                return (
                    <Button className={styles.updateButton}
                    onClick={async () => {
                        //If user not premium, give him a message
                        await changeAdvertStatus(record.advert_id, !record.is_active);
                        //Change the data to force a rerender
                        setData([]);
                    }}>{record.is_active ? "Active" : "Inactive"}</Button>
                )
            }
        }
    ];
    useEffect(() => {
        getOwnedAdverts().then((res) => {
            setData(res);
        });
    }, [data]);
    return (
        <>
            {
                activePage.type === null && (<Col className={styles.advertsContainer}>
                    <h1 className={styles.advertsHeader}>Owned Adverts</h1>
                    <Table columns={columns} dataSource={data} size="middle" rowKey={(record) => record.advert_id} />
                </Col>)
            }
            {
                activePage.type === "update" && (<Col className={styles.advertsContainer}>
                    <h1 className={styles.advertsHeader}>{
                        activePage.type === "update" && (<ArrowLeftOutlined onClick={() => {
                            setActivePage({
                                type: null,
                                advert: null,
                                advertType: null
                            })
                        }
                        } />)
                    }  Update Advert</h1>
                    {
                        activePage.advertType === "buyer" && (<UpdateAdvertDetailsBuyer advertPass={activePage.advert} />)
                    }
                    {
                        activePage.advertType === "model" && (<UpdateAdvertDetailsSellerModel advertPass={activePage.advert} />)
                    }
                    {
                        activePage.advertType === "service" && (<UpdateAdvertDetailsSellerService advertPass={activePage.advert} />)
                    }
                </Col>)
            }
        </>
    );
};

export default OwnedAdverts;