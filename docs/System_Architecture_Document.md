**STUDENT GIG MARKETPLACE**

Complete System Architecture & Design Document


# **Executive Summary**
This document provides comprehensive technical specifications for a student-only gig marketplace platform targeting Indian students (ages 15-24). The platform enables students to hire students for micro-work, creating a closed, high-trust ecosystem where completed gigs become verifiable portfolio entries.

## **Key Platform Metrics**

|**Metric**|**Target**|
| :- | :- |
|Target Users|100,000+ students in first year|
|Transaction Volume|₹10 Cr+ GMV in Year 1|
|Average Gig Value|₹500 - ₹5,000|
|Platform Commission|10-15% per transaction|
|Mobile-First|90%+ mobile traffic expected|


# **Table of Contents**
- High-Level System Architecture
- Data Flow Diagrams
- Complete Screen Map (70+ Screens)
- Database Schema & ERD
- Backend Services Architecture
- API Endpoints (100+ endpoints)
- Payment & Escrow System
- Security & Trust Mechanisms
- Deployment Architecture


# **1. System Architecture**
## **1.1 Architecture Overview**
The platform follows a modern, cloud-native, microservices-oriented architecture optimized for mobile-first delivery and real-time interactions.

|**Layer**|**Technology**|**Purpose**|
| :- | :- | :- |
|Client Layer|React Native (Expo), Next.js 14|Mobile app + Web interface|
|API Gateway|Convex Edge Runtime|Request routing, rate limiting, auth validation|
|Application Services|Node.js, TypeScript, Convex|Business logic, real-time sync|
|Data Layer|Convex DB, Supabase Storage|Document store, file storage|
|Integration Layer|Razorpay, Twilio, FCM|Payments, SMS, Push notifications|


