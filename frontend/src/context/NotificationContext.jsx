import { createContext, useContext, useEffect, useState } from "react";
import socket from "../services/socket";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {

    const [notifications, setNotifications] = useState([]);
      const markAllAsRead = () => {

     setNotifications((prev) =>
        prev.map((notification) => ({
            ...notification,
            read: true,
        }))
    );

};

const clearNotifications = () => {

    setNotifications([]);

};

 const handleExpense = (expense) => {

            const notification = {
                id: Date.now(),
                type: "expense",
                title: "Expense Added",
                message: `${expense.title} - ₹${expense.amount}`,
                createdAt: new Date(),
                read: false,
            };

            setNotifications((prev) => [
                notification,
                ...prev,
            ]);

        };

    const handleExpenseUpdated = (expense) => {

    const notification = {

        id: Date.now(),

        type: "expenseUpdated",

        title: "Expense Updated",

        message: `${expense.title} updated to ₹${expense.amount}`,

        createdAt: new Date(),

        read: false,

    };

    setNotifications(prev => [
        notification,
        ...prev,
    ]);

};

  const handleExpenseDeleted = (expense) => {

    const notification = {

        id: Date.now(),

        type: "expenseDeleted",

        title: "Expense Deleted",

        message: `${expense.title} was deleted`,

        createdAt: new Date(),

        read: false,

    };

    setNotifications((prev) => [

        notification,

        ...prev,

    ]);

};
    useEffect(() => {

       
      

        socket.on("expenseAdded", handleExpense);
        

     socket.on("expenseUpdated", handleExpenseUpdated);

     socket.on("expenseDeleted", handleExpenseDeleted);




        return () => {

            socket.off("expenseAdded", handleExpense);
        
socket.off("expenseUpdated", handleExpenseUpdated);         
socket.off("expenseDeleted", handleExpenseDeleted);


        };

    }, []);

    return (

        <NotificationContext.Provider
            value={{
                notifications,
                markAllAsRead,
                clearNotifications,
            }}
        >
            {children}
        </NotificationContext.Provider>

    );

};

export const useNotification = () => {

    return useContext(NotificationContext);

};