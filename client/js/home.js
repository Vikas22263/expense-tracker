const privateElements = document.getElementById("private");
const expenseForm = document.getElementById("expense-from");
const notLogin = document.getElementById("not-login");
const token = localStorage.getItem("Accesstoken");
const form = document.querySelectorAll("form");
const button = document.querySelector("button");
const premium = document.getElementById("premium");
const menuitems = document.querySelector(".menu-items");
const allexpense = document.querySelector(".allexpenses");
const leetbordbtn = document.querySelector(".leetbord-btn");
const rows = document.querySelector(".row");

leetbordbtn.addEventListener("click", function (event) {
  const logoutbutton = event.target.closest(".logoutbutton");
  if (logoutbutton) {
    localStorage.removeItem("Accesstoken");
    localStorage.removeItem("User");
    window.location.reload();
  }
});

const itemobject = {};
form.forEach((input) => {
  input.addEventListener("input", (e) => {
    const name = e.target.name;
    const val = e.target.value;
    itemobject[name] = val;
  });
});

button.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    const accessToken = JSON.parse(localStorage.getItem("Accesstoken"));
    const response = await axios.post(
      "http://localhost:9000/api/v1/Expense/usersexpense",
      itemobject,
      {
        headers: {
          Authorization: `Bearer${accessToken}`,
        },
      }
    );
    await Toastify({
      text: "Item added",
      newWindow: true,
      duration: 3000,
      close: true,
      style: {
        background: "linear-gradient(to right, #00b09b, #FF0000)",
        position: "absolute",
        zIndex: 9999,
        right: 0,
        width: "23%",
        height: "20vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: "translate(0px, 0px)",
        transition: "all 1s ease-in-out",
      },
    }).showToast();
    
    await fetchallexpense();
  } catch (error) {
    console.log(error);
  }
});

const premiumuser = document.querySelector(".premiumuser");
premiumuser.addEventListener("click", async (e) => {
  try {
    e.preventDefault();
    const accessToken = JSON.parse(localStorage.getItem("Accesstoken"));
    try {
      const response = await axios.post(
        "http://localhost:9000/api/v1/Payment/createOrder",
        {},
        {
          headers: {
            Authorization: `Bearer${accessToken}`,
          },
        }
      );
      if (response) {
        createPayment(response);
      }
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.error(error);
  }
});

const createPayment = async (res) => {
  const data = res.data.data.createorder;

  try {
    const options = {
      key: res.data.data.secretkey,
      amount: data.amount,
      currency: "INR",
      name: "Expense-tracker-project",
      order_id: data.id,

      handler: async function (response) {
        try {
          const accessToken = JSON.parse(localStorage.getItem("Accesstoken"));
          try {
            const verifyResponse = await axios.post(
              `http://localhost:9000/api/v1/Payment/verifyOrder`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                order_id: response.razorpay_order_id,
              },
              {
                headers: {
                  Authorization: `Bearer${accessToken}`,
                },
              }
            );
            if (verifyResponse) {
              localStorage.setItem(
                "Accesstoken",
                JSON.stringify(verifyResponse.data.data.token)
              );
              localStorage.setItem(
                "User",
                JSON.stringify(verifyResponse.data.data.user)
              );
              window.location.reload();
              Toastify({
                text: verifyResponse.data.message,
                newWindow: true,
                duration: 3000,
                close: true,
                style: {
                  background: "linear-gradient(to left, #00b09b, #FF0000)",
                  position: "absolute",
                  zIndex: 9999,
                  right: 0,
                  width: "23%",
                  height: "20vh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: "translate(0px, 0px)",
                  transition: "all 1s ease-in-out",
                },
              }).showToast();
            }
          } catch (error) {
            console.log(error);
          }
        } catch (error) {
          console.error(error);
        }
      },

      prefill: {
        contact: "799934505",
        name: "vikas patel",
        email: "vikas@gmail.com",
      },
      theme: {
        color: "#2300a3",
      },
    };

    const razorpayObject = new Razorpay(options);
    razorpayObject.on("payment.failed", function (response) {
      alert("Payment Failed");
    });
    razorpayObject.open();
  } catch (error) {
    console.error(error);
  }
};

const premiummember = () => {
  const Premember = JSON.parse(localStorage.getItem("User"));

  if (Premember) {
    if (Premember.Ispremium || Premember.user.Ispremium) {
      const premiumElement = document.getElementById("premium");
      const leetbtn = document.querySelector(".leetbord-btn");
      if (premiumElement) {
        premiumElement.classList.remove("premiumuser");
        premiumElement.innerText = "Premium Member";
        premiumElement.classList.add("premiummember");
        premiumElement.classList.add("prmiummemberpostion");
        leetbtn.innerHTML += ` <li><a href="#" class="leed-btn">Leed-bord</a></li>
       <li><a href="#" class="download-report">download-report</a></li>
      `;
      } else {
        premiumElement.innerText = "Buy premium";
        premiumElement.classList.remove("premiummember");
      }
    }
  }
};
premiummember();

const left = document.querySelector(".page-left");
const right = document.querySelector(".page-right");
let currentPage = 1;

