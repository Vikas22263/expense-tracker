 const expense=(dbConnect, Sequelize)=>{
const expenses=dbConnect.define('expense',{
    id:{
        type:Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    Amount:{
        type:Sequelize.STRING,
        allowNull: false,
    },
    Description:{
        type:Sequelize.STRING,
        allowNull: false,
    },
    Category:{
        type:Sequelize.STRING,
        allowNull: false,
    },
 
     UserId:{
        type:Sequelize.INTEGER,
        allowNull: false,
    }
})

return expenses
}
export default expense