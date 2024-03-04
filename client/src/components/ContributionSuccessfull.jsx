import groupIcon from "../svgfile/group.svg";

export default function ContributionSuccessfull() {
  return (
    <div className="checkout-done">
      <img
        className="success-checkout-icon"
        loading="lazy"
        alt=""
        src={groupIcon}
      />
      <b className="contribution-successful">Contribution Successful!</b>
    </div>
  );
}
