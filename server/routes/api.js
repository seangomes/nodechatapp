const express = require('express');
const router = express.Router();

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

router.get('/messages', (req, res) => {
  // Get posts from the mock api
  let messages = [
    {name: "Jens", message: "Hej allesammen"},
    {name: "Glenn", message: "Hej med dig Jens!"},
    {name: "Peter", message: "Hvordan går det?"}
  ];
  //console.log(messages);
  res.send(messages);

});

module.exports = router;