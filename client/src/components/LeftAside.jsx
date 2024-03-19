import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Badge from "react-bootstrap/Badge";
import { BiHomeCircle } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";
import { IoNotificationsOutline } from "react-icons/io5";
import { PiShoppingCartSimple } from "react-icons/pi";
import { HiOutlineUser } from "react-icons/hi2";
import { HiOutlineLogout } from "react-icons/hi";
import { handleLogout } from "../utils/Helper";
import { cartIcon, rankingIcon, userIcon } from "../elements/SvgElements";
import { useLoading } from "../features/loadingHooks";
import { userApi } from "../config/axiosUtils";
import useAuth from "../services/useAuth";
import useFollowed from "../services/useFollowed";
import { useDispatch } from "react-redux";
import { setFollowed } from "../features/fetchFollowedSlice";
import { toast } from "react-toastify";
import { useCart } from "../services/customHooks";

const LeftAside = () => {
  const [isOpen, setIsOpen] = useState(false);
  const cartLength = useCart()?.cart?.length;
  // console.log("Left aside", cart);
  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const closeNav = () => {
    setIsOpen(false);
  };

  return (
    <div className={`conta ${isOpen ? "open" : ""}`}>
      {/* <button className="mobile-toggle" onClick={toggleNav}>
        <i className={`fas ${isOpen ? "fa-times" : "fa-bars"}`}></i>
      </button> */}
      <nav className="side-nav mt-3">
        <div className="divison-left-aside">
          <div className="left-head">
            <h6 className="head-pills">Fight Companion</h6>
          </div>
          <div className="div-4">
            {/* link 01 home fighter */}
            <NavLink to="/fighter" className="my-link mb-3">
              <div className="div-5">
                <svg
                  stroke="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 25 25"
                  fill="none"
                >
                  <mask
                    id="mask0_1405_3010"
                    // style="mask-type:alpha"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="25"
                    height="25"
                  >
                    <rect width="25" height="25" fill="#C4C4C4" />
                  </mask>
                  <g mask="url(#mask0_1405_3010)">
                    <path
                      d="M23.24 7.85954L12.716 2.17725C12.4837 2.05225 12.2056 2.05225 11.9733 2.17725L1.45141 7.85954C1.07224 8.06475 0.930578 8.5387 1.13579 8.91891C1.27641 9.17933 1.5462 9.32828 1.82329 9.32828C1.94829 9.32828 2.07641 9.29703 2.19412 9.23453L3.04308 8.7762L4.73995 20.7689C4.96287 22.0345 6.10245 22.9168 7.5087 22.9168H17.1775C18.5858 22.9168 19.7243 22.0335 19.9514 20.7429L21.6452 8.77411L22.4972 9.23453C22.8764 9.43557 23.3514 9.29703 23.5566 8.91786C23.7608 8.53974 23.6191 8.06579 23.24 7.85954ZM18.4087 20.4981C18.2972 21.1293 17.6764 21.3543 17.1795 21.3543H7.51079C7.01079 21.3543 6.39099 21.1293 6.2837 20.5231L4.51078 7.98453L12.3441 3.75329L20.1795 7.98245L18.4087 20.4981Z"
                      fill="black"
                    />
                    <path
                      d="M8.4066 12.6658C8.4066 14.8366 10.1722 16.6033 12.3441 16.6033C14.516 16.6033 16.2816 14.8366 16.2816 12.6658C16.2816 10.4949 14.516 8.72825 12.3441 8.72825C10.1722 8.72825 8.4066 10.4949 8.4066 12.6658ZM14.7191 12.6658C14.7191 13.9762 13.6545 15.0408 12.3441 15.0408C11.0337 15.0408 9.9691 13.9762 9.9691 12.6658C9.9691 11.3553 11.0337 10.2908 12.3441 10.2908C13.6545 10.2908 14.7191 11.3553 14.7191 12.6658Z"
                      fill="black"
                    />
                  </g>
                </svg>
                <span>Home</span>
              </div>
            </NavLink>
            {/* link 02 search page */}
            <NavLink to="/fighter/search" className="my-link mb-3">
              <div className="div-5">
                <FiSearch size={23} />
                <span>Search</span>
              </div>
            </NavLink>
            {/* link 03 Activities */}
            <NavLink to="/fighter/activites" className="my-link mb-3">
              <div className="div-5">
                <IoNotificationsOutline size={23} />
                <span>Activities</span>
              </div>
            </NavLink>
            {/* link 04 Ranking */}
            <NavLink to="/fighter/ranking" className="my-link mb-3">
              <div className="div-5">
                {rankingIcon}
                <span>Rankings</span>
              </div>
            </NavLink>
            {/* link 05 cart fighter */}
            <NavLink to="/fighter/cart" className="my-link mb-3">
              <div className="div-5">
                {cartIcon}
                <span>
                  Cart &nbsp;
                  <Badge bg="black" className="rounded-circle">
                    {cartLength > 0 && cartLength}
                  </Badge>{" "}
                </span>
              </div>
            </NavLink>
            {/* link 06 account fighter*/}
            <NavLink to="account" className="my-link mb-3">
              <div className="div-5">
                {userIcon}
                <span>Account</span>
              </div>
            </NavLink>
            {/* link 07 */}
            <button onClick={handleLogout} className="mb-2 log-out-btn">
              <div className="div-5">
                <HiOutlineLogout size={23} />
                <span>Logout</span>
              </div>
            </button>
          </div>
          <div className="left-nav-ft mt-2">
            <h6 className="head-pills">Stripe Balance: $XXX.XX</h6>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default LeftAside;
