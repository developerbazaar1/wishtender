import React from "react";
import { Spinner } from "react-bootstrap";

const CustomSpinner = ({ status }) => {
  if (status) {
    return (
      <>
        <div className="custom-spinner-style">
          <Spinner animation="border" variant="danger" />
        </div>
      </>
    );
  }
  return null;
};

export default CustomSpinner;
