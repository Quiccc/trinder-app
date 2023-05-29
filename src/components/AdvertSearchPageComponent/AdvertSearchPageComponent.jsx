import { Button, Col, Dropdown, Input, Menu, Row } from 'antd';
import { useEffect } from 'react';
import { useState } from 'react';
import AdvertSearchGrid from '../AdvertSearchGrid/AdvertSearchGrid';
import styles from './AdvertSearchPageComponent.module.css';

const AdvertSearchPageComponent = ({ data }) => {
  const [resultNumber, setResultNumber] = useState(0);
  //Get url parameters
  const urlParams = new URLSearchParams(window.location.search);
  const [dataPass, setDataPass] = useState({
    location: data.location || urlParams.get('location'),
    value: data.value || urlParams.get('value'),
    minPrice: null,
    maxPrice: null,
    sortText: "Sort By",
    sortParam: null,
    type: "Select Type",
    typeParam: null,
  });
  const items = [
    {
      key: '1',
      label: 'Select Type',
      onClick: () => setDataPass(
        {
          ...dataPass,
          type: 'Select Type',
          typeParam: null,
        }
      ),
    },
    {
      key: '2',
      label: 'Model Request',
      onClick: () => setDataPass(
        {
          ...dataPass,
          type: 'Model Request',
          typeParam: 'buyer',
        }
      ),
    },
    {
      key: '3',
      label: 'Sell Service',
      onClick: () => setDataPass(
        {
          ...dataPass,
          type: 'Sell Service',
          typeParam: 'service',
        }
      ),
    },
    {
      key: '4',
      label: 'Sell Model',
      onClick: () => setDataPass(
        {
          ...dataPass,
          type: 'Sell Model',
          typeParam: 'model',
        }
      ),
    },
  ];

  const sortTextItems = [
    {
      key: '1',
      label: 'Sort By',
      onClick: () => setDataPass(
        {
          ...dataPass,
          sortText: 'Sort By',
          sortParam: null,
        }
      ),
    },
    {
      key: '2',
      label: 'Price: Low to High',
      onClick: () => setDataPass(
        {
          ...dataPass,
          sortText: 'Price: Low to High',
          sortParam: 'price asc',
        }
      ),
    },
    {
      key: '3',
      label: 'Price: High to Low',
      onClick: () => setDataPass(
        {
          ...dataPass,
          sortText: 'Price: High to Low',
          sortParam: 'price desc',
        }
      ),
    }
  ];

  const renderMenuItems = (items) => {
    return items.map((item) => (
      <Menu.Item key={item.key} onClick={item.onClick}>
        {item.label}
      </Menu.Item>
    ));
  };
  const handleResultNumber = (number) => {
    setResultNumber(number);
  };
  
  const handleApplyButton = () => {
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;
    setDataPass({
      ...dataPass,
      minPrice: minPrice,
      maxPrice: maxPrice,
    });
  };
  useEffect(() => {
    setDataPass({
      ...dataPass,
      location: data.location || urlParams.get('location'),
      value: data.value || urlParams.get('value'),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  

  return (
    <>
      <Row className={styles.appContainer} justify='center'>
        <Col xxl={5} xl={5} lg={5} md={22} sm={22} xs={22} justify='end' align='end'>
          <Col className={styles.menuContainer}>
            <Col className={styles.searchParameter}>
              <p className={styles.searchParameterText}>" {dataPass.value} " in {dataPass.location}</p>
            </Col>
            <div className={styles.borderHorizontalLine}></div>
            <Col className={styles.searchParameter}>
              <p className={styles.filtersText}>Filters</p>
              <Col>
                <p className={styles.filtersSubText}>Type</p>
                <Dropdown overlay={<Menu>{renderMenuItems(items)}</Menu>} arrow placement="bottom" className={styles.filtersDropdown} key='1'>
                  <Button className={styles.loadMoreButton}>
                    {dataPass.type}
                  </Button>
                </Dropdown>
              </Col>
              <div className={styles.borderHorizontalLineThick}></div>
              <Col>
                <p className={styles.filtersSubText}>Price</p>
                <Row justify='space-between'>
                  <p className={styles.filtersSubText}>Min:</p> <Input type='number' className={styles.filtersInput} id='minPrice' />
                  <p className={styles.filtersSubText}>Max</p> <Input type='number' className={styles.filtersInput} id='maxPrice' />
                  <Button onClick={handleApplyButton} className={styles.loadMoreButton}>Apply</Button>
                </Row>
              </Col>
            </Col>
          </Col>
        </Col>
        <Col xxl={16} xl={16} lg={16} md={22} sm={22} xs={22} className={styles.sideComponents}>
          <Row justify='space-between' className={styles.searchResultContainer}>
            <p className={styles.resultsFoundText}>{resultNumber} Adverts Found</p>
            <Row>
              <Dropdown overlay={<Menu className={styles.customMenu}>{renderMenuItems(sortTextItems)}</Menu>} arrow placement="bottomRight" className={styles.sortingDropdown} key='2'>
                <Button className={styles.loadMoreButton}>
                  {dataPass.sortText}
                </Button>
              </Dropdown>
            </Row>
          </Row>
          <AdvertSearchGrid data={dataPass} handleResult={handleResultNumber} />
        </Col>
      </Row>
    </>
  );
};

export default AdvertSearchPageComponent;
