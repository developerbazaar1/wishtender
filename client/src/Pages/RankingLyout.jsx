import React from "react";
import { NavLink, Outlet } from "react-router-dom";

import TopSection from "../components/TopSection";

const RankingLyout = () => {
  return (
    <main className="main-content">
      <TopSection title={"Rankings"} />
      {/* section for ranking content */}
      <section className="acttivities-content">
        <div className="row justify-content-center">
          <div className="col-md-11 col-sm-12 col-xs-12 col-lg-11 position-relative">
            <div className="activity-nav mb-3">
              <NavLink
                className={`text-decoration-none goal-activity-tab`}
                to={""}
                end
              >
                Monthly
              </NavLink>
              <NavLink
                className={`text-decoration-none sub-activity-tab`}
                to="quartely"
              >
                Quarterly
              </NavLink>
              <NavLink
                className={`text-decoration-none surprise-activity-tab`}
                to="yearly"
              >
                Yearly
              </NavLink>
            </div>
            <Outlet />
          </div>
        </div>
      </section>
    </main>
  );
};

export default RankingLyout;
