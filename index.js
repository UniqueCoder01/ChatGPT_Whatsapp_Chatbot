const express = require("express");
const twilio = require("twilio");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const accountSid = process.env.TWILLO_ACCOUNT_SID;
const authToken = process.env.TWILLO_ACCOUNT_TOKEN;
const client = twilio(accountSid, authToken);

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
app.get("/", (req, res) => {
  res.send("ok");
});
const handleMessage = (body, from, to) => {
  client.messages
    .create({
      body: body,
      from: to,
      to: from,
    })
    .then((message) => console.log(message.sid))
    .catch((err) => console.log(err));
};
app.post("/message", async (req, res) => {
  //   console.log(req.body);
  const body = req.body.Body;
  const from = req.body.From;
  const to = req.body.To;

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: body,
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  const newResponse = response.data.choices[0].text;
  //   console.log(response.data.choices[0].text);
  handleMessage(newResponse, from, to);
});

app.listen(3002, () => {
  console.log("server running successful");
});
