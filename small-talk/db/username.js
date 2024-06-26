"use server"
const uri = "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@" + process.env.DB_URL
import Mongoboi from "./mongo"
export default async function userExists(username) {
    "use server"
    const mongoboi = new Mongoboi(uri, "Users")
    var filter = {
      username: username, //check for existing username in db
    }
    await mongoboi.connect();
    const user = await mongoboi.findOne("patients", filter)
    await mongoboi.disconnect();
  
    if (user != null) {
      return false; //username is used
    }
    return true; // username is not taken
  }