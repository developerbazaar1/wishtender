const { useState } = require("react");
const { FaTiktok, FaFacebookF, FaInstagram } = require("react-icons/fa");
const { FaXTwitter } = require("react-icons/fa6");
const { IoLinkOutline } = require("react-icons/io5");

const SocialLink = ({ linkItem, register, index, setValue }) => {
  const [selectedSocial, setSelectedSocial] = useState(linkItem?.platform);
  // console.log("social Link item in link components", linkItem);
  const handleSocialLinkSelect = (socialNetwork) => {
    // console.log(socialNetwork);
    setValue(`socialLinks.${index}.platform`, socialNetwork);
    setSelectedSocial(socialNetwork);
  };

  return (
    <div className="my-3">
      <div className="socal-links">
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
