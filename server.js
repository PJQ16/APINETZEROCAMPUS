const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const {swaggerSpec,swaggerUi } =require('./connect/swaggerConfig');
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/uploads',express.static('./uploads'))
app.use('/images',express.static('./images'))
app.use('/sourcesfile',express.static('./sourcesfile'))
app.use('/logos',express.static('./logos'));
app.use(helmet());
const conn = require('./connect/con');
require('dotenv').config();
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;

const port = process.env.MYSQL_PORT




/*  const corsOption = {
  origin:'https://asia-southeast1-dt-2022-01-digital-twin.cloudfunctions.net/',
}  

/*  app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-origin','https://netzero-cmu.web.app');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  res.setHeader('Access-Control-Allow-Credentials',true)
  next()
})  */

app.use(cors( /*  corsOption  */ )); 





app.get('/checkConnect',async(req,res)=>{
    try {
        await conn.authenticate();
        res.status(200).send('Connection has been established successfully.');
      } catch (error) {
        res.status(500).send('Unable to connect to the database:', error);
      }
})



//ใช้ในการจัดการscope หมวดหมู่
app.use(require('./controller/ScopeController'));
app.use(require('./controller/PlaceController'));
app.use(require('./controller/UserController'));
app.use(require('./controller/ActivityPeriodController'));
app.use(require('./controller/SourcesFileController'));
app.use(require('./controller/ImageFileController'));
app.use(require('./controller/UncertaintyController'));
app.use(require('./controller/SignificanceController'));
app.use(require('./controller/ReportController'));
app.use(require('./controller/GoogleMapController'));
app.use(require('./controller/ForgotPasswordController'));
app.use(require('./controller/VerificationController'));
app.use(require('./controller/RemoveActivityController'));
//oauth
/* app.use(require('./auth/oauth')); */
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.listen(port,()=>{
    console.log(`server connecting http://localhost:${port}`);
})