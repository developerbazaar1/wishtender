export const handleLogout = () => {
  localStorage.removeItem("persist:wishtender");
  return window.location.replace("/landing");
};
