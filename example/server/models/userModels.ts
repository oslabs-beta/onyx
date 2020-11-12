import { MongoClient } from '../../deps.ts';

const client = new MongoClient();
const Mongo_URI: string = Deno.env.get('MONGOURI')!;
client.connectWithUri(Mongo_URI);

interface UserSchema {
  _id: { $oid: string };
  username: string;
  password: string;
}

const db = client.database('userdatabase');
const User = db.collection<UserSchema>('user');

export default User;
