# Member 5 — Next Steps

## Current state
The Government Dashboard uses demo/mock data because the Spring Boot backend, Rules Engine, and AI service are not yet available on this machine.

## Current Member 5 features
- Government KPI dashboard
- Application/approval trend analytics
- Approval type distribution
- Weekly processing-time monitoring
- Department analytics
- SLA variance calculation
- Dynamic bottleneck status
- Biggest bottleneck highlight
- CSV export of bottleneck report
- Refresh button with mock/live integration switch

## When backend is ready
Set `VITE_USE_MOCK_DATA=false` and connect `GET /government/dashboard` in `GovernmentDashboard.jsx`. Keep the API response contract aligned with the dashboard data shape.
