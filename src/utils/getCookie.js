// export const getCookie = (name) => {
//   const value = `; ${document.cookie}`;
//   debugger;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop().split(";").shift();
//   return null;
// };

export const getCookie = (name) => {
  return localStorage.getItem(name) || null;
};
