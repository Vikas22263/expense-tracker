const email = document.querySelector('#email')
const loginbtn = document.querySelector('#loginbtn')

loginbtn.addEventListener("click", async (e) => {
  e.preventDefault()
  try {
    const forgotobject = {
      Email: email.value
    };
    const response = await axios.post("http://localhost:9000/api/v1/password/forgotpassword", forgotobject);
    await Toastify({
      text: "Mail-sended",
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
  } catch (error) {
    console.log(error.response.data.message);
    await Toastify({
      text: error.response.data.message,
      newWindow: true,
      duration: 3000,
      close: true,
      style: {
        background: "linear-gradient(to right, #09b09b, #FF0000)",
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
});
