# Event-Driven Medical Clinic Booking System (SAGA)

## Overview
This project implements an **event-driven backend system** for a medical clinic booking workflow.  
It demonstrates **SAGA choreography with compensation logic** to handle distributed transactional workflows without using global or distributed database transactions.

The system enforces pricing rules, a global discount quota, and graceful failure handling, all observable through structured logs and a CLI-based client.

---

## Key Features
- Event-driven architecture using an in-memory event bus
- SAGA choreography pattern (no central orchestrator)
- Explicit compensation logic on failure
- Global system-wide discount quota
- 24-hour automatic discount quota refresh
- Gender-specific medical services
- Real-time CLI status updates
- Multiple bookings in a single runtime
- Structured logs for observability and tracing

---

## Business Rules

### Pricing Rule (R1)
A **12% discount** is applied if **any** of the following conditions are met:
- Total base price of selected services exceeds ₹1000  
- User is female and the booking date matches her date of birth  

> Discount eligibility is calculated using the **base price**, while the discount is applied on the **effective (selling) price**.

---

### Daily Discount Quota Rule (R2)
- The system maintains a **global discount quota** (configurable limit).
- The quota applies only to bookings eligible for R1.
- Once the quota is exhausted:
  - The user is informed
  - The user may continue without discount
- The discount counter **automatically resets after 24 hours**.

---

## Architecture Overview

### Core Components
- **CLI Client** – Simulates user interaction
- **Event Bus** – Central event communication mechanism
- **Pricing Service** – Calculates base price and discount eligibility
- **Discount Service** – Enforces global discount quota
- **Booking Service** – Finalizes or fails bookings
- **Discount Counter** – In-memory global quota with 24-hour reset
- **Logger** – Structured logging for tracing requests

All services communicate **only via events**, enabling loose coupling and scalability.

---

## SAGA Workflow

### Successful Flow
