import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BackBTn, EmailIcon, LockIcon } from "../elements/SvgElements";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { AuthApi } from "../config/axiosUtils";
import { useLoading } from "../features/loadingHooks";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login } from "../features/authSlice";

const SignIn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { globalLoading, startGloablLoading, stopGlobalLoading } = useLoading();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const from = location.state?.from?.pathname || "/";
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  async function HandleSubmit(formData) {
    startGloablLoading();
    try {
      const res = await AuthApi.signin(formData);
      let { status, data } = res;
      // console.log(data);
      // console.log("response", data.user);
      if (status === 200) {
        toast.success(data.message);
        dispatch(
          login({
            user: JSON.stringify(data.user),
            token: JSON.stringify(data.token),
          })
        );

        localStorage.setItem("user-id", data.token);
        navigate(from, { replace: true });
      }
    } catch (e) {
      console.log("error data", e);
      if (e?.response?.status === 401) {
        toast.error(e?.response?.data?.message);
      }
      if (e?.response?.status === 500) {
        toast.error(e?.response?.data?.message);
      }
    } finally {
      stopGlobalLoading();
    }
  }

  return (
    <div>
      <div className="form-start-tab">
        <div className="form-brand-ct">
          <span className="back-i-btn">
            <button
              className="backbtn"
              type="button"
              //   onClick={handleBackButtonClick}
            >
              <Link to="..">{BackBTn}</Link>
            </button>
          </span>
          {/* sign in content start from here  */}
          <div className="login-view mt-4 text-left">
            <h2 className="sub-head">Welcome back</h2>
            <p className="para mt-2 text-left">
              Please enter your email & password to sign in.
            </p>
          </div>
          {/* ... signin content form */}
          <form
            className="user-login-form"
            onSubmit={handleSubmit(HandleSubmit)}
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
                    <label className="form-head mb-2" htmlFor="log-mail">
                      Password
                    </label>
                    <div
                      className={`password-input ${
                        errors?.password ? "error-border" : ""
                      }`}
                    >
                      {LockIcon}
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        className={`${
                          !showPassword.password &&
                          watch("password")?.length > 0
                            ? "if-password"
                            : null
                        }`}
                        placeholder="Enter your password "
                        {...register("password", {
                          minLength: {
                            value: 6,
                            message:
                              "Password Should be More Than 6 Characters",
                          },
                          required: {
                            value: true,
                            message: "Password is Required",
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
                          {showPassword ? (
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
                  {/* div for remember log info */}
                  <div className="d-flex justify-space-between  mt-2">
                    <div className="form-check mt-2 mb-2">
                      <input
                        className="form-check-input "
                        type="checkbox"
                        value=""
                        id="flexCheckDefault"
                      />
                      <label
                        className="form-check-label check-label mx-1-75"
                        htmlFor="flexCheckDefault"
                      >
                        {" "}
                        Remember Me{" "}
                      </label>
                    </div>
                    {/* forget password link */}

                    <div className="form-check mt-2 mb-2">
                      <Link to="#" className="forget-password">
                        Forgot Password?
                      </Link>
                    </div>
                  </div>
                  {/* up div end for remember  */}
                  {/* area for info text */}
                  <div className="log-info mt-2 mb-3">
                    <small className="account-f">
                      Don’t have an account?{" "}
                      <span className="">
                        <Link className="forget-password" to="/">
                          Sign up
                        </Link>
                      </span>
                    </small>
                  </div>
                  {/* area end for info text */}
                  <div className="account-switch">
                    {/* btn-for -sign-in */}

                    <button
                      className={`long-btn-sign-in mt-2 mx-4 ${
                        globalLoading ? "long-btn-sign-in-disabled" : null
                      }`}
                      disabled={globalLoading}
                      type="submit"
                    >
                      {!globalLoading ? " Sign in" : "loading..."}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
