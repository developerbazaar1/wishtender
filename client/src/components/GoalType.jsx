import React, { useState } from "react";

const GoalType = ({ register, watch, errors }) => {
  const [goalTypeClicked, setGoalTypeClicked] = useState(false);

  const selectedGoalType = watch("goalType");
  return (
    <div className="form-group text-left mb-2">
      <label
        className={`form-head mb-2 goaldropdownBtn form-control ${
          errors?.goalType ? "error-border-profile" : ""
        }`}
        type="button"
        onClick={() => setGoalTypeClicked(!goalTypeClicked)}
      >
        Goal Type
      </label>

      {goalTypeClicked && (
        <div className="goal-container">
          {/* single goal container */}
          <div className="single-goal-cont">
            <div className="goal-select-grp">
              <input
                type="radio"
                name="goalType"
                id="singleGoal"
                value="single"
                {...register("goalType", {
                  required: {
                    value: true,
                    message: "Please select a goal type",
                  },
                })}
              />
              <label htmlFor="singleGoal" className="goal-price-typo">
                Single Goal
              </label>
            </div>
            {selectedGoalType === "single" && (
              <div className="single-goal-content">
                <input
                  type="checkbox"
                  id="repeatPurchase"
                  value="multiple"
                  {...register("goalPurchaseType", { defaultValue: "single" })}
                />
                <label htmlFor="repeatPurchase">
                  <span className="typo-grey-14">Allow Repeat Purchases</span>
                  <span className="typo-grey-12">
                    Check if you want the item to be bought again. Without
                    checking, it's gone after the first purchase
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* subscription-goal-container */}
          <div className="sub-goal-cont">
            <div className="goal-select-grp">
              <input
                type="radio"
                name="goalType"
                id="subscriptionGoal"
                value="subscription"
                {...register("goalType", {
                  required: {
                    value: true,
                    message: "Please select a goal type",
                  },
                })}
              />
              <label htmlFor="subscriptionGoal">Subscription</label>
            </div>
            {selectedGoalType === "subscription" && (
              <div className="sub-goal-content row">
                <div className="sub-left col-5">
                  <input
                    type="checkbox"
                    name="goalPurchaseType"
                    id="oneTime"
                    value="multiple"
                    {...register("goalPurchaseType")}
                  />
                  <label htmlFor="oneTime" className="typo-grey-14">
                    Allow One time Purchase
                  </label>
                </div>
                <div className="sub-right col-6">
                  <div className="sub-right-inputpgrp">
                    <input
                      type="radio"
                      name="subscriptionType"
                      value="Daily"
                      id="Daily"
                      {...register("subscriptionType")}
                    />
                    <label htmlFor="Daily" className="typo-grey-14">
                      Daily
                    </label>
                  </div>
                  <div className="sub-right-inputpgrp">
                    <input
                      type="radio"
                      name="subscriptionType"
                      value="Weekly"
                      id="Weekly"
                      {...register("subscriptionType")}
                    />
                    <label htmlFor="Weekly" className="typo-grey-14">
                      Weekly
                    </label>
                  </div>
                  <div className="sub-right-inputpgrp">
                    <input
                      type="radio"
                      name="subscriptionType"
                      value="Bi Weekly"
                      id="BiWeekly"
                      {...register("subscriptionType")}
                    />
                    <label htmlFor="BiWeekly" className="typo-grey-14">
                      Bi-Weekly
                    </label>
                  </div>
                  <div className="sub-right-inputpgrp">
                    <input
                      type="radio"
                      name="subscriptionType"
                      value="Monthly"
                      id="Monthly"
                      {...register("subscriptionType")}
                    />
                    <label htmlFor="Monthly" className="typo-grey-14">
                      Monthly
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* crowd-goal */}
          <div className="crowd-fund">
            <div className="goal-select-grp">
              <input
                type="radio"
                name="goalType"
                id="crowdFundGoal"
                value="crowd"
                {...register("goalType", {
                  required: {
                    value: true,
                    message: "Please select a goal type",
                  },
                })}
              />
              <label htmlFor="crowdFundGoal">Crowd Fund</label>
            </div>
            {selectedGoalType === "crowd" && (
              <label htmlFor="crowdFundGoal" className="typo-grey-14">
                Allows multiple fans to contribute to your goal.
              </label>
            )}
          </div>
        </div>
      )}

      <p className="profile-error-message">{errors?.goalType?.message}</p>
    </div>
  );
};

export default GoalType;
