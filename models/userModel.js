const { DataTypes } = require('sequelize');
const conn = require('../connect/con')
const {PlaceCmuModels} = require('../models/placeAtCmuModels');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const RoleModels = conn.define('role',{
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey:true,
        autoIncrement:true
      },
    role_name:{
        type: DataTypes.STRING(255),
        allowNull:false,
        unique:true
    }

}) 



const UsersModels = conn.define('user', {
                      id: {
                        type: DataTypes.INTEGER(11),
                        primaryKey:true,
                        autoIncrement:true
                      },
                      fname: {
                        type: DataTypes.STRING(255),
                        allowNull:false
                      },
                      sname:{
                        type: DataTypes.STRING(255),
                        allowNull:false
                      },
                      email:{
                        type:DataTypes.STRING(255),
                        allowNull:false,
                        unique:true
                      },
                      password:{
                        type: DataTypes.STRING(255),
                        allowNull: false,
                      },
                      role_id:{
                        type: DataTypes.INTEGER(11),
                        allowNull: false,
                      },
                      fac_id:{
                        type: DataTypes.STRING(255),
                        allowNull: false,
                      },
                      verificationToken: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                      },
                      verificationTokenExpiry: {
                        type: DataTypes.DATE,
                        allowNull: true,
                      },
                      isVerified: {
                        type: DataTypes.TINYINT(1), // TINYINT(1) for boolean-like behavior
                        defaultValue: 0 // Default value is 0 (false)
                      }
                    
                    });
  
                    RoleModels.hasMany(UsersModels,{foreignKey:'role_id'});
                    UsersModels.belongsTo(RoleModels,{foreignKey:'role_id'});

                    PlaceCmuModels.hasMany(UsersModels,{foreignKey:'fac_id'});
                  UsersModels.belongsTo(PlaceCmuModels,{foreignKey:'fac_id'});   
  
                    //กำหนดpass word ให้เป็น hash
                    UsersModels.beforeCreate(async (user, options) => {
                        const hash = await bcrypt.hash(user.password, 10);
                        user.password = hash;
                      });

 UsersModels.sync(       {alter:true}      );
 RoleModels.sync(   /*   {alter:true}   */   );

 module.exports = {UsersModels,RoleModels}