import { RiDeleteBinLine } from "react-icons/ri";
import { useState } from "react";
import { FaTiktok, FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoLinkOutline } from "react-icons/io5";

const SocialLink = ({
  linkItem,
  register,
  index,
  setValue,
  removeSocailLink,
}) => {
  const [selectedSocial, setSelectedSocial] = useState(linkItem?.platform);

  const handleSocialLinkSelect = (socialNetwork) => {
    setValue(`socialLinks.${index}.platform`, socialNetwork);
    setSelectedSocial(socialNetwork);
  };

  return (
    <div className="my-3">
      <div className="socal-links position-relative">
        <span
          className="remove-social-btn"
          onClick={() => removeSocailLink(linkItem._id)}
          role="button"
        >
          <RiDeleteBinLine size={20} color="red" />
        </span>
        <div className="social-top">
          <div className="left dropdown">
            <button
              className=" dropdown-toggle social-toggle typo-grey-16 "
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {selectedSocial ? selectedSocial : "Select a Platform"}
            </button>
            <ul className="dropdown-menu">
              <li>
                <span
                  className="dropdown-item social-link-item"
                  role="button"
                  onClick={(e) => handleSocialLinkSelect("Instagram")}
                >
                  <FaInstagram />
                  Instagram
                </span>
              </li>
              <li>
                <span
                  className="dropdown-item social-link-item"
                  role="button"
                  onClick={(e) => handleSocialLinkSelect("Twitter")}
                >
                  <FaXTwitter /> Twitter
                </span>
              </li>
              <li>
                <span
                  className="dropdown-item social-link-item"
                  role="button"
                  onClick={(e) => handleSocialLinkSelect("Facebook")}
                >
                  <FaFacebookF />
                  Facebook
                </span>
              </li>
              <li>
                <span
                  className="dropdown-item social-link-item"
                  role="button"
                  onClick={(e) => handleSocialLinkSelect("Tiktok")}
                >
                  <FaTiktok />
                  Tiktok
                </span>
              </li>
              <li>
                <span
                  className="dropdown-item social-link-item"
                  role="button"
                  onClick={(e) => handleSocialLinkSelect("Other")}
                >
                  <IoLinkOutline />
                  Other
                </span>
              </li>
            </ul>
          </div>
          <div className="right">
            <input
              type="checkbox"
              className="socialink"
              id={`checkbox${index}`}
              {...register(`socialLinks.${index}.status`)}
            />
            <label
              className="socialLablel"
              htmlFor={`checkbox${index}`}
            ></label>
          </div>
        </div>

        <div className="social-bottom">
          <div className="socila-link-input-container text-star typo-grey-16">
            <span>
              <IoLinkOutline size={23} />{" "}
            </span>
            <input
              type="text"
              name="socialIink"
              defaultValue="https://"
              {...register(`socialLinks.${index}.link`)}
              className="text-black w-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialLink;
