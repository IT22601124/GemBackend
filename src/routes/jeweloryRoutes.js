const express = require('express');
const router = express.Router();
const {
  getJewelryTypes,
  getJewelryType,
  createJewelryType,
  updateJewelryType,
  deleteJewelryType,
  toggleJewelryTypeStatus,
  searchJewelryTypes
} = require('../controllers/jeweloryTypeController');

// All routes are public (no authentication required)
router.get('/', getJewelryTypes);
router.get('/search', searchJewelryTypes);
router.get('/:id', getJewelryType);
router.post('/', createJewelryType);
router.put('/:id', updateJewelryType);
router.delete('/:id', deleteJewelryType);
router.patch('/:id/toggle', toggleJewelryTypeStatus);

module.exports = router;