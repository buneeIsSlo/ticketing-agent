import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Home from "./pages/home";
import Protected from "./components/protected";
import Layout from "./components/layout";
import TicketDetails from "./pages/ticket";
import AdminPage from "./pages/admin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Protected protectedRoute="true">
              <Layout />
            </Protected>
          }
        >
          <Route index element={<Home />} />
          <Route path="/ticket/:id" element={<TicketDetails />} />
          <Route
            path="/admin"
            element={
              <Protected protectedRoute="true" requiredRole="admin">
                <AdminPage />
              </Protected>
            }
          />
        </Route>
        <Route
          path="/login"
          element={
            <Protected protectedRoute="">
              <Login />
            </Protected>
          }
        />
        <Route
          path="/signup"
          element={
            <Protected protectedRoute="">
              <Signup />
            </Protected>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
