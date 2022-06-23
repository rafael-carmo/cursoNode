//Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUmFmYWVsI
//iwiaWQiOiI2MmI0Njg5MjNkM2ZjZmU0OTJlYjEyMzQiLCJpYXQiOjE2NTU5OTUyMzR9.4n88XwTGtIlzULDy4wJ4vHnz
//O token vem dessa forma, por isso é preciso separar a palavra Bearer dele

const getToken = (req) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]

    return token
}

module.exports = getToken