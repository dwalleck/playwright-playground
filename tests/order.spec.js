const { test, expect } = require('@playwright/test');
const path = require('path')
const fs = require('fs')
const { v4 } = require('uuid')

const generateStorageStateFile = (filename) => {
  const currentPathSegments = filename.split(path.sep)
  const storageStatePath = `storage-states/state-${currentPathSegments[currentPathSegments.length - 1]
    }-${v4()}.json`
  if (fs.existsSync(storageStatePath)) {
    fs.unlinkSync(storageStatePath)
  }
  return storageStatePath
}

const storageStatePath = generateStorageStateFile(__filename)

const locatorExists = async (locator) => {
  try {
    await locator.waitFor({ state: "attached" })
    return true
  }
  catch {
    return false
  }
}

test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage()
  await page.goto('https://demo.playwright.dev/todomvc');
  const ex = await locatorExists(page.locator('[data-e2e="msft"]'))
  console.log(ex)
  console.log(`Setting storage state to ${storageStatePath}`)
  await page.context().storageState({ path: storageStatePath })
  await page.close()
})


test.beforeEach(async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  console.log('In before each')
});

test.describe('New Todo', () => {
  console.log(`test.use called with storageState ${storageStatePath}`)
  if (fs.existsSync(storageStatePath)) {
    test.use({ storageState: storageStatePath })
  }


  test('should allow me to add todo items', async () => { console.log('In test') })
})