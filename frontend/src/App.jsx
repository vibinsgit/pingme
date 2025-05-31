import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import OnboardingPage from "./pages/OnboardingPage";
import CallPage from "./pages/CallPage";
import ChatPage from "./pages/ChatPage";
import NotificationsPage from "./pages/NotificationsPage";

import { Toaster } from "react-hot-toast";

import PageLoader from "./components/PageLoader.jsx";
import Layout from "./components/Layout.jsx";


import useAuthUser from "./hooks/useAuthUser.js"
import { useThemeStore } from "./store/useThemeStore.js";
import FriendsPage from "./pages/FriendsPage.jsx";

const App = () => {

  const {isLoading, authUser } = useAuthUser(); 
  const {theme, setTheme} = useThemeStore();

  const isAuthenticated = Boolean(authUser); //Gives either true or false
  const isOnboarded = authUser?.isOnboarded;

  if (isLoading) return (
    <PageLoader />
  )

  return (
    <div className="min-h-screen" data-theme={theme}>
      <Routes>
        <Route path="/"
          element={ 
            isAuthenticated && isOnboarded ? ( 
            <Layout showSidebar={true}> 
              <HomePage /> 
            </Layout> ) : ( 
              <Navigate to={ !isAuthenticated ? "/login" : "/onboarding" } />) 
          }
        >
        </Route>
        <Route path="/signup" element={ !isAuthenticated ? <SignUpPage /> : <Navigate to={ isOnboarded ? "/" : "/onboarding" } /> }></Route>
        <Route path="/login" element={ !isAuthenticated ? <LoginPage /> : <Navigate to={ isOnboarded ? "/" : "/onboarding" } /> }></Route>
        <Route path="/onboarding" element={ isAuthenticated ? ( !isOnboarded ? <OnboardingPage /> : <Navigate to="/login" />) : ( <Navigate to="/login" />) }></Route>
        <Route path="/friends" element= {isAuthenticated && isOnboarded ? (
          <Layout showSidebar={true}>
            <FriendsPage />
          </Layout>
        ) : (<Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />)} ></Route>
        <Route path="/call/:id" element={ isAuthenticated && isOnboarded ? (
          <CallPage />
        ) : ( <Navigate to={ !isAuthenticated ? "/login" : "/onboarding" } />) }></Route>
        <Route path="/chat/:id" element={ isAuthenticated && isOnboarded ? (
          <Layout showSidebar={false}>
            <ChatPage />
          </Layout>
        ) : (
          <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
        ) }></Route>
        <Route 
          path="/notifications" 
          element={ isAuthenticated && isOnboarded ? (
            <Layout showSidebar={true}>
              <NotificationsPage />
            </Layout> ) :(
            <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
          )}
        >
        </Route>
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
