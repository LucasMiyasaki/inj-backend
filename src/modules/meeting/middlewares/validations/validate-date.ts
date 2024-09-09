export const validateDate = (date: Date, endTime: Date): boolean => {
    if(date < endTime)
        return true;
    else   
        return false;
}