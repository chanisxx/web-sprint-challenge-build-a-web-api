// Write your "projects" router here!
const express = require('express');
const Projects = require('./projects-model');

const router = express.Router();

router.use((req, res, next) => {
    console.log('In the project router');
    next();
});

// get all projects
router.get('/', (req, res) => {
    Projects.get()
    .then(r => {
        if(r) {
            res.status(200).json(r);
        } else {
            return []
        }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Error retrieving the projects',
      });
    });
});

// add a project
router.post('/', validateProject, (req, res) => {
    Projects.insert(req.currentProject)
    .then(project => {
      res.status(201).json(project);
    })
    .catch(err => {
      res.status(500).json({message: "Error adding a project", err});
    })
})

//modify a project
router.put('/:id', validateProjectId, validateProject, (req, res) => {
    Projects.update(req.params.id, req.body)
    .then(project => {
      res.status(200).json(project);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({message: 'There was an error updating project'})
    })
})

//delete id
router.delete('/:id', validateProjectId, (req, res) => {
    Projects.remove(req.params.id)
    .then(count => {
        if(count) {
            res.status(200).json({ message: `${count} account deleted: ${req.project.name}`})
        } else {
            res.status(404).json({message: "Invalid project ID"})
        }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: 'Error removing the project' });
    });
})

// get project given id
router.get('/:id', validateProjectId, (req, res) => {
    Projects.get(req.params.id)
    .then(action => {
      res.status(200).json(action)
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: 'Error retrieving project' });
    });
})

// get actions in project with given id
router.get('/:id/actions', (req, res) => {
    Projects.getProjectActions(req.params.id)
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

function validateProjectId(req, res, next) {
    const { id } = req.params;
    Projects.get(id)
    .then(project => {
      if(project) {
        req.project = project;
        next();
      } else {
        next({code: 404, message: "Invalid project ID"});
      }
    })
    .catch(err => {
      console.log(err);
      next({code: 500, message: "Failed to process request", err});
    })
  }
  
  function validateProject(req, res, next) {
      const input = ["name", "description"];
      const request = req.body;
    if(request) {
      if(input.every(key => request.hasOwnProperty(key))) {
        req.currentProject = request;
        next();
      } else {
        next({code: 400, message: "Missing required name or description field"});
      }
    } else {
      next({code: 400, message: "Missing user data", user: req.body});
    }
  }

  
//   function validateAction(req, res, next) {
//     // if(req.body && Object.keys(req.body) > 0) {
//       if(req.body.text) {
//         next();
//       } else {
//         next({code: 404, message: "Please include text"});
//       }
//     // } else {
//       // next({code: 404, message: "Please include a request body"});
//       // res.status(500).json({message: 'please include a request body'})
//     // }
//   };

module.exports = router;
