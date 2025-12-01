const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "..", "database", "users.json");

function readDB() {
    const data = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(data);
}

function writeDB(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

module.exports = {
    getAllUsers: ()=> {
        return readDB().users;
    },

    findUserByEmail: (email) => {
        const { users } = readDB();
        return users.find(user => user.email === email);
    },

    createUser: (newUser) => {
        const db = fs.readDB();
        db.users.push(newUser);
        writeDB(db);
    }
}