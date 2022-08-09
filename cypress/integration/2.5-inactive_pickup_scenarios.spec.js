import { testSetup, updateRetry } from '../support/common/support'
import {
  updatePickupPointdata,
  listallPickupPointsAPI,
  INTIAL_PICKUP_POINTS_ENV,
} from '../support/store-locator.apis'
import { restAPITestCase } from '../support/store-locator.outputvalidation.js'
import storelocatorSelectors from '../support/storelocator.selectors'
import { graphql, getStores } from '../support/shipping-policy.graphql'
import { storeLocator } from '../support/app_list'
import { clickLoadAllStores } from '../support/storelocator.common.js'

const { pickupPoint3Payload } = restAPITestCase

describe('Inactive Pickup Points should not be visible in storefront', () => {
  testSetup()

  listallPickupPointsAPI()
  updatePickupPointdata(pickupPoint3Payload)

  it(
    `Verify the inactive pickup point "${pickupPoint3Payload.name}" is not visible in stores page`,
    updateRetry(1),
    () => {
      cy.getPickupPointItem().then((pickupCount) => {
        cy.visitStore()
        cy.get(storelocatorSelectors.StorePickUpPointList, {
          timeout: 8000,
        }).should('be.visible')
        clickLoadAllStores()
        cy.get(storelocatorSelectors.MoreItems, { timeout: 8000 }).should(
          'have.length',
          pickupCount[INTIAL_PICKUP_POINTS_ENV] + 3
        )
        cy.get(storelocatorSelectors.StorePickUpPointList, {
          timeout: 8000,
        }).should('not.contain', `${pickupPoint3Payload.name}`)
      })
    }
  )

  it('verify getStores without latitude and longitude', updateRetry(3), () => {
    graphql(storeLocator, getStores(), (response) => {
      cy.addDelayBetweenRetries(2000)
      expect(response.status).to.equal(200)
      expect(response.body.data.getStores.items.length).to.not.equal(0)
    })
  })

  it('verify getStores with latitude and longitude', updateRetry(3), () => {
    graphql(storeLocator, getStores(-22.94, -43.18), (response) => {
      cy.addDelayBetweenRetries(2000)
      expect(response.status).to.equal(200)
      expect(response.body.data.getStores.items.length).to.equal(2)
    })
  })
})
