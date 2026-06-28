import React, { useEffect, useState } from "react";
import logo from "../../Assets/images/logo.svg";
import ct_logo from "../../Assets/images/ct_logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "react-slidedown/lib/slidedown.css";
import Dropdown from "../Dropdown/Dropdown";
import { change_night_mode } from "../../redux/actions/StudentAction";
import { current } from "../../redux/actions/Actions";
const HeaderS = () => {
  const { user } = useSelector((state) => state.LoginReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [changeNightMode, setChangeNightMode] = useState(false);
  useEffect(() => {
    dispatch(current());
  }, []);
  const handleChangeNightMode = () => {
    setChangeNightMode(!changeNightMode);
    dispatch(change_night_mode(changeNightMode));
  };
  const Logout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };
  return (
    <>
      <header className="header clearfix">
        <div className="main_logo" id="logo">
          <Link to="/">
            <img src={logo} alt="" />
          </Link>
          <a href="index.html">
            <img className="logo-inverse" src={ct_logo} alt="" />
          </a>
        </div>
        <div className="top-category">
          <Link to="/dashboard-instructor" className="item channel_item">
            Home
          </Link>
          <Link to="/students-list" className="item channel_item">
            Students List
          </Link>
          <Link to="/checkpoints" className="item channel_item">
            Checkpoints
          </Link>
          {/* 
          <Link to="/instructors-list" className="item channel_item">
            Performance
          </Link> */}
        </div>

        <div className="header_right">
          <ul>
            <li></li>
            <li className="ui s-dropdown active visible" tabIndex={0}>
              <Link
                className="opts_account"
                title="Account"
                onClick={() => setOpen(!open)}
              >
                <img src={user.profileImg} alt="" />
                <span>
                  {user.firstName} {user.lastName}
                </span>
              </Link>

              <Dropdown open={open}>
                <div className="dropdown" tabIndex={-1}>
                  <div className="channel_my">
                    <div className="profile_link">
                      <img src={user.profileImg} alt="" />
                      <div className="pd_content">
                        <div className="rhte85">
                          <h6>
                            {user.firstName} {user.lastName}
                          </h6>
                          <div className="mef78" title="Verify">
                            <i className="uil uil-check-circle" />
                          </div>
                        </div>
                        <span>{user.email}</span>
                      </div>
                    </div>
                    <div className="night_mode_switch__btn">
                      <Link
                        id="night-mode"
                        className="btn-night-mode"
                        onClick={handleChangeNightMode}
                      >
                        <i className="uil uil-moon" /> Night mode
                        <span className="btn-night-mode-switch">
                          <span className="uk-switch-button" />
                        </span>
                      </Link>
                    </div>
                  </div>
                  <Link to="/instructor-profile" className="item channel_item">
                    View My Profile
                  </Link>
                  <Link
                    to="/change-password-instuctor"
                    className="item channel_item"
                  >
                    Change Password
                  </Link>

                  <Link className="item channel_item" onClick={() => Logout()}>
                    Sign Out
                  </Link>
                </div>
              </Dropdown>
            </li>
          </ul>
        </div>
      </header>
    </>
  );
};

export default HeaderS;
