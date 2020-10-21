import { Router } from '../../deps.ts'
import App from "../views/App.tsx";
import userController from './controllers/authController.ts'
// import users from './models/userModels.ts'

const router = new Router();

router.get('/login', (ctx) => {
    ctx.response.body = 'do a post request';
    console.log('in login!')
})

router.post('/login', userController.verifyUser) 

router.post('/register', userController.createUser)


// this works too, more in the callback style of express
// router.post('/login', async(ctx) {
//     console.log('in post login, before awaiting userController')
//     await userController.createUser(ctx);
//     console.log('in post login, after waiting for userController')
// })




export default router;