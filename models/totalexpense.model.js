const  Totalexpense=(dbConnect, Sequelize)=>{
    const totalexpenses=dbConnect.define('totalexpenses',{
        Name:{
            type:Sequelize.STRING,
            allowNull: false,
        },
        Amount:{
            type:Sequelize.INTEGER,
            allowNull: false,
        },
         UserId:{
            type:Sequelize.INTEGER,
            allowNull: false,
        }
    })
    
    return totalexpenses
    }
    export default Totalexpense