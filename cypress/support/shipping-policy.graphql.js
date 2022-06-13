import { FAIL_ON_STATUS_CODE } from './common/constants'

const config = Cypress.env()

// Constants
const { vtex } = config.base

function commonGraphlValidation(response) {
  expect(response.status).to.equal(200)
  expect(response.body.data).to.not.equal(null)
}

export function graphql(getQuery, validateResponseFn = null) {
  const { query, queryVariables } = getQuery

  // Define constants
  const APP_NAME = 'vtex.logistics-carrier-graphql'
  const APP = `${APP_NAME}@0.x`
  const CUSTOM_URL = `${vtex.baseUrl}/_v/private/admin-graphql-ide/v0/${APP}`

  cy.request({
    method: 'POST',
    url: CUSTOM_URL,
    ...FAIL_ON_STATUS_CODE,
    body: {
      query,
      variables: queryVariables,
    },
  }).as('RESPONSE')

  if (validateResponseFn) {
    cy.get('@RESPONSE').then((response) => {
      commonGraphlValidation(response)
      validateResponseFn(response)
    })
  } else {
    return cy.get('@RESPONSE')
  }
}

export function updateShippingPolicy(shippingPolicyId, data, status = false) {
  data.shippingPolicy.id = shippingPolicyId
  data.shippingPolicy.isActive = status
  data.shippingPolicy.deliveryChannel = 'delivery'
  cy.log(data)
  const query =
    'mutation' +
    '( $shippingPolicy: ShippingPolicyInput!)' +
    '{updateShippingPolicy(shippingPolicy:$shippingPolicy){id, name}}'

  return {
    query,
    queryVariables: data,
  }
}

export function validateGetStoresresponse(response) {
  expect(response.body.data).to.not.equal(null)
}
