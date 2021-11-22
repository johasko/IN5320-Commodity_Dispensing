//helper function to retrive curent date and time
export function getDateAndTime(){
    return new Date().toISOString().substring(0, 16);
}