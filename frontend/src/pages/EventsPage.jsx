import React from "react";
import { useSelector } from "react-redux";
import EventCard from "../components/Events/EventCard";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";

const EventsPage = () => {
  const { events, isLoading } = useSelector((state) => state.events);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={4} />
          {events && events.length > 0 ? (
            events.map((event, index) => (
              <EventCard key={event._id || index} data={event} active={index === 0} />
            ))
          ) : (
            <div className="text-center py-20 text-gray-500">No events available</div>
          )}
        </div>
      )}
    </>
  );
};

export default EventsPage;