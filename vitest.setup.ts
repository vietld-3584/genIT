import '@testing-library/jest-dom'
import 'reflect-metadata'
import React from 'react'
import { config } from 'dotenv'

// Load test environment variables
config({ path: '.env.test' })

// Mock Next.js router
import { vi } from 'vitest'

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: (props: any) => {
    const { src, alt, width, height, ...rest } = props
    return React.createElement('img', {
      src,
      alt,
      width,
      height,
      ...rest,
    })
  },
}))

// Set up DOM environment
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

global.matchMedia = vi.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(), // deprecated
  removeListener: vi.fn(), // deprecated
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}))

// Mock TextEncoder for Node.js environment
if (typeof globalThis.TextEncoder === 'undefined') {
  const util = require('util')
  globalThis.TextEncoder = util.TextEncoder
}
