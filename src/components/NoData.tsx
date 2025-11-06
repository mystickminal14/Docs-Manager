import React, { useContext } from "react";
import { format } from "date-fns";
import { FaCalendarTimes } from "react-icons/fa";
import { AppContext } from "../context/ContextApp";

interface NoDataProps {
  selectedDate: Date;
  message?: string;
}

const NoData: React.FC<NoDataProps> = ({ selectedDate, message }) => {
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("AppContext not found");

  return (
    <div
      className={`mx-auto h-28 rounded-md flex flex-col justify-center items-center shadow-sm border p-3 
          bg-blue-50 border-blue-200 text-blue-gray-600`}
    >
      <FaCalendarTimes
        className={`mb-2 text-2xl text-blue-500`}
      />
      <p
        className={`text-sm font-bold text-center 
         text-blue-gray-600
        `}
      >
        {message ?? `No event on ${format(selectedDate, "PPP")}`}
      </p>
    </div>
  );
};

export default NoData;
