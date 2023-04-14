
const formatDate = (date) => {
    
    const options = {
        year: 'numeric', month: 'short', 
        day: 'numeric', hour: 'numeric', minute: 'numeric'
    };
    
    date = date.toLocaleDateString('mx', options);

    return date;
}

export {
    formatDate
}
