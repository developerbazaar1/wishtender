import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import { orderApi } from "../config/axiosUtils";
import { toast } from "react-toastify";
import { useLoading } from "../features/loadingHooks";
import { Spinner } from "react-bootstrap";
import { TimeAndDate, imgBasePath } from "../utils/Helper";
import defaultFighterImg from "../img/brand-logo.png";
import useAuth from "../services/useAuth";
import ChatModal from "./ChatModal";
const GoalActivity = ({ token }) => {
  const auth = useAuth();
  const [showChatModal, setshowChatModal] = useState(false);
  const userId = JSON.parse(auth?.user)?._id;

  const [goalTrackers, setGoalTrackers] = useState({
    data: [],
    status: "",
    message: "",
  });
  const { globalLoading, startGloablLoading, stopGlobalLoading } = useLoading();
  const getGoalActivity = async () => {
    try {
      startGloablLoading();
      const res = await orderApi.fetchActivity(token);
      console.log(res);
      setGoalTrackers({
        data: res?.data?.data,
        status: "success",
        message: "successfully Fetched data",
      });
    } catch (e) {
      setGoalTrackers({
        data: [],
        status: "success",
        message: e?.response?.data?.message || e?.response?.data?.error,
      });
      toast.error(e?.response?.data?.message || e?.response?.data?.error);
    } finally {
      stopGlobalLoading();
    }
  };

  useEffect(() => {
    getGoalActivity();
  }, []);

  console.log(goalTrackers?.data);

  return (
    <div className="goal-tracker-content">
      {/* today goal section */}

      {goalTrackers?.data?.map((goalActivity, index) => (
        <div className="today-goal-section" key={goalActivity?._id}>
          {/* service tittle  - today*/}
          <div className="service-label my-4">
            <div className="line-after">
              <span className="text-capitalize">
                {TimeAndDate(goalActivity?.createdAt, "date")}
              </span>
            </div>
          </div>
          {/* service Accordian 01*/}
          <Accordion defaultActiveKey={[index]} alwaysOpen>
            <Accordion.Item eventKey={index}>
              {/* fighter accordian header */}
              <Accordion.Header>
                <div className="fighter-card">
                  <img
                    // loading="lazy"
                    src={
                      goalActivity?.creatorId?.profileImage
                        ? `${imgBasePath}/${goalActivity?.creatorId?.profileImage}`
                        : defaultFighterImg
                    }
                    className="fighter-image"
                    alt="profile"
                  />
                  <div className="fighter-details">
                    <div className="fighter-name">
                      {goalActivity?.creatorId?.firstName +
                        " " +
                        goalActivity?.creatorId?.lastName}
                    </div>
                    <div className="fighter-info">
                      [{TimeAndDate(goalActivity?.createdAt, "time")}] - [
                      {goalActivity?.goalId?.goalName}]
                    </div>
                  </div>
                </div>
              </Accordion.Header>
              {/* fighter accordian header */}
              {/* accordian body start from here */}
              <Accordion.Body>
                <div className="fighter-card-body d-flex">
                  {/* produnct image */}
                  <div className="pr-image">
                    <img
                      className="f-subs-thumbnail"
                      src={
                        goalActivity?.goalId?.goalImage
                          ? `${imgBasePath}/${goalActivity?.goalId?.goalImage}`
                          : defaultFighterImg
                      }
                      alt="loading"
                    ></img>
                  </div>
                  {/* description of card */}
                  <div className="acc-description">
                    {/* order id */}
                    <div className="order-id">
                      <h6>
                        <strong>Order ID </strong>
                        <span className="order-name">
                          {goalActivity?.orderId}
                        </span>
                      </h6>
                    </div>
                    {/* estimate cost  */}
                    <div className="c-est-card">
                      <span className="cost-n">
                        <small className="est">Est. </small>
                        {goalActivity?.currency} ${" "}
                        {parseFloat(goalActivity?.TotalAmount)?.toFixed(2)}
                      </span>
                    </div>
                    {/* recieve amount precentage */}

                    {goalActivity?.goalId?.goalType === "crowd" &&
                      goalActivity?.userId !== userId && (
                        <div className="recv-per">
                          <p>Your goal is now 96.35% funded</p>
                        </div>
                      )}
                    {/* post on x  */}
                    <div className="x-post-btn d-flex">
                      {goalActivity?.userId !== userId && (
                        <Link
                          to="#"
                          className="x-post-btn link-text"
                          type="btn"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 136 136"
                          >
                            <path d="M75.916 54.2L122.542 0h-11.05L71.008 47.06L38.672 0H1.376l48.898 71.164L1.376 128h11.05L55.18 78.303L89.328 128h37.296L75.913 54.2ZM60.782 71.79l-4.955-7.086l-39.42-56.386h16.972L65.19 53.824l4.954 7.086l41.353 59.15h-16.97L60.782 71.793Z" />
                          </svg>
                          <span className="mx-1">Post</span>
                        </Link>
                      )}
                      &nbsp;
                      {/* link 02 fpr message */}
                      <button
                        to="#"
                        className="view-msg link-text"
                        type="btn"
                        onClick={() => setshowChatModal(true)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="26"
                          height="26"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M8 9.5A1.25 1.25 0 1 0 8 12a1.25 1.25 0 0 0 0-2.5Zm4 0a1.25 1.25 0 1 0 0 2.5a1.25 1.25 0 0 0 0-2.5Zm2.75 1.25a1.25 1.25 0 1 1 2.5 0a1.25 1.25 0 0 1-2.5 0Z"
                          />
                          <path
                            fill="currentColor"
                            fillRule="evenodd"
                            d="M16.1 4.593a50.577 50.577 0 0 0-8.098-.04l-.193.015A4.93 4.93 0 0 0 3.25 9.483V18a.75.75 0 0 0 1.105.66l3.91-2.101a1.25 1.25 0 0 1 .593-.149h8.976c1.132 0 2.102-.81 2.305-1.923c.412-2.257.444-4.567.096-6.835l-.102-.669a2.666 2.666 0 0 0-2.408-2.252L16.1 4.593ZM8.116 6.049a49.078 49.078 0 0 1 7.858.038l1.624.139c.536.046.972.453 1.053.985l.103.668a19.165 19.165 0 0 1-.09 6.339a.843.843 0 0 1-.829.692H8.858a2.75 2.75 0 0 0-1.302.328L4.75 16.746V9.483a3.43 3.43 0 0 1 3.171-3.42l.194-.014Z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="mx-1">Messages</span>
                      </button>
                    </div>
                  </div>
                  <div className="gift-status text-end">
                    <span className="goal-amt-status complete-goal">
                      {/* Recieved */}
                      {goalActivity?.userId === userId ? (
                        <span className="text-black">Sent</span>
                      ) : (
                        <span className="text-success">Recieved</span>
                      )}
                    </span>
                  </div>
                </div>
              </Accordion.Body>
              {/* accordian body end  here */}
            </Accordion.Item>
          </Accordion>
          {/* service accordian end */}
        </div>
      ))}
      {globalLoading && (
        <div className="fighter-home-spinner">
          <Spinner animation="border" variant="danger" />
        </div>
      )}

      <ChatModal
        showChatModal={showChatModal}
        setshowChatModal={setshowChatModal}
      />
    </div>
  );
};

export default GoalActivity;
