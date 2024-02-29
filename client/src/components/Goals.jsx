import React from "react";
import LocaProgressBar from "./ProgressBar";
import { Link } from "react-router-dom";
import { AiOutlineLink } from "react-icons/ai";
import { FaXTwitter } from "react-icons/fa6";
import { DragButton } from "../elements/dragButton";

import { Draggable, Droppable } from "react-beautiful-dnd";
import { imgBasePath } from "../utils/Helper";

const Goals = ({ goals, currency }) => {
  return (
    <Droppable droppableId="goalCard" direction="horizontal">
      {(provided, snapshot) => (
        <section
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="goal-card-section"
        >
          {goals?.map((goal, index) => (
            <Draggable
              key={goal?._id}
              draggableId={goal?._id?.toString()}
              index={index}
            >
              {(provided) => (
                <div
                  className="card goal-card"
                  {...provided.dragHandleProps}
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                >
                  <Link
                    to="/fighter/goal-detail"
                    state={{ goalId: goal?._id }}
                    style={{
                      textDecoration: "none",
                    }}
                  >
                    <div className="goal-car-img">
                      {/* card-drag-con start */}
                      <div className="card-drag-icon">{DragButton}</div>
                      {/* card-drag-con end */}
                      <img
                        src={`${imgBasePath}/${goal?.goalImage}`}
                        className="card-img-top"
                        alt="loading"
                      />
                    </div>
                    <div className="card-body">
                      <h5 className="goal-title">{goal?.goalName}</h5>
                      <div className="price-plan-subscription">
                        <h5 className="goal-price-typo">
                          {goal?.userData?.currency || currency}$
                          {parseFloat(goal?.goalPrice).toFixed(2)}
                          <i
                            className="fa fs-6 pointer ms-1"
                            role="button"
                            title={
                              "Estimated Conversion From USD $" +
                              parseFloat(goal?.goalPrice).toFixed(2)
                            }
                          >
                            &#xf059;
                          </i>
                        </h5>
                        {goal?.subscriptionType && (
                          <button className="freq-btn medium-typo">
                            {goal?.subscriptionType}
                          </button>
                        )}
                      </div>
                      <div>
                        {goal?.goalType === "crowd" && (
                          <div className="goal-progressbar">
                            <LocaProgressBar />
                          </div>
                        )}

                        <div className="goal-links">
                          <Link className="text-dark">
                            <AiOutlineLink size={20} />
                          </Link>
                          <Link
                            to={`https://www.twitter.com`}
                            target="_blank"
                            className="d-flex  text-dark text-dec-non x-postbtn"
                          >
                            <FaXTwitter size={22} />
                            Post
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </section>
      )}
    </Droppable>
  );
};

export default Goals;
