import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('/signup', (c) => {
  return c.text('signing up!')
})

app.post('/signin', (c) => {
  return c.text('signing in!')
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
