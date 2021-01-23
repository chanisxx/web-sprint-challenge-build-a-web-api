// Write your "actions" router here!
const express = require('express');
const Actions = require('./actions-model');

const router = express.Router();

router.use((req, res, next) => {
    console.log('In the actions router');
    next();
});

router.get('/', (req, res) => {
    Actions.get()
    .then(r => {
      res.status(200).json(r);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Error retrieving the actions',
      });
    });
});

// get an action given id
router.get('/:id', validateActionId, (req, res) => {
    Actions.get(req.params.id)
    .then(r => {
        res.status(200).json(r);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Error retrieving the actions',
      });
    });
});

// add a action
router.post('/:id', validateAction, validateActionId, (req, res) => {
    Actions.insert(req.action)
    .then(action => {
      res.status(201).json(action);
    })
    .catch(err => {
      res.status(500).json({message: "Error adding an action", err});
    })
})

//modify an action
router.put('/:id', validateAction,validateActionId,(req, res) => {
    Actions.update(req.params.id, req.body)
    .then(actions => {
      res.status(200).json(`Action ${actions.notes} updated`);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({message: 'There was an error updating action'})
    })
})

//delete action
router.delete('/:id', validateActionId, (req, res) => {
    Actions.remove(req.params.id)
    .then(count => {
      res.status(200).json({ message: `${count} account deleted`})
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: 'Error removing the action' });
    });
})

function validateAction(req, res, next) {
    const input = ["notes", "description"];
    const request = req.body;
  if(request) {
    if(input.every(key => request.hasOwnProperty(key))) {
        const action = {...req.body, project_id: req.params.id};
        req.action = action;
      next();
    } else {
      next({code: 400, message: "Missing required name or description field"});
    }
  } else {
    next({code: 400, message: "Missing user data", user: req.body});
  }
}

function validateActionId(req, res, next) {
    const { id } = req.params;
    Actions.get(id)
    .then(action => {
      if(action) {
        next();
      } else {
        next({code: 400, message: "Invalid action ID"});
      }
    })
    .catch(err => {
      console.log(err);
      next({code: 500, message: "Failed to process request", err});
    })
  }

module.exports = router;
