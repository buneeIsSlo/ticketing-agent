import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Protected from "./components/protected";
import Header from "./components/header";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Protected protectedRoute="true">
              <div>
                <Header />
                <section className="container mx-auto px-4 py-8">
                  <h1 className="text-4xl font-bold">Ticketing Agent</h1>
                </section>
              </div>
            </Protected>
          }
        />
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
