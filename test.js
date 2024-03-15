const { logStuff } = require("./folder/stuff")

a = 5 + 5
console.log(a)

logStuff("Hello World")

const MyClass = require("./folder/hello")

const myInstance = new MyClass("John Doe")
myInstance.sayHello() // Outputs: Hello, my name is John Doe
