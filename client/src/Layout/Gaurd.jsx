import { Navigate } from "react-router-dom";
const FighterGaurd = ({ role, components }) => {
  if (role === "fighter") {
    return components;
  } else {
    return <Navigate to={"/companion"} relative={true} />;
  }
};

export const CompanionGaurd = ({ role, components }) => {
  if (role === "companion") {
    return components;
  } else {
    return <Navigate to={"/fighter"} relative={true} />;
  }
};

export default FighterGaurd;
