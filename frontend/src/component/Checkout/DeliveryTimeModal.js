import { useState, useEffect } from "react";
import "./DeliveryTimeModal.css";

const DeliveryTimeModal = ({ onClose, onSelectSlot }) => {
  const [selectedDate, setSelectedDate] = useState(""); // Default selected date
  const [selectedSlot, setSelectedSlot] = useState(null); // No slot selected initially
  const [availableDates, setAvailableDates] = useState([]); // Stores today's & tomorrow's date

  const allTimeSlots = ["90mins", "8AM-10AM", "10AM-12PM", "12PM-2PM", "2PM-4PM", "4PM-6PM", "6PM-8PM"];

  useEffect(() => {
    // Get today's and tomorrow's date dynamically
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    // Format: "Today 10 Feb", "Tomorrow 11 Feb"
    const formatDate = (date, label) => {
      const options = { day: "numeric", month: "short" }; // Format: "10 Feb"
      return `${label} ${date.toLocaleDateString("en-GB", options)}`;
    };

    const formattedDates = [formatDate(today, "Today"), formatDate(tomorrow, "Tomorrow")];

    setAvailableDates(formattedDates);
    setSelectedDate(formattedDates[0]); // Set today as default selected date
  }, []);

  // Function to filter available time slots dynamically
  const getAvailableSlots = () => {
    const now = new Date();
    const currentHour = now.getHours();

    // If "Tomorrow" is selected, return all slots except "90mins"
    if (!selectedDate.includes("Today")) {
      return allTimeSlots.filter(slot => slot !== "90mins");
    }

    // For today, remove past slots
    return allTimeSlots.filter((slot) => {
      if (slot === "90mins" && currentHour >= 18) return false; // Disable "90mins" after 6PM
      if (slot.startsWith("8AM") && currentHour >= 8) return false;
      if (slot.startsWith("10AM") && currentHour >= 10) return false;
      if (slot.startsWith("12PM") && currentHour >= 12) return false;
      if (slot.startsWith("2PM") && currentHour >= 14) return false;
      if (slot.startsWith("4PM") && currentHour >= 16) return false;
      if (slot.startsWith("6PM") && currentHour >= 18) return false;

      return true;
    });
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    if (typeof onSelectSlot === "function") {
      onSelectSlot(`${selectedDate} ${slot}`); // Ensure it's a function before calling
    } else {
      console.warn("onSelectSlot is not defined"); // Debugging
    }
    onClose(); // Close the modal
  };
  

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button-pop" onClick={onClose}>×</button>
        <h2 className="delivery-time-text">Select delivery time</h2>

        {/* Date Selector */}
        <div className="date-selector">
          {availableDates.map((date) => (
            <button 
              key={date} 
              className={`date-btn ${selectedDate === date ? "active" : ""}`}
              onClick={() => setSelectedDate(date)}
            >
              {date}
            </button>
          ))}
        </div>

        {/* Time Slot Selector */}
        <div className="time-slots">
          {getAvailableSlots().map((slot) => (
            <button 
              key={slot} 
              className={`time-slot ${selectedSlot === slot ? "selected" : ""}`}
              onClick={() => handleSlotSelect(slot)}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeliveryTimeModal;
