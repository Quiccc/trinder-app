import React, { useState } from "react";
import styles from "./CreateTopicCategory.module.css";
import { Button, Form, Col, Input, Row, Card } from "antd";
import useNotification from "../../hooks/UseNotification";
import { createTopicCategory } from "../../server/AdminService";

const CreateTopicCategory = () => {
  const { alertSuccess, alertError } = useNotification();
  const [topicCategory, setTopicCategory] = useState();
  const handleSubmit = async () => {
    try {
      await createTopicCategory(topicCategory);
      alertSuccess("Yeni Kategori Oluşturuldu");
    } catch (err) {
      alertError(`${err}`);
    }
  };
  return (
    <div className={styles.container}>
      <Row className={styles.rowstyle}>
        <Col>
          <Card>
            <Form
              name="normal_login"
              initialValues={{
                remember: true,
              }}
              onFinish={handleSubmit}
            >
              <Form.Item
                name="topicHeader"
                label="Topic Header"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Please input topic header!",
                  },
                ]}
              >
                <Input
                  placeholder="Topic Header"
                  onChange={(e) => {
                    setTopicCategory({ ...topicCategory, topicHeader: e.target.value });
                  }}
                />


              </Form.Item>
              <Form.Item className={styles.loginButton}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className={styles.loginformbutton}
                >
                  Create
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CreateTopicCategory;
