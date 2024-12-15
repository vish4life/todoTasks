const CurrentDate = (currDate) => {
    let currmonth = currDate.getMonth();
        currmonth = currmonth + 1;
    let curryear = currDate.getFullYear();
    let currday = currDate.getDate();
    if (currmonth < 10) {
        currmonth = '0' + currmonth;
    };
    if (currday < 10) {
        currday = '0' + currday;
    };
    let dateNow = curryear + currmonth + currday;
    return dateNow;
};

export default CurrentDate;