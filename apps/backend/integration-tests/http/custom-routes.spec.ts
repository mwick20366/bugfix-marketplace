import { medusaIntegrationTestRunner } from "@medusajs/test-utils"

medusaIntegrationTestRunner({
  env: {
    // make sure required env vars are set
    DATABASE_URL: process.env.DATABASE_URL,
  },
  testSuite: ({ api, getContainer }) => {
    describe("Custom endpoints", () => {
      describe("GET /custom", () => {
        it("returns correct message", async () => {
          const response = await api.get(`/custom`)
          expect(response.status).toEqual(200)
        })
      })
    })
  },
})

jest.setTimeout(60 * 1000)