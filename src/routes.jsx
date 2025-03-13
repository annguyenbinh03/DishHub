import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';

import { BASE_URL } from './config/constant';
import { path } from 'd3';
import UserLayout from './layouts/UserLayout/UserLayout';
import { parseHTML } from 'jquery';

export const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;

        return (
          <Route
            key={i}
            path={route.path}
            element={
              <Guard>
                <Layout>{route.routes ? renderRoutes(route.routes) : <Element props={true} />}</Layout>
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

const routes = [
  {
    exact: 'true',
    path: '/test3',
    element: lazy(() => import('./views/user/testSignalROrder'))
  },
  {
    exact: 'true',
    path: '/test2',
    element: lazy(() => import('./views/user/testSignalRRequest'))
  },
  {
    exact: 'true',
    path: '/test',
    element: lazy(() => import('./views/user/test2'))
  },
  {
    exact: 'true',
    path: '/unauthorized',
    element: lazy(() => import('./views/common/Unauthorized'))
  },
  {
    exact: 'true',
    path: '/login',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    exact: 'true',
    path: '/auth/signin-1',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    exact: 'true',
    path: '/auth/signup-1',
    element: lazy(() => import('./views/auth/signup/SignUp1'))
  },
  {
    path: '/user/*',
    layout: UserLayout,
    routes: [
      {
        exact: 'true',
        path: '',
        element: () => <Navigate to="/user/about-me" replace />
      },
      ,
      {
        exact: 'true',
        path: '/table-setting',
        element: lazy(() => import('./views/user/tableSetting/TableSetting'))
      },
      {
        exact: 'true',
        path: '/about-me',
        element: lazy(() => import('./views/user/aboutMe/AboutMe'))
      },
      {
        exact: 'true',
        path: '/home',
        element: lazy(() => import('./views/user/home/Home'))
      },
      {
        exact: 'true',
        path: 'dish/:id',
        element: lazy(() => import('./views/user/foodDetail/FoodDetail'))
      },
      {
        exact: 'true',
        path: 'support',
        element: lazy(() => import('./views/user/support/Support'))
      },
      {
        exact: 'true',
        path: 'checkout',
        element: lazy(() => import('./views/user/checkout/Checkout'))
      }
      ,
      {
        exact: 'true',
        path: 'chatbot',
        element: lazy(() => import('./views/user/chat/Chatbot'))
      }
      // ,
      // {
      //   exact: 'true',
      //   path: 'testTSS',
      //   element: lazy(() => import('./views/user/testTTS'))
      // }
    ]
  },
  {
    path: '*',
    layout: AdminLayout,
    routes: [
      {
        exact: 'true',
        path: '/app/dashboard/default',
        element: lazy(() => import('./views/dashboard'))
      },
      {
        exact: 'true',
        path: '/basic/button',
        element: lazy(() => import('./views/ui-elements/basic/BasicButton'))
      },
      {
        exact: 'true',
        path: '/basic/badges',
        element: lazy(() => import('./views/ui-elements/basic/BasicBadges'))
      },
      {
        exact: 'true',
        path: '/basic/breadcrumb-paging',
        element: lazy(() => import('./views/ui-elements/basic/BasicBreadcrumb'))
      },
      {
        exact: 'true',
        path: '/basic/collapse',
        element: lazy(() => import('./views/ui-elements/basic/BasicCollapse'))
      },
      {
        exact: 'true',
        path: '/basic/tabs-pills',
        element: lazy(() => import('./views/ui-elements/basic/BasicTabsPills'))
      },
      {
        exact: 'true',
        path: '/basic/typography',
        element: lazy(() => import('./views/ui-elements/basic/BasicTypography'))
      },
      {
        exact: 'true',
        path: '/forms/form-basic',
        element: lazy(() => import('./views/forms/FormsElements'))
      },
      {
        exact: 'true',
        path: '/tables/bootstrap',
        element: lazy(() => import('./views/tables/BootstrapTable'))
      },
      {
        exact: 'true',
        path: '/charts/nvd3',
        element: lazy(() => import('./views/charts/nvd3-chart'))
      },
      {
        exact: 'true',
        path: '/maps/google-map',
        element: lazy(() => import('./views/maps/GoogleMaps'))
      },
      {
        exact: 'true',
        path: '/food-management/food',
        element: lazy(() => import('./views/admin/foodAndIngredients/foodManagement/foodManagement'))
      },
      {
        exact: 'true',
        path: '/food-management/ingredients',
        element: lazy(() => import('./views/admin/foodAndIngredients/ingredients/Ingredients'))
      },
      {
        exact: true,
        path: '/table-management',
        element: lazy(() => import('./views/admin/tableManagement'))
      },
      {
        exact: true,
        path: '/category-management',
        element: lazy(() => import('./views/admin/categoryManagement/categoryManagement'))
      },
      {
        exact: true,
        path: '/order-management/order',
        element: lazy(() => import('./views/admin/orderManagement/orderManagement'))
      },
      {
        exact: true,
        path: '/restaurant-management',
        element: lazy(() => import('./views/admin/restaurantManagement/restaurantManagement'))
      },
      {
        exact: true,
        path: '/staff-management',
        element: lazy(() => import('./views/admin/staffManagement/staffManagement'))
      },
      {
        exact: true,
        path: '/request-management',
        element: lazy(() => import('./views/admin/requestManagement/requestManagement'))

      },
      {
        exact: true,
        path: '/request-type-management',
        element: lazy(() => import('./views/admin/requestTypeManagement/requestTypeManagement'))
      },
      {
        exact: true,
        path: '/payment-management/payment-by-restaurant',
        element: lazy(() => import('./views/admin/paymentsByRestaurant/PaymentsByRestaurant'))
      },
      {
        path: '*',
        exact: 'true',
        element: () => <Navigate to={BASE_URL} />
      }
    ]
  }
];

export default routes;
