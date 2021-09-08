module.exports = (sequelize, Sequelize) => {
  return sequelize.define("user", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    title: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    memo: {
      type: Sequelize.STRING(300),
      allowNull: false
    },
    name: {
      type: Sequelize.STRING(30),
      allowNull: false
    },
    status: {
      type: Sequelize.STRING(30),
      allowNull: false
    }
  });
};
