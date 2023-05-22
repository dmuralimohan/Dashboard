import React from "react";


export class DateInfo extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            date: (d) =>  d ? new Date(d) : new Date()
        }
        this.dates = new Array(31).fill().map((_, i) => i+1);
        this.months = {
            "January" : 1,
            "February" : 2,
            "March" : 3,
            "April" : 4,
            "May" : 5,
            "June" : 6,
            "July" : 7,
            "August" : 8,
            "September" : 9,
            "October" : 10,
            "November" : 11,
            "December" : 12
        };
        this.days = {
            "Sunday" : 1,
            "Monday" : 2,
            "Tuesday" : 3,
            "Wednesday" : 4,
            "Thursday" : 5,
            "Friday" : 6,
            "Saturday" : 7
        }
    }
    getMonths(){
        return this.months;
    }
    getMonthName(monthIndex){
        if(monthIndex < 1 || monthIndex > 12){
            return "Invalid Date";
        }
        return Object.keys(this.getMonths())[monthIndex-1];
    }
    getMonthNumber(monthName){
        return this.months[monthName] ?? "Invalid Month Name";
    }
    getDates(){
        return this.dates;
    }
    getDays(){
        return this.days;
    }
    getDayNumber(day){
        return this.days[day] ?? "Invalid Day";
    }
    getDayName(number){
        if(number < 1 && number > 7){
            return "Invalid Day Number"
        }
        return Object.keys(this.getDays())[number-1];
    }
    isValidDate(d){
        if(!d) return false;

        const date = this.state.date(d);
        const currentDate = this.state.date();

        if(!date) return false;

        const dateArr = d.split("-").map(n => parseInt(n));

        let isValid = date.getFullYear().toString().length === 4 ? true : false;
        isValid = dateArr[0] === date.getFullYear() && dateArr[1] === (date.getMonth() + 1) && dateArr[2] === date.getDate();
        isValid = date.getFullYear() > currentDate.getFullYear() ? false : isValid;

        if(currentDate.getFullYear() === date.getFullYear()){
            if(date.getMonth() === currentDate.getMonth()){
                isValid = date.getDate() > currentDate.getDate() ? false : true;
            }else if(date.getMonth() > currentDate.getMonth()){
                isValid = false;
            }
        }

        return isValid ? true : false;
    }
}