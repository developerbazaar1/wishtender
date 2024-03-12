import React, { useState } from "react";
import { imgBasePath } from "../utils/Helper";
import surpriseGift from "../img/surpriseGift.png";
import { addIcon, minusIcons } from "../elements/SvgElements";
import AddMessageModal from "./AddMessageModal";
import { useLoading } from "../features/loadingHooks";
import { cartApi } from "../config/axiosUtils";
import useAuth from "../services/useAuth";
import { toast } from "react-toastify";

const CartGoalDetails = ({ cart, updateCart, globalLoading, setRefresh }) => {
  const { startGloablLoading, stopGlobalLoading } = useLoading();
  const token = JSON.parse(useAuth()?.token);

  async function deleteCart() {
    try {
      startGloablLoading();
      const res = await cartApi.deleteCart(token, cart?._id);
      if (res?.status === 200) {
        toast.success(res?.data?.message);
        setRefresh((val) => !val);
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.response.data.error);
    } finally {
      stopGlobalLoading();
    }
  }

  const [showAddMessageModal, setShowAddmessageModal] = useState(false);
  return (
    <tr>
      <td>
        <div className="product-image text-left">
          <img
            loading="lazy"
            className="product-thumbnail"
            alt={cart?.shopType || cart?.goal?.goalName}
            src={
              cart?.shopType === "surprise"
                ? surpriseGift
                : `${imgBasePath}/${cart?.goal?.goalImage}`
            }
          />
          <div className="image-tittle text-capitalize">
            {cart?.shopType === "surprise"
              ? cart?.shopType
              : cart?.goal?.goalName}
          </div>
        </div>
      </td>
      <td className="own-category t-data">
        {cart?.goalType === "single" && (
          <div className="update-quantity-container">
            <button
              className="add-quantity"
              disabled={globalLoading}
              onClick={() =>
                updateCart(
                  cart?._id,
                  cart?.quantity + 1,
                  cart?.amount,
                  cart?.message
                )
              }
            >
              {addIcon}
            </button>
            {cart?.quantity}
            <button
              disabled={globalLoading}
              className="remove-quantity"
              onClick={() =>
                updateCart(
                  cart?._id,
                  cart?.quantity - 1,
                  cart?.amount,
                  cart?.message
                )
              }
            >
              {minusIcons}
            </button>
          </div>
        )}
        {cart?.goalType === "crowd" && "Crowdfunded"}
        {cart?.goalType === "subscription" && (
          <>
            <span>Subscription:</span>&nbsp;
            <button className="freq-btn medium-typo">
              {cart?.subscriptionType}
            </button>
          </>
        )}

        {cart.shopType === "surprise" && (
          <span className="text-capitalize">{cart?.shopType}</span>
        )}
      </td>
      <td className="product-prics t-data">
        <small className="est">Est.</small>{" "}
        <span>CA${parseFloat(cart?.amount)?.toFixed(2)} </span>{" "}
        <span
          className="model mx-1"
          role="button"
          title={
            "Estimated Conversion From USD $" +
            parseFloat(cart?.amount).toFixed(2)
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
      </td>
      <td className="Add-Message">
        <AddMessageModal
          showAddMessageModal={showAddMessageModal}
          setShowAddmessageModal={setShowAddmessageModal}
          cart={cart}
          setRefresh={setRefresh}
        />
        <button onClick={() => setShowAddmessageModal(true)}>
          {cart.senderMessage ? "Edit Message" : "Add Message"}
        </button>
      </td>
      <td className="remove-product">
        <button
          className="remove-prdct"
          disabled={globalLoading}
          onClick={deleteCart}
        >
          Remove
        </button>
      </td>
    </tr>
  );
};

export default CartGoalDetails;
