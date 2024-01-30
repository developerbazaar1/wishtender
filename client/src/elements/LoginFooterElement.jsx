import React from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const LoginFooterElement = () => {
  return (
    <div className="login-footer-page">
      <ul className="footer-ul">
        <li>
          <Link to="/about" type="button">
            About
          </Link>{" "}
        </li>
        <li>
          {" "}
          <Link to="/helpcenter" type="button">
            Help Center
          </Link>{" "}
        </li>
        <li>
          {" "}
          <Link to="/terms-of-services" type="button">
            Terms of Service
          </Link>{" "}
        </li>
        <li>
          {" "}
          <Link to="/privacypolicy" type="button">
            Privacy Policy
          </Link>
        </li>
        <li>
          {" "}
          <Link to="/cookie-policy" type="button">
            Cookie Policy
          </Link>
        </li>
        <li>
          {" "}
          <Link to="/how-it-works" type="button">
            How its works
          </Link>{" "}
        </li>
        <li>
          {" "}
          <Link to="/faq" type="button">
            FAQ
          </Link>
        </li>
        <li>
          <Link to="">© 2021 Fight Companion LLC.</Link>
        </li>
        {/* <li>How it works</li> */}
      </ul>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default LoginFooterElement;
