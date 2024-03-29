import { Button, Col, Modal, Table } from "antd";
import { useEffect, useState } from "react";
import { banUser, getUsersForAdmin } from "../../server/AdminService";
import styles from "./UsersTable.module.css";

const UsersTable = () => {
  const [data, setData] = useState([]);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");

  const dataSource = data;

  const columns = [
    {
        title: "Name",
        render: (text) => <div>{text.name + " " + text.surname}</div>,
    },
    {
        title: "Email",
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: "Is Premium?",
        dataIndex: 'premiumID',
        key: 'premiumID',
        render: (text) => <div>{text ? "Yes" : "No"}</div>,
    },
    {
      title: "Action",
      dataIndex: 'id',
      key: 'id',
      render: (text) => (
        <Col>
          <Button onClick={() => showConfirmModal(text)}>Ban User</Button>
        </Col>
      ),
    },
  ];

  const handleBanUser = (userId) => {
    banUser(userId).then((res) => {
      // Handle success or failure, if needed
    });
  };

  const showConfirmModal = (userId) => {
    setSelectedUserId(userId);
    setConfirmModalVisible(true);
  };

  const handleConfirmModalOk = () => {
    handleBanUser(selectedUserId);
    setConfirmModalVisible(false);
  };

  const handleConfirmModalCancel = () => {
    setConfirmModalVisible(false);
  };

  useEffect(() => {
    getUsersForAdmin().then((res) => {
      setData(res);
    });
  }, []);

  return (
    <div>
      <Table className={styles.Line} dataSource={dataSource} columns={columns} />

      <Modal
        title="Confirmation"
        visible={confirmModalVisible}
        onOk={handleConfirmModalOk}
        onCancel={handleConfirmModalCancel}
      >
        <p>Are you sure you want to ban this user?</p>
      </Modal>
    </div>
  );
};

export default UsersTable;
