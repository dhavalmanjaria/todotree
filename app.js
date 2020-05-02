let express = require('express')
let path = requre('path')
let app = express()

// Configure app to serve static files from public folder
app.use(express.static(path.join(__dirname, 'dist')))

app.get('/', (req, res, next) => {
	// Respond with index.html
	req.sendFile('index.html')
})

app.listen(3000 ||  process.env.PORT, () => {
	console.log("Server listening on 3000. Welcome to express")
})