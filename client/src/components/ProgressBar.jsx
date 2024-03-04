import ProgressBar from "react-bootstrap/ProgressBar";

function LocaProgressBar({ totalPercent = 60 }) {
  // const now = 60;
  return (
    <ProgressBar
      variant="black"
      now={totalPercent}
      label={`${totalPercent}%`}
      visuallyHidden
    />
  );
}

export default LocaProgressBar;
