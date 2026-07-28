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
const handleGroupMemberAdded = (data) => {

    const notification = {
        id: Date.now(),
        type: "group",
        title: "New Group Member",
        message: `${data.memberName} joined ${data.groupName}`,
        createdAt: new Date(),
        read: false,
    };

    setNotifications((prev) => [
        notification,
        ...prev,
    ]);

};

const handleGroupExpenseAdded = (data) => {

    const notification = {
        id: Date.now(),
        type: "groupExpense",
        title: "Group Expense Added",
        message: `${data.paidBy} added ₹${data.amount} for ${data.title} in ${data.groupName}`,
        createdAt: new Date(),
        read: false,
    };

    setNotifications((prev) => [
        notification,
        ...prev,
    ]);

};
const handleGroupExpenseUpdated = (data) => {

    const notification = {
        id: Date.now(),
        type: "groupExpense",
        title: "Group Expense Updated",
        message: `${data.updatedBy} updated ${data.title}`,
        createdAt: new Date(),
        read: false,
    };

    setNotifications((prev) => [
        notification,
        ...prev,
    ]);

};
const handleGroupExpenseDeleted = (data) => {

    const notification = {
        id: Date.now(),
        type: "groupExpense",
        title: "Group Expense Deleted",
        message: `${data.deletedBy} deleted ${data.title}`,
        createdAt: new Date(),
        read: false,
    };

    setNotifications((prev) => [
        notification,
        ...prev,
    ]);

};
const handleSettlementCompleted = (data) => {

    const notification = {
        id: Date.now(),
        type: "settlement",
        title: "Settlement Completed",
        message: `${data.from} settled ₹${data.amount} `,
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
   
     socket.on("groupMemberAdded", handleGroupMemberAdded);

    socket.on("groupExpenseAdded", handleGroupExpenseAdded);

    socket.on("groupExpenseUpdated", handleGroupExpenseUpdated);

    socket.on("groupExpenseDeleted", handleGroupExpenseDeleted);

socket.on("settlementCompleted", handleSettlementCompleted);



        return () => {

            socket.off("expenseAdded", handleExpense);
        
          socket.off("expenseUpdated", handleExpenseUpdated);         
         socket.off("expenseDeleted", handleExpenseDeleted);

          socket.off("groupMemberAdded", handleGroupMemberAdded);
 
        socket.off("groupExpenseAdded", handleGroupExpenseAdded);

        socket.off("groupExpenseUpdated", handleGroupExpenseUpdated);

        socket.off("groupExpenseDeleted", handleGroupExpenseDeleted);

        socket.off("settlementCompleted", handleSettlementCompleted);



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