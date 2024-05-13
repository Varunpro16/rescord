const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const uniqid = require('uniqid');
const http = require('http');
const { Server } = require('socket.io');
const { log } = require('console');
const { Schema } = mongoose;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
const dbURI = 'mongodb://127.0.0.1:27017/rescord';

const dbConnection = mongoose.createConnection(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

const UserSchema = new mongoose.Schema({
    name:{type:String,required:true},
    role:{type:String,required:true,unique:true},
    id:{type:Number,required:true,unique:true},
    isAgency:{type:Boolean,default:false,},
    phoneNumber:{type:Number,unique:true},
    password:{type:String,required:true,unique:true},
    isRequested:{type:Boolean,default:false,},
    isAvailable:{type:Boolean,default:false,},
    location:{type:Array,default:[]}
})

const MissionSchema = new mongoose.Schema({
    peoples:{type:Array,required:true},
    location:{type:Array,required:true}
})

const MessageSchema = new mongoose.Schema({
    msg:{type:String},
    user:{type:String}
})

const User = dbConnection.model("users",UserSchema)
const Mission = dbConnection.model("missions",MissionSchema)
const Message = dbConnection.model("msgs",MessageSchema)


dbConnection.on('connected', () => {
    console.log('Connected to DB...');
});

dbConnection.on('error', (err) => {
    console.log('connection error:');
});

io.on('connection', (socket) => {
    socket.on('chat message', (data) => {
    const message = new Message({
        msg:data.msg,
        user:data.user
    });
    message.save().then(() => {
        io.emit('chat message', data); // Broadcast the message to all connected clients
        });
    });

    // Handle client disconnection
    socket.on('disconnect', () => {
        console.log(`Client disconnected`);
    });

  // ...
});

app.use(bodyParser.json())
app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json())

app.post('/login', async (req, res) => {
    console.log('login');
    const user = await User.findOne({
        id:req.body.id,
        password:req.body.password,
    });
    await User.updateOne(
        {id:req.body.id},
        {$set:{isAvailable:true}})
    
    if(user){
        res.json({
            status:"success",
            code:200,
            id:user._id,
            role:user.role
        })
    }else{
        res.json({
            status:"failure",
            code:404
        })
    }
});

app.post('/requestSubmit',async(req,res)=>{
    const location=req.body.location;
    const issueType=req.body.issueType;
    const id=req.body.id;
    if(location && issueType && id){
        const mission = new Mission({
            peoples:[id],
            location:location
        })
        await mission.save()
        .then(result => {
        console.log("success");
        io.emit('pageConnect',{
            location:location,
            issueType:issueType,
            missionId:mission._id,
            neededTypes:['landslide']
        })
        res.json({
            status:"success",
            code:200,
            missionId:mission
            ._id
        });
        })
        .catch(error => {
        console.log("failure");
        res.json({
            status:"failure",
            code:404
        });
        });
    }
})

app.post('/addAgency',async(req,res)=> {
    const result=await Mission.updateOne(
        {_id:req.body.missionId},
        { $push: { peoples: req.body.agencyId } }
    )
    if (result.matchedCount === 1 && result.modifiedCount === 1) {
        res.json({
            status:"success",
            code:200,
            missionId:req.body.missionId
        })
    }else{
        res.json({
            status:"failure",
            code:404
        })
    }
})

app.post('/getPeoples',async(req,res)=>{
    console.log("getpeople");
    const peoples=await Mission.findOne(
        {_id:req.body.missionId}
    )
    // console.log(peoples);
    const missions = await User.find({ _id: { $in: peoples.peoples } });

    console.log("missions: ",missions);
    const locations = missions.map((mission) => [
        mission.isAgency===false ? "Issue Place" : mission.name,
        mission.location
    ]);

    
    console.log('Locations:', locations);
    if(missions && locations){
        res.json({
            status:"success",
            code:200,
            locations:locations
        })
    }else{
        res.json({
            status:"failure",
            code:404,
        })
    }
    
})


app.get('/getMsgs',async(req,res)=> {
    const msgs =await Message.find({})
    res.json({
        status:"success",
        code:200,
        msgs:msgs
    })
})



server.listen(5000,()=>{
    console.log("server is running");
})