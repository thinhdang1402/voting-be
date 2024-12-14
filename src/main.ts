import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import * as compression from 'compression'
import helmet from 'helmet'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 2592000,
  })

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  app.use(compression())
  app.use(helmet())

  // Start the application
  await app.listen(3008)

  console.info(`⚡️[server]: Server is running at ${await app.getUrl()} `)
}
bootstrap()
