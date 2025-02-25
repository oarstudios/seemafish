const express = require('express');
const router = express.Router();
const ftdController = require('../controllers/ftdController');

router.post('/', ftdController.createFtd);
router.get('/', ftdController.getAllFtds);
router.get('/:id', ftdController.getFtdById);
router.delete('/:id', ftdController.deleteFtd);

module.exports = router;
