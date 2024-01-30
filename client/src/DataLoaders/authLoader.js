import { api } from "../config/axiosConfig";

export async function signupLoader() {
  return await api.request({
    url: `auth/signup`,
    method: "POST",
  });
}
export async function loginLoader() {}
