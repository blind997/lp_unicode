import pino from "pino"
const logger= pino({
    transport:{//customizes the format of th log output
          target:"pino-pretty"
             
    }
})
export default logger;