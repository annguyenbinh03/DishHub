import React from 'react';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Bounce, toast } from 'react-toastify';
import { login, loginGoogle } from 'services/authService';
import { jwtDecode } from 'jwt-decode';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from 'hooks/useAuth';

const googleClientId = import.meta.env.VITE_GOOGLE_LOGIN_CLIENTID;
const JWTLogin = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const from = location?.state?.from?.pathname || "/";
  console.log("from" + from)
  const {setAuth} = useAuth();

  const handleGoogleLogin = async (response) => {
    // Gửi token này đến backend để xác thực
    try {
      const res = await loginGoogle(response.credential);
      navigateLogin(res.data.token);
    } catch (error) {
      console.error('Error verifying Google token', error);
    }
  };

  const handleLogin = async (values) => {
    console.log('Login with:', values.username, values.password);
    try {
      const res = await login(values.username, values.password);
      navigateLogin(res.token);
    } catch (error) {
      console.error('Invalid username or password', error);
    }
  };

  const navigateLogin = (token) => {
    const decoded = jwtDecode(token);
    localStorage.setItem("token", token);
    const authData = {
      username: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
      roleId: decoded.RoleId,
      token: token
    };
    setAuth(authData);
    console.log(authData);

    if (from !== "/") {
      console.log("Navigating to:", from);
      navigate(from, { replace: true });
    } else {
      if (authData.roleId === '1') {
        navigate('/user', { replace: true });
      } else {
        navigate('/app/dashboard/default', { replace: true });
      }
    }
  };

  return (
    <Formik
      initialValues={{
        username: '',
        password: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string().max(255).required('username is required'),
        password: Yup.string().max(255).required('Password is required')
      })}
      onSubmit={handleLogin}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <input
              className="form-control"
              label="username Address / Username"
              name="username"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.username}
              placeholder="username"
            />
            {touched.username && errors.username && <small className="text-danger form-text">{errors.username}</small>}
          </div>
          <div className="form-group mb-4">
            <input
              className="form-control"
              label="Password"
              name="password"
              onBlur={handleBlur}
              onChange={handleChange}
              type="password"
              value={values.password}
              placeholder="password"
            />
            {touched.password && errors.password && <small className="text-danger form-text">{errors.password}</small>}
          </div>

          {/* <div className="custom-control custom-checkbox  text-start mb-4 mt-2">
            <input type="checkbox" className="custom-control-input mx-2" id="customCheck1" />
            <label className="custom-control-label" htmlFor="customCheck1">
              Save credentials.
            </label>
          </div> */}

          {errors.submit && (
            <Col sm={12}>
              <Alert>{errors.submit}</Alert>
            </Col>
          )}

          <Row>
            <Col mt={2}>
              <Button className="btn-block mb-4" color="primary" disabled={isSubmitting} size="large" type="submit" variant="primary">
                Signin
              </Button>
            </Col>
          </Row>
          <Row>
            <GoogleOAuthProvider clientId={googleClientId}>
              <GoogleLogin logo_alignment="center" onSuccess={handleGoogleLogin} onError={() => console.error('Login Failed')} />
            </GoogleOAuthProvider>
          </Row>
        </form>
      )}
    </Formik>
  );
};

export default JWTLogin;
