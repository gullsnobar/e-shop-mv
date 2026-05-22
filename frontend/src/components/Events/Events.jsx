import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../styles/styles";
import EventCard from "./EventCard";
import { getAllEvents } from "../../redux/actions/event";

const Events = () => {
  const dispatch = useDispatch();
  const { events } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  return (
    <div className={`${styles.section} py-10`}>
      <div className={`${styles.heading} mb-8`}>
        <h1>Popular Events</h1>
      </div>

      <div className="space-y-8">
        {events &&
          events.map((event, index) => (
            <EventCard key={event._id || index} data={event} />
          ))}
      </div>
    </div>
  );
};

export default Events
