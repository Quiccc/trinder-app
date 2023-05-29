import { CloseOutlined, LockOutlined, LogoutOutlined, MailOutlined, RightOutlined, UserOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getIsUserHasActiveSubscription } from '../../server/PaymentService';
import { isUserVerified } from '../../server/UserService';
import CancelPremium from '../CancelPremium/CancelPremium';
import ChangePassword from '../ChangePassword/ChangePassword';
import OwnedAdverts from '../OwnedAdverts/OwnedAdverts';
import SendVerification from '../SendVerification/SendVerification';
import UserKnowledge from '../UserKnowledge/UserKnowledge';
import styles from './ProfileComponent.module.css'

const ProfileComponent = () => {
    const navigate = useNavigate();
    // states
    const [menu, setMenu] = useState({
        userKnowledge: true,
        changePassword: false,
        verifyEmail: false,
        adverts: false,
        cancelPremium: false
    })
    const [userVerified, setUserVerified] = useState(false);
    const [subscriptionDate, setSubscriptionDate] = useState(null);
    // useContext logout function
    const { logout } = useAuth();
    const [isUserHasActiveSubscription, setIsUserHasActiveSubscription] = useState(false);
    const handleLogout = () => {
        logout();
        navigate('/')
    }

    useEffect(() => {
        const checkVerified = async () => {
            setUserVerified(await isUserVerified());
        }
        getIsUserHasActiveSubscription().then((res) => {
            setIsUserHasActiveSubscription(res.subscription);
            setSubscriptionDate(res.canceledDate);
        })
        // check user's email verification
        checkVerified();
    }, [])

    return (
        <>
            <Row className={styles.appContainer} justify='center'>
                <Col xxl={5} xl={5} lg={5} md={22} sm={22} xs={22} justify='end' align='end'>
                    <Col className={styles.menuContainer}>
                        {subscriptionDate && <p className={styles.subscriptionDate}>Your subscription will be canceled at {subscriptionDate}</p>}
                        <Row
                            className={menu?.userKnowledge ? styles.menuTitleActiveRow : styles.menuTitleRow}
                            span={24}
                            justify='space-between'
                            align='middle'
                            onClick={() => {
                                setMenu({ userKnowledge: true })
                            }
                            }
                            wrap={false}
                        >
                            <Row align='middle' className={styles.iconContainer} wrap={false}>
                                <UserOutlined className={styles.menuIcons} />
                                <p className={menu.userKnowledge ? styles.menuTitleActive : styles.menuTitlePassive}>User Knowledge</p>
                            </Row>
                            {menu.userKnowledge && <RightOutlined className={styles.arrow} />}
                        </Row>
                        <Row className={menu?.adverts ? styles.menuTitleActiveRow : styles.menuTitleRow}
                        span={24} justify='space-between' align='middle' onClick={() => {
                            setMenu({ adverts: true })
                        }
                        } wrap={false}>
                            <Row align='middle' className={styles.iconContainer} wrap={false}>
                                <UserOutlined className={styles.menuIcons} />
                                <p className={menu.adverts ? styles.menuTitleActive : styles.menuTitlePassive}>Owned Adverts</p>
                            </Row>
                            {menu.adverts && <RightOutlined className={styles.arrow} />}
                        </Row>
                        <Row
                            className={menu?.changePassword ? styles.menuTitleActiveRow : styles.menuTitleRow}
                            span={24}
                            justify='space-between'
                            align='middle'
                            onClick={() => {
                                setMenu({ changePassword: true })
                            }
                            } wrap={false}>
                            <Row align='middle' className={styles.iconContainer} wrap={false}>
                                <LockOutlined className={styles.menuIcons} />
                                <p className={menu.changePassword ? styles.menuTitleActive : styles.menuTitlePassive}>Change Password</p>
                            </Row>
                            {menu.changePassword && <RightOutlined className={styles.arrow} />}
                        </Row>
                        {
                            !userVerified
                            &&
                            <Row
                                className={menu?.verifyEmail ? styles.menuTitleActiveRow : styles.menuTitleRow}
                                span={24}
                                justify='space-between'
                                align='middle'
                                onClick={() => {
                                    setMenu({ verifyEmail: true })
                                }
                                } wrap={false}>
                                <Row align='middle' className={styles.iconContainer} wrap={false}>
                                    <MailOutlined className={styles.menuIcons} />
                                    <p className={menu.verifyEmail ? styles.menuTitleActive : styles.menuTitlePassive}>Verify Email</p>
                                </Row>
                                {menu.verifyEmail && <RightOutlined className={styles.arrow} />}
                            </Row>
                        }
                        {
                            isUserHasActiveSubscription && (
                                <Row
                                    className={menu?.cancelPremium ? styles.menuTitleActiveRow : styles.menuTitleRow}
                                    span={24}
                                    justify='space-between'
                                    align='middle'
                                    onClick={() => {
                                        setMenu({ cancelPremium: true })
                                    }
                                    } wrap={false}>
                                    <Row align='middle' className={styles.iconContainer} wrap={false}>
                                        <CloseOutlined className={styles.menuIcons} />
                                        <p className={menu.cancelPremium ? styles.menuTitleActive : styles.menuTitlePassive}>Cancel Premium</p>
                                    </Row>
                                    {menu.cancelPremium && <RightOutlined className={styles.arrow} />}
                                </Row>
                            )
                        }

                        <Row className={styles.signOutRow} span={24} align='middle' wrap={false} onClick={handleLogout}>
                            <Row align='middle' wrap={false}>
                                <LogoutOutlined className={styles.signOutIcon} />
                                <p className={styles.signOut}>Logout</p>
                            </Row>
                        </Row>
                    </Col>
                </Col>
                <Col xxl={16} xl={16} lg={16} md={22} sm={22} xs={22} className={styles.sideComponents}>
                    {menu.userKnowledge && <UserKnowledge />}
                    {menu.changePassword && <ChangePassword />}
                    {menu.verifyEmail && <SendVerification />}
                    {menu.adverts && <OwnedAdverts />}
                    {menu.cancelPremium && <CancelPremium />}
                </Col>
            </Row>
        </>
    )
}

export default ProfileComponent