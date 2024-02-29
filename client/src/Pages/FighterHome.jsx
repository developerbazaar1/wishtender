import React, { useEffect, useState } from "react";
import { IoCopyOutline } from "react-icons/io5";
import { FaFacebookF, FaRegCalendarAlt } from "react-icons/fa";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";
import { BiSolidPencil } from "react-icons/bi";
import { GoPencil } from "react-icons/go";
import profilePic from "../img/userProfile.png";
import { Link, useSearchParams } from "react-router-dom";
import SocialLinkModal1 from "../components/SocialLinkModal1";
import Goals from "../components/Goals";
import { DragDropContext } from "react-beautiful-dnd";
import ProductGoal from "../img/product-gloves.png";
import Massage from "../img/massage.png";
import dubmbels from "../img/dumbels.png";
import { fighterApi, userApi } from "../config/axiosUtils";
import useAuth from "../services/useAuth";
import { useLoading } from "../features/loadingHooks";
import { toast } from "react-toastify";
import { filterIcon } from "../elements/SvgElements";
import { useCategory } from "../features/categoryHooks.jsx";
import { Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import castDate, {
  castUpdateFormData,
  getSocialIcon,
  imgBasePath,
} from "../utils/Helper.js";
import { updateProfile } from "../features/authSlice.js";
import { useDispatch } from "react-redux";
// import SocialLinkModal2 from "../components/SocialLinkModal2";

const MainContent = () => {
  const categories = useCategory();
  const [searchParams, setSearchParams] = useSearchParams();
  const auth = useAuth();
  const user = JSON.parse(auth?.user);
  const dispatch = useDispatch();
  const [showSocilMdl1, setShowSocilMdl1] = useState(false);
  const [bannerpreveImage, setBannerPreviewImage] = useState(null);
  const [profileprevImage, setprofilePreviewImage] = useState(null);
  const [data, setData] = useState({
    goals: [],
    status: "",
    message: "",
  });
  const { globalLoading, startGloablLoading, stopGlobalLoading } = useLoading();

  const { register, watch } = useForm();

  const [goals, setGoals] = useState([
    {
      name: "Gloves",
      price: "CA$200.00",
      goalImg: ProductGoal,
      ProgessBar: true,
      frequency: "Daily",
      id: "136",
    },
    {
      name: "Everyday Coffee",
      price: "CA$200.00",
      goalImg: Massage,
      ProgessBar: false,
      id: "225",
    },
    {
      name: "dubmbels",
      price: "CA$200.00",
      goalImg: dubmbels,
      ProgessBar: true,
      frequency: "Monthly",
      id: "433",
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
    console.log("This is Drang and Drop result", result);
  };

  const handeProfileUpdate = async (e, caller) => {
    startGloablLoading();
    const file = e.target.files[0];
    let formData = new FormData();
    if (caller === "bannerImage") {
      setBannerPreviewImage(URL.createObjectURL(file));
      formData.append("bannerImage", file);
    } else {
      setprofilePreviewImage(URL.createObjectURL(file));
      formData.append("profileImage", file);
    }

    // return;

    try {
      const res = await userApi.updateProfile(
        formData,
        JSON.parse(auth?.token)
      );
      console.log(res?.data?.data);
      // return;
      if (res?.status === 200) {
        toast.success(res?.data?.message);
        dispatch(
          updateProfile({
            user: JSON.stringify(res?.data?.data),
          })
        );
        setBannerPreviewImage(null);
        setprofilePreviewImage(null);
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

  //function to load the user goals
  async function LoaderHomeData() {
    startGloablLoading();
    try {
      let token = JSON?.parse(auth?.token);
      const res = await fighterApi.fetchHomeData(
        token,
        searchParams.get("category") || "",
        searchParams.get("sort") || ""
      );

      if (res?.status === 200) {
        const { data, message, status } = res?.data;

        if (data?.length === 0) {
          setData({
            goals: [],
            message: message,
            status: status,
          });
          return;
        }

        setData({
          goals: data,
          message: message,
          status: status,
        });
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        toast.error(error?.response?.data?.message);
        return;
      }
      const { message } = error?.response?.data;
      // console.log(message);
      toast.error(message);
    } finally {
      stopGlobalLoading();
    }
  }

  //function to add filter data and type

  // console.log(watch("profileImage"));
  // console.log(watch("bannerImage"));

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

  useEffect(() => {
    LoaderHomeData();
  }, [searchParams.get("sort"), searchParams.get("category")]);

  return (
    <>
      <main className="main-content">
        <div className="row">
          <div className="col-md-12 col-sm-12 col-xs-12 col-lg-12">
            <div className="tile">
              <div className="tile-content">
                <div className="user-banner-image">
                  <img
                    loading="lazy"
                    alt="banner"
                    srcSet={
                      bannerpreveImage
                        ? bannerpreveImage
                        : user?.bannerImage
                        ? `${imgBasePath}/${user?.bannerImage}`
                        : "https://cdn.builder.io/api/v1/image/assets/TEMP/ce2fa3ea-01f4-4d9e-abfc-255dccdd8f17?apiKey=a05c6109e97c4bde98e757ca99d37c45&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/ce2fa3ea-01f4-4d9e-abfc-255dccdd8f17?apiKey=a05c6109e97c4bde98e757ca99d37c45&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/ce2fa3ea-01f4-4d9e-abfc-255dccdd8f17?apiKey=a05c6109e97c4bde98e757ca99d37c45&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/ce2fa3ea-01f4-4d9e-abfc-255dccdd8f17?apiKey=a05c6109e97c4bde98e757ca99d37c45&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/ce2fa3ea-01f4-4d9e-abfc-255dccdd8f17?apiKey=a05c6109e97c4bde98e757ca99d37c45&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/ce2fa3ea-01f4-4d9e-abfc-255dccdd8f17?apiKey=a05c6109e97c4bde98e757ca99d37c45&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/ce2fa3ea-01f4-4d9e-abfc-255dccdd8f17?apiKey=a05c6109e97c4bde98e757ca99d37c45&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/ce2fa3ea-01f4-4d9e-abfc-255dccdd8f17?apiKey=a05c6109e97c4bde98e757ca99d37c45&"
                    }
                    className="img u-banner"
                  />

                  <div className="banner-img-picker-background">
                    <div className="banner-img-picker">
                      <input
                        type="file"
                        multiple={false}
                        disabled={globalLoading}
                        onChange={(e) => handeProfileUpdate(e, "bannerImage")}
                      />
                      <span className="picker-icon typo-grey-16">
                        Edit
                        <BiSolidPencil size={21} color="white" />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="user-profile-container">
                  <img
                    src={
                      profileprevImage
                        ? profileprevImage
                        : user?.profileImage
                        ? `${imgBasePath}/${user?.profileImage}`
                        : profilePic
                    }
                    alt="profil-pic"
                  />
                  <div className="img-picker-container">
                    <input
                      type="file"
                      multiple={false}
                      onChange={(e) => handeProfileUpdate(e, "profileImage")}
                      disabled={globalLoading}
                    />

                    <span className="picker-icon">
                      Edit
                      <BiSolidPencil color="white" />
                    </span>
                  </div>
                </div>
                <div className="user-info">
                  <div className="user-content">
                    <div className="user-details">
                      <div className="user-name sec-head">
                        {user?.firstName} {user?.lastName}
                      </div>
                      <div className="user-handle">{user?.userName}</div>
                      <div className="user-link profile-details">
                        https://www.fightcompanion.io/aainsley
                      </div>
                      <div className="promotion-company profile-details">
                        Fight Promotion Company: {user?.promotionCompany}
                      </div>
                    </div>
                    <div className="profilelink-copy-btn">
                      <IoCopyOutline
                        className="img-2"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            "https://www.fightcompanion.io/aainsley"
                          );
                          toast.info("Copied to clipboard");
                        }}
                      />
                    </div>
                  </div>
                  <div className="log-user-info-right">
                    <div className="fighter-top text-end">
                      <Link to="favourite" className="follow-button fav-btn">
                        Favorites
                      </Link>
                    </div>
                    <div className="fighter-bottom d-flex gap-2 flex-column">
                      <div className="d-flex align-item-center gap-1">
                        <FaRegCalendarAlt size={23} /> Joined{" "}
                        {castDate(user?.createdAt)}
                      </div>

                      <div className="d-flex gap-1 align-items-center justify-content-end">
                        {user?.socialLinks?.map((link) => (
                          <Link to={link?.link} key={link._id} target="_blank">
                            {getSocialIcon(link?.platform)}
                          </Link>
                        ))}

                        {user?.socialLinks?.length === 0 ? (
                          <span
                            role="button"
                            className="text-decoration-underline"
                            onClick={() => setShowSocilMdl1(true)}
                          >
                            Add Social Links
                          </span>
                        ) : null}
                        <GoPencil
                          size={20}
                          className="social-picker"
                          onClick={() => setShowSocilMdl1(true)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="filter-goal">
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
                          key={element?._id}
                          className="dropdown-item"
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
                <div className="rightgoal all-btn">
                  <Link to="create-goal">Create Goal</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* card section-start */}

          {data?.goals?.length === 0 && !globalLoading ? (
            <div className="text-center">There is No Goal Found !</div>
          ) : (
            <div className="col-md-12 col-sm-12 col-xs-12 col-lg-12">
              <DragDropContext onDragEnd={onDragEnd}>
                <Goals goals={data?.goals} />
              </DragDropContext>
            </div>
          )}

          {/* card section-end-here */}
        </div>
      </main>
      <SocialLinkModal1
        showSocilMdl1={showSocilMdl1}
        setShowSocilMdl1={setShowSocilMdl1}
        socialLink={user?.socialLinks}
      />
      {globalLoading && (
        <div className="fighter-home-spinner">
          <Spinner animation="border" variant="danger" />
        </div>
      )}
    </>
  );
};

export default MainContent;
