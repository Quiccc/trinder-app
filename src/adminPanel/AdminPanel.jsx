import { Button, Col, Menu, Row } from "antd";
import { useEffect, useState } from "react";
import styles from './AdminPanel.module.css'
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { isCurrentUserAdmin } from "../server/UserService";
import Loading from "../components/Loading/Loading";

function getItem(label, key, description, role, icon, children, type) {
    return {
        key,
        icon,
        description,
        role,
        children,
        label,
        type,
    };
}


const AdminPanel = () => {
    const navigate = useNavigate();
    const [current, setCurrent] = useState("0");
    const [isRender, setIsRender] = useState(false);
    const [remainingReports, setRemainingReports] = useState(0);
    const items = [
        getItem("Users", "0", "Users", "admin", null, null, "item"),
        getItem("Adverts", "1", "Adverts", "admin", null, null, "item"),
        getItem("Reports", "2", "Reports", "admin", null, null, "item"),
    ];
    useEffect(() => {
        isCurrentUserAdmin().then((res) => {
            if (!res) {
                setIsRender(false);
                navigate("/");
            } else {
                setIsRender(true);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const menuClicked = (e) => {
        setCurrent(e.key);
        // setDescription(e.item.props.role);
    };
    const reloadRemaining = () => {};
    return (
        <div>
            <Navbar design={true} />
            {
                isRender ?
                    <div className={styles.recordPageContainer}>
                        <Col className={styles.reportNumber}>
                            <Row>
                                <h2>Remaining Reports: </h2>
                                <h2 className={styles.recordPageTitle}>{remainingReports}</h2>
                            </Row>
                            <Row>
                                <Button type="primary" onClick={reloadRemaining}>Reload</Button>
                            </Row>
                        </Col>
                        <Row wrap={true} className={styles.menuContainer} justify='center'>
                            <Col xxl={6} xl={6} lg={6} md={6} sm={22} xs={22} className={styles.menuColumn}>
                                <Menu
                                    onClick={menuClicked}
                                    className={styles.menu}
                                    defaultOpenKeys={['sub1']}
                                    selectedKeys={[current]}
                                    mode="inline"
                                    items={items}
                                />
                            </Col>
                            <Col xxl={17} xl={17} lg={17} md={17} sm={22} xs={23}>
                                <div className={styles.recordContainer}>
        
                                </div>
                            </Col>
                        </Row>
                    </div>
                    : <Loading />
            }
            <Footer />
        </div>
    )
}
export default AdminPanel