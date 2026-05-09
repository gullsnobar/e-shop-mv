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
    <div>
      <div className={`${styles.section}`}>
        <div className={`${styles.heading}`}>
          <h1>Popular Events</h1>
        </div>

        <div className="w-full grid gap-5">
          {events &&
            events.map((event, index) => (
              <EventCard key={event._id || index} data={event} active={index === 0} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Events
