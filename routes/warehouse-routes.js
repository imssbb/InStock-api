const router = require('express').Router();

const useController = require('../controllers/warehouse-controller');

router.route('/').get(useController.index).post(useController.add);
router
  .route('/:id')
  .get(useController.findOne)
  .put(useController.update)
  .delete(useController.remove);

router.route('/:id/inventories').get(useController.inventories);

module.exports = router;
