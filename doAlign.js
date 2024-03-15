require("dotenv").config()

const DEFAULT_JP_FILE_LOCATION = process.env.DEFAULT_JP_FILE_LOCATION

const fs = require("fs")

// To read the file
const data = fs.readFileSync(DEFAULT_JP_FILE_LOCATION, "utf8")
console.log(data)

// To write the file
fs.writeFileSync(DEFAULT_JP_FILE_LOCATION, "Your content here")
//file written successfully
