import React from "react";

const TotalPrice = ({ cartItem }) => {
  return (
    <>
      <div className="row justify-content-center mt-2 mb-4 message-tab">
        <div className="col-md-12 col-lg-11 col-sm-12 col-xs-11">
          <hr />
          <div className="">
            <div className="service-group row">
              <div className="col-6 text-end d-flex justify-content-end align-items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="19"
                  height="19"
                  viewBox="0 0 21 20"
                  fill="none"
                  className="me-1"
                >
                  <path
                    d="M10.2496 1.25C12.5705 1.25 14.7962 2.17194 16.4373 3.813C18.0783 5.45406 19.0003 7.67981 19.0003 10.0006C19.0003 12.3214 18.0783 14.5472 16.4373 16.1883C14.7962 17.8293 12.5705 18.7513 10.2496 18.7513C7.92884 18.7513 5.70308 17.8293 4.06202 16.1883C2.42096 14.5472 1.49902 12.3214 1.49902 10.0006C1.49902 7.67981 2.42096 5.45406 4.06202 3.813C5.70308 2.17194 7.92884 1.25 10.2496 1.25ZM11.5621 6.6225C12.2121 6.6225 12.7396 6.17125 12.7396 5.5025C12.7396 4.83375 12.2109 4.3825 11.5621 4.3825C10.9121 4.3825 10.3871 4.83375 10.3871 5.5025C10.3871 6.17125 10.9121 6.6225 11.5621 6.6225ZM11.7909 13.6562C11.7909 13.5225 11.8371 13.175 11.8109 12.9775L10.7834 14.16C10.5709 14.3837 10.3046 14.5387 10.1796 14.4975C10.1229 14.4766 10.0755 14.4362 10.046 14.3835C10.0164 14.3308 10.0066 14.2693 10.0184 14.21L11.7309 8.8C11.8709 8.11375 11.4859 7.4875 10.6696 7.4075C9.8084 7.4075 8.5409 8.28125 7.76965 9.39C7.76965 9.5225 7.74465 9.8525 7.7709 10.05L8.79715 8.86625C9.00965 8.645 9.25715 8.48875 9.38215 8.53125C9.44373 8.55335 9.4942 8.59872 9.52271 8.65762C9.55122 8.71651 9.55551 8.78423 9.53465 8.84625L7.83715 14.23C7.6409 14.86 8.01215 15.4775 8.91215 15.6175C10.2371 15.6175 11.0196 14.765 11.7921 13.6562H11.7909Z"
                    fill="#212121"
                  />
                </svg>
                <span className="amout-typography">Service Fee :</span>
              </div>
              <div className="col-6 d-flex align-items-center">
                <small className="est me-2">Est. </small>{" "}
                <span className="amout-typography">
                  CA${parseFloat(120)?.toFixed(2)}{" "}
                </span>{" "}
                <span
                  className="model mx-1"
                  role="button"
                  title={
                    "Estimated Conversion From USD $" +
                    parseFloat(120).toFixed(2)
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 21 20"
                    fill="none"
                  >
                    <path
                      d="M10.667 2.5C11.6519 2.5 12.6272 2.69399 13.5371 3.0709C14.4471 3.44781 15.2739 4.00026 15.9703 4.6967C16.6667 5.39314 17.2192 6.21993 17.5961 7.12987C17.973 8.03982 18.167 9.01509 18.167 10C18.167 10.9849 17.973 11.9602 17.5961 12.8701C17.2192 13.7801 16.6667 14.6069 15.9703 15.3033C15.2739 15.9997 14.4471 16.5522 13.5371 16.9291C12.6272 17.306 11.6519 17.5 10.667 17.5C8.67787 17.5 6.77021 16.7098 5.36369 15.3033C3.95717 13.8968 3.16699 11.9891 3.16699 10C3.16699 8.01088 3.95717 6.10322 5.36369 4.6967C6.77021 3.29018 8.67787 2.5 10.667 2.5ZM10.667 13.125C10.4184 13.125 10.1799 13.2238 10.0041 13.3996C9.82826 13.5754 9.72949 13.8139 9.72949 14.0625C9.72949 14.3111 9.82826 14.5496 10.0041 14.7254C10.1799 14.9012 10.4184 15 10.667 15C10.9156 15 11.1541 14.9012 11.3299 14.7254C11.5057 14.5496 11.6045 14.3111 11.6045 14.0625C11.6045 13.8139 11.5057 13.5754 11.3299 13.3996C11.1541 13.2238 10.9156 13.125 10.667 13.125ZM10.667 5.625C10.004 5.625 9.36807 5.88839 8.89923 6.35723C8.43038 6.82607 8.16699 7.46196 8.16699 8.125C8.16699 8.29076 8.23284 8.44973 8.35005 8.56694C8.46726 8.68415 8.62623 8.75 8.79199 8.75C8.95775 8.75 9.11672 8.68415 9.23393 8.56694C9.35114 8.44973 9.41699 8.29076 9.41699 8.125C9.41699 7.79348 9.54869 7.47554 9.78311 7.24112C10.0175 7.0067 10.3355 6.875 10.667 6.875C10.9985 6.875 11.3165 7.0067 11.5509 7.24112C11.7853 7.47554 11.917 7.79348 11.917 8.125C11.917 8.5875 11.8132 8.85 11.4595 9.2475L11.3145 9.40375L10.9845 9.74125C10.307 10.45 10.042 10.96 10.042 11.875C10.042 12.0408 10.1078 12.1997 10.2251 12.3169C10.3423 12.4342 10.5012 12.5 10.667 12.5C10.8328 12.5 10.9917 12.4342 11.1089 12.3169C11.2261 12.1997 11.292 12.0408 11.292 11.875C11.292 11.4125 11.3957 11.15 11.7495 10.7525L11.8945 10.5963L12.2245 10.2587C12.902 9.55 13.167 9.04 13.167 8.125C13.167 7.46196 12.9036 6.82607 12.4348 6.35723C11.9659 5.88839 11.33 5.625 10.667 5.625Z"
                      fill="#757575"
                    />
                  </svg>
                </span>
              </div>
            </div>
            <div className="total-amount row">
              <div className="col-6 text-end amout-typography">Total :</div>
              <div className="col-6 d-flex align-items-center">
                <small className="est me-2">Est. </small>{" "}
                <span className="amout-typography">
                  CA${parseFloat(cartItem?.fighterTotalAmount)?.toFixed(2)}{" "}
                </span>{" "}
                <span
                  className="model mx-1"
                  role="button"
                  title={
                    "Estimated Conversion From USD $" +
                    parseFloat(cartItem?.fighterTotalAmount).toFixed(2)
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 21 20"
                    fill="none"
                  >
                    <path
                      d="M10.667 2.5C11.6519 2.5 12.6272 2.69399 13.5371 3.0709C14.4471 3.44781 15.2739 4.00026 15.9703 4.6967C16.6667 5.39314 17.2192 6.21993 17.5961 7.12987C17.973 8.03982 18.167 9.01509 18.167 10C18.167 10.9849 17.973 11.9602 17.5961 12.8701C17.2192 13.7801 16.6667 14.6069 15.9703 15.3033C15.2739 15.9997 14.4471 16.5522 13.5371 16.9291C12.6272 17.306 11.6519 17.5 10.667 17.5C8.67787 17.5 6.77021 16.7098 5.36369 15.3033C3.95717 13.8968 3.16699 11.9891 3.16699 10C3.16699 8.01088 3.95717 6.10322 5.36369 4.6967C6.77021 3.29018 8.67787 2.5 10.667 2.5ZM10.667 13.125C10.4184 13.125 10.1799 13.2238 10.0041 13.3996C9.82826 13.5754 9.72949 13.8139 9.72949 14.0625C9.72949 14.3111 9.82826 14.5496 10.0041 14.7254C10.1799 14.9012 10.4184 15 10.667 15C10.9156 15 11.1541 14.9012 11.3299 14.7254C11.5057 14.5496 11.6045 14.3111 11.6045 14.0625C11.6045 13.8139 11.5057 13.5754 11.3299 13.3996C11.1541 13.2238 10.9156 13.125 10.667 13.125ZM10.667 5.625C10.004 5.625 9.36807 5.88839 8.89923 6.35723C8.43038 6.82607 8.16699 7.46196 8.16699 8.125C8.16699 8.29076 8.23284 8.44973 8.35005 8.56694C8.46726 8.68415 8.62623 8.75 8.79199 8.75C8.95775 8.75 9.11672 8.68415 9.23393 8.56694C9.35114 8.44973 9.41699 8.29076 9.41699 8.125C9.41699 7.79348 9.54869 7.47554 9.78311 7.24112C10.0175 7.0067 10.3355 6.875 10.667 6.875C10.9985 6.875 11.3165 7.0067 11.5509 7.24112C11.7853 7.47554 11.917 7.79348 11.917 8.125C11.917 8.5875 11.8132 8.85 11.4595 9.2475L11.3145 9.40375L10.9845 9.74125C10.307 10.45 10.042 10.96 10.042 11.875C10.042 12.0408 10.1078 12.1997 10.2251 12.3169C10.3423 12.4342 10.5012 12.5 10.667 12.5C10.8328 12.5 10.9917 12.4342 11.1089 12.3169C11.2261 12.1997 11.292 12.0408 11.292 11.875C11.292 11.4125 11.3957 11.15 11.7495 10.7525L11.8945 10.5963L12.2245 10.2587C12.902 9.55 13.167 9.04 13.167 8.125C13.167 7.46196 12.9036 6.82607 12.4348 6.35723C11.9659 5.88839 11.33 5.625 10.667 5.625Z"
                      fill="#757575"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
          <hr />
        </div>
      </div>
    </>
  );
};

export default TotalPrice;
