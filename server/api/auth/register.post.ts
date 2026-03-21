import { defineEventHandler, readBody, setCookie } from 'h3'
import { authService } from '../../layers/auth/services/auth.service'
import { registerSchema } from '../../layers/auth/schemas/auth.schemas'
import { ZodError } from 'zod'
import { getClientIP } from '../../layers/shared/utils/security'

export default defineEventHandler(async (event) => {
  try {
    // Parse and validate request body
    const body = await readBody(event)
    const validatedData = registerSchema.parse(body)

    // Get client info
    const ipAddress = getClientIP(event)
    const userAgent = event.node.req.headers['user-agent'] || 'Unknown'

    // Initialize service

    // Perform registration
    const result = await authService.register(
      validatedData.email,
      validatedData.username,
      validatedData.password,
      ipAddress,
      userAgent,
    )

    return {
      success: true,
      message:
        'Registration successful. Please check your email to verify your account.',
      user: result,
    }
  } catch (error) {
    if (error instanceof ZodError) {
      // Use the first field error message directly so the client can show it
      const first = error.errors[0]
      const field = first?.path?.[0] ? `${first.path[0]}: ` : ''
      throw createError({
        statusCode: 400,
        statusMessage: `${field}${first?.message ?? 'Invalid input'}`,
      })
    }

    if (error instanceof Error && error.message.includes('AuthError')) {
      const authError = error as any
      throw createError({
        statusCode: authError.statusCode || 400,
        statusMessage: error.message,
      })
    }

    // Surface known business errors (e.g. "Email already in use") directly
    if (error instanceof Error && error.message) {
      const msg = error.message.toLowerCase()
      if (
        msg.includes('already') ||
        msg.includes('taken') ||
        msg.includes('exists') ||
        msg.includes('invalid') ||
        msg.includes('not found') ||
        msg.includes('banned') ||
        msg.includes('suspended')
      ) {
        throw createError({ statusCode: 400, statusMessage: error.message })
      }
    }

    console.error('[Register API] Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Registration failed. Please try again.',
    })
  }
})
