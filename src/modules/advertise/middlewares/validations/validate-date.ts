export const validateDate = (startDate: Date, endDate: Date): boolean => {
    if(startDate < endDate)
        return true;

    return false;
};