
const forms = document.querySelectorAll("input");
const formsubmit = document.querySelector("form");
const container = document.querySelector(".container");
const loginbtn=document.getElementById("loginbtn");
const obj = {};

forms.forEach((ele) => {
  ele.addEventListener("input", (e) => {
    const vale = e.target.name;
    const inputval = e.target.value;
    obj[vale] = inputval;
  });
});
formsubmit.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      "http://localhost:9000/api/v1/Auth/register",
      obj
    );
    console.log(response.data);
    await Toastify({
      text: "Register-success please login",
      newWindow: true,
      duration: 3000,
      close: true,
      style: {
        background: "linear-gradient(to right, #00b09b, #FF0000)",
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
    window.location.href='http://127.0.0.1:5500/client/login-page.html'
  } catch (error) {
    Toastify({
      text: error.response.data.Message,
      newWindow: true,
      duration: 3000,
      close: true,
      style: {
        background: "linear-gradient(to right, #00b09b, #FF0000)",
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
    
    console.log(error);
  }
});

//Login functions
const Logininput = container.querySelectorAll("input");
const Loginobject ={}
Logininput.forEach((input) => {
 input.addEventListener("input",(e)=>{
     const name=e.target.name;
     const value=e.target.value;
     Loginobject[name]=value;
 })
});


