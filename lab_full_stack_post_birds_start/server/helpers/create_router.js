const express = require('express');
const ObjectID = require('mongodb').ObjectID;

const createRouter = function (collection) {

  const router = express.Router();

  router.get('/', (req, res) => {
    collection
      .find()
      .toArray()
      .then((docs) => res.json(docs))
      .catch((err) => {
        console.error(err);
        res.status(500);
        res.json({ status: 500, error: err });
      });
  });

  router.get('/:id', (req, res) => {
    const id = req.params.id;
    collection
      .findOne({ _id: ObjectID(id) })
      .then((doc) => res.json(doc))
      .catch((err) => {
        console.error(err);
        res.status(500);
        res.json({ status: 500, error: err });
      });
  });

  //create
  router.post('/', (req, res)=>{
    const newData = req.body;
    collection
      .insertOne(newData)
      //this returns all docs in our collection
      //.then(()=> collection.find().toArray())
      .then((result)=> {
        res.json(result.ops[0])
      })
      .then((docs)=> res.json(docs))
      .catch((err)=>{
        console.error(err);
        res.status(500);
        res.json({status:500, error: err})
      });
  });

  //destroy
  router.delete('/:id', (req, res)=>{
    const id= req.params.id;
    collection
      .deleteOne({_id:ObjectID(id)})
      .then(result => {
        res.json(result)
      })
      .catch((err)=>{
        console.error(err);
        res.status(500);
        res.json({status:500, error: err}); 
      })
  })

  //update
  router.put('/:id', (req, res)=>{
    const id= req.params.id;
    const updataData= req.body;
    collection.findOneAndUpdate(
      {_id:ObjectID(id)},
      ({$set: updataData}),
      {returnOriginal:false}
      )
      .then((result)=> {
        res.json(result.value)
      })
      .catch((err)=>{
        console.error(err);
        res.status(500);
        res.json({status:500, error: err}); 
      })

  })



  return router;
};

module.exports = createRouter;
