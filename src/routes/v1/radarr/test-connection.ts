import type { FastifyPluginAsync } from 'fastify'
import type { z } from 'zod'
import {
  TestConnectionBodySchema,
  TestConnectionResponseSchema,
  ErrorSchema,
} from '@schemas/radarr/test-connection.schema.js'

const plugin: FastifyPluginAsync = async (fastify) => {
  fastify.post<{
    Body: z.infer<typeof TestConnectionBodySchema>
    Reply: z.infer<typeof TestConnectionResponseSchema>
  }>(
    '/test-connection',
    {
      schema: {
        summary: 'Test Radarr connection',
        operationId: 'testRadarrConnection',
        description:
          'Test connectivity to a Radarr instance with provided credentials',
        body: TestConnectionBodySchema,
        response: {
          200: TestConnectionResponseSchema,
          500: ErrorSchema,
        },
        tags: ['Radarr'],
      },
    },
    async (request, reply) => {
      try {
        const { baseUrl, apiKey } = request.body
        const result = await fastify.radarrManager.testConnection(
          baseUrl,
          apiKey,
        )

        return {
          success: result.success,
          message: result.message,
        }
      } catch (err) {
        fastify.log.error('Error testing Radarr connection:', err)

        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Unable to test Radarr connection'

        return reply.status(500).send({
          success: false,
          message: errorMessage.replace(/Radarr API error: /, ''),
        })
      }
    },
  )
}

export default plugin
