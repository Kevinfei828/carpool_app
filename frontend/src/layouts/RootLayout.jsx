import {useEffect, useState} from "react";
import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";
import {Col, Row} from "react-bootstrap";
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import Header from "./Header";
import {Grid} from "@mui/material"; // Import the Header component

import { useAuth } from '../auth/AuthContext'; // Import the AuthContext

export const RootLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = useState('');

  const { userToken, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !userToken) {
      navigate("/Login"); // Redirect to login page if user is not authenticated
    }
  }, [userToken, isLoading, navigate]);

  const onNavClick = (e) => {
    const targetPage = e.target.parentElement.id;
    const isLoginPage = targetPage === 'nav-Login';
    if (!userToken && !isLoginPage) { 
      alert('請先登入以訪問此頁面');
      navigate("/Login"); 
      return;
    }
    setPage(targetPage);
  }

  useEffect(() => {
    const path = 'nav-' + location.pathname.split('/').pop();
    setPage(path);
  }, [location.pathname]);

  return (
    <Row className="vh-100">
      <Col xs={3} className="p-0 sidebar"> {/* Added p-0 to remove default margin */}
        <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark vh-100">
          <Grid container spacing={2} justifyContent="flex-start" alignItems="center">
            <Grid item xs={0.5}> </Grid>
            <Grid item>
              <Link to="search" style={{
                background: '#007BFF',
                padding: '10px',
                borderRadius: '10px',
                marginRight: '10px',
                width: '50px',
                height: '50px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <LocalTaxiIcon style={{fontSize: 36, color: '#ffffff'}}/>
              </Link>
            </Grid>
          </Grid>
          <hr/>
          <ul className="nav nav-pills flex-column mb-auto">
            {!userToken && (
              <li id='nav-Login' className="nav-item" onClick={onNavClick}>
                {page === 'nav-Login' ? (<Link to="Login" className="nav-link active">登入頁面</Link>)
                  : (<Link to="Login" className="nav-link text-white">登入頁面</Link>)}
              </li>
            )}
            <li id='nav-search' className="nav-item" onClick={onNavClick}>
              {page === 'nav-search' ? (<Link to="search" className="nav-link active">搜尋共乘</Link>)
                : (<Link to="search" className="nav-link text-white">搜尋共乘</Link>)}
            </li>
            <li id='nav-launch' className="nav-item" onClick={onNavClick}>
              {page === 'nav-launch' ? (<Link to="launch" className="nav-link active">發起共乘</Link>)
                : (<Link to="launch" className="nav-link text-white">發起共乘</Link>)}
            </li>
            <li id='nav-joined' className="nav-item" onClick={onNavClick}>
              {page === 'nav-joined' ? (<Link to="joined" className="nav-link active">已加入的共乘</Link>)
                : (<Link to="joined" className="nav-link text-white">已加入的共乘</Link>)}
            </li>
            <li id='nav-ended' className="nav-item" onClick={onNavClick}>
              {page === 'nav-ended' ? (<Link to="ended" className="nav-link active">結束的共乘</Link>)
                : (<Link to="ended" className="nav-link text-white">結束的共乘</Link>)}
            </li>
            
            <li id='nav-user' className="nav-item" onClick={onNavClick}>
              {page === 'nav-user' ? (<Link to="user" className="nav-link active">用戶資料</Link>)
                : (<Link to="user" className="nav-link text-white">用戶資料</Link>)}
            </li>
            {/* <li id='nav-top-up' className="nav-item" onClick={onNavClick}>
              {page === 'nav-top-up' ? (<Link to="top-up" className="nav-link active">用戶儲值：目前在此</Link>)
                : (<Link to="top-up" className="nav-link text-white">用戶儲值</Link>)}
            </li>
            <li id='nav-confirm' className="nav-item" onClick={onNavClick}>
              {page === 'nav-confirm' ? (<Link to="confirm" className="nav-link active">Confirm：目前在此</Link>)
                : (<Link to="confirm" className="nav-link text-white">Confirm</Link>)}
            </li> */}
          </ul>
        </div>
      </Col>


      <Col xs={9} className="p-0"> {/* Added p-0 to remove default margin */}
        <div className="overflow-auto vh-100"> {/* warp the scrollable object */}
          {/* the Header component */}
          <Header/>

          {/* The imported carpool page component */}
          <Outlet/>
        </div>
      </Col>
    </Row>
  );
}

export default RootLayout;
