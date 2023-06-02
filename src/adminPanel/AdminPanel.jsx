import { Button, Col, Menu, Row } from "antd";
import { useEffect, useState } from "react";
import styles from './AdminPanel.module.css'
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { isCurrentUserAdmin } from "../server/UserService";
import Loading from "../components/Loading/Loading";
import ReportForumTable from "./ReportForum/ReportForumTable";
import ReportAdvertTable from "./ReportAdvert/ReportAdvertTable";
import ReportChatTable from "./ReportChat/ReportChatTable";
import UsersTable from "./Users/UsersTable";
import AdvertsTable from "./Adverts/AdvertsTable";
import { getReportsCount } from "../server/AdminService";

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
    const [remainingReports, setRemainingReports] = useState(null);
    const items = [
        getItem("Users", "0", "Users", "admin"),
        getItem("Adverts", "1", "Adverts", "admin", null),
        getItem("Reports", "2", "Reports", "admin", null,[
            getItem("Advert Reports", "2-0", "Advert Reports", "admin"),
            getItem("User Reports", "2-1", "User Reports", "admin"),
            getItem("Forum Reports", "2-2", "Forum Reports", "admin"),
        ]),
    ];
    useEffect(() => {
        isCurrentUserAdmin().then((res) => {
            if (!res) {
                setIsRender(false);
                navigate("/");
            } else {
                getReportsCount().then((res) => {
                    setRemainingReports(res);
                });
                setIsRender(true);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const menuClicked = (e) => {
        setCurrent(e.key);
        // setDescription(e.item.props.role);
    };
    const reloadRemaining = () => {
        getReportsCount().then((res) => {
            setRemainingReports(res);
        });
    };
    return (
        <div>
            <Navbar design={true} />
            {
                isRender ?
                    <div className={styles.recordPageContainer}>
                        <Col className={styles.reportNumber}>
                            <Row>
                                <h2>Remaining Forum Reports: </h2>
                                <h2 className={styles.recordPageTitle}>
                                    {
                                        remainingReports === null ?
                                            0 : remainingReports.forumCount}
                                </h2>
                                <div className={styles.dividerVertical}>

</div>
                                <h2>Remaining Advert Reports: </h2>
                                <h2 className={styles.recordPageTitle}>
                                    {
                                        remainingReports === null ?
                                            0 : remainingReports.advertCount}
                                </h2>
                                <div className={styles.dividerVertical}>

                                </div>
                                <h2>Remaining Chat Reports:</h2>
                                <h2 className={styles.recordPageTitle}>
                                    {
                                        remainingReports === null ?
                                            0 : remainingReports.userCount}
                                </h2>
                            </Row>
                            <Row>
                                <Button type="primary" className={styles.reloadButton} onClick={reloadRemaining}>Reload</Button>
                            </Row>
                        </Col>
                        <Row wrap={true} className={styles.menuContainer} justify='center'>
                            <Col xxl={6} xl={6} lg={6} md={6} sm={22} xs={22} className={styles.menuColumn}>
                                <Menu
                                    onClick={menuClicked}
                                    className={styles.menu}
                                    defaultOpenKeys={['0']}
                                    selectedKeys={[current]}
                                    mode="inline"
                                    items={items}
                                />
                            </Col>
                            <Col xxl={17} xl={17} lg={17} md={17} sm={22} xs={23}>
                                <div className={styles.recordContainer}>
                                        {current === "0" && <UsersTable />}
                                        {current === "1" && <AdvertsTable />}
                                        {current === "2-0" && <ReportAdvertTable />}
                                        {current === "2-1" && <ReportChatTable />}
                                        {current === "2-2" && <ReportForumTable />}
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