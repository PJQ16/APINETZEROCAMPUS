const express = require('express')
const app = express();
const {CampusModels,PlaceCmuModels} = require('../models/placeAtCmuModels');

/**
 * @swagger
 * /place/showAllPlace:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     tags: [Campus and Faculties ]
*/
app.get('/place/showAllPlace',async(req,res)=>{
    try {
        const ShowData = await CampusModels.findAll({
            attributes: [
                'id',
                'campus_name',
            ],
            include: [
                {
                    model: PlaceCmuModels,
                    attributes: [
                        'id',
                        'fac_name',
                    ],
                }
            ]
        });
    
        res.json(ShowData); // Add this line to send the response
    } catch (e) {
        res.status(500).json(e.message);
    }
    
});

/**
 * @swagger
 * /place/showCampus/:id:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     tags: [Campus and Faculties ]
*/
app.get('/place/showCampus/:id',async(req,res)=>{
    try {
    
        const ShowData = await PlaceCmuModels.findAll({
            where:{
                campus_id:req.params.id,
            }
        });
    
        res.json(ShowData); // Add this line to send the response
    } catch (e) {
        res.status(500).json(e.message);
    }
    
});

/**
 * @swagger
 * /place/showCampus:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     tags: [Campus and Faculties ]
*/
app.get('/place/showCampus',async(req,res)=>{
    try{
        const ShowData = await CampusModels.findAll();
        res.status(200).json(ShowData);
    }catch(e){
        res.status(500).json('Error Server ' + e.message);
    }
})

/**
 * @swagger
 * /place/showFaculty:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     tags: [Campus and Faculties ]
*/
app.get('/place/showFaculty',async(req,res)=>{
    try{
        const ShowData = await PlaceCmuModels.findAll();
        res.status(200).json(ShowData);
    }catch(e){
        res.status(500).json('Error Server ' + e.message);
    }
});

const { Logo } = require('../middleware/logo');
/**
 * @swagger
 * /place/updateLogo/:id:
 *   put:
 *     summary: Update logo of a place by ID
 *     description: Update the logo of a place by providing its ID and uploading a new logo file.
 *     tags: [Campus and Faculties ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the place to update logo
 *       - in: formData
 *         name: logo
 *         required: true
 *         type: file
 *         description: Logo file to upload
 *     responses:
 *       '200':
 *         description: Updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Updated successfully
 *       '404':
 *         description: Data not found or no update needed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Data not found or no update needed
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error Server
 */

app.put('/place/updateLogo/:id', Logo, async (req, res) => {
    try {
        const data = {
            logo: req.file.filename // ชื่อไฟล์ที่อัพโหลด
        };

        // ให้ใช้งานฟังก์ชัน update ด้วยการระบุอ็อบเจกต์ของข้อมูลที่ต้องการอัพเดท และเงื่อนไขในการอัพเดท
         const updateData = await PlaceCmuModels.update(data, {
            where: {
                id: req.params.id
            }
        }); 

        // ตรวจสอบว่ามีการอัพเดทข้อมูลหรือไม่ ถ้ามีให้ส่งข้อมูลที่อัพเดทแล้วกลับไป
         if (updateData[0] === 1) {
            res.status(200).json({ message: 'Updated successfully' });
        } else {
            res.status(404).json({ message: 'Data not found or no update needed' });
        } 
    } catch (e) {
        res.status(500).json('Error Server ' + e.message);
    }
});







module.exports = app