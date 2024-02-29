import React from "react";
import { Tab } from "bootstrap";
import Tabs from "react-bootstrap/Tabs";
import TopSection from "../components/TopSection";
import GoalActivity from "../components/GoalActivity";
import SurpriseActivity from "../components/SurpriseActivity";
import SubscriptionActivity from "../components/SubscriptionActivity";
import useAuth from "../services/useAuth";
import { NavLink, Outlet } from "react-router-dom";

const ActivitiesFighter = () => {
  const token = JSON.parse(useAuth()?.token);
  return (
    <main className="main-content">
      <TopSection title={"Activities"} />
      {/* section for activities content */}
      <section className="acttivities-content">
        <div className="row justify-content-center">
          <div className="col-md-11 col-sm-12 col-xs-12 col-lg-11 position-relative">
            <div className="activity-nav">
              <NavLink
                className={`text-decoration-none goal-activity-tab`}
                to={""}
                end
              >
                Goal Tracker
              </NavLink>
              <NavLink
                className={`text-decoration-none sub-activity-tab`}
                to="subscriptions"
              >
                Subscriptions
              </NavLink>
              <NavLink
                className={`text-decoration-none surprise-activity-tab`}
                to="surprise"
              >
                Surprise
              </NavLink>
            </div>
            <Outlet />
          </div>
        </div>
      </section>
    </main>
  );
};

export default ActivitiesFighter;
