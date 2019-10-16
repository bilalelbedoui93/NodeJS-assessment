const logic = require('.')
const { expect } = require('chai')
const { User } = require('../data')
const mongoose = require("mongoose")


describe('LOGIC', () => {
    before(async() => {
        await mongoose.connect("mongodb://localhost/nodejs-assessment", {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });     
    })

    describe('SIGNUP/LOGIN USERS', () => {
        let fullname, email, password
        debugger

        beforeEach(async () => {

           await User.deleteMany()

            fullname = `Carlos-${Math.floor(Math.random() * (1000 - 1)) + 1}tonto`
            email = `email-${Math.floor(Math.random() * (1000 - 1)) + 1}@gmail.com`
            password = `BBbb11..-${Math.floor(Math.random() * (1000 - 1)) + 1}`
            
        })
        describe('To register a new user', () => {

            it('Should create a user', async () => {
                
                await logic.createUser(fullname, email, password)

                const user = await User.findOne({email})
                
                expect(user).to.exist
                expect(user.fullname).to.equal(fullname)
                expect(user.email).to.equal(email)
                expect(user.password).to.exist
            })
            
            it('Should fail is the information provided is not accepted by the validator', async () => {

                try {
                    await logic.createUser(fullname, email, password = 123)
                } catch (error) {
                    expect(error.message).to.exist
                    expect(error.message).to.equal(`password ${password} is not a string`)
                } 
            })
            it('Should fail if the email is not properly written', async () => {
                try {
                    email = 'nowrittenprop@.com'
                    user = await logic.authenticateUser(email, password)
                } catch (error) {
                    expect(error).to.exist
                    expect(error.message).to.equal(`${email} is not an e-mail`)
                }
            })
            it('Should fail is the user already exists', async () => {

                await logic.createUser(fullname, email = 'usesexisting@gmail.es', password)
                debugger
                try {
                    await logic.createUser(fullname, email = 'usesexisting@gmail.es', password)
                } catch (error) {
                    expect(error.message).to.be.not.undefined
                    expect(error.message).to.equal(`The user with the email ${email} already exists`)
                }
            })
        })
        describe('Authenticate Normal USer', () => {
            beforeEach(async () => {
                await logic.createUser(fullname, email, password)
            })

            it('Should succed if the credentials are correct', async () => {
                const user = await logic.authenticateUser(email, password)

                expect(user).to.exist
                expect(user).to.be.an('object')
            })
            it('Should fail if the is not properly written', async () => {
                try {
                    email = 'nowrittenprop@.com'
                    const user = await logic.authenticateUser(email, password)
                } catch (error) {
                    expect(error).to.exist
                    expect(error.message).to.equal(`${email} is not an e-mail`)
                }
            })
            it('Should fail if the email does not exist', async () => {
                try {
                    email = 'holhola@gmail.com'
                    const user = await logic.authenticateUser(email, password)
                } catch (error) {
                    expect(error).to.exist
                    expect(error.message).to.equal(`User with the email holhola@gmail.com doesn't exist`)
                }
            })
            it('Should fail if the password is not correct', async () => {
                try {
                    password = 'LLbb33..'
                    const user = await logic.authenticateUser(email, password)
                } catch (error) {
                    expect(error).to.exist
                    expect(error.message).to.equal('Wrong credentials!')
                }
            })
        })
    })
    describe('API FUNCTIONALITIES',() => {


        describe('Get user data filtered by user id, accessible by roles "users" & "admin"', () => {

            it('should show the user with the "admin" role, providing an Id', async () => {
                const userExpected = {
                    id: "e8fd159b-57c4-4d36-9bd7-a59ca13057bb",
                    name: "Manning",
                    email: "manningblankenship@quotezart.com",
                    role: "admin"
                }

                const userRetrieved = await logic.getUserDataById('e8fd159b-57c4-4d36-9bd7-a59ca13057bb')

                expect(userRetrieved).to.exist
                expect(userRetrieved.id).to.equal(userExpected.id)
                expect(userRetrieved.name).to.equal(userExpected.name)
                expect(userRetrieved.email).to.equal(userExpected.email)
                expect(userRetrieved.role).to.equal(userExpected.role)
            })

            it('should show the user with the "user" role, providing an Id', async () => {
                const userExpected = {
                    id: "a3b8d425-2b60-4ad7-becc-bedf2ef860bd",
                    name: "Barnett",
                    email: "barnettblankenship@quotezart.com",
                    role: "user"
                }

                const userRetrieved = await logic.getUserDataById('a3b8d425-2b60-4ad7-becc-bedf2ef860bd')

                expect(userRetrieved).to.exist
                expect(userRetrieved.id).to.equal(userExpected.id)
                expect(userRetrieved.name).to.equal(userExpected.name)
                expect(userRetrieved.email).to.equal(userExpected.email)
                expect(userRetrieved.role).to.equal(userExpected.role)
            })

            it('should not workd if the id provided is not correct', async () => {

                try {
                    const userRetrieved = await logic.getUserDataById('2b60-4ad7-becc-bedf2ef860bd')
                } catch (error) {
                    expect(error.message).to.equal('Error: User with id 2b60-4ad7-becc-bedf2ef860bd does not exist')
                    expect(error.message).to.not.be.undefined
                }
            })

        })

        describe('Get user data filtered by user name, accessible by roles "users" & "admin"', () => {

            it('should show the user with the "user" role, providing the user name', async () => {
                const userExpected = {
                    id: "ca8b8993-06eb-4061-a6a4-d2db80d25e23",
                    name: "Baxter",
                    email: "baxterblankenship@quotezart.com",
                    role: "user"
                }

                const userRetrieved = await logic.getUserDataByName('Baxter')

                expect(userRetrieved).to.exist
                expect(userRetrieved.id).to.equal(userExpected.id)
                expect(userRetrieved.name).to.equal(userExpected.name)
                expect(userRetrieved.email).to.equal(userExpected.email)
                expect(userRetrieved.role).to.equal(userExpected.role)
            })

            it('should show the user with the "admin" role, the user name', async () => {
                const userExpected = {
                    id: "8e336cb2-37d0-4e3d-91d8-0a1d2b3e5967",
                    name: "Allen",
                    email: "allenblankenship@quotezart.com",
                    role: "admin"
                }

                const userRetrieved = await logic.getUserDataByName('Allen')

                expect(userRetrieved).to.exist
                expect(userRetrieved.id).to.equal(userExpected.id)
                expect(userRetrieved.name).to.equal(userExpected.name)
                expect(userRetrieved.email).to.equal(userExpected.email)
                expect(userRetrieved.role).to.equal(userExpected.role)
            })

            it('should not work if the id provided is not correct', async () => {

                try {
                    const userRetrieved = await logic.getUserDataByName('bilal')
                } catch (error) {
                    expect(error.message).to.equal('Error: User with name bilal does not exist')
                    expect(error.message).to.not.be.undefined
                }
            })

        })

        describe('Get the list of policies linked to a user name, accessible just to users with role "admin"', () => {

            it('should retrieve a list of policies that belongs to a certain user', async () => {

                const listResult = await logic.getPoliciesByUserName('britney')

                const policy = {
                    id: "7b624ed3-00d5-4c1b-9ab8-c265067ef58b",
                    amountInsured: 399.89,
                    email: "inesblankenship@quotezart.com",
                    inceptionDate: "2015-07-06T06:55:49Z",
                    installmentPayment: true,
                    clientId: "a0ece5db-cd14-4f21-812f-966633e7be86"
                }


                expect(listResult).to.be.an('array')
                expect(listResult.length).to.equal(102)
                expect(listResult[0].id).to.equal(policy.id)
                expect(listResult[0].amountInsured).to.equal(policy.amountInsured)
                expect(listResult[0].email).to.equal(policy.email)
                expect(listResult[0].inceptionDate).to.equal(policy.inceptionDate)
                expect(listResult[0].installmentPayment).to.equal(policy.installmentPayment)
                expect(listResult[0].clientId).to.equal(policy.clientId)
            })

            it('should fail if the user is not admin', async () => {

                try {
                    const listResult = await logic.getPoliciesByUserName('Barnett')
                } catch (error) {
                    expect(error.message).to.exist
                    expect(error.message).to.be.a('string')
                    expect(error.message).to.equal("Error: You are not allowed to access to this information")
                }

            })

        })

        describe('Get the user linked to a policy number, accessible just to users with role "admin"', () => {

            it('should show the user that the policy id provided belong', async () => {

                const userExpected = {
                    id: "a0ece5db-cd14-4f21-812f-966633e7be86",
                    name: "Britney",
                    email: "britneyblankenship@quotezart.com",
                    role: "admin"
                }

                const userResult = await logic.getUserByPolicyId('25202f31-fff0-481c-acfd-1f3ff2a9bcbe')

                expect(userResult).to.exist
                expect(userResult).to.be.an('object')
                expect(userResult.id).to.equal(userExpected.id)
                expect(userResult.name).to.equal(userExpected.name)
                expect(userResult.email).to.equal(userExpected.email)
                expect(userResult.role).to.equal(userExpected.role)
            })

            it('should fail if the policy does not exist', async () => {
                try {
                    const listResult = await logic.getUserByPolicyId('750feb5e-021f-4ef9-8b35-f50984120097')
                } catch (error) {
                    expect(error.message).to.exist
                    expect(error.message).to.be.a('string')
                    expect(error.message).to.equal("Error: the policy 767feb5e-021f-4ef9-8b35-f50984120097 not found in our databse")
                }
            })
        })
    })
    after(async () => mongoose.disconnect(true))
})