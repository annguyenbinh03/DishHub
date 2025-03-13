import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Tabs, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import avatar1 from '../../assets/images/user/avatar-1.jpg';
import avatar2 from '../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../assets/images/user/avatar-3.jpg';

const DashDefault = () => {
  const [dashSalesData, setDashSalesData] = useState([]);
  const [topDishes, setTopDishes] = useState([]);
  const [tableStatus, setTableStatus] = useState([]);

  useEffect(() => {
    fetch('https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/dashboard/sales-data/1')
      .then(response => response.json())
      .then(data => {
        if (data.isSucess) {
          setDashSalesData([
            { title: 'Doanh Thu Ngày', amount: `${data.data.dailySales.toLocaleString()} VNĐ`, icon: 'icon-arrow-up text-c-green', value: 50, class: 'progress-c-theme' },
            { title: 'Doanh Thu Tháng', amount: `${data.data.monthlySales.toLocaleString()} VNĐ`, icon: 'icon-arrow-down text-c-red', value: 36, class: 'progress-c-theme2' },
            { title: 'Doanh Thu Năm', amount: `${data.data.yearlySales.toLocaleString()} VNĐ`, icon: 'icon-arrow-up text-c-green', value: 70, class: 'progress-c-theme' }
          ]);
        }
      });

    fetch('https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/dashboard/top-dishes/1')
      .then(response => response.json())
      .then(data => {
        if (data.isSucess) {
          setTopDishes(data.data);
        }
      });

    fetch('https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/dashboard/tables/1')
      .then(response => response.json())
      .then(data => {
        if (data.isSucess) {
          setTableStatus(data.data);
        }
      });
  }, []);

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
          <div className='row d-flex justify-content-between'>
            {dashSalesData.map((data, index) => {
              return (
                <Card className='col-md-4 p-2' >
                  <Card.Body className='px-3 py-2 bg-danger rounded'>
                    <h6 className="mb-4">{data.title}</h6>
                    <div className="row d-flex align-items-center">
                      <div>
                        <h3 className="f-w-300 d-flex align-items-center m-b-0">
                          <i className={` f-30 m-r-5`} /> {data.amount}
                          {/* feather ${data.icon} */}
                        </h3>
                      </div>
                    </div>

                  </Card.Body>
                </Card>
              );
            })}
          </div>
          <div>
            <Card className="Top-Dishes widget-focus-lg">
              <Card.Header>
                <Card.Title as="h5">Món Ăn Bán Chạy Nhất</Card.Title>
              </Card.Header>
              <Card.Body className="px-0 py-2">
                <Table responsive hover className="top-dishes">
                  <tbody>
                    {topDishes.map((dish, index) => (
                      <tr key={index} className="unread">
                        <td>
                          <img className="rounded-circle" style={{ width: '40px' }} src={dish.image} alt={dish.name} />
                        </td>
                        <td>
                          <h6 className="mb-1">{dish.name}</h6>
                          <p className="m-0">{dish.categoryName}</p>
                        </td>
                        <td>
                          <h6 className="text-muted">
                            {dish.price.toLocaleString()} VNĐ
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-muted">
                            Sold: {dish.soldCount}
                          </h6>
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
                          {table.status}
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