document.addEventListener("DOMContentLoaded", () => {
  if (token) {
    privateElements.style.display = "none";
    expenseForm.style.display = "block";
    premium.style.display = "block";
    allexpense.style.display = "flex";
    leetbordbtn.innerHTML += `<button class="logoutbutton">Logout</button>`;
    pagination();
  } else {
    privateElements.style.display = "flex";
    expenseForm.style.display = "none";
    notLogin.style.display = "block";
    premium.style.display = "none";
    rows.classList.add("displaynone");
  }

  const downloadreport = document.querySelector(".download-report");
  if (downloadreport) {
    downloadreport.addEventListener("click", async () => {
      console.log("click");
      try {
        const accessToken = JSON.parse(localStorage.getItem("Accesstoken"));
        const response = await axios.get(
          "http://localhost:9000/api/v1/Expense/download",
          {
            headers: {
              Authorization: `Bearer${accessToken}`,
            },
          }
        );

        if (response.status === 200) {
          let a = document.createElement("a");
          a.href = response.data.fileURL;
          a.download = "myexpense.csv";
          a.click();
          showallreport(response.data.getoldExpenserecord);
        }
      } catch (error) {
        console.error("Error downloading report:", error);
      }
    });
  }
  const mainbody = document.querySelector(".main-body");
  const downloadreportbody=document.querySelector('.download-reportbody')
  function showallreport(report) {
    const reportdata = document.querySelector(".report-data");
    console.log(report);
    mainbody.classList.toggle('displaynone')
    downloadreportbody.classList.toggle('displaynone')
    reportdata.innerHTML = "";
    report.map((ele, index) => {
      const ptag = document.createElement("p");
      ptag.innerHTML += `<a href='${ele.Record}'>${index+1}-${ele.createdAt}</a>`;

      reportdata.append(ptag);
    });
  }


  const closereport=document.querySelector('.close-report')

   closereport.addEventListener('click',()=>{
    mainbody.classList.toggle('displaynone')
    downloadreportbody.classList.toggle('displaynone')
   })

  const accessToken = JSON.parse(localStorage.getItem("Accesstoken"));
  const savedRowValue = JSON.parse(localStorage.getItem("row")) || 5;
  if (accessToken) {
    fetchallexpense(currentPage, savedRowValue);
  }

  const rowsSelect = document.querySelector(".row");
  rowsSelect.addEventListener("change", () => {
    const selectedRows = rowsSelect.value;
    localStorage.setItem("row", JSON.stringify(selectedRows));
    const savedrowvalue = JSON.parse(localStorage.getItem("row"));
    currentPage = 1;
    fetchallexpense(currentPage, savedrowvalue);
  });

  left.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      fetchallexpense(currentPage);
      pagination();
    }
  });

  right.addEventListener("click", () => {
    currentPage++;
    fetchallexpense(currentPage);
    pagination();
  });
});

async function pagination() {
  try {
    const data = await fetchallexpense(currentPage);
    const page = data.data.data.pagination;

    left.textContent = page.previouspage;
    right.textContent = page.nextpage;

    left.classList.toggle("displaynone", !page.previouspage);
    right.classList.toggle("displaynone", !page.nextpage);
  } catch (error) {
    console.error(error);
  }
}

const fetchallexpense = async (page, limit) => {
  try {
    const accessToken = JSON.parse(localStorage.getItem("Accesstoken"));

    const response = await axios.get(
      `http://localhost:9000/api/v1/Expense/allexpense?page=${page}&pagelimit=${limit}`,

      {
        headers: {
          Authorization: `Bearer${accessToken}`,
        },
      }
    );

    await adddataTobody(response);
    return response;
  } catch (error) {
    console.error(error);
  }
};

function adddataTobody(response) {
  try {
    const data = response.data.data.userExpense;
    const premiumdata = response.data.data.Leedbord;

    const newitem = document.querySelector(".items");
    newitem.innerHTML = "";
    if (data.length > 0) {
      allexpense.style.display = "none";

      data.forEach((item) => {
        const newli = document.createElement("div");
        newli.innerHTML = `
          <div class="card">
            <div class="card-body">
              <p class="card-text">Amount:${item.Amount}</p>
              <p class="card-title">Description:${item.Description}</p>
              <p class="card-text">Category:${item.Category}</p>
              <i class="material-icons" onclick=deletebtn(${item.id}) style="font-size:28px;color:red">delete</i>
            </div>
          </div>
        `;
        newitem.appendChild(newli);
      });
    } else {
      allexpense.style.display = "flex";
    }

    function showleedboard(premiumdata) {
      newitem.innerHTML = "";
      premiumdata.forEach((item) => {
        const newli = document.createElement("div");
        newli.innerHTML = `
          <div class="card">
            <div class="card-body">
              <p class="card-text">User-name:${item.Name}</p>
              <p class="card-title">Total-Expense:${item.Amount}</p>
            </div>
          </div>
        `;
        newitem.appendChild(newli);
      });
    }

    const leedbtn = document.querySelector(".leed-btn");
    if (leedbtn) {
      leedbtn.addEventListener("click", () => {
        showleedboard(premiumdata);
      });
    }

  } catch (error) {
    console.error("Error in adddataTobody:", error);
  }
}

const deletebtn = async (id) => {
  try {
    const accessToken = JSON.parse(localStorage.getItem("Accesstoken"));
    const response = await axios.delete(
      `http://localhost:9000/api/v1/Expense/deleteexpense/${id}`,
      {
        headers: {
          Authorization: `Bearer${accessToken}`,
        },
      }
    );
    Toastify({
      text: "Item Deleted",
      newWindow: true,
      duration: 3000,
      close: true,
      style: {
        background: "linear-gradient(to right, #00b09b, #FF0000)",
        position: "absolute",
        zIndex: 9999,
        right: 0,
        width: "23%",
        height: "20vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: "translate(0px, 0px)",
        transition: "all 1s ease-in-out",
      },
    }).showToast();

    await fetchallexpense();
  } catch (error) {
    console.log(error);
  }
};
