import "./App.css";
import "./Responsive.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
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
import SignupLayout from "./Layout/SignupLayout";
import FighterSignup from "./Pages/FighterSignup";
import CompanionSignup from "./Pages/CompanionSignup";
import SignIn from "./Pages/SignIn";
import { LoadingProvider } from "./features/loadingHooks";
import Unauthorize from "./Pages/Unauthorize";
import RoleAuth from "./Layout/RoleAuth";
import useAuth from "./services/useAuth";
import FighterGaurd, { CompanionGaurd } from "./Layout/Gaurd";
import NotFound from "./Pages/NotFound";
import { useEffect, useState } from "react";
import { fetchCategory, userApi } from "./config/axiosUtils";
import { CategoryProvider } from "./features/categoryHooks";
import { defaultCategory } from "./utils/Helper";
import PasswordChange from "./Pages/PasswordChange";
import { setFollowed } from "./features/fetchFollowedSlice";
import { useDispatch } from "react-redux";
import GoalActivity from "./components/GoalActivity";
import SubscriptionActivity from "./components/SubscriptionActivity";
import SurpriseActivity from "./components/SurpriseActivity";
import RankingLyout from "./Pages/RankingLyout";
import RankingPage from "./Pages/Ranking/RankingPage";
function App() {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const auth = useAuth();

  // Function to check if the token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    return Date.now() >= decodedToken.exp * 1000;
  };

  // Function to handle token expiration
  const handleTokenExpiration = () => {
    const token = localStorage.getItem("user-id");
    if (isTokenExpired(token)) {
      // Token expired, log out the user
      localStorage.removeItem("user-id");
      localStorage.removeItem("persist:wishtender");
      window.location.reload(); // Refresh the page to trigger the sign-in flow
    }
  };

  useEffect(() => {
    // Check token expiration every minute
    const interval = setInterval(() => {
      handleTokenExpiration();
    }, 60000);

    // Clear the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  //routes
  const router = createBrowserRouter([
    {
      path: "/landing",
      element:
        auth?.isLoggedIn && JSON.parse(auth?.token) ? (
          <Navigate to={"/fighter"} replace={true} />
        ) : (
          <LandingLog />
        ),
    },
    {
      path: "/signup",
      element:
        auth?.isLoggedIn && JSON.parse(auth?.token) ? (
          <Navigate to={"/fighter"} replace={true} />
        ) : (
          <SignupLayout />
        ),
      children: [
        {
          index: true,
          element: <Navigate to="fighter" replace={true} />, // this is work as default route
        },

        {
          path: "fighter",
          element: <FighterSignup />,
          // loader:
        },
        {
          path: "companion",
          element: <CompanionSignup />,
        },
      ],
    },
    {
      path: "/unauthorized",
      element: <Unauthorize />,
    },
    {
      element: <SignupLayout />,
      children: [
        {
          path: "/signin",
          element: <SignIn />,
        },
      ],
    },

    {
      path: "/",
      element: <RoleAuth allowedRoles={[JSON?.parse(auth?.user)?.role]} />,
      children: [
        {
          index: true,
          element: <Navigate to="fighter" replace={true} />, // this is work as default route
        },
        {
          path: "fighter",
          element: <LayoutPage />,
          children: [
            {
              index: true,
              element: (
                <FighterGaurd
                  components={<FighterHome />}
                  role={JSON?.parse(auth?.user)?.role}
                />
              ),
              errorElement: <>{}</>,
            },
            {
              path: "goal-detail",
              element: <GoalsDetails token={JSON.parse(auth?.token)} />,
            },
            {
              path: "account",
              element: <AccountFighter />,
            },
            {
              path: "change-password",
              element: <PasswordChange />,
            },
            {
              path: "mightlike",
              element: <LikeProfile />,
            },
            {
              path: ":userName",
              element: <OtherFighterProfile />,
            },
            {
              path: "favourite",
              element: <FavoriteFighter />,
            },
            {
              path: "cart",
              element: <CartFighter />,
            },
            {
              path: "search",
              element: <SearchFighter />,
            },
            {
              path: "create-goal",
              element: <AddGoal />,
            },
            {
              path: "activites",
              element: <ActivitiesFighter />,
              children: [
                {
                  path: "",
                  element: <GoalActivity token={JSON.parse(auth?.token)} />,
                },
                {
                  path: "subscriptions",
                  element: (
                    <SubscriptionActivity token={JSON.parse(auth?.token)} />
                  ),
                },
                {
                  path: "surprise",
                  element: <SurpriseActivity token={JSON.parse(auth?.token)} />,
                },
              ],
            },
            {
              //route for ranking
              path: "ranking",
              element: <RankingLyout />,
              children: [
                { path: "", element: <RankingPage /> },
                { path: "quartely", element: <RankingPage /> },
                { path: "yearly", element: <RankingPage /> },
              ],
            },
            {
              path: "payment",
              element: <PaymentInfo />,
            },
          ],
        },
        {
          path: "companion",
          element: <LayoutPage />,
          children: [
            {
              index: true,
              element: (
                <CompanionGaurd
                  components={<CompanionHome />}
                  role={JSON?.parse(auth?.user)?.role}
                />
              ),
            },
          ],
        },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  useEffect(() => {
    fetchCategory()
      .then((res) => {
        // console.log(res.data.category);
        if (res?.status === 200 && res?.data?.category?.length === 0) {
          setCategories(defaultCategory);
        }
        setCategories(res?.data?.category);
        // setGloablCategory();
      })
      .catch((e) => {
        setCategories(defaultCategory);
      });

    userApi
      .getFollowedFighter(JSON.parse(auth?.token))
      .then((res) => {
        if (res?.status === 200) {
          dispatch(
            setFollowed({
              followed: res?.data?.followList,
            })
          );
        }
      })
      .catch((error) => {
        // console.log(error);
      });
  }, []);

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
      <CategoryProvider categories={categories}>
        <RouterProvider router={router} />
      </CategoryProvider>
    </LoadingProvider>
  );
}

export default App;
