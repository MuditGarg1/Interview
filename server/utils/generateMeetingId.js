const generateMeetingId = () => {
    return  "INT-" + Math.random().toString(36).substring(2, 12).toUpperCase();
}
export default generateMeetingId;