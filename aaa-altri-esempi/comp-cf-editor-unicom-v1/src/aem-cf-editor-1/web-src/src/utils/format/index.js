export const getDateFormated = (date) => {
  const dateFormated = new Date(date);
  const year = dateFormated.getFullYear();
  const month = String(dateFormated.getMonth() + 1).padStart(2, '0');
  const day = String(dateFormated.getDate()).padStart(2, '0');

  return `${day}/${month}/${year}`;
};
