import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import { useLoading } from "../features/loadingHooks";
import { toast } from "react-toastify";
import { orderApi } from "../config/axiosUtils";
import defaultFighterImg from "../img/brand-logo.png";
import useAuth from "../services/useAuth";
import { Spinner } from "react-bootstrap";
import { TimeAndDate, imgBasePath, nextPaymentDate } from "../utils/Helper";
import { useSearchParams } from "react-router-dom";
import ChatModal from "./ChatModal";
import { io } from "socket.io-client";
const ENDPOINT = process.env.REACT_APP_SOCKET_API_URL;
var socket, selectedChatCompare;
const SubscriptionActivity = ({ token }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedChatActivity, setSelectedChatActivity] = useState();
  const [showChatModal, setshowChatModal] = useState(false);
  const auth = useAuth();
  const userId = JSON.parse(auth?.user)?._id;

  const [SurpriseTracker, setSurpriseTracker] = useState({
    data: [],
    status: "",
    message: "",
  });

  const { globalLoading, startGloablLoading, stopGlobalLoading } = useLoading();

  //function to handle open-hide modal
  function HandleOpenHideChatModal() {
    setshowChatModal((val) => !val);
  }
  const getSubActivity = async () => {
    try {
      startGloablLoading();
      const res = await orderApi.fetchActivity(
        token,
        searchParams.get("sending") || "",
        searchParams.get("receiving") || "",
        "surprise",
        ""
      );
      console.log("res the data", res);
      setSurpriseTracker({
        data: res?.data?.data,
        status: "success",
        message: "data fetched successfully",
      });
    } catch (e) {
      setSurpriseTracker({
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
    getSubActivity();
  }, [searchParams.get("receiving"), searchParams.get("sending")]);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", JSON.parse(auth?.user));
    socket.on("connected", () => {
      console.log("connection ");
    });
  }, []);

  return (
    <>
      <div className="subscription-drop-container">
        <div className="dropdown subscription-drop-down">
          <div type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="35"
              height="35"
              viewBox="0 0 35 35"
              fill="none"
            >
              <path
                d="M13.125 7.29182C12.7383 7.29182 12.3673 7.44547 12.0938 7.71896C11.8204 7.99245 11.6667 8.36338 11.6667 8.75016C11.6667 9.13693 11.8204 9.50786 12.0938 9.78135C12.3673 10.0548 12.7383 10.2085 13.125 10.2085C13.5118 10.2085 13.8827 10.0548 14.1562 9.78135C14.4297 9.50786 14.5834 9.13693 14.5834 8.75016C14.5834 8.36338 14.4297 7.99245 14.1562 7.71896C13.8827 7.44547 13.5118 7.29182 13.125 7.29182ZM8.99796 7.29182C9.29925 6.43792 9.85799 5.6985 10.5972 5.17547C11.3363 4.65245 12.2195 4.37158 13.125 4.37158C14.0305 4.37158 14.9137 4.65245 15.6529 5.17547C16.3921 5.6985 16.9508 6.43792 17.2521 7.29182H27.7084C28.0951 7.29182 28.4661 7.44547 28.7396 7.71896C29.0131 7.99245 29.1667 8.36338 29.1667 8.75016C29.1667 9.13693 29.0131 9.50786 28.7396 9.78135C28.4661 10.0548 28.0951 10.2085 27.7084 10.2085H17.2521C16.9508 11.0624 16.3921 11.8018 15.6529 12.3248C14.9137 12.8479 14.0305 13.1287 13.125 13.1287C12.2195 13.1287 11.3363 12.8479 10.5972 12.3248C9.85799 11.8018 9.29925 11.0624 8.99796 10.2085H7.29171C6.90493 10.2085 6.534 10.0548 6.26051 9.78135C5.98702 9.50786 5.83337 9.13693 5.83337 8.75016C5.83337 8.36338 5.98702 7.99245 6.26051 7.71896C6.534 7.44547 6.90493 7.29182 7.29171 7.29182H8.99796ZM21.875 16.0418C21.4883 16.0418 21.1173 16.1955 20.8438 16.469C20.5704 16.7424 20.4167 17.1134 20.4167 17.5002C20.4167 17.8869 20.5704 18.2579 20.8438 18.5314C21.1173 18.8048 21.4883 18.9585 21.875 18.9585C22.2618 18.9585 22.6327 18.8048 22.9062 18.5314C23.1797 18.2579 23.3334 17.8869 23.3334 17.5002C23.3334 17.1134 23.1797 16.7424 22.9062 16.469C22.6327 16.1955 22.2618 16.0418 21.875 16.0418ZM17.748 16.0418C18.0493 15.1879 18.608 14.4485 19.3472 13.9255C20.0863 13.4025 20.9695 13.1216 21.875 13.1216C22.7805 13.1216 23.6637 13.4025 24.4029 13.9255C25.1421 14.4485 25.7008 15.1879 26.0021 16.0418H27.7084C28.0951 16.0418 28.4661 16.1955 28.7396 16.469C29.0131 16.7424 29.1667 17.1134 29.1667 17.5002C29.1667 17.8869 29.0131 18.2579 28.7396 18.5314C28.4661 18.8048 28.0951 18.9585 27.7084 18.9585H26.0021C25.7008 19.8124 25.1421 20.5518 24.4029 21.0748C23.6637 21.5979 22.7805 21.8787 21.875 21.8787C20.9695 21.8787 20.0863 21.5979 19.3472 21.0748C18.608 20.5518 18.0493 19.8124 17.748 18.9585H7.29171C6.90493 18.9585 6.534 18.8048 6.26051 18.5314C5.98702 18.2579 5.83337 17.8869 5.83337 17.5002C5.83337 17.1134 5.98702 16.7424 6.26051 16.469C6.534 16.1955 6.90493 16.0418 7.29171 16.0418H17.748ZM13.125 24.7918C12.7383 24.7918 12.3673 24.9455 12.0938 25.219C11.8204 25.4924 11.6667 25.8634 11.6667 26.2502C11.6667 26.6369 11.8204 27.0079 12.0938 27.2814C12.3673 27.5548 12.7383 27.7085 13.125 27.7085C13.5118 27.7085 13.8827 27.5548 14.1562 27.2814C14.4297 27.0079 14.5834 26.6369 14.5834 26.2502C14.5834 25.8634 14.4297 25.4924 14.1562 25.219C13.8827 24.9455 13.5118 24.7918 13.125 24.7918ZM8.99796 24.7918C9.29925 23.9379 9.85799 23.1985 10.5972 22.6755C11.3363 22.1525 12.2195 21.8716 13.125 21.8716C14.0305 21.8716 14.9137 22.1525 15.6529 22.6755C16.3921 23.1985 16.9508 23.9379 17.2521 24.7918H27.7084C28.0951 24.7918 28.4661 24.9455 28.7396 25.219C29.0131 25.4924 29.1667 25.8634 29.1667 26.2502C29.1667 26.6369 29.0131 27.0079 28.7396 27.2814C28.4661 27.5548 28.0951 27.7085 27.7084 27.7085H17.2521C16.9508 28.5624 16.3921 29.3018 15.6529 29.8248C14.9137 30.3479 14.0305 30.6287 13.125 30.6287C12.2195 30.6287 11.3363 30.3479 10.5972 29.8248C9.85799 29.3018 9.29925 28.5624 8.99796 27.7085H7.29171C6.90493 27.7085 6.534 27.5548 6.26051 27.2814C5.98702 27.0079 5.83337 26.6369 5.83337 26.2502C5.83337 25.8634 5.98702 25.4924 6.26051 25.219C6.534 24.9455 6.90493 24.7918 7.29171 24.7918H8.99796Z"
                fill="black"
              />
            </svg>
          </div>
          <ul className="dropdown-menu subscription-drop-down-list">
            <li role="button" onClick={() => setSearchParams({ all: "all" })}>
              <span className="dropdown-item">All</span>
            </li>
            <li
              role="button"
              onClick={() => setSearchParams({ sending: userId })}
            >
              <span className="dropdown-item">Sending</span>
            </li>
            <li
              role="button"
              onClick={() => setSearchParams({ receiving: userId })}
            >
              <span className="dropdown-item">Receiving</span>
            </li>
          </ul>
        </div>
      </div>
      {SurpriseTracker?.data?.map((subActivity, index) => (
        <div className="goal-subscription-content" key={subActivity?._id}>
          {/* today goal section */}
          <div className="today-goal-section">
            {/* service head  - today*/}
            <div className="service-label my-4">
              <div className="line-after">
                <span className="text-capitalize">
                  {TimeAndDate(subActivity?.createdAt, "date")}
                </span>
              </div>
            </div>
            {/* service profile */}
            <Accordion defaultActiveKey={[index]} alwaysOpen>
              <Accordion.Item eventKey={index}>
                {/* fighter accordian header */}
                <Accordion.Header>
                  <div className="fighter-card">
                    <img
                      // loading="lazy"
                      src={
                        subActivity?.fighterId?.profileImage
                          ? `${imgBasePath}/${subActivity?.fighterId?.profileImage}`
                          : defaultFighterImg
                      }
                      className="fighter-image"
                      alt="profile"
                    />
                    <div className="fighter-details">
                      <div className="fighter-name">
                        {subActivity?.fighterId?.firstName +
                          " " +
                          subActivity?.fighterId?.lastName}
                      </div>
                      <div className="fighter-info">
                        [{TimeAndDate(subActivity?.createdAt, "time")}]
                        {/* - [{subActivity?.goalId?.goalName}] */}
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
                          subActivity?.goalId?.goalImage
                            ? `${imgBasePath}/${subActivity?.goalId?.goalImage}`
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
                            {subActivity?.orderId}
                          </span>
                        </h6>
                      </div>
                      {/* estimate cost  */}
                      <div className="c-est-card">
                        <span className="cost-n">
                          <small className="est">Est. </small>
                          {subActivity?.currency} ${" "}
                          {parseFloat(subActivity?.TotalAmount)?.toFixed(2)}
                        </span>
                      </div>
                      <div className="subs-type mt-1">
                        <h6>
                          <strong>Surprise</strong>{" "}
                          <span className="badge rounded-pill text-dark bg-light">
                            {subActivity?.goalId?.subscriptionType}
                          </span>
                        </h6>
                      </div>
                      {/* recieve amount precentage */}
                      <div className="next-pay">
                        {subActivity?.goalId?.subscriptionType && (
                          <p>
                            Next payment expected by{" "}
                            {nextPaymentDate(
                              subActivity?.createdAt,
                              subActivity?.goalId?.subscriptionType
                            )}
                            &nbsp;{TimeAndDate(subActivity?.createdAt, "time")}
                          </p>
                        )}
                      </div>
                      {/* post on x  */}
                      <div className="x-post-btn d-flex">
                        {subActivity?.userId !== userId && (
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
                          onClick={() => {
                            setSelectedChatActivity(subActivity?._id);
                            HandleOpenHideChatModal();
                          }}
                          className="view-msg link-text"
                          type="btn"
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
                        {subActivity?.userId === userId ? (
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
          </div>
        </div>
      ))}

      {globalLoading && (
        <div className="fighter-home-spinner">
          <Spinner animation="border" variant="danger" />
        </div>
      )}

      {selectedChatActivity && (
        <ChatModal
          showChatModal={showChatModal}
          setshowChatModal={setshowChatModal}
          selectedChatActivity={selectedChatActivity}
          setSelectedChatActivity={setSelectedChatActivity}
          user={JSON.parse(auth?.user)}
          token={token}
          socket={socket}
        />
      )}
    </>
  );
};

export default SubscriptionActivity;
