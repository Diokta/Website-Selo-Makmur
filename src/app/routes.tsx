import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Shop } from "./pages/Shop";
import { ProductDetail } from "./pages/ProductDetail";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { Dashboard } from "./pages/Dashboard";
import { News } from "./pages/News";
import { Reports } from "./pages/Reports";
import { Contact } from "./pages/Contact";
import { NotFound } from "./pages/NotFound";

// Admin Gapoktan Pages
import { AdminGapoktanLayout } from "./pages/admin-gapoktan/AdminGapoktanLayout";
import { GapoktanDashboard } from "./pages/admin-gapoktan/GapoktanDashboard";
import { GapoktanProducts } from "./pages/admin-gapoktan/GapoktanProducts";
import { GapoktanOrders } from "./pages/admin-gapoktan/GapoktanOrders";
import { GapoktanUsers } from "./pages/admin-gapoktan/GapoktanUsers";
import { GapoktanFinance } from "./pages/admin-gapoktan/GapoktanFinance";
import { GapoktanGallery } from "./pages/admin-gapoktan/GapoktanGallery";
import { GapoktanContent } from "./pages/admin-gapoktan/GapoktanContent";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "shop", Component: Shop },
      { path: "product/:id", Component: ProductDetail },
      { path: "cart", Component: Cart },
      { path: "checkout", Component: Checkout },
      { path: "dashboard", Component: Dashboard },
      { path: "news", Component: News },
      { path: "reports", Component: Reports },
      { path: "contact", Component: Contact },
      { path: "*", Component: NotFound },
    ],
  },
  {
    path: "/admin-gapoktan",
    Component: AdminGapoktanLayout,
    children: [
      { index: true, Component: GapoktanDashboard },
      { path: "products", Component: GapoktanProducts },
      { path: "orders", Component: GapoktanOrders },
      { path: "users", Component: GapoktanUsers },
      { path: "finance", Component: GapoktanFinance },
      { path: "gallery", Component: GapoktanGallery },
      { path: "content", Component: GapoktanContent },
    ],
  },
]);
