import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BackBTn, EmailIcon, LockIcon } from "../elements/SvgElements";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { AuthApi } from "../config/axiosUtils";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
import { useLoading } from "../features/loadingHooks";

const FighterSignup = () => {
  const navigate = useNavigate();
  const { globalLoading, startGloablLoading, stopGlobalLoading } = useLoading();
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false, // Corrected the state key
  });

  const togglePasswordVisibility = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  function hanelSignup(formData) {
    formData["role"] = "fighter";
    startGloablLoading();

    AuthApi.signup(formData)
      .then((res) => {
        toast.success(res?.data?.message);
        navigate("/signin");
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
        if (e?.code) {
          toast.error(e?.message);
        }
        if (e?.response?.status === 422) {
          const validationErrors = e.response?.data?.data || [];

          validationErrors?.forEach((data) => {
            // console.log("data error", data);
            toast.error(data?.msg);
          });
        }

        if (e?.response?.status === 500) {
          toast.error(e?.response?.data?.message);
        }
        // toast.error()
      })
      .finally(() => {
        stopGlobalLoading();
      });
  }

  return (
    <>
      <div className="form-start-tab ">
        <div className="form-brand-ct ">
          <span className="back-i-btn">
            <button
              className="backbtn"
              type="button"
              //   onClick={handleBackButtonClick}
            >
              <Link to="/landing">{BackBTn}</Link>
            </button>
          </span>
          {/* sign in content start from here  */}
          <div className="login-view mt-4 text-left">
            <h2 className="sub-head">Create account </h2>
            <p className="para mt-2 text-left">
              Please enter your email & password to sign in.
            </p>
          </div>
          {/* ... signin content form */}
          <form
            className="user-login-form"
            onSubmit={handleSubmit(hanelSignup)}
            id="signup-btn"
          >
            <div className="form-start-login">
              <div className="form-brand">
                {/* form start from here */}
                <div className="col-md-12 col-sm-12 col-xs-12 col-lg-12">
                  {/* form input one for log email */}
                  <div className="form-group text-left">
                    <label className="form-head mb-2" htmlFor="log-mail">
                      Email
                    </label>
                    <div
                      className={`inputWithIcon email-input ${
                        errors?.email ? "error-border" : ""
                      } `}
                    >
                      <input
                        type="text"
                        id="login-email"
                        className={`${
                          errors?.email ? "error-placeholder" : ""
                        }`}
                        placeholder="Enter your email"
                        {...register("email", {
                          required: {
                            value: true,
                            message: "Email is required",
                          },
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Enter a Valid Email",
                          },
                        })}
                      />
                      {EmailIcon}
                    </div>
                    {errors?.email && (
                      <small className="error-message">
                        {errors?.email?.message}
                      </small>
                    )}
                  </div>
                  {/* form input two for log password */}
                  <div className="form-group text-left mt-2">
                    <label className="form-head mb-2" htmlFor="password">
                      Password
                    </label>
                    <div
                      className={`password-input ${
                        errors?.password ? "error-border" : ""
                      }`}
                    >
                      {LockIcon}
                      <input
                        type={showPassword?.password ? "text" : "password"}
                        id="password"
                        className={`${
                          !showPassword.password &&
                          watch("password")?.length > 0
                            ? "if-password"
                            : null
                        }`}
                        placeholder="Enter your password "
                        {...register("password", {
                          required: {
                            value: true,
                            message: "Password is Required",
                          },
                          minLength: {
                            value: 6,
                            message:
                              "Password Should be More Than 6 Characters",
                          },
                        })}
                        // onChange={(e) =>
                        //   handleInputChange("password", e.target.value)
                        // }
                      />
                      {watch("password")?.length > 0 && (
                        <button
                          type="button"
                          className="showHideIcon"
                          onClick={() => togglePasswordVisibility("password")}
                        >
                          {showPassword?.password ? (
                            <FaEye color="#9E9E9E" size={20} />
                          ) : (
                            <FaEyeSlash color="#9E9E9E" size={20} />
                          )}
                        </button>
                      )}
                    </div>
                    {errors?.password && (
                      <small className="error-message">
                        {errors?.password?.message}
                      </small>
                    )}
                  </div>

                  {/* re-enter password start */}
                  <div className="form-group text-left mt-2">
                    <label className="form-head mb-2" htmlFor="confirmpassword">
                      {/* re-enter password end */}
                      Re-enter Password
                    </label>
                    <div
                      className={`password-input ${
                        errors?.confirmpassword ? "error-border" : ""
                      }`}
                    >
                      {LockIcon}
                      <input
                        type={
                          showPassword?.confirmPassword ? "text" : "password"
                        }
                        id="confirmpassword"
                        className={`${
                          !showPassword?.confirmPassword &&
                          watch("confirmpassword")?.length > 0
                            ? "if-password"
                            : ""
                        }`}
                        placeholder="Confirm your password "
                        {...register("confirmpassword", {
                          required: {
                            value: true,
                            message: "Confirm Password Is Required",
                          },

                          validate: (val) => {
                            if (watch("password") !== val) {
                              return "Your passwords do not match";
                            }
                          },
                        })}
                      />
                      {watch("confirmpassword")?.length > 0 && (
                        <button
                          type="button"
                          className="showHideIcon"
                          onClick={() =>
                            togglePasswordVisibility("confirmPassword")
                          }
                        >
                          {showPassword?.confirmPassword ? (
                            <FaEye color="#9E9E9E" size={20} />
                          ) : (
                            <FaEyeSlash color="#9E9E9E" size={20} />
                          )}
                        </button>
                      )}
                    </div>
                    {errors?.confirmpassword && (
                      <small className="error-message">
                        {errors?.confirmpassword?.message}
                      </small>
                    )}
                  </div>

                  <div className="term-policy">
                    <input
                      type="checkbox"
                      name="termCondition"
                      id="termCondition"
                      {...register("agreeTermConditions", {
                        required: {
                          value: true,
                          message: "You must agree before submitting.",
                        },
                      })}
                    />
                    <label htmlFor="termCondition">
                      I agree to Fight Companion{" "}
                      <Link className="text-black">Terms</Link> &
                      <Link className="text-dark"> Policy</Link> .
                    </label>
                    {errors?.agreeTermConditions && (
                      <small className="error-message">
                        {errors?.agreeTermConditions?.message}
                      </small>
                    )}
                  </div>

                  <div className="already-have-account">
                    <label htmlFor="">Already have an account?</label>
                    <Link
                      className="text-decoration-none text-dark"
                      to="/signin"
                    >
                      Sign in
                    </Link>
                  </div>

                  <div className="account-switch">
                    {/* btn-for -sign-in */}
                    {/* <Link to="fighterhome"> */}
                    <button
                      type="submit"
                      className={`long-btn-sign-in mt-2 mx-4 ${
                        globalLoading ? "long-btn-sign-in-disabled" : null
                      }`}
                      disabled={globalLoading}
                    >
                      {" "}
                      {!globalLoading ? "Sign up" : "loading..."}
                    </button>
                    {/* </Link> */}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default FighterSignup;
