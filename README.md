# AI-MoPMS Dashboard

Web dashboard prototype for **AI-MoPMS — Artificial Intelligence Enabled Motor Protection, Monitoring & Predictive Maintenance System**.

Architecture represented in the dashboard:
- ESP32 master controller
- PTA8D08 8-channel PT100 Modbus RTU module with 5 PT100 sensors
- Circutor CVM-C4 electrical analyzer
- Delta DOP-107BV local HMI on a dedicated RS-485 link
- Vibration and RPM sensing
- Hardwired E-stop and ESP32-enforced motor permissives

## Important
This version uses simulated browser telemetry. The web START/STOP controls do **not** operate real hardware. Real remote control must use authentication and a backend/API, while the ESP32 independently enforces all protection and start permissives. The hardwired E-stop must remain independent of software and network connectivity.

GitHub Pages deployment is configured in `.github/workflows/pages.yml`.
