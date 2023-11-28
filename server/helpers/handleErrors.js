export const clientError = (res, message) => {
  return res.status(404).send(message);
};

export const serverError = (res, error, message) => {
  console.log(error);
  return res.status(500).send(message);
};
