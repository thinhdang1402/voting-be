type Env = 'development' | 'staging' | 'production'
const env: Env = (process.env.NODE_ENV as Env) || 'development'

const configuration = () => ({
  server: { env },
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucketName: process.env.AWS_BUCKET_NAME,
    region: process.env.AWS_REGION,
  },
  twilioSms: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    serviceId: process.env.TWILIO_SERVICE_ID,
  },
  kafka: {
    url: process.env.KAFKA_SERVICE_URL,
  },
})

export type EnvironmentVariables = ReturnType<typeof configuration>

export default configuration
