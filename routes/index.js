const express = require('express');
const router = express.Router();
const logic = require('../logic');

router.get('/user/id/:id', async (req, res) => {
    try{
        debugger
        const { params: { id } } = req
        const user = await logic.getUserDataById(id)
        res.json({user})
    }catch(error){
        res.status(400).json({error: error.message})
    }
})

module.exports = router;
