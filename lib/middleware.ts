// filepath: /c:/Users/Owner/OneDrive/Desktop/A2C/portal-final/middleware.ts
import { withClerkMiddleware } from '@clerk/nextjs/server'

export default withClerkMiddleware((req, res, next) => {
  next()
})

export const config = {
  matcher: ['/api/admin/applications/:path*'],
}