import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../services/useAuth";
import { userApi } from "../config/axiosUtils";
import { useLoading } from "../features/loadingHooks";
import { Spinner } from "react-bootstrap";
import useFollowed from "../services/useFollowed";
import { useDispatch } from "react-redux";
import { setFollowed } from "../features/fetchFollowedSlice";
import { toast } from "react-toastify";
import { imgBasePath } from "../utils/Helper";

const LikeProfile = ({ title }) => {
  const { globalLoading, startGloablLoading, stopGlobalLoading } = useLoading();
  const [youMightLike, setyouMIghtLike] = useState([]);
  const token = JSON.parse(useAuth()?.token);
  const following = useFollowed()?.followed;
  const dispatch = useDispatch();
  // console.log(following);
  //function to get the random Fihter list
  const FetchMightLike = async () => {
    startGloablLoading();
    try {
      const res = await userApi.youMightLike(token);
      console.log(res);
      if (res?.status === 200) {
        setyouMIghtLike(res?.data?.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      stopGlobalLoading();
    }
  };

  //function to follow and unfollow fighter
  const followUnfollow = async (fighterId, action) => {
    startGloablLoading();
    try {
      const res = await userApi.followUnfollow(token, fighterId, action);
      console.log(res);
      if (res?.status === 200) {
        dispatch(
          setFollowed({
            followed: res?.data?.updatedFollower,
          })
        );
        return toast.success(res?.data?.message);
      }
    } catch (e) {
      console.log(e);
      if (e?.response?.status === 401) {
        toast.error("Something went wrong try later");
      }
      if (e?.response?.status === 500) {
        toast.error(e?.response?.data?.message);
      }
      if (e?.response?.status === 400) {
        toast.error(e?.response?.data?.message);
      }
    } finally {
      stopGlobalLoading();
    }
  };

  useEffect(() => {
    FetchMightLike();
  }, []);

  return (
    <>
      <main className="main-content">
        <section className="search-fighter-sec page-head">
          <div className="row">
            <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12">
              <div className="back-page">
                <Link to={-1} className="back-to-page-btn link-text">
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
            </div>
          </div>
          {/* page tittle */}
          <div className="row ">
            <div className="col-md-12 col-sm-12 col-xs-12 col-lg-12 text-center">
              <div className="page-head">
                <div className="card-head mb-3 mt-2">
                  <h5> You Might Like </h5>
                  {title &&
                    "Currently, you are not following any fighters. Please follow some fighters from suggestions listed below to add them to the Favorites list"}
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* profile like section start from here */}
        <section className="like-profiles">
          <div className="row justify-content-center">
            <div className="col-md-11 col-lg-11 col-sm-12 col-xs-12">
              {/* likes profile content start from here */}
              <div className="like-profiles-content">
                {/* likes profile card list */}
                <div className="like-profiles-card">
                  {/* profile card 01 */}

                  {youMightLike?.map((element) => (
                    <div className="select-fighter" key={element?._id}>
                      <div className="fighter-card mb-3 ">
                        <img
                          // loading="lazy"
                          src={
                            element?.profileImage
                              ? `${imgBasePath}/${element?.profileImage}`
                              : "https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?cs=srgb&dl=pexels-jack-winbow-1559486.jpg&fm=jpg"
                          }
                          className="fighter-image"
                          alt="profile"
                        />
                        <Link
                          className="fighter-details text-decoration-none"
                          to={`/fighter/${element?.userName}`}
                        >
                          <div className="fighter-name">
                            {element?.firstName} {element?.lastName}
                          </div>
                          <div className="fighter-info">
                            {element?.userName} - [{" "}
                            {element?.promotionCompany ||
                              "Fighter Promotion Company"}
                            ]
                          </div>
                        </Link>
                        <div className="follow-btn align-self-center">
                          {following?.some(
                            (localElement) => localElement?._id === element?._id
                          ) ? (
                            <button
                              disabled={globalLoading}
                              className="follow-profile-btn"
                              onClick={() =>
                                followUnfollow(element?._id, "unfollow")
                              }
                            >
                              Following
                            </button>
                          ) : (
                            <button
                              disabled={globalLoading}
                              className="follow-profile-btn"
                              onClick={() =>
                                followUnfollow(element?._id, "follow")
                              }
                            >
                              Follow
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>{" "}
      {globalLoading && (
        <div className="fighter-home-spinner">
          <Spinner animation="border" variant="danger" />
        </div>
      )}
    </>
  );
};

export default LikeProfile;
