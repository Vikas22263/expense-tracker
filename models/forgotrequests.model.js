const Forgotpassword = (dbConnect, Sequelize) => {
  const forgotpassword = dbConnect.define("Forgotpassword", {
    token: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      allowNull: false,
    },
    UserId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    isactive: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
  });

  return forgotpassword;
};

export default Forgotpassword;
