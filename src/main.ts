import { Hono } from 'hono'
import userRoutes from './view/router/userRouters'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/users', userRoutes)

export default app
