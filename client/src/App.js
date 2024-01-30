import "./App.css";
import "./Responsive.css";
import {
  BrowserRouter,
  Routes,
  Route,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LandingLog from "./Pages/LandingLog";
import "bootstrap/dist/css/bootstrap.min.css";
import FighterHome from "./Pages/FighterHome";
import LayoutPage from "./components/LayoutPage";
import CompanionHome from "./Pages/CompanionHome";
import SearchFighter from "./Pages/SearchFighter";
import ActivitiesFighter from "./Pages/ActivitiesFighter";
import RankingFighter from "./Pages/RankingFighter";
import CartFighter from "./Pages/CartFighter";
import AccountFighter from "./Pages/AccountFighter";
import PaymentInfo from "./Pages/PaymentInfo";
import TwitterPost from "./Pages/TwitterPost";
import PasswordReset from "./Pages/PasswordReset";
import LikeProfile from "./Pages/LikeProfile";
import PayMethod from "./Pages/PayMethod";
import About from "./Pages/About";
import HelpCenter from "./Pages/HelpCenter";
import TermsService from "./Pages/TermsService";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import CookiePolicy from "./Pages/CookiePolicy";
import Works from "./Pages/Works";
import Faq from "./Pages/Faq";
import AddGoal from "./Pages/AddGoal";
import FavoriteFighter from "./Pages/FavoriteFighter";
import OtherFighterProfile from "./Pages/OtherFighterProfile";
import GoalsDetails from "./Pages/GoalsDetails";
import Test from "./Test";

import SignupLayout from "./Layout/SignupLayout";
import FighterSignup from "./Pages/FighterSignup";
import CompanionSignup from "./Pages/CompanionSignup";
import { signupLoader } from "./DataLoaders/authLoader";
import SignIn from "./Pages/SignIn";
import { LoadingProvider } from "./features/loadingHooks";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingLog />,
    },
    {
      path: "/signup",
      element: <SignupLayout />,
      children: [
        {
          path: "fighter",
          element: <FighterSignup />,
        },
        {
          path: "companion",
          element: <CompanionSignup />,
        },
      ],
    },
    {
      path: "",
      element: <SignupLayout />,
      children: [
        {
          path: "/signin",
          element: <SignIn />,
        },
      ],
    },
    {
      path: "",
      element: <LayoutPage />,
      children: [
        {
          path: "/fighterhome",
          element: <FighterHome />,
        },
        {
          path: "/companionhome",
          element: <CompanionHome />,
        },
      ],
    },
  ]);

  return (
    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/" index element={<LandingLog />} />
    //     <Route path="/test" element={<Test />} />
    //     <Route path="/signup" element={<SignupLayout />}>
    //       <Route path="fighter" element={<FighterSignup />} />
    //       <Route path="companion" element={<CompanionSignup />} />
    //     </Route>
    //     <Route element={<LayoutPage />}>
    //       <Route path=":oterfighter" element={<OtherFighterProfile />} />
    //       <Route path="addgoal" element={<AddGoal />} />
    //       <Route path="favorite" element={<FavoriteFighter />} />
    //       <Route path="goaldetails" element={<GoalsDetails />} />
    //       <Route path="/fighterhome" element={<FighterHome />} />
    //       <Route path="/companionhome" element={<CompanionHome />} />
    //       <Route path="/searchfighter" element={<SearchFighter />} />
    //       <Route path="/activitiesfighter" element={<ActivitiesFighter />} />
    //       <Route path="/rankingfighter" element={<RankingFighter />} />
    //       <Route path="/cartfighter" element={<CartFighter />} />
    //       <Route path="/accountfighter" element={<AccountFighter />} />
    //       <Route path="/paymentinfo" element={<PaymentInfo />} />
    //       <Route path="/twitterpost" element={<TwitterPost />} />
    //       <Route path="/passwodreset" element={<PasswordReset />} />
    //       <Route path="/likeprofile" element={<LikeProfile />} />
    //       <Route path="/paymentmethod" element={<PayMethod />} />
    //       <Route path="/about" element={<About />} />
    //       <Route path="/helpcenter" element={<HelpCenter />} />
    //       <Route path="/terms-of-services" element={<TermsService />} />
    //       <Route path="/privacypolicy" element={<PrivacyPolicy />} />
    //       <Route path="/cookie-policy" element={<CookiePolicy />} />
    //       <Route path="/how-it-works" element={<Works />} />
    //       <Route path="/faq" element={<Faq />} />
    //       {/* <Route path="/footr" element={<Footer />} /> */}
    //     </Route>
    //   </Routes>
    // </BrowserRouter>
    <LoadingProvider>
      <RouterProvider router={router} />
    </LoadingProvider>
  );
}

export default App;
