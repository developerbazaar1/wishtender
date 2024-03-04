import { Link, useLocation, useParams } from "react-router-dom";
import { useLoading } from "../../features/loadingHooks";
import { orderApi } from "../../config/axiosUtils";
import useAuth from "../../services/useAuth";
import { useEffect, useState } from "react";
import { RankingIterval, imgBasePath } from "../../utils/Helper";
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";

export default function RankingPage() {
  const { globalLoading, startGloablLoading, stopGlobalLoading } = useLoading();
  const [rankingData, setRankingData] = useState({
    fighters: [],
    status: "",
    message: "",
  });
  const location = useLocation();
  const time = RankingIterval(location.pathname);

  const token = useAuth().token;
  async function fetchRanking() {
    try {
      startGloablLoading();

      const res = await orderApi.fetchRanking(JSON.parse(token), time);
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
  }, [time]);

  return (
    <>
      <div className="ranking-content-area">
        {/* ranking content start from here */}
        {/* ranking card 01 */}

        {rankingData?.fighters?.map((fighter, index) => (
          <div to="#" className="select-fighter" key={fighter._id}>
            <div className="fighter-card mb-3">
              <Link to={`/fighter/${fighter?.userName}`}>
                <img
                  // loading="lazy"
                  src={
                    fighter?.profileImage
                      ? `${imgBasePath}/${fighter?.profileImage}`
                      : "https://media.istockphoto.com/id/1268292259/photo/asian-woman-smile-take-selfie.jpg?s=612x612&w=0&k=20&c=9wN1RoksDOiBCgp3OxnK1T1W8Jz9zT83dvtfU0d0Z8E="
                  }
                  className="fighter-image"
                  alt="profile"
                />
              </Link>
              <div className="fighter-details">
                <div className="fighter-name">
                  {" "}
                  <Link
                    to={`/fighter/${fighter?.userName}`}
                    className="text-decoration-none text-black"
                  >
                    {fighter?.firstName} {fighter?.lastName}
                  </Link>{" "}
                </div>
                <div className="fighter-info">
                  [{" "}
                  <Link
                    to={`/fighter/${fighter?.userName}`}
                    className="text-decoration-none text-black"
                  >
                    {fighter?.userName} ]
                  </Link>{" "}
                  - [{fighter?.promotionCompany}]
                </div>
              </div>
              <span className="cs-rank">#{index + 1}</span>
            </div>
          </div>
        ))}

        {rankingData?.status === "success" ||
          ("error" && !globalLoading && (
            <h5 className="text-center mt-5">
              Ranking is not available right now, try again later!
            </h5>
          ))}
      </div>

      {globalLoading && (
        <div className="fighter-home-spinner">
          <Spinner animation="border" variant="danger" />
        </div>
      )}
    </>
  );
}
