import React from 'react'

const formattedTime = () => {
    const formatTime = (ThisMessage) => {
        const dateTimeString = ThisMessage?.createdAt || ThisMessage;
        const dateTime = new Date(dateTimeString);
      
        // Get hours, minutes, and AM/PM
        const hours = dateTime.getHours();
        const minutes = dateTime.getMinutes();
        const ampm = hours >= 12 ? "pm" : "am";
      
        // Convert hours to 12-hour format
        const hours12 = hours % 12 || 12;
      
        // Format the time with leading zeros for hours and minutes
        const formattedTime = `${hours12.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}${ampm}`;
      
        return formattedTime;
    }
    return {formatTime}
}

export default formattedTime
