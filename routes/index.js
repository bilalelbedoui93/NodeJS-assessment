const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const logic = require('../logic');
const auth = require('../middleware/auth')

const { env: { jwtPrivateKey } } = process

router.post('/register', async (req, res) => {
    debugger
    try {
        const { body: { fullname, email, password } } = req
        await logic.createUser(fullname, email, password);
        res.json({ message: 'User registered' });
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.post('/auth', async (req, res) => {
    try {

        const { body: { email, password } } = req

        const { id } = await logic.authenticateUser(email, password);
        
        const token = jwt.sign({ id }, jwtPrivateKey);
        
        res.json({ message: 'User logged in', token })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.get('/user/id/:id',auth, async (req, res) => {
    try {
        const { params: { id } } = req
        const user = await logic.getUserDataById(id)
        res.json({ user })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.get('/user/name/:name',auth, async (req, res) => {
    try {
        const { params: { name } } = req
        const user = await logic.getUserDataByName(name)
        res.json({ user })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.get('/policies/:name',auth,async (req, res) => {
    try {
        const { params: { name } } = req
        const policies = await logic.getPoliciesByUserName(name)
        res.json({ policies })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.get('/user/policy/:policyId',auth, async (req, res) => {
    try {
        const { params: { policyId } } = req
        const user = await logic.getUserByPolicyId(policyId)
        res.json({ user })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

module.exports = router;
