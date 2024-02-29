import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userApi } from "../config/axiosUtils";
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

  // console.log(youMightLike);

  useEffect(() => {
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
        {/* card 02 */}
        <div className="card-area-02 mt-3">
          <div className="card-grey">
            <div className="card-content">
              <div className="card-head mb-3 mt-2">
                <h5>Rankings</h5>
              </div>
              {/* celebrity ul list */}
              <div className="celeb-c">
                <ul className="celeb-list mx-4 m-auto ">
                  {/* celebrity list start from here */}
                  {/* list 01 */}
                  <li className="mb-2">
                    <div className="celebrity-profile">
                      <img
                        loading="lazy"
                        src="https://media.istockphoto.com/id/1268292259/photo/asian-woman-smile-take-selfie.jpg?s=612x612&w=0&k=20&c=9wN1RoksDOiBCgp3OxnK1T1W8Jz9zT83dvtfU0d0Z8E="
                        alt="Celebrity Profile"
                        className="celebrity-avatar"
                      />
                      <div className="celebrity-rank-info">
                        <div className="celebrity-name">Shuhratbek</div>
                        <div className="celebrity-role">ONE FC</div>
                      </div>
                      <div className="ranking">#1</div>
                    </div>
                  </li>
                  {/* list 02 */}
                  <li className="mb-2">
                    <div className="celebrity-profile">
                      <img
                        loading="lazy"
                        src="https://media.istockphoto.com/id/1268292259/photo/asian-woman-smile-take-selfie.jpg?s=612x612&w=0&k=20&c=9wN1RoksDOiBCgp3OxnK1T1W8Jz9zT83dvtfU0d0Z8E="
                        alt="Celebrity Profile"
                        className="celebrity-avatar"
                      />
                      <div className="celebrity-rank-info">
                        <div className="celebrity-name">Shuhratbek</div>
                        <div className="celebrity-role">ONE FC</div>
                      </div>
                      <div className="ranking">#2</div>
                    </div>
                  </li>

                  <div className="see-more-btn">
                    <Link to="/rankingfighter" className="see link-text">
                      Show More
                    </Link>
                  </div>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightAside;
