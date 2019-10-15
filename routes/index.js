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

router.get('/user/name/:name', async (req, res) => {
    try{
        const { params: { name } } = req
        const user = await logic.getUserDataByName(name)
        res.json({user})
    }catch(error){
        res.status(400).json({error: error.message})
    }
})

router.get('/policies/:name', async (req, res) => {
    try{
        const { params: { name } } = req
        const policies = await logic.getPoliciesByUserName(name)
        res.json({policies})
    }catch(error){
        res.status(400).json({error: error.message})
    }
})

module.exports = router;
