import React from 'react';
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

const InboxPage = () => {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl text-gray-600 mb-2">Inbox</h2>
          <p className="text-gray-500">Messaging feature coming soon.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default InboxPage;
