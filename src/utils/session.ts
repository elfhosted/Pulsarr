import type { FastifyRequest } from 'fastify'

/**
 * Sets a fixed admin user in the session to simulate authentication bypass.
 *
 * @remark
 * Use only when authentication is disabled or bypassed, such as for local development or trusted IPs. The session user is assigned static admin credentials.
 *
 * @param request - The Fastify request object with session support.
 */
export function createTemporaryAdminSession(request: FastifyRequest): void {
  request.session.user = {
    id: 1, // IMPORTANT: Must remain 1 - client-side code depends on this ID
    email: 'admin@localhost',
    username: 'Administrator',
    role: 'admin',
  }
}
