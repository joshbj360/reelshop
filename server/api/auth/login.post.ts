import { defineEventHandler, readBody, setCookie, createError } from 'h3'
import { getRequestIP, getRequestHeader } from 'h3'
import { authService } from '../../layers/auth/services/auth.service'
import { loginSchema } from '../../layers/auth/schemas/auth.schemas'

export default defineEventHandler(async (event) => {
  try {
    // 1. Parse and validate request body
    const body = await readBody(event)
    const validation = loginSchema.safeParse(body)

    if (!validation.success) {
      const first = validation.error.errors[0]
      const field = first?.path?.[0] ? `${first.path[0]}: ` : ''
      throw createError({
        statusCode: 400,
        statusMessage: `${field}${first?.message ?? 'Invalid input'}`,
      })
    }

    const { email, password } = validation.data

    // 2. Get Client Info
    // Helper to get IP safely (handles proxies/local)
    const ipAddress =
      getRequestIP(event, { xForwardedFor: true }) || '127.0.0.1'
    const userAgent = getRequestHeader(event, 'user-agent') || 'Unknown'
    const device = getRequestHeader(event, 'device') || 'Web'

    // 3. Call the Service (No 'new' keyword needed anymore)
    // The Service handles Rate Limiting, Locking, Password Check, and Auditing
    const result = await authService.login(
      email,
      password,
      ipAddress,
      userAgent,
      device,
    )

    // 4. Set Secure Cookies (Best Practice)
    // Access Token (Short lived)
    setCookie(event, 'accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60, // 15 minutes
    })

    // Refresh Token (Long lived)
    setCookie(event, 'refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    // 5. Return Public User Data (tokens are in HTTP-only cookies only)
    return {
      success: true,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    }
  } catch (error: any) {
    // Handle Custom Auth Errors (like Locked Account)
    if (error.statusCode) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.message,
      })
    }

    // Handle Unexpected Errors
    console.error('[Login API] Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Login failed. Please try again.',
    })
  }
})
