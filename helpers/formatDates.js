
const formatDate = (date) => {  
    date = date.toLocaleString("es-MX", {timeZone: "America/Mexico_City"});

    return date;
}

export {
    formatDate
}
