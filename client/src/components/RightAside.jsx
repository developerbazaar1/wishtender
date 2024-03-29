import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { orderApi, userApi } from "../config/axiosUtils";
import { useLoading } from "../features/loadingHooks";
import { toast } from "react-toastify";
import useAuth from "../services/useAuth";
import useFollowed from "../services/useFollowed";
import { useDispatch } from "react-redux";
import { setFollowed } from "../features/fetchFollowedSlice";
import { imgBasePath } from "../utils/Helper";

const RightAside = () => {
  const { globalLoading, startGloablLoading, stopGlobalLoading } = useLoading();
  const following = useFollowed()?.followed;
  const dispatch = useDispatch();
  const [youMightLike, setyouMIghtLike] = useState([]);
  const [rankingData, setRankingData] = useState({
    fighters: [],
    status: "",
    message: "",
  });
  const token = JSON.parse(useAuth()?.token);
  const FetchMightLike = async () => {
    startGloablLoading();
    try {
      const res = await userApi.youMightLike(token);
      // console.log(res);
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

  //function to fetch ranking
  async function fetchRanking() {
    try {
      startGloablLoading();

      const res = await orderApi.fetchRanking(token, "Monthly", 4);
      // console.log(res);
      setRankingData({
        fighters: res?.data?.data,
        message: "data Fetched successfully",
        status: "success",
      });
      // console.log(res);
    } catch (e) {
      setRankingData({
        fighters: [],
        message: e?.response?.data?.message || e?.response?.data?.error,
        status: "error",
      });
      console.log(e);
    } finally {
      stopGlobalLoading();
    }
  }

  useEffect(() => {
    fetchRanking();
    FetchMightLike();
  }, []);

  return (
    <div className="right-aside">
      <div className="right-card">
        {/* card for you may like */}
        <div className="card-grey">
          <div className="card-content">
            <div className="card-head mb-3 mt-2">
              <h5>You Might Like</h5>
            </div>
            {/* celebrity ul list */}
            <div className="celeb-c">
              <ul className="celeb-list m-auto ">
                {/* celebrity list start from here */}
                {/* list 01 */}

                {youMightLike?.slice(0, 5)?.map((element) => (
                  <li className="mb-2" key={element._id}>
                    <div className="celebrity-profile row">
                      <div className="p-0 col-2">
                        <img
                          loading="lazy"
                          src={
                            element?.profileImage
                              ? `${imgBasePath}/${element?.profileImage}`
                              : "https://media.istockphoto.com/id/1268292259/photo/asian-woman-smile-take-selfie.jpg?s=612x612&w=0&k=20&c=9wN1RoksDOiBCgp3OxnK1T1W8Jz9zT83dvtfU0d0Z8E="
                          }
                          alt="Celebrity Profile"
                          className="celebrity-avatar"
                        />
                      </div>
                      <Link
                        to={`/fighter/${element?.userName}`}
                        className="text-decoration-none col-4"
                      >
                        <div className="celebrity-name text-capitalize">
                          {element?.firstName}
                        </div>
                        <div className="celebrity-role text-capitalize">
                          {element?.promotionCompany}
                        </div>
                      </Link>

                      {following?.some(
                        (localElement) => localElement?._id === element?._id
                      ) ? (
                        <button
                          className="follow-button col-4"
                          disabled={globalLoading}
                          onClick={() =>
                            followUnfollow(element?._id, "unfollow")
                          }
                        >
                          Following
                        </button>
                      ) : (
                        <button
                          className="follow-button col-4"
                          disabled={globalLoading}
                          onClick={() => followUnfollow(element?._id, "follow")}
                        >
                          Follow
                        </button>
                      )}
                    </div>
                  </li>
                ))}
                <div className="see-more-btn">
                  <Link to="/fighter/mightlike" className="see link-text">
                    Show More
                  </Link>
                </div>
              </ul>
            </div>
          </div>
        </div>
        <div className="card-grey">
          <div className="card-content">
            <div className="card-head mb-3 mt-2">
              <h5>Rankings</h5>
            </div>
            {/* celebrity ul list */}
            <div className="celeb-c">
              <ul className="celeb-list m-auto ">
                {/* celebrity list start from here */}
                {/* list 01 */}

                {rankingData?.fighters?.map((element, index) => (
                  <li className="mb-2" key={element?._id}>
                    <div className="celebrity-profile row">
                      <div className="p-0 col-2">
                        <img
                          loading="lazy"
                          src={
                            element?.profileImage
                              ? `${imgBasePath}/${element?.profileImage}`
                              : "https://media.istockphoto.com/id/1268292259/photo/asian-woman-smile-take-selfie.jpg?s=612x612&w=0&k=20&c=9wN1RoksDOiBCgp3OxnK1T1W8Jz9zT83dvtfU0d0Z8E="
                          }
                          alt="Celebrity Profile"
                          className="celebrity-avatar"
                        />
                      </div>
                      <Link
                        to={`/fighter/${element?.userName}`}
                        className="text-decoration-none col-4"
                      >
                        <div className="celebrity-name text-capitalize">
                          {element?.firstName}
                        </div>
                        <div className="celebrity-role text-capitalize">
                          {element?.promotionCompany}
                        </div>
                      </Link>

                      <div className="ranking col-4 text-end">#{index + 1}</div>
                    </div>
                  </li>
                ))}
                <div className="see-more-btn">
                  <Link to="/fighter/ranking" className="see link-text">
                    Show More
                  </Link>
                </div>
              </ul>
            </div>
          </div>
        </div>
        {/* card 02 */}
      </div>
    </div>
  );
};

export default RightAside;
