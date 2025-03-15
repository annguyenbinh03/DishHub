import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { Container, Table } from "react-bootstrap";
import { Bounce, toast } from "react-toastify";

const SignalRTest = () => {
  const [requests, setRequests] = useState([]);
  const restaurantId = 1; // Đặt ID nhà hàng test

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/hub/requests?restaurantId=${restaurantId}`)
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => console.log("Connected to SignalR"))
      .catch(err => console.error("Connection failed: ", err));

    // Nhận danh sách đơn hàng khi mới kết nối
    connection.on("LoadCurrentRequest", (data) => {
      setRequests(data.data);
      console.log(data.data);
    });

    // Nhận thông báo đơn hàng mới
    connection.on("ReceiveNewRequest", (orderDetail) => {
      console.log(orderDetail);
      setRequests(prev => [orderDetail, ...prev]);
    });

      connection.on('UpdateRequestStatus', (updatedRequest) => {
          console.log('Update request status: ', updatedRequest);
          toast(updatedRequest.id + " : " + updatedRequest.status, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
            transition: Bounce
          });
          setRequests((preRequests) =>
            preRequests.map((request) =>
              request.id === updatedRequest.id ? { ...request, status: updatedRequest.status } : request
            )
          );
        });

    return () => {
      connection.stop();
    };
  }, []);


  return (
    <Container>
    <h2 className="my-4">Danh sách request</h2>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Order ID</th>
          <th>Loại</th>
          <th>Ghi chú</th>
          <th>Ngày tạo</th>
          <th>Bàn</th>
          <th>Trạng thái</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((req, index) => (
          <tr key={index}>
            <td>{req.id}</td>
            <td>{req.orderId}</td>
            <td>{req.typeName}</td>
            <td>{req.note}</td>
            <td>{req.createdAt}</td>
            <td>{req.tableName}</td>
            <td>{req.status}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </Container>
  );
};

export default SignalRTest;
