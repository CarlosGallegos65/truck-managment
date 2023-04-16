
const formatDate = (date) => {  
    let newDate = date.toLocaleString("es-MX", {timeZone: "America/Mexico_City"});
    return newDate;
}

export {
    formatDate
}
