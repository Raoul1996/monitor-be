export const getMailTransport  = (host,user,passwd)=> `smtps://${user}@${host}:${passwd}@smtp.${host}`
