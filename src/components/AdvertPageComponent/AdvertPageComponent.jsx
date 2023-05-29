
import { LoadingOutlined } from '@ant-design/icons';
import { Button, Carousel, Col, Modal, Row } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import useNotification from '../../hooks/UseNotification';
import { getAdvert } from '../../server/AdvertService';
import { createContact } from '../../server/ChatService';
import { auth } from '../../server/config/FirebaseConfig';
import { sendReport } from '../../server/AdvertService';
import styles from './AdvertPageComponent.module.css';

const AdvertPageComponent = () => {
    const settings = {
        arrows: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 0,
    }

    const location = useLocation();
    const [advert, setAdvert] = useState({});
    const [titlePrefix, setTitlePrefix] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [resetLoading, setResetLoading] = useState(false)
    const {alertSuccess, alertError} = useNotification();
    const advertId = location.pathname.split('/')[2];
    const navigate = useNavigate();

    useEffect(() => {
        //get from url
        let advert_id = location.pathname.split('/')[2];
        getAdvert(advert_id).then((advert) => {
            setAdvert(advert);
            if (advert?.type === 'service') {
                setTitlePrefix('Sell Service');
            } else if (advert?.type === 'model') {
                setTitlePrefix('Sell Model');
            } else if (advert?.type === 'buyer') {
                setTitlePrefix('Model Request');
            }
        });
        //eslint-disable-next-line
    }, [])

    const handleContact = async () => {
        //Navigate to chat page with advert id
        await createContact(advertId).then((chatId) => {
            //TODO: Navigate to chat page with chatId
            navigate(`/chat`, { state: { chatId: chatId } });
        });
    };      

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    
    const handleReport = async () => {
        const text = document.getElementById('report-text').value;
        if (auth.currentUser === null) {
            alertError("You must be logged in to report");
            return;
        }   
        setResetLoading(true);
        try {
            await sendReport(advert,text);
            alertSuccess("Your report has been sent successfully, we will review it as soon as possible");
            setResetLoading(false)
        } catch (err) {
            console.log(err);
            alertError("Report could not be sent, please try again later");
            setResetLoading(false)
        }
        setIsModalOpen(false);
    };

    return (
        advert && (
            <>
                <Col>
                    <Row className={styles.contentContainer}>
                        <Col align='left' span={17}>
                            <Col>
                                <h1 className={styles.title}>
                                    <span className={styles.prefix}>{titlePrefix} &gt;</span>  {advert?.title}
                                </h1>
                                <Carousel {...settings} className={styles.carouselContainer}>
                                    {
                                        advert?.images?.map((image,index) => {
                                            return (
                                                <img
                                                    src={image.url}
                                                    alt="advert"
                                                    key={image.name}
                                                />
                                            )
                                        })
                                    }
                                </Carousel>
                            </Col>
                        </Col>
                        <Col align='middle' span={7} justify='right'>
                            <Col className={styles.advertDetailCard}>
                                <Col>
                                    <p className={styles.cardPrice} ><span className={styles.navyBlue}>{advert?.type === 'service' ? 'Average Price: ' : 'Price: '}</span>{advert.price} TL</p>
                                </Col>
                                <Col>
                                    <p className={styles.cardTitle} >{advert?.title}</p>
                                </Col>
                                <Col>
                                    <Row justify="space-between">
                                        <Col span={12}>
                                            <p className={styles.cardSubheadersLeft} >{advert?.location}</p>
                                        </Col>
                                        <Col span={12}>
                                            <p className={styles.cardSubheadersRight} >{advert?.created_at}</p>
                                        </Col>
                                    </Row>
                                </Col>
                            </Col>
                            <Col className={styles.advertDetailCard} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <Col>
                                    <Row align='middle' justify="space-between">
                                        <img
                                            className={styles.userAvatar}
                                            src={advert?.user?.profile_image?.url ? advert?.user?.profile_image?.url : '/images/no_profile_image.jpeg'}
                                            alt={advert?.user?.profile_image?.name || 'advert'}
                                        />
                                        <Col span={18}>
                                            <p className={styles.cardPrice} >{advert?.user_name}</p>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col>
                                    <Button onClick={handleContact} className={styles.loadMoreButton}>
                                        Contact
                                    </Button>
                                </Col>
                            </Col>
                            <Col className={styles.advertDetailCard}>
                                <Col>
                                    <p className={styles.cardLocation} >Advert Location</p>
                                </Col>
                                <Col>
                                    <Row justify="space-between">
                                        <Col span={12}>
                                            <p className={styles.cardSubheadersLeft} >{advert?.location}</p>
                                        </Col>
                                    </Row>
                                </Col>
                            </Col>
                            <Col className={styles.reportText} onClick={() => { setIsModalOpen(true) }}>
                                Report Advert
                            </Col>
                            {/* {
                                advert?.type === 'buyer' && (
                                    <Col className={styles.advertDetailCard}>
                                    </Col>
                                )
                            } */}
                        </Col>
                    </Row>
                    <div className={styles.contentContainer}>
                        <Col className={styles.advertDetailCardBig}>
                            <Row justify="space-between">
                                <Col span={12}>
                                    <p className={styles.cardSubheadersLeftBig} ><span className={styles.navyBlue}>Colors:</span>  {advert?.colors}</p>
                                </Col>
                                <Col span={12}>
                                    <p className={styles.cardSubheadersRightBig} ><span className={styles.navyBlue}>Size:</span>  {advert?.size}</p>
                                </Col>
                            </Row>
                            <Row justify="space-between">
                                <Col span={12}>
                                    {
                                        advert?.type === 'service' && (
                                            <p className={styles.cardSubheadersLeftBig} ><span className={styles.navyBlue}>Printer Model:</span>  {advert?.printer_model}</p>
                                        )
                                    }
                                    {
                                        advert?.type === 'buyer' && advert?.model_obj && (
                                            //put file here to download
                                            <p className={styles.cardSubheadersLeftBig} onClick={() => { 
                                                window.open(advert?.model_obj.url);
                                            }}><span className={styles.navyBlue}>Model File:</span> <Button className={styles.loadMoreButton}>Download</Button></p>
                                        )
                                    }
                                </Col>
                            </Row>
                            <Col span={22}>
                                <div className={styles.line}></div>
                            </Col>
                            <Col span={22}>
                                <p className={styles.cardSubheadersLeftBig} ><span className={styles.navyBlue}>Description:</span></p>
                            </Col>
                            <Col>
                                <p className={styles.cardDescription} >{advert?.description}</p>
                            </Col>
                        </Col>
                    </div>
                    <Modal open={isModalOpen}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        footer={false}
                    >
                        <TextArea className={styles.modalInput} type="text" placeholder="Report Reason" autoSize={{ minRows: 3, maxRows: 3 }} id="report-text" />
                        <Row align='center'>
                            <button onClick={handleReport} className={styles.modalButton}>
                                {resetLoading ? <LoadingOutlined /> : "Send Report"}
                            </button>
                        </Row>
                    </Modal>
                </Col>
            </>
        )
    )
};

export default AdvertPageComponent;