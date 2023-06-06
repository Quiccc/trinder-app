import { RightOutlined, } from '@ant-design/icons';
import { Button, Col, Input, Row } from 'antd';
import { useEffect, useState } from 'react';
import useNotification from '../../hooks/UseNotification';
import { auth } from '../../server/config/FirebaseConfig';
import { getTopicCategories } from '../../server/ForumService';
import CreateNewTopic from '../CreateNewTopic/CreateNewTopic';
import TopicComponent from '../TopicComponent/TopicComponent';
import TopicDetailsComponent from '../TopicDetailsComponent/TopicDetailsComponent';
import styles from './ForumComponent.module.css'

const ForumComponent = ({ topicId }) => {
    //Options are "3D Models", "3D Printers", "Filaments"
    const [forumMenuOptions, setMenuOptions] = useState(null);
    const [selectedTopicID, setSelectedTopicID] = useState(null);
    const [isCreateTopicVisible, setIsCreateTopicVisible] = useState(false);
    //Use the active forum menu option to get topics
    const [category, setCategory] = useState(null);
    const [searchValue, setSearchValue] = useState(null);
    const { alertError } = useNotification();
    const handleSelectTopic = (topicID) => {
        setSelectedTopicID(topicID);
        setSearchValue(null);
    };

    useEffect(() => {
        getTopicCategories().then((response) => {
            setMenuOptions(response);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (topicId) {
            setSelectedTopicID(topicId);
        }
    }, [topicId]);
    const handleSearch = (e) => {
        setSearchValue(e.target.value);
        setSelectedTopicID(null);
        setCategory(null);
        setIsCreateTopicVisible(false);
    };
    return (
        <>
            {
                forumMenuOptions && (
                    <Row className={styles.appContainer} justify='center'>
                        <Col xxl={5} xl={5} lg={5} md={22} sm={22} xs={22} justify='start' align='start'>
                            <Col className={styles.searchContainer}>

                                <Button className={styles.createTopicButton} type='primary' disabled={isCreateTopicVisible} onClick={() => {
                                    if (!auth?.currentUser?.emailVerified) {
                                        alertError("Please verify your email address to create a topic.");
                                    } else {
                                        setIsCreateTopicVisible(true);
                                        const newMenu = forumMenuOptions.map((option) => {
                                            return {
                                                ...option,
                                                active: false,
                                            };
                                        })
                                        setMenuOptions(newMenu);
                                        setSelectedTopicID(null);
                                        setCategory(null);
                                        setSearchValue(null);
                                    }
                                }}
                                >
                                    Create New Topic
                                </Button>

                            </Col>
                            <Col className={styles.searchContainer}>
                                <Input className={styles.searchInput} placeholder='Search All Topics' onPressEnter={handleSearch} />
                            </Col>
                            <Col className={styles.menuContainer}>
                                {
                                    //Map first 3 items of menu options
                                    forumMenuOptions.length > 0 && forumMenuOptions.map((item, index) => {
                                        return (
                                            <Row
                                                className={item.active ? styles.menuTitleActiveRow : styles.menuTitleRow}
                                                span={24}
                                                justify='space-between'
                                                align='middle'
                                                onClick={() => {
                                                    //Make active clicked menu item and make others passive
                                                    const newMenu = forumMenuOptions.map((option) => {
                                                        if (option.id === item.id) {
                                                            return {
                                                                ...option,
                                                                active: true,
                                                            };
                                                        }
                                                        return {
                                                            ...option,
                                                            active: false,
                                                        };
                                                    })
                                                    setSelectedTopicID(null);
                                                    setCategory(item?.categoryId);
                                                    setMenuOptions(newMenu);
                                                    setIsCreateTopicVisible(false);
                                                    setSearchValue(null);
                                                }}
                                                wrap={false}
                                                key={item.id}
                                            >
                                                <Row align='middle' className={styles.iconContainer} wrap={false}>
                                                    <p className={styles.menuTitlePassive}>{item.title}</p>

                                                </Row>
                                                <RightOutlined className={styles.arrow} />
                                            </Row>

                                        )
                                    })
                                }
                            </Col>
                        </Col>
                        <Col xxl={16} xl={16} lg={16} md={22} sm={22} xs={22} className={styles.sideComponents}>

                            {/* <TopicDetailsComponent category={category}/> */}

                            {
                                !isCreateTopicVisible && !searchValue && selectedTopicID && <TopicDetailsComponent topicID={selectedTopicID} />
                            }
                            {
                                !isCreateTopicVisible && !searchValue &&!selectedTopicID && <TopicComponent category={category} handleSelectTopic={handleSelectTopic} />
                            }
                            {
                                isCreateTopicVisible && <CreateNewTopic />
                            }
                            {
                                !isCreateTopicVisible && !category && searchValue && !selectedTopicID && <TopicComponent searchValue={searchValue} handleSelectTopic={handleSelectTopic} />
                            }
                        </Col>

                    </Row>
                )
            }
        </>
    )
}

export default ForumComponent