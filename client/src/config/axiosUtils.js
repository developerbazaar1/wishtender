import { api } from "./axiosConfig";

export const AuthApi = {
  signup: async (data) => {
    return await api.request({
      url: `/auth/signup`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    });
  },
  signin: async (data) => {
    return await api.request({
      url: `/auth/login`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    });
  },
};
