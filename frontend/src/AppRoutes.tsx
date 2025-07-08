import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layouts/layout";
import HomePage from "./pages/HomePage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import RestaurantPage from "./pages/RestauarantPage";
import SearchPage from "./pages/SearchPage";
import OpenOrders from "./pages/OpenOrders";
import CreateOrder from "./pages/CreateOrder";
import JoinOrder from "./pages/JoinOrder";
import OrderDetails from "./pages/OrderDetailsPage";
import ChooseRestaurant from "@/pages/ChooseRestaurant";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OpenOrdersList from "./pages/OpenOrdersList";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <HomePage />
          </Layout>
        }
      />
      <Route path="/auth-callback" element={<AuthCallbackPage />} />
      <Route
        path="/search/:restaurant"
        element={
          <Layout showHero={false}>
            <SearchPage />
          </Layout>
        }
      />
      <Route path="/user-profile" element={<span>USER PROFILE PAGE</span>} />
      <Route
        path="/open-orders"
        element={
          <Layout showHero={false}>
            <OpenOrders />
          </Layout>
        }
      />
      <Route path="/restaurants" element={<RestaurantPage />} />
      <Route
        path="/create-order"
        element={
          <Layout showHero={false}>
            <CreateOrder />
          </Layout>
        }
      />
      <Route
        path="/join-order/:orderId"
        element={
          <Layout showHero={false}>
            <JoinOrder />
          </Layout>
        }
      />
      <Route
        path="/order-details/:orderId"
        element={
          <Layout showHero={false}>
            <OrderDetails />
          </Layout>
        }
      />
      <Route
        path="/choose-restaurant"
        element={
          <Layout showHero={false}>
            <ChooseRestaurant />
          </Layout>
        }
      />
      <Route
        path="/order-confirmation"
        element={
          <Layout showHero={false}>
            <OrderConfirmationPage />
          </Layout>
        }
      />

      <Route
        path="/open-orders"
        element={
          <Layout showHero={false}>
            <OpenOrdersList />
          </Layout>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
