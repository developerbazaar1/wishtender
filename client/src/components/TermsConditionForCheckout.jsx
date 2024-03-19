import React from "react";
import Form from "react-bootstrap/Form";
import { useLoading } from "../features/loadingHooks";
import { useForm } from "react-hook-form";
import { cartApi, orderApi } from "../config/axiosUtils";
import { toast } from "react-toastify";
import { getCurrentDate } from "../utils/Helper";

const TermsConditionForCheckout = ({ id, token, setRefresh }) => {
  const { globalLoading, startGloablLoading, stopGlobalLoading } = useLoading();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const handleCheckout = async (data) => {
    try {
      startGloablLoading();
      data["currency"] = "USD";
      data["paymentMethod"] = "stripe";
      data["fighterId"] = id;
      data["status"] = "processing";
      const res = await orderApi.checkout(token, data);

      if (res?.status === 201) {
        toast.success(res?.data?.message);
        let updateOrderData = {
          status: "paid",
          paymentMethod: "credit card",
          transactionId: "1121434324343",
          paidDate: getCurrentDate,
        };
        // return;
        const response = await orderApi.updateOrder(
          token,
          res?.data?.order?._id,
          updateOrderData
        );

        if (response?.status === 200) {
          toast.success(response?.data?.message);
          setRefresh((val) => !val);
        }
        console.log("This is checkout update  response", response);
      }
      console.log("This is create checkout response", res);
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.response.data.error);
    } finally {
      stopGlobalLoading();
    }
  };

  return (
    <>
      <section className="cart-terms mb-5">
        <form
          className="row justify-content-center"
          onSubmit={handleSubmit(handleCheckout)}
          style={{
            textAlign: "unset",
          }}
        >
          <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12">
            <div className="terms-condition-box">
              <div className="terms-check">
                <div>
                  <div className="mb-1 ms-3 text-left fs-14">
                    <input
                      type="checkbox"
                      className="terms-checkbox-input"
                      {...register("termscondition", {
                        required: {
                          value: true,
                          message:
                            "You must agree to the terms and conditions before proceeding with checkout",
                        },
                      })}
                    />
                    <label className="ms-2">
                      I agree to the Terms of Service and Privacy Policy and the
                      following statements:
                    </label>
                  </div>
                  {errors?.termscondition?.message && (
                    <p className="text-danger  ms-4">
                      {errors?.termscondition?.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="read-terms">
                <ul className="terms-list">
                  <li>I am making a non-refundable cash gift donation.</li>
                  <li>
                    I expect no product or service in return from the gift
                    recipient.
                  </li>
                  <li>
                    This payment is a donation intended for the gift recipient.
                  </li>
                  <li>
                    I have taken the necessary steps to confirm the Goals list
                    owner is authentic and I understand that Fight Companion LLC
                    will not be held responsible for any issues arising from a
                    catfishing situation.
                  </li>
                  <li>
                    I understand that by violating these terms I may be subject
                    to legal action or can fall a victim of scams.
                  </li>
                  <li>
                    I understand that by checking the box above and then
                    clicking "CHECKOUT", I will have created a legally binding
                    e-signature to this agreement.
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* section for submit checklist  */}
          <div className="check-payment  text-center mt-5">
            <button
              className="checkout-btn"
              type="submit"
              disabled={globalLoading}
            >
              Checkout
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default TermsConditionForCheckout;
