import { toast } from "react-toastify";
export const url = "http://localhost:5000";
// export const url = "https://learn-b.onrender.com";

export const errorToast = (err) => {
  toast.error(err, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
};

export const successToast = (msg) => {
  toast.success(msg, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
};

export const scrollToElement = (elementId) => {
  if (elementId) {
    const element = window.location.pathname;
    if (element.includes(elementId)) {
      setTimeout(() => {
        const anchorTag = document.getElementById(elementId);
        if (anchorTag) {
          anchorTag.scrollIntoView({
            behavior: "smooth",
          });
        }
      }, 3000);
    }
  }
};
export const dateFunction = (date) => {
  const dateValue = new Date(date);
  if (dateValue.getDate() < 10) {
    var day = `0${dateValue.getDate()}`;
  } else {
    day = dateValue.getDate();
  }
  if (dateValue.getMonth() + 1 < 10) {
    var month = `0${dateValue.getMonth() + 1}`;
  } else {
    month = `${dateValue.getMonth() + 1}`;
  }
  const year = dateValue.getFullYear();

  return `${year}-${month}-${day}`;
};
