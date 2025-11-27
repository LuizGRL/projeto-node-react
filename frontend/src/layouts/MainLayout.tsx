import { Outlet } from "react-router-dom";
import { NavBar } from "../components/Navbar/Navbar";
import { Footer } from "../components/Footer/Footer";

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 grid grid-rows-[auto_1fr_auto]">
      <NavBar />
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};