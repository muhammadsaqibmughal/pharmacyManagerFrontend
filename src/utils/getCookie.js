// export const getCookie = (name) => {
//   const value = `; ${document.cookie}`;
//   debugger;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop().split(";").shift();
//   return null;
// };


import Cookies from "js-cookie";

export const getCookie = (name) => {
 return Cookies.get(name) || null;
};