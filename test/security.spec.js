import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, fetch } from '@nuxt/test-utils'

describe('[nuxt-security] Headers', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  })
  let res

  it ('fetches the homepage', async () => {
    res = await fetch('/')

    expect(res).toBeDefined()
    expect(res).toBeTruthy()
  })

  it('has `content-security-policy` header set with correct default value', async () => {
    const { headers } = res

    expect(headers.has('content-security-policy')).toBeTruthy()

    const cspHeaderValue = headers.get('content-security-policy')

    expect(cspHeaderValue).toBeTruthy()
    expect(cspHeaderValue).toBe("base-uri 'self'; font-src 'self' data: https://fonts.gstatic.com https://cdn.jsdelivr.net; form-action 'self'; frame-ancestors 'self'; img-src 'self' https://avatars.githubusercontent.com https://*.gravatar.com *; object-src 'self'; script-src-attr 'none'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; upgrade-insecure-requests; connection-src 'self' https://api.github.com https://cilogon.org https://www.gravatar.com; default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google-analytics.com")
  })

  it('has `referrer-policy` header set with correct default value', async () => {
    const { headers } = res

    expect(headers.has('referrer-policy')).toBeTruthy()

    const rpHeaderValue = headers.get('referrer-policy')

    expect(rpHeaderValue).toBeTruthy()
    expect(rpHeaderValue).toBe('same-origin')
  })

  it('has `strict-transport-security` header set with correct value', async () => {
    const { headers } = res

    expect(headers.has('strict-transport-security')).toBeTruthy()

    const stsHeaderValue = headers.get('strict-transport-security')

    expect(stsHeaderValue).toBeTruthy()
    expect(stsHeaderValue).toBe('max-age=15552000; includeSubDomains; preload')
  })
})