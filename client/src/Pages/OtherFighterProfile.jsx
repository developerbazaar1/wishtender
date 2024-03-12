import React, { useEffect, useState } from "react";
import { IoCopyOutline } from "react-icons/io5";
import { FaRegCalendarAlt } from "react-icons/fa";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Goals from "../components/Goals";
import { DragDropContext } from "react-beautiful-dnd";
import ProductGoal from "../img/product-gloves.png";
import Massage from "../img/massage.png";
import dubmbels from "../img/dumbels.png";
import SendSurpriseModal from "../components/SendSurpriseModal";
import { userApi } from "../config/axiosUtils";
import useAuth from "../services/useAuth";
import { useLoading } from "../features/loadingHooks";
import { toast } from "react-toastify";
import castDate, { getSocialIcon, imgBasePath } from "../utils/Helper";
import { filterIcon } from "../elements/SvgElements";
import { useCategory } from "../features/categoryHooks";
import { Spinner } from "react-bootstrap";
import useFollowed from "../services/useFollowed";
import { setFollowed } from "../features/fetchFollowedSlice";
import { useDispatch } from "react-redux";
const OtherFighterProfile = () => {
  const following = useFollowed()?.followed;
  const dispatch = useDispatch();
  const [sendShowSurpriseModal, setSendShowSurpriseModal] = useState(false);
  const categories = useCategory();
  const [searchParams, setSearchParams] = useSearchParams();
  const [fighterData, setFighterData] = useState({
    data: {},
    status: "",
    message: "",
  });
  const token = JSON.parse(useAuth()?.token);
  const userName = useParams()?.userName;
  const { globalLoading, startGloablLoading, stopGlobalLoading } = useLoading();

  const [goals, setGoals] = useState([
    {
      name: "Gloves",
      price: "CA$200.00",
      goalImg: ProductGoal,
      ProgessBar: true,
      frequency: "Daily",
      id: 636,
    },
    {
      name: "Everyday Coffee",
      price: "CA$200.00",
      goalImg: Massage,
      ProgessBar: false,
      id: 285,
    },
    {
      name: "dubmbels",
      price: "CA$200.00",
      goalImg: dubmbels,
      ProgessBar: true,
      frequency: "Monthly",
      id: 493,
    },
  ]);
  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    let active = goals;
    let add;
    add = active[source.index];
    active.splice(source.index, 1);
    active.splice(destination.index, 0, add);

    setGoals(active);
  };

  // this function is used to fetched the fighter data
  const loadFighterData = async () => {
    startGloablLoading();
    try {
      const res = await userApi.getFitherDetails(
        token,
        userName,
        searchParams.get("sort") || "",
        searchParams.get("category") || ""
      );

      // console.log(res);

      if (res?.status === 200) {
        setFighterData({
          data: res?.data?.data[0],
          status: "success",
          message: res?.data?.message,
        });
      }
    } catch (e) {
      if (e?.response?.status === 401) {
        toast.error(e?.response?.data?.message);
        setFighterData({
          data: {},
          status: "error",
          message: e?.response?.data?.message,
        });
      }
      if (e?.response?.status === 500) {
        toast.error(e?.response?.data?.message);
        setFighterData({
          data: {},
          status: "error",
          message: e?.response?.data?.message,
        });
      }
    } finally {
      stopGlobalLoading();
    }
  };

  function handleFilter(filterType, value) {
    setSearchParams((prev) => {
      if (filterType === "price-sort") {
        prev.set("sort", value);
      } else {
        prev.set("category", value);
      }
      return prev;
    });
  }

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
    loadFighterData();
  }, [userName, searchParams.get("sort"), searchParams.get("category")]);

  return (
    <>
      <main className="main-content mt-2">
        <div className="row">
          <div className="col-md-12 col-sm-12 col-xs-12 col-lg-12">
            <div className="tile">
              <div className="tile-content">
                <div className="user-banner-image">
                  <img
                    loading="lazy"
                    alt="banner"
                    src={
                      fighterData?.data?.bannerImage
                        ? `${imgBasePath}/${fighterData?.data?.bannerImage}`
                        : "https://cdn.builder.io/api/v1/image/assets/TEMP/ce2fa3ea-01f4-4d9e-abfc-255dccdd8f17?apiKey=a05c6109e97c4bde98e757ca99d37c45&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/ce2fa3ea-01f4-4d9e-abfc-255dccdd8f17?apiKey=a05c6109e97c4bde98e757ca99d37c45&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/ce2fa3ea-01f4-4d9e-abfc-255dccdd8f17?apiKey=a05c6109e97c4bde98e757ca99d37c45&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/ce2fa3ea-01f4-4d9e-abfc-255dccdd8f17?apiKey=a05c6109e97c4bde98e757ca99d37c45&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/ce2fa3ea-01f4-4d9e-abfc-255dccdd8f17?apiKey=a05c6109e97c4bde98e757ca99d37c45&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/ce2fa3ea-01f4-4d9e-abfc-255dccdd8f17?apiKey=a05c6109e97c4bde98e757ca99d37c45&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/ce2fa3ea-01f4-4d9e-abfc-255dccdd8f17?apiKey=a05c6109e97c4bde98e757ca99d37c45&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/ce2fa3ea-01f4-4d9e-abfc-255dccdd8f17?apiKey=a05c6109e97c4bde98e757ca99d37c45&"
                    }
                    className="img u-banner"
                  />
                </div>

                <div className="user-profile-container">
                  <img
                    src={
                      fighterData?.data?.profileImage
                        ? `${imgBasePath}/${fighterData?.data?.profileImage}`
                        : "https://media.istockphoto.com/id/1268292259/photo/asian-woman-smile-take-selfie.jpg?s=612x612&w=0&k=20&c=9wN1RoksDOiBCgp3OxnK1T1W8Jz9zT83dvtfU0d0Z8E="
                    }
                    alt="profil-pic"
                  />
                </div>
                <div className="user-info">
                  <div className="user-content">
                    <div className="user-details">
                      <div className="user-name sec-head">
                        {fighterData?.data?.firstName}{" "}
                        {fighterData?.data?.lastName}
                      </div>
                      <div className="user-handle">
                        {fighterData?.data?.userName}
                      </div>
                      <div className="user-link profile-details">
                        https://www.fightcompanion.io/{" "}
                        {fighterData?.data?.userName}
                      </div>
                      <div className="promotion-company profile-details">
                        Fight Promation Company:{" "}
                        {fighterData?.data?.promotionCompany}
                      </div>
                    </div>
                    <div className="profilelink-copy-btn">
                      <IoCopyOutline
                        className="img-2"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `https://www.fightcompanion.io/
                        ${fighterData?.data?.userName}`
                          );
                          toast.info("Copied to clipboard");
                        }}
                      />
                    </div>
                  </div>
                  <div className="log-user-info-right">
                    <div className="fighter-top text-end">
                      {following?.some(
                        (localElement) =>
                          localElement?._id === fighterData?.data?._id
                      ) ? (
                        <button
                          className="follow-button fav-btn"
                          disabled={globalLoading}
                          onClick={() =>
                            followUnfollow(fighterData?.data?._id, "unfollow")
                          }
                        >
                          Following
                        </button>
                      ) : (
                        <button
                          className="follow-button fav-btn"
                          disabled={globalLoading}
                          onClick={() =>
                            followUnfollow(fighterData?.data?._id, "follow")
                          }
                        >
                          Follow
                        </button>
                      )}
                    </div>
                    <div className="fighter-bottom d-flex gap-2 flex-column">
                      <div className="d-flex align-items-center gap-1">
                        <FaRegCalendarAlt size={23} /> Joined{" "}
                        {castDate(fighterData?.data?.createdAt)}
                      </div>
                      <div className="d-flex gap-1 align-items-center justify-content-end">
                        {fighterData?.data?.socialLinks?.map((link) => (
                          <Link to={link?.link} key={link._id} target="_blank">
                            {getSocialIcon(link?.platform)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="filter-goal">
                <div className="surprise-goal">
                  <button
                    className="follow-button fav-btn"
                    onClick={() => setSendShowSurpriseModal(true)}
                  >
                    Send Surprise
                  </button>
                  <div className="filterLeft ">
                    <div className="filterLeft ">
                      <div className="dropdown">
                        <div
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          className="category-btn sub-btn-fonts"
                          role="button"
                        >
                          Category
                        </div>
                        <ul className="dropdown-menu category-dropdown">
                          {categories?.map((element) => (
                            <li
                              className="dropdown-item"
                              key={element?._id}
                              role="button"
                              onClick={() =>
                                handleFilter("category", element?.categoryName)
                              }
                            >
                              {element.categoryName}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="dropdown">
                        <div
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {filterIcon}
                        </div>
                        <ul className="dropdown-menu category-dropdown">
                          <li
                            className="dropdown-item"
                            role="button"
                            onClick={(e) =>
                              handleFilter("price-sort", e?.target?.innerHTML)
                            }
                          >
                            Default
                          </li>
                          <li
                            className="dropdown-item"
                            role="button"
                            onClick={(e) =>
                              handleFilter("price-sort", "High to Low")
                            }
                          >
                            Price: High to Low
                          </li>
                          <li
                            className="dropdown-item"
                            role="button"
                            onClick={(e) =>
                              handleFilter("price-sort", "Low to High")
                            }
                          >
                            Price: Low to High
                          </li>
                          <li
                            className="dropdown-item"
                            role="button"
                            onClick={(e) =>
                              handleFilter("price-sort", e?.target?.innerHTML)
                            }
                          >
                            Most Recent
                          </li>
                          <li
                            className="dropdown-item"
                            role="button"
                            onClick={(e) =>
                              handleFilter("price-sort", e?.target?.innerHTML)
                            }
                          >
                            Oldest
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          {/* card section-start */}

          <div className="col-md-12 col-sm-12 col-xs-12 col-lg-12">
            {fighterData?.data?.goals?.length > 0 && !globalLoading ? (
              <DragDropContext onDragEnd={onDragEnd}>
                <Goals
                  goals={fighterData?.data?.goals}
                  currency={fighterData?.data?.currency}
                />
              </DragDropContext>
            ) : (
              <div className="text-center">
                {" "}
                This fighter does not have any Goals
              </div>
            )}
          </div>

          <SendSurpriseModal
            sendShowSurpriseModal={sendShowSurpriseModal}
            setSendShowSurpriseModal={setSendShowSurpriseModal}
            surprisePrice={fighterData?.data?.surpriceContributionAmount}
            name={`${fighterData?.data?.firstName} ${fighterData?.data?.lastName}`}
            userId={fighterData?.data?._id}
            token={token}
          />
          {/* card section-end-here */}
        </div>
      </main>
      {globalLoading && (
        <div className="fighter-home-spinner">
          <Spinner animation="border" variant="danger" />
        </div>
      )}
    </>
  );
};

export default OtherFighterProfile;
