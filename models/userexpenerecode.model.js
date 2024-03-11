

const Expensereocord = (dbConnect, Sequelize) => {
    const expensereocord = dbConnect.define("Expensereocrd", {
  
  
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Record: {
        type: Sequelize.STRING,
       
      },
    });
  
    return expensereocord;
  };
  export default Expensereocord;
  