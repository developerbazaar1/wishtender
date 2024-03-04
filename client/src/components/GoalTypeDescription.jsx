import { FundedPercentage } from "../utils/Helper";
import LocaProgressBar from "./ProgressBar";

export const GoalCrowdDescription = ({
  goals,
  register,
  clearError,
  errors,
}) => {
  const totalPercentage = FundedPercentage(
    goals.TotalCrowdFunded,
    goals?.goalPrice
  );
  return (
    <div className="subscription-details mt-4">
      <div className="goal-progressbar">
        <LocaProgressBar totalPercent={totalPercentage} />
      </div>
      <div className="divii-5">
        <div className="divii-6">
          <div className="divii-7">{totalPercentage || 20}%</div>
          <div className="divii-8">Granted</div>
        </div>

        <div className="divii-9">
          <div className="divii-10">Est.</div>
          <div className="divii-11">
            {goals?.currencyDetails?.currency} $
            {parseFloat(goals?.goalPrice).toFixed(2)}{" "}
            <i
              className="fa fs-6 pointer"
              role="button"
              title={
                "Estimated Conversion From USD $" +
                parseFloat(goals?.goalPrice).toFixed(2)
              }
            >
              &#xf059;
            </i>
          </div>
        </div>
      </div>
      <div className="crowd-contribution-amount">
        <input
          type="text"
          id="Amount"
          className={`${errors?.amount ? "error-border-profile" : null}`}
          placeholder="$ Enter Your Amount"
          {...register("amount")}
          inputMode="numeric"
          autoComplete="off"
          autoFocus={true}
          onInput={(e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, "");
          }}
        />
        {<p className="profile-error-message">{errors?.amount?.message}</p>}
      </div>
    </div>
  );
};

// Goal description of subscription
export const GoalSubDescription = ({ goals }) => {
  return (
    <>
      <div className="goal-sub-desc-container">
        <div className="divii-9">
          <div className="divii-10">Est.</div>
          <div className="divii-11">
            <span className="currency">{goals?.currencyDetails?.currency}</span>{" "}
            ${parseFloat(goals?.goalPrice).toFixed(2)}{" "}
            <i
              className="fa fs-6 pointer"
              role="button"
              title={
                "Estimated Conversion From USD $" +
                parseFloat(goals?.goalPrice).toFixed(2)
              }
            >
              &#xf059;
            </i>
          </div>
        </div>
        <div className="goal-subdescription">
          <h5 className="mb-0 subscription-head">Subscription: </h5>{" "}
          <span
            className="badge text-bg-light border border-dark rounded-pill py-2"
            role="button"
          >
            {goals?.subscriptionType}
          </span>
        </div>
      </div>
    </>
  );
};

// Goal description of single goal
export const GoalSingleDescription = ({ goals }) => {
  return (
    <>
      <div className="goal-sub-desc-container">
        <div className="divii-9">
          <div className="divii-10">Est.</div>
          <div className="divii-11">
            <span className="currency">{goals?.currencyDetails?.currency}</span>{" "}
            ${parseFloat(goals?.goalPrice).toFixed(2)}{" "}
            <i
              className="fa fs-6 pointer"
              role="button"
              title={
                "Estimated Conversion From USD $" +
                parseFloat(goals?.goalPrice).toFixed(2)
              }
            >
              &#xf059;
            </i>
          </div>
        </div>
      </div>
    </>
  );
};

//function to convert from currency into currency symbol.
const getCurrencySymbol = (currencyName) => {
  try {
    const currencyFormatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyName,
    });
    const currencySymbol = currencyFormatter
      .formatToParts(0)
      .find((part) => part.type === "currency").value;
    return currencySymbol;
  } catch (error) {
    console.error("Error retrieving currency symbol:", error);
    return null;
  }
};
