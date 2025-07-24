const express = require('express');
const router = express.Router();
const {
  submitContact,
  getContacts,
  getContact,
  updateContactStatus,
  deleteContact
} = require('../controllers/contactController');

// Contact form submission (public)
router.post('/', submitContact);

// Admin routes (should be protected with authentication in production)
router.get('/', getContacts);
router.get('/:id', getContact);
router.put('/:id', updateContactStatus);
router.delete('/:id', deleteContact);

module.exports = router;