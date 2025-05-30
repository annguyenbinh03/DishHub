import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Dropdown, DropdownButton } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import avatar1 from '../../assets/images/user/avatar-1.jpg';
import avatar2 from '../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../assets/images/user/avatar-3.jpg';
import useAuth from 'hooks/useAuth';

const DashDefault = () => {
  const { auth } = useAuth();
  const [dashSalesData, setDashSalesData] = useState([]);
  const [topDishes, setTopDishes] = useState([]);
  const [tableStatus, setTableStatus] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('topDailyDishes');

  const config = {
    headers: { Authorization: `Bearer ${auth.token}` }
  };

  useEffect(() => {
    fetch('https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/dashboard/sales-data/1', config)
      .then((response) => response.json())
      .then((data) => {
        if (data.isSucess) {
          setDashSalesData([
            {
              title: 'Doanh Thu Ngày',
              amount: `${data.data.dailySales.toLocaleString()} VNĐ`,
              icon: 'icon-arrow-up text-c-green',
              value: 50,
              class: 'progress-c-theme'
            },
            {
              title: 'Doanh Thu Tháng',
              amount: `${data.data.monthlySales.toLocaleString()} VNĐ`,
              icon: 'icon-arrow-down text-c-red',
              value: 36,
              class: 'progress-c-theme2'
            },
            {
              title: 'Doanh Thu Năm',
              amount: `${data.data.yearlySales.toLocaleString()} VNĐ`,
              icon: 'icon-arrow-up text-c-green',
              value: 70,
              class: 'progress-c-theme'
            }
          ]);
        }
      });

    fetch('https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/dashboard/top-dishes/1', config)
      .then((response) => response.json())
      .then((data) => {
        if (data.isSucess) {
          setTopDishes(data.data);
        }
      });

    fetch('https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/dashboard/tables/1', config)
      .then((response) => response.json())
      .then((data) => {
        if (data.isSucess) {
          setTableStatus(data.data);
        }
      });
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const tabContent = (
    <React.Fragment>
      <div className="d-flex friendlist-box align-items-center justify-content-center m-b-20">
        <div className="m-r-10 photo-table flex-shrink-0">
          <Link to="#">
            <img className="rounded-circle" style={{ width: '40px' }} src={avatar1} alt="activity-user" />
          </Link>
        </div>
        <div className="flex-grow-1 ms-3">
          <h6 className="m-0 d-inline">Silje Larsen</h6>
          <span className="float-end d-flex  align-items-center">
            <i className="fa fa-caret-up f-22 m-r-10 text-c-green" />
            3784
          </span>
        </div>
      </div>
      <div className="d-flex friendlist-box align-items-center justify-content-center m-b-20">
        <div className="m-r-10 photo-table flex-shrink-0">
          <Link to="#">
            <img className="rounded-circle" style={{ width: '40px' }} src={avatar2} alt="activity-user" />
          </Link>
        </div>
        <div className="flex-grow-1 ms-3">
          <h6 className="m-0 d-inline">Julie Vad</h6>
          <span className="float-end d-flex  align-items-center">
            <i className="fa fa-caret-up f-22 m-r-10 text-c-green" />
            3544
          </span>
        </div>
      </div>
      <div className="d-flex friendlist-box align-items-center justify-content-center m-b-20">
        <div className="m-r-10 photo-table flex-shrink-0">
          <Link to="#">
            <img className="rounded-circle" style={{ width: '40px' }} src={avatar3} alt="activity-user" />
          </Link>
        </div>
        <div className="flex-grow-1 ms-3">
          <h6 className="m-0 d-inline">Storm Hanse</h6>
          <span className="float-end d-flex  align-items-center">
            <i className="fa fa-caret-down f-22 m-r-10 text-c-red" />
            2739
          </span>
        </div>
      </div>
      <div className="d-flex friendlist-box align-items-center justify-content-center m-b-20">
        <div className="m-r-10 photo-table flex-shrink-0">
          <Link to="#">
            <img className="rounded-circle" style={{ width: '40px' }} src={avatar1} alt="activity-user" />
          </Link>
        </div>
        <div className="flex-grow-1 ms-3">
          <h6 className="m-0 d-inline">Frida Thomse</h6>
          <span className="float-end d-flex  align-items-center">
            <i className="fa fa-caret-down f-22 m-r-10 text-c-red" />
            1032
          </span>
        </div>
      </div>
      <div className="d-flex friendlist-box align-items-center justify-content-center m-b-20">
        <div className="m-r-10 photo-table flex-shrink-0">
          <Link to="#">
            <img className="rounded-circle" style={{ width: '40px' }} src={avatar2} alt="activity-user" />
          </Link>
        </div>
        <div className="flex-grow-1 ms-3">
          <h6 className="m-0 d-inline">Silje Larsen</h6>
          <span className="float-end d-flex  align-items-center">
            <i className="fa fa-caret-up f-22 m-r-10 text-c-green" />
            8750
          </span>
        </div>
      </div>
      <div className="d-flex friendlist-box align-items-center justify-content-center">
        <div className="m-r-10 photo-table flex-shrink-0">
          <Link to="#">
            <img className="rounded-circle" style={{ width: '40px' }} src={avatar3} alt="activity-user" />
          </Link>
        </div>
        <div className="flex-grow-1 ms-3">
          <h6 className="m-0 d-inline">Storm Hanse</h6>
          <span className="float-end d-flex  align-items-center">
            <i className="fa fa-caret-down f-22 m-r-10 text-c-red" />
            8750
          </span>
        </div>
      </div>
    </React.Fragment>
  );
  return (
    <React.Fragment>
      <Row>
        <Col md={9}>
          <div className="row d-flex justify-content-between">
            {dashSalesData.length > 0 && (
              <>
                <Card className="col-md-4 p-1 bg-transparent">
                  <Card.Body className="px-3 py-3 bg-danger rounded">
                    <h6 className="mb-4 text-white">{dashSalesData[0].title}</h6>
                    <div className="row d-flex align-items-center">
                      <div>
                        <h3 className="f-w-300 d-flex align-items-center m-b-0 text-white">
                          <i className={` f-30 m-r-5`} /> {dashSalesData[0].amount}
                          {/* feather ${data.icon} */}
                        </h3>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
                <Card className="col-md-4 p-1 bg-transparent">
                  <Card.Body className="px-3 py-3 bg-success rounded">
                    <h6 className="mb-4 text-white">{dashSalesData[1].title}</h6>
                    <div className="row d-flex align-items-center">
                      <div>
                        <h3 className="f-w-300 d-flex align-items-center m-b-0 text-white">
                          <i className={` f-30 m-r-5`} /> {dashSalesData[1].amount}
                          {/* feather ${data.icon} */}
                        </h3>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
                <Card className="col-md-4 p-1  bg-transparent">
                  <Card.Body className="px-3 py-3 bg-primary rounded">
                    <h6 className="mb-4 text-white">{dashSalesData[2].title}</h6>
                    <div className="row d-flex align-items-center">
                      <div>
                        <h3 className="f-w-300 d-flex align-items-center m-b-0 text-white">
                          <i className={` f-30 m-r-5`} /> {dashSalesData[2].amount}
                          {/* feather ${data.icon} */}
                        </h3>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </>
            )}
          </div>
          <div>
            <Card className="Top-Dishes widget-focus-lg">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <Card.Title as="h5">Món Ăn Bán Chạy Nhất</Card.Title>
                <DropdownButton
                  id="dropdown-basic-button"
                  title={
                    <>
                      {selectedCategory === 'topDailyDishes' && <i className="fa fa-calendar-day me-2" />}
                      {selectedCategory === 'topMonthlyDishes' && <i className="fa fa-calendar-alt me-2" />}
                      {selectedCategory === 'topYearlyDishes' && <i className="fa fa-calendar me-2" />}
                      {selectedCategory === 'topAllTimeDishes' && <i className="fa fa-infinity me-2" />}
                      {selectedCategory === 'topDailyDishes' && 'Daily'}
                      {selectedCategory === 'topMonthlyDishes' && 'Monthly'}
                      {selectedCategory === 'topYearlyDishes' && 'Yearly'}
                      {selectedCategory === 'topAllTimeDishes' && 'All Time'}
                    </>
                  }
                  variant="secondary"
                  className="dropdown-custom"
                >
                  <Dropdown.Item onClick={() => handleCategoryChange('topDailyDishes')}>
                    <i className="fa fa-calendar-day me-2" /> Daily
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleCategoryChange('topMonthlyDishes')}>
                    <i className="fa fa-calendar-alt me-2" /> Monthly
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleCategoryChange('topYearlyDishes')}>
                    <i className="fa fa-calendar me-2" /> Yearly
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleCategoryChange('topAllTimeDishes')}>
                    <i className="fa fa-infinity me-2" /> All Time
                  </Dropdown.Item>
                </DropdownButton>
              </Card.Header>
              <Card.Body className="px-0 py-2">
                <Table responsive hover className="top-dishes">
                  <tbody>
                    {topDishes[selectedCategory]?.map((dish, index) => (
                      <tr key={index} className="unread">
                        <td>
                          <img className="rounded-circle" style={{ width: '40px' }} src={dish.image} alt={dish.name} />
                        </td>
                        <td>
                          <h6 className="mb-1">{dish.name}</h6>
                          <p className="m-0">{dish.categoryName}</p>
                        </td>
                        <td>
                          <h6 className="text-muted">{dish.price.toLocaleString()} VNĐ</h6>
                        </td>
                        <td>
                          <h6 className="text-muted">Sold: {dish.sold}</h6>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </div>
        </Col>

        <Col md={3}>
          <Card className="Table-Status widget-focus-lg ">
            <Card.Header>
              <Card.Title as="h5">Tình Trạng Bàn</Card.Title>
            </Card.Header>
            <Card.Body className="px-0 py-2">
              <Table responsive hover className="table-status">
                <tbody>
                  {tableStatus.map((table, index) => (
                    <tr key={index} className="unread">
                      <td>
                        <h6 className="mb-1">{table.tableName}</h6>
                      </td>
                      <td>
                        <h6 className={`text-${table.status === 'available' ? 'c-green' : 'c-red'}`}>
                          {table.status === 'available' ? 'Bàn trống' : 'Đã có khách'}
                        </h6>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default DashDefault;
