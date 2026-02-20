const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

/* ================= CORS FIX ================= */
app.use(cors({
    origin: "http://127.0.0.1:5501",
    methods: ["GET","POST","OPTIONS"],
    allowedHeaders: ["Content-Type","Authorization"]
}));

app.use(express.json());

const SECRET = "fidelity-secret";

/* ================= DATABASE ================= */
const db = new sqlite3.Database("./fidelity.db");

db.serialize(() => {

    db.run(`CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT,
        name TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS wallet(
        userId INTEGER,
        balance INTEGER DEFAULT 0
    )`);

});

/* ================= SIGNUP ================= */
app.post("/api/auth/signup", async (req,res)=>{

    const {email,password,name} = req.body;

    if(!email || !password || !name){
        return res.status(400).json({success:false,message:"Missing fields"});
    }

    const hash = await bcrypt.hash(password,10);

    db.run(
        "INSERT INTO users(email,password,name) VALUES(?,?,?)",
        [email,hash,name],
        function(err){

            if(err){
                return res.json({success:false,message:"User already exists"});
            }

            db.run("INSERT INTO wallet(userId) VALUES(?)",[this.lastID]);

            const token = jwt.sign({id:this.lastID}, SECRET);

            res.json({
                success:true,
                token
            });
        }
    );
});

/* ================= LOGIN ================= */
app.post("/api/auth/login",(req,res)=>{

    const {email,password} = req.body;

    db.get(
        "SELECT * FROM users WHERE email=?",
        [email],
        async(err,user)=>{

            if(!user){
                return res.json({success:false,message:"User not found"});
            }

            const valid = await bcrypt.compare(password,user.password);

            if(!valid){
                return res.json({success:false,message:"Wrong password"});
            }

            const token = jwt.sign({id:user.id},SECRET);

            res.json({
                success:true,
                token
            });
        }
    );
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("✅ Server running on port " + PORT);
});
    