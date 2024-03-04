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

//Function to return the next payment Date in formated order
export const nextPaymentDate = (createdDate, interval) => {
  const currentDate = new Date(createdDate);
  let nextDate = new Date(currentDate);

  switch (interval) {
    case "Daily":
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case "Weekly":
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case "Bi Weekly":
      nextDate.setDate(nextDate.getDate() + 14);
      break;
    case "Monthly":
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    default:
      return "";
  }

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dayOfWeek = days[nextDate.getDay()];
  const month = months[nextDate.getMonth()];
  const day = nextDate.getDate();
  const year = nextDate.getFullYear();

  return `${dayOfWeek}: ${month} ${day} ${year}`;
};

// functin that help to decide ranking type   Monthly || Quartely || Yearly
export const RankingIterval = (pathname) => {
  const pathArray = pathname.split("/");
  if (pathArray.length === 3) {
    return "Monthly";
  } else if (pathArray[3] === "quartely") {
    return "Quarterly";
  } else {
    return "Yearly";
  }
};

//give total funded %
export const FundedPercentage = (creditedAmount, targetAmount) => {
  if (targetAmount <= 0) {
    return 0; // Prevent division by zero
  }
  let totalPercent = (100 * creditedAmount) / targetAmount;
  // Ensure percentage is within the range of 0 to 100
  totalPercent = Math.max(0, Math.min(totalPercent, 100));

  return totalPercent;
};
