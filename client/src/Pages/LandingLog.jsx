import React, { useState } from "react";
import BrandImg from "../img/brand-logo.png";
import { Link } from "react-router-dom";
import LoginFooterElement from "../elements/LoginFooterElement";
import { BackBTn, BagIcon, RightBtn, UserIcon } from "../elements/SvgElements";
const LandingLog = () => {
  const [showComment, setShowComment] = useState(true);
  const [showSignUp, setShowSignUp] = useState(false);
  const handleSignUpClick = () => {
    setShowComment(false);
    setShowSignUp(true);
  };

  return (
    <>
      <section className="user-welcome">
        <div className="image-form-container">
          <div className="image-container"></div>
          <div className="form-container">
            {showComment && (
              <div className="row">
                <div className="col-md-12 col-sm-12 col-xs-12 col-lg-12">
                  <form className="user-enter-form">
                    <div className="form-start">
                      <div className="form-brand ">
                        <img
                          className="l-form-brand w-124 w-94"
                          src={BrandImg}
                          alt="logo"
                        />
                        <div className="landing-head mt-5">
                          <h1>Fight The Good Fight</h1>
                          <p className="para">
                            {" "}
                            Embrace the Future of Fanhood! <br /> With Fight
                            Companion, supporting your beloved fighters has
                            never been simpler.{" "}
                          </p>
                        </div>
                        <div className="tab-btn d-flex text-center mt-5">
                          <button
                            type="button"
                            className="tab-btn-signin"
                            onClick={handleSignUpClick}
                          >
                            {" "}
                            Sign up{" "}
                          </button>
                          <Link
                            className="text-white text-decoration-none"
                            to={`/signin`}
                          >
                            <button type="button" className="tab-btn-signup">
                              Sign in
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
            {showSignUp && (
              <form className="user-signup-form">
                <div className="form-start-signup">
                  <div className="form-brand text-start">
                    <span className="back-i-btn">
                      <button
                        className="backbtn"
                        type="button"
                        onClick={() => {
                          setShowComment(true);
                          setShowSignUp(false);
                        }}
                      >
                        {BackBTn}
                      </button>
                    </span>
                    <div className="signup-view mt-4 text-left">
                      <h2 className="sub-head">Sign Up</h2>
                      <p className="para mt-2 text-left">
                        Create a new account to get started.
                      </p>
                    </div>
                    {/* ... Sign-up content ... */}
                    <section className="main-container">
                      <Link
                        className="main-container text-decoration-none"
                        state={{ role: "fighter" }}
                        to="/signup/companion"
                      >
                        <div className="image-wrapper">
                          <div>{UserIcon}</div>
                        </div>
                        <div className="description-container">
                          <h2 className="title-log-card">Companion Account</h2>
                          <p className="description-log-card">
                            Support your favorite fighters around the world.
                          </p>
                        </div>
                        {RightBtn}
                      </Link>
                    </section>
                    <section className="main-container">
                      <Link
                        className="main-container text-decoration-none"
                        state={{ role: "fighter" }}
                        to="/signup/fighter"
                      >
                        <div className="image-wrapper">
                          <div>{BagIcon}</div>
                        </div>
                        <div className="description-container">
                          <div>
                            <h2 className="title-log-card">Fighter Account</h2>
                            <p className="description-log-card">
                              Fulfill your dreams with support from your biggest
                              fans.
                            </p>
                          </div>
                        </div>
                        <div>{RightBtn}</div>
                      </Link>
                    </section>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <LoginFooterElement />
    </>
  );
};

export default LandingLog;
