import { useSelector } from "react-redux";

export default function useFollowed() {
  return useSelector((state) => state?.followed);
}
