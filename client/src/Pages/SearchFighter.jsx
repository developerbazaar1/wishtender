import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useLoading } from "../features/loadingHooks";
import { userApi } from "../config/axiosUtils";
import useAuth from "../services/useAuth";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { imgBasePath } from "../utils/Helper";

const SearchFighter = () => {
  const { globalLoading, startGloablLoading, stopGlobalLoading } = useLoading();
  const [searchParams, setSearchParams] = useSearchParams("");
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [searchResult, setSearchResult] = useState({
    data: [],
    status: "",
    message: "",
  });
  const token = JSON.parse(useAuth()?.token);
  const fetchSearch = async () => {
    startGloablLoading();
    try {
      const res = await userApi.searchFighter(
        token,
        searchParams.get("query") || ""
      );
      console.log(res);
      if (res?.status === 200) {
        setSearchResult({
          data: res?.data?.data,
          status: "success",
          message: res?.data?.message,
        });
      }
    } catch (e) {
      if (e?.response?.status === 401) {
        toast.error(e?.response?.data?.message);
        setSearchResult({
          data: {},
          status: "error",
          message: e?.response?.data?.message,
        });
      }
      if (e?.response?.status === 500) {
        toast.error(e?.response?.data?.message);
        setSearchResult({
          data: {},
          status: "error",
          message: e?.response?.data?.message,
        });
      }

      console.log(e);
    } finally {
      stopGlobalLoading();
    }
  };

  function handleQuery(data) {
    console.log(data);
    setSearchParams({ query: data?.search });
  }

  useEffect(() => {
    fetchSearch();
  }, [searchParams.get("query")]);
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
                  <h5>Search </h5>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="search-content">
          {/* ROW START FROM HERE */}
          <div className="row justify-content-center">
            <div className="col-md-11 col-sm-12 col-xs-12 col-lg-11">
              <div className="search-wrapper">
                <form onSubmit={handleSubmit(handleQuery)}>
                  <div className="searchBar">
                    <input
                      id="search"
                      type="text"
                      name="search"
                      placeholder="Search"
                      {...register("search")}
                    />
                    <button id="search-btn" type="search">
                      <svg
                        style={{ width: "24px", height: "24px" }}
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#666666"
                          d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
                        />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
        <section className="search-content mt-3">
          <div className="row justify-content-center">
            <div className="col-md-11 col-lg-11 col-sm-12 col-xs-12">
              <div className="row">
                {/* Fighter content */}
                <div className="col-md-11 col-sm-12 col-xs-12 col-lg-11">
                  <div className="fighter-content-area">
                    {/* fighter card 01 */}

                    {searchResult?.data?.length === 0 && !globalLoading ? (
                      <div className="text-center">
                        NO Result Found With Search Query
                      </div>
                    ) : (
                      ""
                    )}

                    {searchResult?.data?.map((fighter) => (
                      <Link
                        to={`/fighter/${fighter?.userName}`}
                        className="select-fighter"
                        key={fighter._id}
                      >
                        <div className="fighter-card mb-3">
                          <img
                            // loading="lazy"
                            src={
                              fighter?.profileImage
                                ? `${imgBasePath}/${fighter.profileImage}`
                                : "https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg"
                            }
                            className="fighter-image"
                            alt="profile"
                          />
                          <div className="fighter-details">
                            <div className="fighter-name">
                              {fighter?.firstName} {fighter?.lastName}
                            </div>
                            <div className="fighter-info">
                              {fighter?.userName} {fighter?.promotionCompany}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
                {/* Sidebar for alphabetical search */}
                <div className="col-md-1 col-sm-12 col-xs-12 col-lg-1 f-bar">
                  <div className="alphabetical-search">
                    <ul className="alphabet-list">
                      {Array.from({ length: 26 }, (_, i) =>
                        String.fromCharCode(65 + i)
                      ).map((letter) => (
                        <li key={letter}>
                          <span
                            onClick={(e) => setSearchParams({ query: letter })}
                          >
                            {letter}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default SearchFighter;
