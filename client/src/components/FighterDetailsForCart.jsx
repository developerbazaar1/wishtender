import React from "react";

const FighterDetailsForCart = ({ wisher }) => {
  return (
    <div className="row justify-content-center">
      <div className="col-md-12 col-sm-12 col-xs-12 col-lg-12">
        <div className="cart-detail">
          <div className="fighter-name">
            <h6 className="user-call">
              {wisher?.FirstName} {wisher?.LastName}{" "}
              <span className="Goal">goals</span>
            </h6>
            <p className="user-recall">
              You are about to contribute to{" "}
              <strong>
                {wisher?.FirstName} {wisher?.LastName}
              </strong>{" "}
              Goals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FighterDetailsForCart;
