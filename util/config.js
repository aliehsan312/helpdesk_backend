require('dotenv').config()

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT || 3001,
  SECRET: 'SQLAPP',
  SW_TECH_ID: Number(process.env.SW_TECH_ID) || 5,
HW_TECH_ID: Number(process.env.HW_TECH_ID) || 3,
HW_SUPR_ID: Number(process.env.HW_SUPR_ID) ||1,
SW_SUPR_ID: Number(process.env.SW_SUPR_ID) ||4,
USER_ID: Number(process.env.USER_ID) ||2,
WAITING_ID: Number(process.env.WAITING_ID) ||1,
ASSIGNED_ID: Number(process.env.ASSIGNED_ID) ||2,
IN_PROCESS_ID: Number(process.env.IN_PROCESS_ID) ||3,
 ATTENDED_ID: Number(process.env.ATTENDED_ID) || 5,
CLOSED_ID: Number(process.env.CLOSED_ID) ||  4 ,
USER_ACCESS_LEVEL: Number(process.env.USER_ACCESS_LEVEL) || 1,
TECH_ACCESS_LEVEL: Number(process.env.TECH_ACCESS_LEVEL) || 2,
SUPR_ACCESS_LEVEL: Number(process.env.SUPR_ACCESS_LEVEL) || 3,
}