import axios from "axios";

console.log(process.env.REACT_APP_LOCAL_API_URL);

// console.log();
export const api = axios.create({
  baseURL: process.env.REACT_APP_LOCAL_API_URL,
});
// export const api = axios.create({
//   baseURL: `${process.env.REACT_APP_global_url_Local_API_URL}`,
// });
