import { RightOutlined, } from '@ant-design/icons';
import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { getChatUsers } from '../../server/ChatService';
import ChatMessagesComponent from '../ChatMessagesComponent/ChatMessagesComponent';
import styles from './ChatComponent.module.css'

const ChatComponent = ({ chatId }) => {
    const [menuOptions, setMenuOptions] = useState([])
    const [isEmpty, setIsEmpty] = useState(false)
    useEffect(() => {
        getChatUsers().then((res) => {
            //Chat id is coming from ChatPage.jsx, make active the chat which has same id with chatId
            const users = res.map((user) => {
                const userName = user.name + ' ' + user.surname;
                return {
                    ...user,
                    userName,
                };
            });
            let options = users.map((user) => ({
                userId: user.id,
                userName: user.userName,
                active: false,
                chatsId: user.chatsId,
                profile_image: user?.profile_image,
            }));
            if (chatId) {
                options = options.map((option) => {
                    if (option.chatsId === chatId) {
                        return {
                            ...option,
                            active: true,
                        };
                    }
                    return {
                        ...option,
                        active: false,
                    };
                });
            }
            if (options.length === 0) {
                setIsEmpty(true);
            }
            setMenuOptions(options);

        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Row className={styles.appContainer} justify='center'>
                {
                    !isEmpty ? (
                        <Col xxl={5} xl={5} lg={5} md={22} sm={22} xs={22} justify='end' align='end'>
                            <Col className={styles.menuContainer}>
                                {
                                    menuOptions.length > 0 && menuOptions.map((item, index) => {
                                        return (
                                            <Row
                                                className={item.active ? styles.menuTitleActiveRow : styles.menuTitleRow}
                                                span={24}
                                                justify='space-between'
                                                align='middle'
                                                onClick={() => {
                                                    //Make active clicked menu item and make others passive
                                                    const newMenu = menuOptions.map((option) => {
                                                        if (option.chatsId === item.chatsId) {
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
                                                    setMenuOptions(newMenu);
                                                }}
                                                wrap={false}
                                                key={item.chatsId}
                                            >
                                                <Row align='middle' className={styles.iconContainer} wrap={false}>
                                                    <img src={item?.profile_image?.url || '/images/no_profile_image.jpeg'} alt='profile' className={styles.profilePhoto} />
                                                    <p className={styles.menuTitlePassive}>{item.userName}</p>

                                                </Row>
                                                <RightOutlined className={styles.arrow} />
                                            </Row>

                                        )
                                    })
                                }
                            </Col>
                        </Col>) : (
                        <Col xxl={5} xl={5} lg={5} md={22} sm={22} xs={22} justify='start' align='start'>
                            <Col className={styles.menuContainer}>
                                <p className={styles.errorMessage}>There is no conversation yet</p>
                            </Col>
                        </Col>


                    )
                }
                <Col xxl={16} xl={16} lg={16} md={22} sm={22} xs={22} className={styles.sideComponents}>
                    {
                        menuOptions.length > 0 && menuOptions.map((item, index) => {
                            if (item.active) {
                                return (
                                    <>
                                        {/* <p>Report User</p> */}
                                        <ChatMessagesComponent chatId={item.chatsId} key={item.chatsId} />
                                    </>
                                )
                            }
                            return null;
                        })
                    }
                </Col>
            </Row>
        </>
    )
}

export default ChatComponent