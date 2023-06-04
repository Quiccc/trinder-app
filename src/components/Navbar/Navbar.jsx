import { AutoComplete, Col, Input, Row } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import styles from './Navbar.module.css'
import cityData from '../../assets/formatted_city_data.json'
import { useState } from "react";
import { MessageOutlined, SearchOutlined } from "@ant-design/icons";
import { AdminPanelSettings } from "@mui/icons-material";
import NotificationComponent from "../NotificationComponent/NotificationComponent";

const Navbar = ({ design, onData, onSearchData }) => {
  const { currentUser, userDetails } = useAuth();
  const isAdmin = userDetails.isAdmin;
  const [options, setOptions] = useState([]);
  const navigate = useNavigate();
  const handleSearch = value => {
    if (value.length < 3) {
      setOptions([]); // Clear options when input length is less than three
      return;
    }

    const filteredOptions = cityData
      .filter(city => city.toLowerCase().includes(value.toLowerCase()))
      .map(city => ({
        value: city,
        label: getOptionLabel(city, value),
      }));

    setOptions(filteredOptions); // Update options with filtered results
  };

  const getOptionLabel = (city, value) => {
    const regex = new RegExp(`(${value})`, 'gi');
    const parts = city.split(regex);
    return parts.map((part, index) => (
      part.toLowerCase() === value.toLowerCase() ? (
        <strong key={index}>{part}</strong>
      ) : (
        part
      )
    ));
  };
  const handleSelect = (value) => {
    onData && onData(value);
    //Keep the selected value in local storage
    localStorage.setItem('selectedLocation', value);
  }

  const handleSearchAdvert = async (event) => {
    //Get location data from local storage if structure is like 'district, city' or 'city'
    const location = localStorage.getItem('selectedLocation') ? localStorage.getItem('selectedLocation').includes(',') ? localStorage.getItem('selectedLocation').split(',')[0] + "-" + localStorage.getItem('selectedLocation').split(', ')[1] : localStorage.getItem('selectedLocation') : '';
    const value = event.target.value;
    onSearchData && onSearchData(value);
    navigate(`/search?location=${location}&value=${value}`);
  };
  return (
    <Row id='navbarId' className={design ? styles.designedContainer : styles.headerContainer} justify='center' >
      <Row align='middle' justify='space-between' className={styles.innerContainer}>
        <Col xxl={4} lg={4} md={5} sm={5} xs={12}>
          <Link to={'/'} className={styles.logoContainer}>
            <img src="/images/logo_v2.png" alt="frewell logo" />
          </Link>
        </Col>
        <Col xxl={13} xl={13} lg={13} md={0} sm={0} xs={0} align='middle' >
          <Row align='middle' justify='space-between'>
            {/* <EnvironmentOutlined className={styles.locationIcon} /> */}
            <AutoComplete style={{ width: '30%', border: '1px solid #3e4581', borderRadius: '.5vw'}}
            options={options} placeholder="Search" onSearch={handleSearch} optionFilterProp="value" onSelect={handleSelect} defaultValue={localStorage.getItem('selectedLocation') || ''}>
            </AutoComplete>
            <Input className={styles.stringSearchInput} placeholder="Search" suffix={<SearchOutlined />} onPressEnter={handleSearchAdvert} />
          </Row>
        </Col>
        <Col xxl={7} xl={7} lg={7} md={0} sm={0} xs={0}>
          <Row justify="end" align='middle' gutter={1} span={24} wrap={false}>
            {
              currentUser ? (
                <Row align='middle' wrap={false}>
                  {isAdmin && <Link to={'/admin'} className={styles.messageIcon}><AdminPanelSettings style={{fontSize: '3rem'}} /></Link>}
                  <Link to={'/chat'} className={styles.messageIcon}><MessageOutlined /></Link>
                  <NotificationComponent />
                  <Link to={'/profile'} className={styles.userName}>{`${userDetails.name} ${userDetails.surname}`}</Link>
                  <Link to={'/new-advert'} className={styles.appButton}>Create</Link>
                </Row>
              ) : (
                <>
                  <Link to={'/login'} className={styles.loginButton}>Login</Link>
                  <Link to={'/register'} className={styles.registerButton}>Register</Link>
                </>
              )
            }
          </Row>
        </Col>
        <Col xxl={0} lg={0} md={17} sm={17} xs={9} align='end' >
          {
            currentUser && <Link to={'/profile'} className={styles.headerPaginationSmallName}>{`${userDetails.name} ${userDetails.surname}`}</Link>
          }
        </Col>
      </Row>
    </Row>
  );
};

export default Navbar;