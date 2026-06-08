# Scalability Notes

This project is structured as a monolith suitable for an internship assignment. Below is a concise path to scale it in production.

## Current architecture

- **Frontend**: static React build served by nginx
- **Backend**: single Express API process
- **Database**: PostgreSQL with Prisma ORM

## Redis caching

Introduce Redis to reduce database load and improve response times:

- **Session / JWT blocklist**: store revoked tokens for logout and forced sign-out
- **Task list cache**: cache `GET /api/v1/tasks` per user with a short TTL (e.g. 30–60s); invalidate on create/update/delete
- **Rate limiting**: move auth rate limits from in-memory `express-rate-limit` to Redis so limits work across multiple API instances

Example flow:

```
Client → API → Redis (cache hit?) → PostgreSQL (cache miss)
```

## Load balancing

Run multiple backend replicas behind a load balancer (nginx, AWS ALB, or Kubernetes Ingress):

- Use **stateless** API instances (JWT in HttpOnly cookies or Bearer tokens; no in-memory session state)
- Place Redis and PostgreSQL outside the API containers
- Enable **health checks** on `/health` for automatic failover
- Use **connection pooling** (PgBouncer or Prisma Accelerate) when many API replicas connect to Postgres

```
                    ┌─────────┐
Clients ──► ALB ──► │ API x N │
                    └────┬────┘
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
           Redis    PostgreSQL   (optional CDN for frontend static assets)
```

## Microservices split

If traffic or team size grows, split by bounded context:

| Service | Responsibility |
|---------|----------------|
| **Auth service** | Register, login, JWT issuance, role management |
| **Tasks service** | Task CRUD, ownership checks |
| **API gateway** | Routing, auth verification, rate limiting |

Communication options:

- **Sync**: REST or gRPC between services
- **Async**: message queue (RabbitMQ, SQS) for events like `task.created` → notifications/analytics

Prisma schemas would move to per-service databases (database-per-service) to avoid tight coupling.

## Frontend at scale

- Serve the Vite build from a **CDN** (CloudFront, Cloudflare)
- Keep API on a separate subdomain (`api.example.com`) with CORS + `credentials: true`, or continue same-origin proxy via the gateway

## Observability

Before scaling horizontally, add:

- Structured logging (request ID per request)
- Metrics (latency, error rate, DB pool usage)
- Distributed tracing across services

These make it possible to find bottlenecks before adding more infrastructure.
