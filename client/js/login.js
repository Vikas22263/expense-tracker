
const forms = document.querySelectorAll("input");
const formsubmit = document.querySelector("form");
const container = document.querySelector(".container");
const loginbtn=document.getElementById("loginbtn");


//forgot functions
const Logininput = container.querySelectorAll("input");
const forgot ={}
Logininput.forEach((input) => {
 input.addEventListener("input",(e)=>{
     const name=e.target.name;
     const value=e.target.value;
     forgot[name]=value;
   
 })
});


loginbtn.addEventListener("click",async(e)=>{
  e.preventDefault()
try {
   const response =await axios.post("http://localhost:9000/api/v1/Auth/login",forgot)
   if(response.status){
    Toastify({
      text: "Login-success",
      newWindow: true,
      duration: 3000,
      close: true,
      style: {
        background: "linear-gradient(to left, #00b09b, #FF0000)",
        position: "absolute",
        zIndex: 9999,
        right:0,
        width: "23%", 
        height: "20vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: "translate(0px, 0px)",
        transition: "all 1s ease-in-out" 
      },
    }).showToast();
      localStorage.setItem("User",JSON.stringify(response.data.data))
      localStorage.setItem("Accesstoken",JSON.stringify(response.data.data.Accesstoken))

   window.location.href="http://127.0.0.1:5500/client/index.html"}
} catch (error) {
  
  Toastify({
    text: error.response.data.Message,
    newWindow: true,
    duration: 3000,
    close: true,
    style: {
      background: "linear-gradient(to left, #00b09b, #FF0000)",
      position: "absolute",
      zIndex: 9999,
      right:0,
      width: "23%", 
      height: "20vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transform: "translate(0px, 0px)",
      transition: "all 1s ease-in-out" 
    },
  }).showToast();
}
})
