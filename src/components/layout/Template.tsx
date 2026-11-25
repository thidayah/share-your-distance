import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Bounce, ToastContainer } from "react-toastify";

interface TemplateProps {
  children: React.ReactNode;
}

export default function Template({ children }: TemplateProps) {
  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] antialiased flex flex-col">
      <Header />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </div>
  );
}
