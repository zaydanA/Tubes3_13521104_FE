const { Configuration, OpenAIApi } = require("openai");
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const configuration = new Configuration({
    organization: "org-ZSjJflRbhq8yCVHxxtgQTU2d",
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);


const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 3080
app.post('/',async(req,res) => {
    const {messages}=req.body;
    // console.log(message);
    const completion = await openai.createChatCompletion({
        // model: "text-davinci-003",
        // prompt: `${message}`,
        model: "gpt-3.5-turbo",
        messages: [
            {role:"system", content: "Your are helpful assistant chatbot"},
            {role: "user", content: `${messages}`}
            // {role: "user", content: `${message}`}
        ],        
        max_tokens: 1024,
        // temperature: 0.5,
      });
      res.json({
        completion:completion.data.choices[0].message,
      })
})

app.listen(port, () => {
    console.log('Example app listening at http://localhost:' + port)
})