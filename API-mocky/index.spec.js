const api = require('.')
const { expect } = require('chai')


describe('DATA FROM APIS-MOCKY', () => {

    describe('Retrieve all users', () => {

        it('should retrieve all the users available in the database', async () => {

            const { clients } = await api.getUsersData()

            expect(clients).to.exist
            expect(clients).to.be.an('array')
            expect(clients).to.have.lengthOf(194)
            expect(clients[0].id).to.equal('a0ece5db-cd14-4f21-812f-966633e7be86')
            expect(clients[0].name).to.equal('Britney')
            expect(clients[0].email).to.equal('britneyblankenship@quotezart.com')
            expect(clients[0].role).to.equal('admin')
        })
    })
    describe('Retrieve all policies', () => {

        it('should retrieve all the users available in the database', async () => {

            const policiesList = await api.getAllPolicies()

            expect(policiesList).to.exist
            expect(policiesList).to.be.an('object')
            expect(policiesList.policies).to.be.an('array')
            expect(policiesList.policies).to.have.lengthOf(193)
            expect(policiesList.policies[0].id).to.equal('64cceef9-3a01-49ae-a23b-3761b604800b')
            expect(policiesList.policies[0].amountInsured).to.equal(1825.89)
            expect(policiesList.policies[0].email).to.equal('inesblankenship@quotezart.com')
            expect(policiesList.policies[0].inceptionDate).to.equal('2016-06-01T03:33:32Z')
            expect(policiesList.policies[0].installmentPayment).to.be.true
            expect(policiesList.policies[0].clientId).to.equal('e8fd159b-57c4-4d36-9bd7-a59ca13057bb')
        })
    })
})

