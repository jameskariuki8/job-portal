const getCurrentUser=()=>{
return JSON.parse(localStorage.getItem("currentUser") || 'null');
}
export default getCurrentUser;