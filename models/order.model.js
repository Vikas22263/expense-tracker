

 const Order=(dbConnect,Sequelize)=>{
   
    const order=dbConnect.define('order',{
        id:{
            type:Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        order_id:{
            type:Sequelize.STRING,
            allowNull: false,
        },
        payment_id:{
            type:Sequelize.STRING,
            allowNull: false,
        },
        status:{
            type:Sequelize.STRING,
            allowNull: false,
           
        },

       

    })
return order
}
export default Order