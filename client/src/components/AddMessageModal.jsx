import Modal from "react-bootstrap/Modal";
import { Spinner } from "react-bootstrap";
import { useLoading } from "../features/loadingHooks";
import { useForm } from "react-hook-form";
import { cartApi } from "../config/axiosUtils";
import useAuth from "../services/useAuth";
import { toast } from "react-toastify";

const AddMessageModal = ({
  showAddMessageModal,
  setShowAddmessageModal,
  cart,
  setRefresh,
}) => {
  const { globalLoading, startGloablLoading, stopGlobalLoading } = useLoading();
  const token = JSON.parse(useAuth()?.token);
  const updateCart = async (formData) => {
    // console.log(formData);
    formData["amount"] = cart.amount;
    formData["quantity"] = cart?.quantity;
    // return;
    startGloablLoading();

    try {
      const res = await cartApi.updateCart(token, cart?._id, formData);
      //   console.log(res);
      if (res?.status === 200) {
        toast.success(res?.data?.message);
        setShowAddmessageModal(false);
        setRefresh((val) => !val);
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.response?.data?.error);
    } finally {
      stopGlobalLoading();
    }
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      senderMessage: cart?.senderMessage || "",
    },
  });
  return (
    <div>
      <Modal
        show={showAddMessageModal}
        onHide={() => setShowAddmessageModal(false)}
        id="modal-container"
        centered
      >
        <form onSubmit={handleSubmit(updateCart)}>
          <div className="add-message-modal-body">
            <div className="MinAmount-grup">
              <label
                htmlFor="minammount"
                className="typo-grey-16-600 text-black mb-2"
              >
                Message
              </label>
              <div className="send-gift-container typo-grey-16-600">
                <textarea
                  type="text"
                  rows={6}
                  cols={60}
                  placeholder="Write a message here"
                  {...register("senderMessage", {
                    pattern: {
                      value: /^[a-zA-Z\s,;"':?!.]*$/,
                      message: "Please Enter a Valid Message",
                    },
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
          <div className="save-message-container">
            <button
              className="save-message-btn"
              type="submit"
              disabled={globalLoading}
            >
              {!globalLoading ? "Save" : "loading..."}
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

export default AddMessageModal;
