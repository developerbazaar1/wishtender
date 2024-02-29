import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SurpRiseGiftPop from "../components/SurpRiseGiftPop";
import AccountDeleteModal from "../components/AccountDeleteModal";
import XsetupModal from "../components/XsetupModal";
import {
  imageIcon,
  rightIconSurprise,
  twitterIcon,
} from "../elements/SvgElements";
import { useForm } from "react-hook-form";
import useAuth from "../services/useAuth";
import { userApi } from "../config/axiosUtils";
import { useLoading } from "../features/loadingHooks";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateProfile } from "../features/authSlice";
import { Spinner } from "react-bootstrap";
import { castUpdateFormData, imgBasePath } from "../utils/Helper";

const AccountFighter = () => {
  const dispatch = useDispatch();
  const [showsurpriseModal, setshowsurpriseModal] = useState(false);
  const [showPasswordModal, setshowPasswordModal] = useState(false);
  const [showTwiterModaldModal, setshowTwiterModaldModal] = useState(false);
  const { globalLoading, startGloablLoading, stopGlobalLoading } = useLoading();
  const [selectedImage, setSelectedImage] = useState(null);
  const user = JSON.parse(useAuth()?.user);
  const token = JSON.parse(useAuth()?.token);
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: user,
  });

  const handeProfileUpdate = async (data) => {
    // console.log(data);
    const formData = castUpdateFormData(data);

    // return;
    startGloablLoading();
    try {
      const res = await userApi.updateProfile(formData, token);
      console.log(res?.data?.data);
      // return;
      if (res?.status === 200) {
        toast.success(res?.data?.message);
        dispatch(
          updateProfile({
            user: JSON.stringify(res?.data?.data),
          })
        );
      }
    } catch (e) {
      console.log(e);
      if (e?.response?.status === 401) {
        toast.error(e?.response?.data?.message);
      }
      if (e?.response?.status === 500) {
        toast.error(e?.response?.data?.message);
      }
    } finally {
      stopGlobalLoading();
    }
  };

  useEffect(() => {
    if (watch("newProfileImage") && watch("newProfileImage").length > 0) {
      setSelectedImage(URL.createObjectURL(watch("newProfileImage")[0]));
    }
  }, [watch("newProfileImage")]);

  return (
    <main className="main-content">
      {/* section start from here */}
      <section className="account-settelment">
        <div className="back-page">
          <Link to="/" className="back-to-page-btn link-text">
            <svg
              className="mb-1 mx-1"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12.7273 3.68676C12.8176 3.59129 12.8881 3.47898 12.9349 3.35626C12.9817 3.23353 13.0039 3.10278 13.0002 2.97148C12.9965 2.84017 12.9669 2.71089 12.9133 2.591C12.8596 2.47112 12.7828 2.36298 12.6873 2.27276C12.5919 2.18254 12.4796 2.11201 12.3568 2.0652C12.2341 2.01838 12.1034 1.9962 11.9721 1.99991C11.8408 2.00363 11.7115 2.03317 11.5916 2.08684C11.4717 2.14052 11.3636 2.21729 11.2733 2.31276L2.77334 11.3128C2.59781 11.4984 2.5 11.7442 2.5 11.9998C2.5 12.2553 2.59781 12.5011 2.77334 12.6868L11.2733 21.6878C11.363 21.7853 11.4711 21.8641 11.5914 21.9195C11.7117 21.975 11.8419 22.0059 11.9743 22.0106C12.1067 22.0153 12.2387 21.9937 12.3626 21.9469C12.4866 21.9002 12.6 21.8293 12.6963 21.7383C12.7927 21.6474 12.8699 21.5382 12.9237 21.4171C12.9775 21.296 13.0067 21.1655 13.0095 21.033C13.0124 20.9006 12.989 20.7689 12.9405 20.6456C12.8921 20.5223 12.8196 20.4098 12.7273 20.3148L4.87534 11.9998L12.7273 3.68676Z"
                fill="black"
              />
            </svg>
            Back
          </Link>
        </div>
        <div className="row ">
          <div className="col-md-12 col-sm-12 col-xs-12 col-lg-12 text-center">
            <div className="page-head">
              <div className="card-head mb-3 mt-2">
                <h5>Account</h5>
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-10 col-sm-12 col-xs-12 col-lg-10 text left">
            {/* account form start from here */}
            <form
              className="acc-form"
              onSubmit={handleSubmit(handeProfileUpdate)}
            >
              {/* for image wrapper */}
              <div className="file-wrapper">
                <input
                  type="file"
                  id="fileInput"
                  className="hidden-input"
                  multiple={false}
                  {...register("newProfileImage")}
                  // onChange={handleImageChange}
                />
                <label htmlFor="fileInput" className="file-upload">
                  <img
                    src={
                      selectedImage
                        ? selectedImage
                        : `${imgBasePath}/${user?.profileImage}`
                    }
                    alt="profile-pic"
                    className="profile-image"
                  />
                  {imageIcon}
                </label>
              </div>
              {/* for input 01 for username */}
              <div className="form-group text-left mb-2">
                <label className="form-head mb-2" htmlFor="username">
                  Username :
                </label>
                <input
                  type="text"
                  id="user-name"
                  className={`form-control ${
                    errors?.userName ? "error-border-profile" : null
                  }`}
                  placeholder="Enter your username"
                  {...register("userName", {
                    required: {
                      value: true,
                      message: "User is Required",
                    },
                  })}
                />
                <p className="profile-error-message">
                  {errors?.userName?.message}
                </p>
              </div>
              {/* form input 02 for first name  */}
              <div className="form-group text-left mb-2">
                <label className="form-head mb-2" htmlFor="userfirstame">
                  First Name :
                </label>
                <input
                  type="text"
                  id="first-name"
                  className={`form-control ${
                    errors?.firstName ? "error-border-profile" : null
                  }`}
                  placeholder="Enter your first name"
                  {...register("firstName", {
                    required: {
                      value: true,
                      message: "First Name is Required",
                    },
                    pattern: {
                      value: /^[a-zA-Z]+$/,
                      message: "Please Enter a Valid FirstName",
                    },
                  })}
                />

                <p className="profile-error-message">
                  {errors?.firstName?.message}
                </p>
              </div>
              {/* input 03 for last name*/}
              <div className="form-group text-left mb-2">
                <label className="form-head mb-2" htmlFor="userlastname">
                  Last Name :
                </label>
                <input
                  type="text"
                  id="last-name"
                  className={`form-control ${
                    errors?.lastName ? "error-border-profile" : null
                  }`}
                  placeholder="Enter your last name"
                  {...register("lastName")}
                />
                <p className="profile-error-message">
                  {errors?.lastName?.message}
                </p>
              </div>
              {/* input 04 for email address */}
              <div className="form-group text-left mb-2">
                <label className="form-head mb-2" htmlFor="useremail">
                  Email :
                </label>
                <input
                  type="text"
                  id="user-email"
                  className="form-control"
                  placeholder="Enter your email"
                  readOnly
                  {...register("email")}
                />
              </div>
              {/* input 05 for select currency */}
              <div className="form-group text-left mb-2">
                <label className="form-head mb-2" htmlFor="s-currency">
                  Select Currency (all currencies) :
                </label>
                <div className="select-group h-40 select-currency">
                  <select
                    id="s-currency dropdown-toggle"
                    {...register("currency", {
                      required: {
                        value: true,
                        message: "Please Select a Currency",
                      },
                    })}
                    className={`form-control ${
                      errors?.currency ? "error-border-profile" : null
                    }`}
                  >
                    <option value="">Select Currency (all currencies) </option>
                    <option value="CAD">CAD</option>
                    <option value="USD">USD</option>
                    <option value="EURO">EURO</option>
                    <option value="Pound">Pound</option>
                    <option value="Dirham">Dirham</option>
                  </select>

                  <p className="profile-error-message">
                    {errors?.currency?.message}
                  </p>
                </div>
              </div>
              {/* input 06 for fight prootion company */}
              <div className="form-group text-left mb-2 ">
                <label className="form-head mb-2" htmlFor="fight-promotion">
                  Select Fight Promotion Company :
                </label>
                <div className="select-group h-40 select-promotion">
                  <select
                    className={`form-control ${
                      errors?.promotionCompany ? "error-border-profile" : null
                    }`}
                    id="s-currency"
                    {...register("promotionCompany", {
                      required: {
                        value: true,
                        message: "Fight Promotion Company is Required",
                      },
                    })}
                  >
                    <option value="">Select Fight Promotion Company </option>
                    <option value="UFC">UFC</option>
                    <option value="Bellator">Bellator</option>
                    <option value="One FC">One FC</option>
                    <option value="PFL">PFL</option>
                    <option value="Asolute Championship Akhmat">
                      Asolute Championship Akhmat
                    </option>
                    <option value="AMC Fight Night">AMC Fight Night</option>
                    <option value="RIZIN Fighting Federation">
                      RIZIN Fighting Federation
                    </option>
                    <option value="Invicta Fight Championship">
                      Invicta Fight Championship{" "}
                    </option>
                    <option value="Pancrase">Pancrase </option>
                    <option value="KSW">KSW</option>
                    <option value="M-1 Global">M-1 Global</option>
                    <option value="Legacy Fighting Alliance">
                      Legacy Fighting Alliance
                    </option>
                    <option value="Unified MMA">Unified MMA</option>
                    <option value="Cage Warriors Fight Championship">
                      Cage Warriors Fight Championship
                    </option>
                    <option value="Rumble In The Cage">
                      Rumble In The Cage
                    </option>
                    <option value="Other">Other</option>
                  </select>
                  <p className="profile-error-message">
                    {errors?.promotionCompany?.message}
                  </p>
                </div>
              </div>
              {/* display my name in public ranking page */}
              <div className="form-group text-left mb-2 ">
                <div className="select-group h-40 displaynameRanking">
                  <label className="form-head " htmlFor="displayName">
                    Display my name in public Rankings page
                  </label>
                  <div className="right">
                    <input
                      type="checkbox"
                      className="socialink"
                      id="displayName"
                      {...register("displayNameInPublicRankingPage")}
                    />
                    <label
                      className="socialLablel"
                      htmlFor="displayName"
                    ></label>
                  </div>
                </div>
              </div>
              {/* Surprise Gift Section */}

              <div className="form-group text-left mb-2 ">
                <div
                  type="button"
                  className="select-group h-40 surprise-gift-container"
                  onClick={() => setshowsurpriseModal(true)}
                >
                  <label className="form-head " htmlFor="defaulGift">
                    Surprise Gift Settings
                  </label>

                  {rightIconSurprise}
                </div>
              </div>

              {/* twitter auto post section */}
              <div className="form-group text-left mb-2 ">
                <div className="select-group h-40 displaynameRanking">
                  <label
                    className="form-head x-auto-setupBtn"
                    onClick={() => setshowTwiterModaldModal(true)}
                  >
                    Setup Auto &nbsp;
                    {twitterIcon}
                    &nbsp; Post
                  </label>
                  <div className="right">
                    <input
                      type="checkbox"
                      className="socialink"
                      id="xpost"
                      {...register("setAutoPost")}
                    />
                    <label className="socialLablel" htmlFor="xpost"></label>
                  </div>
                </div>
              </div>

              <div className="act-btn mt-5">
                {/* btn for payment */}
                <div className="btn-payment mb-5">
                  <Link to="/paymentinfo" className="btn-pay sub-bt link-text ">
                    Go to Payment Dashboard
                  </Link>
                </div>
                {/* btn for change password */}
                <div className="btn-payment mb-5">
                  <Link
                    to="/fighter/change-password"
                    className="btn-pay sub-bt-cp link-text "
                  >
                    Change Password
                  </Link>
                </div>
              </div>
              {/* submit form button */}
              <div className="f-submit">
                <button
                  type="submit"
                  className="acs-form"
                  disabled={globalLoading}
                >
                  {!globalLoading ? "Submit" : "loading..."}
                </button>
              </div>
              <div
                className="delete-account my-4 typo-grey-16-600"
                onClick={() => setshowPasswordModal(true)}
              >
                Delete Account
              </div>
            </form>
          </div>
        </div>
      </section>
      {/* section end from here */}
      <SurpRiseGiftPop
        showsurpriseModal={showsurpriseModal}
        setshowsurpriseModal={setshowsurpriseModal}
        register={register}
      />

      {/* account delte modal */}
      <AccountDeleteModal
        showPasswordModal={showPasswordModal}
        setshowPasswordModal={setshowPasswordModal}
      />

      <XsetupModal
        showTwiterModaldModal={showTwiterModaldModal}
        setshowTwiterModaldModal={setshowTwiterModaldModal}
      />

      {globalLoading && (
        <div className="fighter-home-spinner">
          <Spinner animation="border" variant="danger" />
        </div>
      )}
    </main>
  );
};

export default AccountFighter;
