import { Outlet } from "react-router-dom";
import LoginFooterElement from "../elements/LoginFooterElement";
import { useLoading } from "../features/loadingHooks";
import CustomSpinner from "../components/Spinner";

const SignupLayout = () => {
  const { globalLoading } = useLoading();
  return (
    <>
      <section className="user-welcome">
        <div className="image-form-container">
          <div className="image-container"></div>
          <div className="form-container position-relative">
            <Outlet />
            <CustomSpinner status={globalLoading} />
          </div>
        </div>
      </section>
      <LoginFooterElement />
    </>
  );
};

export default SignupLayout;
