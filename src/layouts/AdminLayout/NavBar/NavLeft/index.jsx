import React, { useEffect, useState } from 'react';
import { ListGroup, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import useWindowSize from '../../../../hooks/useWindowSize';
import NavSearch from './NavSearch';
import useAuth from 'hooks/useAuth';
import axios from 'axios';
import { toast } from 'react-toastify';

const NavLeft = () => {
  const windowSize = useWindowSize();

  let navItemClass = ['nav-item'];
  if (windowSize.width <= 575) {
    navItemClass = [...navItemClass, 'd-none'];
  }

  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState({});

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const { auth } = useAuth();

  const fetchRestaurants = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    };
    try {
      const response = await axios.get('https://dishub-dxacd4dyevg9h3en.southeastasia-01.azurewebsites.net/api/admin/restaurants', config);
      if (response.data.isSucess) {
        const restaurantsData = response.data.data;
        setRestaurants(restaurantsData);
        let restaurantId = localStorage.getItem('restaurantId');
        if (!restaurantId && restaurantsData.length > 0) {
          // Nếu không có restaurantId, lấy phần tử đầu tiên
          const firstRestaurant = restaurantsData[0];
          localStorage.setItem('restaurantId', firstRestaurant.id);
          setSelectedRestaurant(firstRestaurant);
        } else {
          // Nếu đã có restaurantId, tìm restaurant tương ứng
          const selected = restaurantsData.find((r) => r.id.toString() === restaurantId);
          if (selected) {
            setSelectedRestaurant(selected);
          } else {
            // Nếu không tìm thấy (VD: nhà hàng bị xóa), chọn phần tử đầu tiên
            const firstRestaurant = restaurantsData[0];
            localStorage.setItem('restaurantId', firstRestaurant.id);
            setSelectedRestaurant(firstRestaurant);
          }
        }
      } else {
        toast.error('Lấy danh sách nhà hàng thất bại!');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra!');
    }
  };

  const handleChangeRestaurant = (item) => {
    setSelectedRestaurant(item);
    localStorage.setItem('restaurantId', item.id);
  };

  return (
    <React.Fragment>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav mr-auto">
        <ListGroup.Item as="li" bsPrefix=" " className={navItemClass.join(' ')}>
          <Dropdown align={'start'}>
            <Dropdown.Toggle variant={'link'} id="dropdown-basic">
              Dropdown
            </Dropdown.Toggle>
            <ul>
              <Dropdown.Menu>
                <li>
                  <Link to="#" className="dropdown-item">
                    Action
                  </Link>
                </li>
                <li>
                  <Link to="#" className="dropdown-item">
                    Another action
                  </Link>
                </li>
                <li>
                  <Link to="#" className="dropdown-item">
                    Something else here
                  </Link>
                </li>
              </Dropdown.Menu>
            </ul>
          </Dropdown>
        </ListGroup.Item>
        <ListGroup.Item as="li" bsPrefix=" " className="nav-item">
          <NavSearch windowWidth={windowSize.width} />
        </ListGroup.Item>
        <ListGroup.Item as="li" className="nav-item">
          <Dropdown align={'start'}>
            <Dropdown.Toggle variant={'link'} id="dropdown-basic">
              <img
                src={selectedRestaurant.image || 'https://via.placeholder.com/50'}
                alt={selectedRestaurant.name}
                width="40"
                height="40"
                className='me-2'
                style={{ borderRadius: '5px', objectFit: 'cover' }}
              />
              <span>{selectedRestaurant.name}</span>
            </Dropdown.Toggle>
            <ul>
              <Dropdown.Menu>
                {restaurants?.map((restaurant) => (
                  <Dropdown.Item
                    as="li"
                    key={restaurant.id}
                    onClick={() => handleChangeRestaurant(restaurant)}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                    active={selectedRestaurant?.id === restaurant.id}
                    className='restaurant'
                  >
                    <img
                      src={restaurant.image || 'https://via.placeholder.com/50'}
                      alt={restaurant.name}
                      width="40"
                      height="40"
                      style={{ borderRadius: '5px', objectFit: 'cover' }}
                    />
                    <span>{restaurant.name}</span>
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </ul>
          </Dropdown>
        </ListGroup.Item>
      </ListGroup>
    </React.Fragment>
  );
};

export default NavLeft;
