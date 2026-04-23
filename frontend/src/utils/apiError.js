const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";

const extractApiErrorMessage = (error) => {
  const responseMessage = error?.response?.data?.message;
  const fallbackMessage = error?.message;

  if (typeof responseMessage === "string" && responseMessage.trim()) {
    return responseMessage.trim();
  }

  if (typeof fallbackMessage === "string" && fallbackMessage.trim()) {
    return fallbackMessage.trim();
  }

  return DEFAULT_ERROR_MESSAGE;
};

export { DEFAULT_ERROR_MESSAGE, extractApiErrorMessage };
