const express = require('express');
const TodosController = require('../controllers/todos-controller');
const isOwnedMiddleware = require('../middlewares/is-owned-middleware');

const router = express.Router();

router.get('/', TodosController.findAll);
router.get('/:id', isOwnedMiddleware, TodosController.findOne);
router.post('/', TodosController.create);
router.put('/:id', isOwnedMiddleware, TodosController.update);
router.delete('/:id', isOwnedMiddleware, TodosController.delete);

module.exports = router;
