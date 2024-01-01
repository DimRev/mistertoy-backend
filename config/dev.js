import { ADMIN_PASSWORD } from "../globalVars.js";

export default {
    dbURL: `mongodb+srv://Admin:${ADMIN_PASSWORD}@mistertoy.ku3ejxj.mongodb.net/`,
    // dbURL: 'mongodb://localhost:27017',
    dbName: 'toys_db',
}
