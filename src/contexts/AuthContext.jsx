import { jwtDecode } from 'jwt-decode';
import { createContext, useEffect, useState } from 'react';
import { replace, useNavigate } from 'react-router-dom';

const AuthContext = createContext({});

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [authLoading, setAuthLoading] = useState(true); // Thêm state này

  const navigate = useNavigate();
  useEffect(() => {
    getStoragedToken();
  }, []);

  const isExpiredToken = (token) => {
    const decoded = jwtDecode(token);
    console.log('exp: ', decoded.exp * 1000, ' now:', Date.now());
    return decoded.exp * 1000 < Date.now();
  };

  // const refreshToken = async (oldAccessToken) => {
  //   try {
  //     console.log("expried token");
  //     const response = await refreshAccessToken(oldAccessToken);
  //     const refreshedToken = response.result.token;
  //     localStorage.setItem("lagikoiToken", refreshedToken);
  //     console.log("new token: ", response);
  //     return refreshedToken;
  //   } catch (error) {
  //     console.error("Error refreshing token:", error);
  //     localStorage.removeItem("lagikoiToken");
  //     throw new Error("Failed to refresh token");
  //   }
  // };

  const getStoragedToken = async () => {
    let storagedToken = localStorage.getItem('token');
    console.log(storagedToken);
    if (storagedToken) {
      try {
        if (isExpiredToken(storagedToken)) {
          // storagedToken = await refreshToken(storagedToken);

          // console.log(decoded);
          // const scopeArray = decoded.scope.split(" ");
          // const roles = getRoles(scopeArray);
          // const authorities = getAuthorities(scopeArray);
          // const username = decoded.sub;
          console.log("experied")
          setAuthLoading(false);
          navigate('/login');
        } else {
          const decoded = jwtDecode(storagedToken);
          console.log(decoded);
          const authData = {
            username: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
            roleId: decoded.RoleId,
            token: storagedToken
          };
          console.log(authData);
          setAuth(authData);
          setAuthLoading(false);
        }
      } catch (error) {
        console.error('Error refreshing token:', error);
        localStorage.removeItem('token');
        setAuthLoading(false);
      }
    }else{
      setAuthLoading(false);
    }
  };

  return <AuthContext.Provider value={{ auth, setAuth, authLoading }}>{children}</AuthContext.Provider>;
};
