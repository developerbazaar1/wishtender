import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { IoIosAdd } from "react-icons/io";
import SocialLink from "./SocialLink";
import { useForm } from "react-hook-form";
import { userApi } from "../config/axiosUtils";
import useAuth from "../services/useAuth";
import { useLoading } from "../features/loadingHooks";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateProfile } from "../features/authSlice";

const SocialLinkModal1 = ({ showSocilMdl1, setShowSocilMdl1, socialLink }) => {
  const { globalLoading, startGloablLoading, stopGlobalLoading } = useLoading();
  // console.log(socialLink);
  const dispatch = useDispatch();
  const auth = useAuth();
  // console.log("user social link item in modal updated props", socialLink);
  const [links, setLinks] = useState(socialLink || []);
  // console.log("user social link item in modal state", links);
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      socialLinks: socialLink || [],
    },
  });

  const handleCloselinkModal = () => {
    setShowSocilMdl1(false);
  };

  const submit = async (formData) => {
    startGloablLoading();
    try {
      const res = await userApi.updeSocialLInk(
        JSON.parse(auth?.token),
        formData
      );
      // console.log(res);
      if (res.status === 200) {
        toast.success(res?.data?.message);
        dispatch(
          updateProfile({
            user: JSON.stringify(res?.data?.data),
          })
        );
        setLinks(res?.data?.data?.socialLinks || []);
        handleCloselinkModal();
      }
    } catch (e) {
      if (e?.response?.status === 401) {
        toast.error(e?.response?.data?.message);
      }
      if (e?.response?.status === 500) {
        toast.error(e?.response?.data?.message);
      }
      console.log(e);
    } finally {
      stopGlobalLoading();
    }
  };

  const handleAddLink = () => {
    const newLink = { platform: "", link: "", status: false };
    setLinks([...links, newLink]);
  };

  return (
    <>
      <div>
        <Modal
          show={showSocilMdl1}
          onHide={handleCloselinkModal}
          id="modal-container"
          centered
        >
          <form onSubmit={handleSubmit(submit)}>
            <h5 className="sec-head">Update Your Social Links</h5>
            {links?.length === 0 ? (
              <div className="my-3 goal-title ">You have no social links.</div>
            ) : null}

            {links?.map((linkItem, index) => (
              <SocialLink
                key={`${index + "dfg"}`}
                linkItem={linkItem}
                register={register}
                index={index}
                setValue={setValue}
              />
            ))}

            <div className="social-btn-group">
              <button
                className="add-link-btn goal-title text-black"
                onClick={handleAddLink}
                type="button"
              >
                <IoIosAdd /> add Link
              </button>
              <button
                className="save-social-btn goal-title text-white all-btn"
                type="submit"
                disabled={globalLoading}
              >
                {globalLoading ? "Loading..." : "Save"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default SocialLinkModal1;
