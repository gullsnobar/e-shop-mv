import React from "react";
import { useSelector } from "react-redux";
import EventCard from "../components/Events/EventCard";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import Loader from "../components/Layout/Loader";
import styles from "../styles/styles";

const EventsPage = () => {
  const { events, isLoading } = useSelector((state) => state.events);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="min-h-screen flex flex-col">
          <Header activeHeading={4} />

          <div className={`${styles.section} flex-1 py-10`}>
            <div className={`${styles.heading} mb-8`}>
              <h1>Popular Events</h1>
            </div>

            {events && events.length > 0 ? (
              <div className="space-y-8">
                {events.map((event, index) => (
                  <EventCard key={event._id || index} data={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-500 bg-white rounded-xl shadow-sm">
                No events available at the moment
              </div>
            )}
          </div>

          <Footer />
        </div>
      )}
    </>
  );
};

export default EventsPage;