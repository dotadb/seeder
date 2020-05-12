declare namespace NodeJS {
  export interface ProcessEnv {
    MONGO_URI: string

    ALGOLIA_APP_ID: string
    ALGOLIA_APP_KEY: string
  }
}
