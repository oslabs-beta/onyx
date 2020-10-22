import { MongoClient } from '../../../deps.ts';

const client = new MongoClient();
const Mongo_URI: string  = Deno.env.get("MONGOURI")!; // Add exclamation point to let Typescript know that 'string | undefined' type will be a string
client.connectWithUri(Mongo_URI);

// Using TypeScript interface in place of a mongoose schema
interface UserSchema {
    _id: { $oid: string },
    username: string,
    password: string,
}


// interface UserSchema {
//   _id: { $oid: string },
//   username: object,
//   password: string,
// }

// {
//   type: string;
//   unique: boolean;
// }



const db = client.database('userdatabase');
const User = db.collection<UserSchema>('user');

export default User;