import { Button, Col, Modal, Table } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { banUser, deleteAdvert, getAdvertsForAdmin } from "../../server/AdminService";
import styles from "./AdvertsTable.module.css";

const AdvertsTable = () => {
  const [data, setData] = useState([]);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");

  const dataSource = data;

  const columns = [
    {
        title: "Title",
        dataIndex: 'title',
        key: 'title',
    },
    {
        title: "Owner",
        dataIndex: 'userName',
        key: 'userName',
        render: (text) => <div>{text}</div>,
    },
    {
        title: "City",
        dataIndex: 'city',
        key: 'city',
    },
    {
        title: "District",
        dataIndex: 'district',
        key: 'district',
    },
    {
        title: "View Advert",
        dataIndex: 'id',
        key: 'id',
        render: (text) => <Link to={"/advert/" + text} target="_blank">View Advert</Link>,
    },
    {
      title: "Action",
      dataIndex: 'id',
      key: 'id',
      render: (advertId, record) => (
        <Col>
          <Button onClick={() => showConfirmModal("delete", advertId)}>Delete Advert / Send Warning</Button>
          <Button onClick={() => showConfirmModal("ban", record.user_id)}>Ban User</Button>
        </Col>
      ),
    },
  ];

  const handleDeleteAdvert = (advertId) => {
    deleteAdvert(advertId).then((res) => {
      // Handle success or failure, if needed
    });
  };

  const handleBanUser = (userId) => {
    banUser(userId).then((res) => {
      // Handle success or failure, if needed
    });
  };

  const showConfirmModal = (action, itemId) => {
    setSelectedAction(action);
    setSelectedItemId(itemId);
    setConfirmModalVisible(true);
  };

  const handleConfirmModalOk = () => {
    if (selectedAction === "delete") {
      handleDeleteAdvert(selectedItemId);
    } else if (selectedAction === "ban") {
      handleBanUser(selectedItemId);
    }

    setConfirmModalVisible(false);
  };

  const handleConfirmModalCancel = () => {
    setConfirmModalVisible(false);
  };

  useEffect(() => {
    getAdvertsForAdmin().then((res) => {
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
        <p>
          {selectedAction === "delete"
            ? "Are you sure you want to delete the advert or send a warning?"
            : "Are you sure you want to ban this user?"}
        </p>
      </Modal>
    </div>
  );
};

export default AdvertsTable;
