
const formatDate = (date) => {
    
    const options = {
        year: 'numeric', month: 'short', 
        day: 'numeric', hour: 'numeric', minute: 'numeric'
    };
    
    date = new Intl.DateTimeFormat('es-MX', options, {timeZone: "America/Mexico_City" }).format(date)

    return date;
}

export {
    formatDate
}
