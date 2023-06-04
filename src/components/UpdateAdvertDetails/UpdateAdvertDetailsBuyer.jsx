import { Button, Card, Col, Divider, Form, Input, Modal, Row, Select, Upload } from 'antd';
import { useState } from 'react';
import styles from './UpdateAdvertDetails.module.css';
import { useEffect } from 'react';
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import { updateAdvert } from '../../server/AdvertService';
import useNotification from '../../hooks/UseNotification';
import { useNavigate } from 'react-router';
import TextArea from 'antd/es/input/TextArea';

const UpdateAdvertDetailsBuyer = ({ advertPass }) => {
  const { Option } = Select;
  const [imageList, setImageList] = useState(
    advertPass?.images
      ? advertPass.images.map((image) => ({
        name: image.name,
        status: 'done',
        url: image.url,
      }))
      : []
  );
  const [objList, setObjList] = useState(advertPass?.model_obj ? [
    {
      name: advertPass?.model_obj?.name,
      status: 'done',
      url: advertPass?.model_obj?.url,
    }
  ] : []);
  const [cities, setCities] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { alertSuccess, alertError } = useNotification();
  const [advert, setAdvert] = useState({
    title: advertPass?.title || '',
    description: advertPass?.description || '',
    colors: advertPass?.colors || [],
    size: advertPass?.size || '',
    price: advertPass?.price || '',
    images: advertPass?.images || [],
    city: '',
    district: '',
    model_obj: advertPass?.model_obj || [],
    id: advertPass?.advert_id || '',
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    await updateAdvert(advert, 'buyer').then((response) => {
      if (response.status === 200) {
        alertSuccess(response.message);
        setTimeout(() => {
          navigate('/');
        }, 2000);
        setIsLoading(false);
      } else {
        alertError("Something went wrong!");
      }
    });
  };

  const validateInput = (input) => {
    //Input would be format "numberxnumberxnumber"
    //Returns true if input is valid, false otherwise
    const isValid = /^([0-9]+x){2}[0-9]+$/.test(input);
    return isValid;
  };

  const handleCancel = () => setPreviewOpen(false);

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || (file.preview));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  useEffect(() => {
    fetch('/city_data.json')
      .then((response) => response.json())
      .then((data) => {
        setCities(data);
      });

  }, []);
  return (
    <Row className={styles.rowstyle}>
      <Col>
        <Card className={styles.cardstyle}>
          <p className={styles.formTitle}>Model Request</p>
          <Form
            name="normal_login"
            initialValues={{
              title: advert.title,
              description: advert.description,
              colors: advert.colors,
              size: advert.size,
              price: advert.price,
              images: advert.images,
              model_obj: advert.model_obj,
            }}

            onFinish={handleSubmit}
          >
            <Form.Item
              name="title"
              label={<label className={styles.label}>Title</label>}
              labelCol={{ span: 24 }}
              defaultValue={advert.title}
              rules={[
                {
                  required: true,
                  message: "Please input title.",
                },
              ]}
            >
              <Input
                placeholder="Title"
                onChange={(e) => {
                  setAdvert({ ...advert, title: e.target.value });
                }}
              />
            </Form.Item>
            <Form.Item
              name="description"
              label={<label className={styles.label}>Description</label>}
              labelCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: "Please input description.",
                },
              ]}
            >
              <TextArea
                maxLength={500}
                placeholder="Max 500 characters"
                onChange={(e) => {
                  setAdvert({ ...advert, description: e.target.value });
                }}
              />
            </Form.Item>
            <Form.Item
              name="colors"
              label={<label className={styles.label}>Model Color</label>}
              labelCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: "Please select model color.",
                },
              ]}
            >
              <Select
                placeholder="Select color"
                onChange={(values) => {
                  //Make array of colors
                  let colorsTemp = [];
                  colorsTemp.push(values);
                  setAdvert({ ...advert, colors: colorsTemp });
                }}
              >
                <Option value="Red">Red</Option>
                <Option value="Blue">Blue</Option>
                <Option value="Green">Green</Option>
                <Option value="Yellow">Yellow</Option>
                <Option value="Purple">Purple</Option>
                <Option value="Pink">Pink</Option>
                <Option value="Orange">Orange</Option>
                <Option value="Brown">Brown</Option>
                <Option value="Black">Black</Option>
                <Option value="White">White</Option>
                <Option value="Gray">Gray</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="size"
              label={<label className={styles.label}>Size - Format: WidthxLengthxHeight</label>}
              labelCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: "Please input size.",
                },
                {
                  validator: (_, value) => {
                    if (validateInput(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Please input valid size."));
                  },
                  message: "Please input valid format.",
                }
              ]}
            >
              <Input
                //just number 

                suffix="cm"
                placeholder="Size of Model"
                onChange={(e) => {
                  setAdvert({ ...advert, size: e.target.value });
                }}
              />
            </Form.Item>
            <Form.Item
              name="price"
              label={<label className={styles.label}>Average Price</label>}
              labelCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: "Please input average price.",
                },
              ]}
            >
              <Input min={0} max={10000}
                type="number"
                suffix="TL"
                placeholder={<label className={styles.label}>Average Price</label>}
                onChange={(e) => {
                  setAdvert({ ...advert, price: e.target.value });
                }}
              />
            </Form.Item>
            <Form.Item
              name="model_obj"
              label={<label className={styles.label}>Model File</label>}
              labelCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: "Please input model file.",
                },
              ]}
            >
              <Upload
                maxCount={1}
                fileList={objList}
                accept=".obj"
                onRemove={(e) => {
                  setObjList(objList.filter((item) => item.uid !== e.uid));
                  setAdvert({ ...advert, model_obj: objList });
                }}
                onChange={(e) => {
                  if (Array.isArray(e.fileList)) {
                    const filteredList = e.fileList.filter(
                      (file) => file.status === "done" || file.status === "uploading"
                    );
                    setObjList(filteredList);
                    setAdvert({ ...advert, model_obj: objList });
                  }
                }}
                customRequest={dummyRequest}
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>

            <Form.Item
              name="images"
              labelCol={{ span: 24 }}
              label={<label className={styles.label}>Model Images</label>}
              rules={[
                {
                  required: true,
                  message: "Please upload at least one image.",
                },
              ]}
            >
              <Upload
                fileList={imageList}
                onPreview={handlePreview}
                accept="image/*"
                listType="picture-card"
                disabled={imageList.length >= 8 || previewOpen}
                onRemove={(e) => {
                  setImageList(imageList.filter((item) => item.uid !== e.uid));
                  setAdvert({ ...advert, images: imageList });
                }}
                onChange={(e) => {
                  if (Array.isArray(e.fileList)) {
                    const filteredList = e.fileList.filter(
                      (file) => file.status === "done" || file.status === "uploading"
                    );
                    setImageList(filteredList);
                    setAdvert({ ...advert, images: filteredList });
                  }
                }}
                customRequest={dummyRequest}
              >
                <div>
                  <div className="ant-upload-text">Upload</div>
                </div>
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
              </Upload>
            </Form.Item>
            <h4>First image will be used as cover image.</h4>
            <Divider className={styles.divider} />
            <p className={styles.subTitle}>Location</p>
            {
              cities.length > 0 && (
                <Form.Item
                  name="city"
                  label={<label className={styles.label}>City</label>}
                  labelCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: "Please input city.",
                    },
                  ]}
                >
                  <Select
                    placeholder="Select city"
                    onChange={(value) => {
                      setAdvert({ ...advert, city: value });
                    }}
                  >
                    {
                      cities.map((city, index) => (
                        <Option value={city.name} key={index}>{city.name}</Option>
                      ))
                    }
                  </Select>
                </Form.Item>
              )
            }
            {
              advert.city && (
                <Form.Item
                  name="district"
                  label={<label className={styles.label}>District</label>}
                  labelCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: "Please input district.",
                    },
                  ]}
                >
                  <Select
                    placeholder="Select district"
                    onChange={(value) => {
                      setAdvert({ ...advert, district: value });
                    }}
                  >
                    {
                      cities.find((city) => city.name === advert.city).districts.map((district, index) => (
                        <Option value={district.name} key={index}>{district.name}</Option>
                      ))
                    }
                  </Select>
                </Form.Item>

              )
            }
            <Form.Item>
              <Button htmlType="submit" className={styles.submitButton} disabled={isLoading}>
                {isLoading ? <LoadingOutlined className={styles.loadingGif} /> : "Submit"}
              </Button>
            </Form.Item>
          </Form>

        </Card>
      </Col>
    </Row>

  );
};

export default UpdateAdvertDetailsBuyer;