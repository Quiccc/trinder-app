import { CaretDownFilled, CaretUpFilled, LockOutlined, MessageOutlined } from '@ant-design/icons';
import { Col, Pagination, Row } from 'antd';
import { useEffect, useState } from 'react';
import useNotification from '../../hooks/UseNotification';
import { auth } from '../../server/config/FirebaseConfig';
import { getTopicsByCategoryId, getTopicsByText, sendLikeUnlikeTopic } from '../../server/ForumService';
import { isCurrentUserVerified } from '../../server/UtilsService';
import styles from './TopicComponent.module.css';

const TopicComponent = ({ category, handleSelectTopic, searchValue }) => {
    const {alertError} = useNotification();
    const [topics, setTopics] = useState(null);
    const [count, setCount] = useState(0);
    useEffect(() => {
        if(category ) {
            getTopicsByCategoryId(category,0,10).then((response) => {
                setTopics(response.topicList);
                setCount(response.count);
            });
            return;
        }
        //Pass last index id to get next 10 topics
    }, [category]);
    useEffect(() => {
        if(searchValue) {
            getTopicsByText(searchValue,0,10).then((response) => {
                setTopics(response.topicList);
                setCount(response.count);
            });
            return;
        }
    }, [searchValue]);
    return (
        <>
            {
                topics && topics.map((topic, index) => {
                    return(
                        <Col align="middle" className={styles.cardContainer} span={24} key={topic.id}
                        onClick={() => {
                            handleSelectTopic(topic.id);
                        }}>
                            <Row>
                                <Col span={1}>
                                    <CaretUpFilled className={styles.upIcon} onClick={(e) => {
                                        e.stopPropagation();
                                        if(auth.currentUser === null) {
                                            alertError("Please login to like");
                                            return;
                                        }
                                        isCurrentUserVerified().then((response) => {
                                            if(!response) {
                                                alertError("Please verify your email to like");
                                                return;
                                            }else {
                                                if(topic?.likedBy.includes(auth.currentUser.uid)) {
                                                    alertError("You already liked this topic");
                                                    return;
                                                }else {
                                                    sendLikeUnlikeTopic(topic?.id, true).then((response) => {
                                                        //Update the state, function return just updated topic
                                                        setTopics((prevTopics) => {
                                                            let newTopics = [...prevTopics];
                                                            newTopics[index].likesCount = response.likedBy.length;
                                                            newTopics[index].unlikesCount = response.unlikedBy.length;
                                                            newTopics[index].likedBy = response.likedBy;
                                                            newTopics[index].unlikedBy = response.unlikedBy;
                                                            return newTopics;
                                                        });
                                                    });
                                                }
                                            }
                                        });
                                        
                                    } } />
                                    <p className={topic?.unlikesCount > topic?.likesCount ? styles.likeNumberRed : styles.likeNumberGreen} >{topic?.likesCount - topic?.unlikesCount}</p>
                                    <CaretDownFilled className={styles.downIcon} onClick={(e) => {
                                        e.stopPropagation();
                                        if(auth.currentUser === null) {
                                            alertError("Please login to unlike");
                                            return;
                                        }
                                        isCurrentUserVerified().then((response) => {
                                            if(!response) {
                                                alertError("Please verify your email to unlike");
                                                return;
                                            }else {
                                                if(topic?.unlikedBy.includes(auth.currentUser.uid)) {
                                                    alertError("You already unliked this topic");
                                                    return;
                                                }else {
                                                    sendLikeUnlikeTopic(topic?.id, false).then((response) => {
                                                        //Update the state, function return just updated topic
                                                        setTopics((prevTopics) => {
                                                            let newTopics = [...prevTopics];
                                                            newTopics[index].likesCount = response.likedBy.length;
                                                            newTopics[index].unlikesCount = response.unlikedBy.length;
                                                            newTopics[index].likedBy = response.likedBy;
                                                            newTopics[index].unlikedBy = response.unlikedBy;
                                                            return newTopics;
                                                        });
                                                    });
                                                }
                                            }
                                        });
                                        
                                    } } />
                                </Col>
                                <Col style={{ textAlign: 'left' }} span={21}>
                                    <p className={styles.title} >{topic?.topicHeader}</p>
                                    <p className={styles.cardTitle} >{topic?.createdAt}</p>
                                </Col>
                                <Col span={2} style={{ textAlign: 'center', marginTop: 'auto', marginBottom: 'auto' }}>
                                    
                                    <Row justify='end'>
                                    {
                                        topic?.isLocked && <LockOutlined className={styles.lockIcon} />
                                    }
                                    <p className={styles.cardSubheaders} ><MessageOutlined /> {topic?.commentsCount}</p>
                                    </Row>
                                    
                                </Col>
                            </Row>
                        </Col>
                    )
                })
                }
                {
                    count > 0 && <Pagination defaultCurrent={1} total={count} className={styles.pagination} onChange={(page, pageSize) => {
                        if(searchValue) {
                            getTopicsByText(searchValue, (page - 1), 10).then((response) => {
                                setTopics(response.topicList);
                                setCount(response.count);

                            });
                        }else {
                            getTopicsByCategoryId(category, (page - 1), 10,topics[topics.length - 1].id).then((response) => {
                                setTopics(response.topicList);
                                setCount(response.count);
                            });
                        }
                    } } />
                }
        </>
    );
};

export default TopicComponent;