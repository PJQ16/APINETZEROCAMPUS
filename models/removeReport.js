const { DataTypes } = require('sequelize');
const conn = require('../connect/con')

const RemoveActivitty = conn.define('removeActivity', {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey:true,
      autoIncrement:true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull:false
    },
    activityId:{
        type:DataTypes.STRING(255),
        allowNull:false
    },
  });

RemoveActivitty.sync(  {alter:true} );
module.exports = {RemoveActivitty}