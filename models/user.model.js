
 const User=(dbConnect,Sequelize)=>{
   
    const user=dbConnect.define('user',{
        id:{
            type:Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        Name:{
            type:Sequelize.STRING,
            allowNull: false,
        },
        Email:{
            type:Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        Phone:{
            type: Sequelize.STRING,
            allowNull: false,
        },
        Password:{
            type:Sequelize.STRING,
            allowNull: false,
        },
        Ispremium:{
            type: Sequelize.BOOLEAN,
            allowNull: false,
        }


    })
   
return user
}
export default User