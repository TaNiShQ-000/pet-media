import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt'

const app = new Hono()

app.use('/posts/*', async (c, next) => {
  const jwt = c.req.header('Authorization');
  if (!jwt) {
    c.status(401);
    return c.json({ error: "unauthorized" });
  }
  const token = jwt.split(' ')[1];
  //@ts-ignore
  const payload = await verify(token, c.env.JWT_SECRET);
  if (!payload) {
    c.status(401);
    return c.json({ error: "unauthorized" });
  }
  // c.set('userId', payload.id);
  await next()

})
app.get('/', async (c) => {
  c.text("hello hono !!")
})

app.post('/signup', async(c) => {
  // return c.text('signing up!')
  const prisma = new PrismaClient({
    //@ts-ignore
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  const body = await c.req.json();

  try{
    const user = await prisma.user.create({
      data:{
        email:body.email,
        password: body.password,
      }
    })
    //@ts-ignore
    const token = await sign({id:user.id}, c.env.JWT_SECRET)
    c.json({jwt:token})
  }catch(e){
    console.log(e);
    c.text("error while signing up")
  }

})

app.post('/signin', async(c) => {
  const body = await c.req.json();
  const prisma = new PrismaClient({
    //@ts-ignore
    datasourceUrl:c.env.DATABASE_URL
  }).$extends(withAccelerate())

  try{
    // const user = await prisma.user.findUnique({
    //   where:{
    //     email:body.email
    //   }
    // })
    // if(!user){
    //   return c.text('user not found')
    // }
    // if(user.password !== body.password){
    //   return c.text('invalid password')
    // }
    // //@ts-ignore
    // const token = await sign({id:user.id}, c.env.JWT_SECRET)
    // c.json({jwt:token})
    const user = await prisma.user.findFirst({
      where:{
        email: body.email
      }
    })
    if(!user){
      c.status(403);
      c.json({
        message:"error generated"
      })
    }
    //@ts-ignore
    const jwt = await sign({id:user.id}, c.env.JWT_SECRET)
    c.text(jwt);
  }catch(e){
    console.log(e);
    c.text("error while signing in")
  }
})

app.post('/post', (c) => {
  return c.text('create new post!')
})

app.put('/post', (c) => {
  return c.text('updating post!')
})

app.get('/post', (c) => {
  return c.text('get post!')
})

export default app
