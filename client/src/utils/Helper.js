import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoLinkOutline } from "react-icons/io5";

export const handleLogout = () => {
  localStorage.removeItem("persist:wishtender");
  return window.location.replace("/landing");
};

export const imgBasePath = process.env.REACT_APP_LOCAL_API_URL;

export const defaultCategory = [
  {
    _id: "65c5feeb3a5c853decbd72bc",
    categoryName: "Charitable Donations",
    __v: 0,
  },
  {
    _id: "65c5fef63a5c853decbd72be",
    categoryName: "Skill Development Courses",
    __v: 0,
  },
  {
    _id: "65c5feff3a5c853decbd72c0",
    categoryName: "Health and Fitness Goals",
    __v: 0,
  },
  {
    _id: "65c5ff083a5c853decbd72c2",
    categoryName: "Gadgets and Electronics",
    __v: 0,
  },
];

export default function castDate(date) {
  const newDate = new Date(date);
  const month = newDate.toLocaleString("default", { month: "short" });
  const year = newDate.getFullYear();
  return `${month} ${year}`;
}
//data cast to adding goal to cart
export const castGoalData = (goal, amount) => {
  let data = {
    goalId: goal?._id,
    goalType: goal.goalType,
    amount: goal?.goalPrice,
    fighterId: goal?.creator,
    quantity: 1,
  };

  if (goal?.goalType === "crowd") {
    data.amount = amount;
  }
  return data;
};

export const castUpdateFormData = (inputData) => {
  let data = new FormData();
  data.append("userName", inputData.userName);
  data.append("firstName", inputData.firstName);
  data.append("lastName", inputData.lastName);
  data.append("currency", inputData.currency);
  data.append("promotionCompany", inputData.promotionCompany);
  data.append("setAutoPost", inputData.setAutoPost);
  data.append(
    "displayNameInPublicRankingPage",
    inputData.displayNameInPublicRankingPage
  );
  // console.log(inputData.surpriceContribution);
  // return;
  data.append("surpriceContribution", inputData.surpriceContribution);
  data.append(
    "surpriceContributionAmount",
    inputData.surpriceContributionAmount
  );
  if (inputData.newProfileImage.length > 0) {
    data.append("profileImage", inputData.newProfileImage[0]);
  }
  return data;
};

export const getSocialIcon = (iconName) => {
  switch (iconName) {
    case "Instagram":
      return <FaInstagram className="social-icon-style" size={20} />;

    case "Twitter":
      return <FaXTwitter className="social-icon-style" size={20} />;

    case "Facebook":
      return <FaFacebookF className="social-icon-style" size={20} />;

    case "Tiktok":
      return <FaTiktok className="social-icon-style" size={20} />;

    default:
      return <IoLinkOutline className="social-icon-style" size={20} />;
  }
};
// function to cast goaldata to add-goal
export const castAddGoalData = (inputData) => {
  let data = new FormData();
  data.append("goalName", inputData.goalName);
  data.append("goalPrice", inputData.goalPrice);
  data.append("image", inputData.image[0]);
  data.append("goalCategory", inputData.goalCategory);
  data.append("goalType", inputData.goalType);
  if (inputData?.goalType !== "crowd") {
    data.append(
      "goalPurchaseType",
      inputData.goalPurchaseType === false ? "single" : "multiple"
    );
  }
  if (inputData?.goalType === "subscription") {
    data.append("subscriptionType", inputData.subscriptionType);
  }
  return data;
};

export const goBackHelper = (navigate) => {
  navigate(-1);
};

export const getCurrentDate = () => {
  let currentDate = new Date();
  let day = currentDate.getDate();
  let month = currentDate.getMonth() + 1; // Month is zero-based, so we add 1
  let year = currentDate.getFullYear() % 100; // Get last two digits of the year

  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;
  return `${day}-${month}-${year}`;
};

export const TimeAndDate = (dateTimeString, type) => {
  const currentDate = new Date();
  const targetDate = new Date(dateTimeString);

  if (type === "time") {
    const hours = targetDate.getHours();
    const minutes = targetDate.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${period}`;
  } else if (type === "date") {
    console.log("current date", currentDate.getDate());
    console.log("current month", currentDate.getMonth());
    console.log("current year", currentDate.getFullYear());
    console.log("target date", targetDate.getDate());
    console.log("target month", targetDate.getMonth());
    console.log("target year", targetDate.getFullYear());
    const diffTime = Math.abs(currentDate.getTime() - targetDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (
      currentDate.getDate() === targetDate.getDate() &&
      currentDate.getMonth() === targetDate.getMonth() &&
      currentDate.getFullYear() &&
      targetDate.getFullYear()
    ) {
      return "today";
    } else if (
      currentDate.getDate() !== targetDate.getDate() &&
      currentDate.getMonth() === targetDate.getMonth() &&
      currentDate.getFullYear() &&
      targetDate.getFullYear()
    ) {
      return "yesterday";
    } else {
      const options = { month: "short", day: "numeric", year: "numeric" };
      return targetDate.toLocaleDateString("en-US", options);
    }
  } else {
    throw new Error('Invalid type parameter. Use "time" or "date".');
  }
};

// Example usage:
