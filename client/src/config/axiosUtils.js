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

export const fighterApi = {
  fetchHomeData: async (token, category = "", sort = "") => {
    return await api.request({
      url: `/goal/all?sort=${sort}&category=${category}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  },

  fetchGoalDetails: async (token, goalId) => {
    return await api.request({
      url: `/goal/${goalId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  },

  createGoals: async (token, goalData) => {
    console.log(goalData);
    return await api.request({
      url: "/goal/create",
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: goalData,
    });
  },
};

export const fetchCategory = async () => {
  return await api.request({
    url: "/category/all",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const userApi = {
  updateProfile: async (data, token) => {
    return await api.request({
      url: "/user/update",
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: data,
    });
  },
  updatePassword: async (data, token) => {
    return await api.request({
      url: "/user/change-password",
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify(data),
    });
  },
  youMightLike: async (token) => {
    return await api.request({
      url: `/user/fighters?random=${true}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  },
  followUnfollow: async (token, fighterId, action) => {
    return await api.request({
      url: `/user/${fighterId}/${action}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  },
  getFollowedFighter: async (token) => {
    return await api.request({
      url: `/user/followed-fighters`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  },
  getFitherDetails: async (token, userName, sort, category) => {
    return await api.request({
      url: `/user/fighter/${userName}?sort=${sort}&category=${category}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  },

  searchFighter: async (token, search) => {
    return await api.request({
      url: `/user/fighters?search=${search}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  },

  updeSocialLInk: async (token, data) => {
    return await api.request({
      url: `/user/social-links`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: data,
    });
  },
};

export const cartApi = {
  addToCart: async (token, data) => {
    return await api.request({
      url: `/cart/add`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify(data),
    });
  },

  getCart: async (token) => {
    return await api.request({
      url: `/cart/view`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  updateCart: async (token, cartId, data) => {
    return await api.request({
      url: `/cart/update/${cartId}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      data: data,
    });
  },

  deleteCart: async (token, cartId) => {
    return await api.request({
      url: `/cart/delete/${cartId}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export const orderApi = {
  checkout: async (token, data) => {
    return await api.request({
      url: `/order/create`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: data,
    });
  },

  updateOrder: async (token, orderId, data) => {
    return await api.request({
      url: `/order/update/${orderId}`,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: data,
    });
  },

  fetchActivity: async (
    token,
    sending = "",
    receiving = "",
    shopType = "",
    goalType = ""
  ) => {
    return await api.request({
      url: `/order/getActivityGoals?sending=${sending}&receiving=${receiving}&shopType=${shopType}&goalType=${goalType}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
