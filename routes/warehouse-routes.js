const router = require('express').Router();

const useController = require('../controllers/warehouse-controller');

router.route('/').get(useController.index).post(useController.add);
router.route('/:id').get(useController.findOne);

module.exports = router;
