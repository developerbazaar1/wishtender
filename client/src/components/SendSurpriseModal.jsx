import React, { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../features/loadingHooks";
import { cartApi } from "../config/axiosUtils";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCart } from "../features/cartSlice";
import { Spinner } from "react-bootstrap";

const SendSurpriseModal = ({
  sendShowSurpriseModal,
  setSendShowSurpriseModal,
  surprisePrice,
  name,
  userId,
  token,
}) => {
  const {
    register,
    reset,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm();
  const { globalLoading, startGloablLoading, stopGlobalLoading } = useLoading();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCloseSurpriceGiftModal = () => {
    reset({ amount: parseFloat(surprisePrice)?.toFixed(2), senderMessage: "" });
    setSendShowSurpriseModal(false);
  };

  async function handleAddSurprise(data, event) {
    const type = event?.nativeEvent?.submitter?.id;
    startGloablLoading();
    data["shopType"] = "surprise";
    data["fighterId"] = userId;
    try {
      const res = await cartApi.addToCart(token, data);
      console.log(res?.data?.cart);
      if (res?.status === 200) {
        toast.success(res?.data?.message);
        dispatch(
          setCart({
            cart: res?.data?.cart,
          })
        );

        setSendShowSurpriseModal(false);
        if (type === "checkout") {
          navigate("/fighter/cart");
        } else {
        }
        reset({
          amount: parseFloat(surprisePrice)?.toFixed(2),
          senderMessage: "",
        });
      }
    } catch (e) {
      console.log(e);
      toast.error(e?.response?.data?.message || e?.response?.data?.error);
    } finally {
      stopGlobalLoading();
    }
    // Handle submission
  }

  useEffect(() => {
    if (surprisePrice) {
      setValue("amount", parseFloat(surprisePrice)?.toFixed(2));
    }
  }, [surprisePrice]);

  return (
    <div>
      <Modal
        show={sendShowSurpriseModal}
        onHide={() => handleCloseSurpriceGiftModal("nothing")}
        id="modal-container"
        centered
      >
        <form
          onSubmit={handleSubmit((data, event) =>
            handleAddSurprise(data, event)
          )}
        >
          <h5 className="sec-head">Send a Surprise</h5>
          <div className="giftmodal-body">
            <div className="MinAmount-grup">
              <label
                htmlFor="minammount"
                className="typo-grey-16-600 text-black"
              >
                Amount
              </label>
              <div className="send-gift-container typo-grey-16-600">
                <span>CA$</span>
                <input
                  type="text"
                  id="surprisePrice"
                  {...register("amount", {
                    required: "Surprise amount is required",
                    pattern: {
                      value: /^\d+(\.\d{1,2})?$/,
                      message: "Please enter a valid price",
                    },
                    min: {
                      value: surprisePrice,
                      message: `Fighter has set the minimum surprise amount to ${surprisePrice}`,
                    },
                  })}
                />
              </div>
              {errors?.amount && (
                <small className="text-danger">{errors?.amount?.message}</small>
              )}
            </div>
            <div className="MinAmount-grup">
              <label
                htmlFor="minammount"
                className="typo-grey-16-600 text-black"
              >
                Message
              </label>
              <div className="send-gift-container typo-grey-16-600">
                <textarea
                  type="text"
                  rows={4}
                  cols={60}
                  {...register("senderMessage", {
                    required: "Message is required",
                  })}
                />
              </div>
              {errors?.senderMessage && (
                <small className="text-danger">
                  {errors?.senderMessage?.message}
                </small>
              )}
            </div>
          </div>
          <div className="social-btn-group">
            <button
              className="goal-title add-surprise-to-card-btn"
              // onClick={() => handleAddSurprise("continue")}
              id={"continue"}
              style={{ width: "58%" }}
              name="continue"
              value="continue"
              disabled={globalLoading}
            >
              {!globalLoading
                ? "Add to Cart and Continue Shopping"
                : "loading..."}
            </button>
            <button
              type="submit"
              id={"checkout"}
              name="checkout"
              disabled={globalLoading}
              value="checkout"
              className="save-social-btn goal-title text-white all-btn"
              style={{ width: "58%", padding: "8px 0px" }}
            >
              {!globalLoading ? " Add to Cart and Checkout" : "loading..."}
            </button>
          </div>
        </form>
      </Modal>

      {globalLoading && (
        <div className="fighter-home-spinner">
          <Spinner animation="border" variant="danger" />
        </div>
      )}
    </div>
  );
};

export default SendSurpriseModal;
