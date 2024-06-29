export const calculateTotalCost = (
  startTime: string,
  endTime: string,
  pricePerHour: number,
): number => {
  // Parse the startTime and endTime to extract hours and minutes
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);

  // Convert startTime and endTime to total hours
  const startTotalHours = startHours + startMinutes / 60;
  const endTotalHours = endHours + endMinutes / 60;

  // Calculate the duration in hours
  const durationHours = endTotalHours - startTotalHours;

  // Calculate and return the total cost
  return durationHours * pricePerHour;
};
