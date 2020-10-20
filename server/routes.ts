import { Router } from '../deps.ts'
import App from "../views/App.tsx";
// import users from './models/userModels.ts'

const router = new Router();

router.get('/', (ctx) => {
    ctx.response.body = 'hi!';
})


export default router;


