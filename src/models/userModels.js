const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "..", "database", "users.json");

async function readDB() {
    const data = await fs.promises.readFile(DB_PATH, "utf-8");
    return JSON.parse(data);
}

async function writeDB(data) {
    await fs.promises.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

module.exports = {
    getAllUsers: async () => {
        const db = await readDB();
        return db.users;
    },

    findUserByEmail: async (email) => {
        const db = await readDB();
        return db.users.find(user => user.email === email);
    },

    createUser: async (newUser) => {
        const db = await readDB();
        db.users.push(newUser);
        await writeDB(db);
    }
};
