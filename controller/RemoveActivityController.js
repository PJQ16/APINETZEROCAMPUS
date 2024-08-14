const express = require('express');
const { Op } = require("sequelize");
const app = express();
app.use(express.json());


const {RemoveActivitty} = require('../models/removeReport');
const {ActivityGHGModel} =  require('../models/activityYear');
app.post('/saveRemoveActivity', async (req, res) => {
    try {
        const { email, activityId } = req.body;
        if (!email || !activityId) {
            return res.status(400).json('Missing email or activityId');
        }
        // ตรวจสอบว่าการสร้างข้อมูลสำเร็จ
         await RemoveActivitty.create({ email, activityId });
         await ActivityGHGModel.destroy({
            where:{
                id:activityId
            }
        })
        res.status(200).json('Save Remove Activity successfully');
    } catch (e) {
        res.status(500).json(`Server Error: ${e.message}`);
    }
});
module.exports = app;