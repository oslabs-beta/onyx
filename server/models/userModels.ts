import { MongoClient } from '../../deps.ts';

const client = new MongoClient();
client.connectWithUri(Deno.env.get('MONGO_URI'));

// Using TypeScript interface in place of a mongoose schema
interface UserSchema {
    _id: { $oid: string },
    username: string,
    password: string,
  }

const db = client.database('deno');
const users = db.collection<UserSchema>('users');

export default users;
