const formatDateString = (date: string) => {
    const dateObject = new Date(date);
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1;
    const day = dateObject.getDate();
    return `${day}-${month}-${year}`;
};

export default formatDateString;
