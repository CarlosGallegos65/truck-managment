
const formatDate = (date) => {  
    const newDate = date.toLocaleString("es-MX", date.getTimezoneOffset());
    return newDate;
}

export {
    formatDate
}
