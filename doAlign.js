require("dotenv").config()

const { JP_INPUT_LOCATION, CN_INPUT_LOCATION, DI_INPUT_LOCATION, OUTPUT_LOCATION } = process.env

const fs = require("fs")

// To read the file
const data = fs.readFileSync(JP_INPUT_LOCATION, "utf8")
console.log(data)

// To write the file
fs.writeFileSync(OUTPUT_LOCATION, data, "utf8")
//file written successfully
