const formatDate = (date: string) => {
  const dateObj = new Date(date);
  return dateObj.toDateString();
};

export const helper = {
  formatDate,
};
