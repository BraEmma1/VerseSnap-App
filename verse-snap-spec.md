# App Name: VerseSnap

## Description

A full-stack web app that allows users to capture or upload an image containing a Bible verse, extract the text using OCR, detect the verse reference, and display that verse in multiple translations.

---

## Architecture Overview

### Frontend (React)

Responsible for:

- UI rendering
- Camera access and image upload
- Sending requests to backend
- Displaying extracted text and Bible verses

### Backend (Node.js + Express)

Responsible for:

- OCR processing
- Verse detection logic
- Bible API integration
- Handling all business logic

### Database (MongoDB)

Responsible for:

- Storing user query history

---

## Core Flow

1. User captures or uploads image (React)
2. Image is sent to backend (Express)
3. Backend performs OCR and extracts text
4. Backend detects possible Bible verse reference
5. Backend returns extracted text + detected reference
6. User edits/confirms verse on frontend
7. Frontend sends confirmed verse to backend
8. Backend fetches translations from Bible API
9. Backend returns results
10. Frontend displays translations

---

## Features

### Frontend

- Capture image using browser camera
- Upload image from device
- Display extracted text
- Editable verse input field
- Fetch and display multiple Bible translations

---

### Backend

- OCR processing service
- Verse detection service
- Bible API integration service
- REST API endpoints

---

## API Endpoints

### POST /api/ocr

- Accepts image upload
- Returns extracted text

### POST /api/detect-verse

- Accepts extracted text
- Returns detected verse reference

### POST /api/get-verses

- Accepts confirmed verse reference
- Returns multiple Bible translations

---

## Database Schema

### Collection: VerseQueries

- \_id
- extracted_text
- detected_reference
- confirmed_reference
- created_at

---

## Tech Stack

### Frontend

- React (Vite)
- Axios

### Backend

- Node.js
- Express
- Multer (file upload)
- Tesseract OCR

### Database

- MongoDB (Mongoose)

---

## Constraints

- OCR accuracy is not guaranteed
- Verse detection may require user correction
- All heavy processing must happen in backend

---

## Rules

- Frontend must NOT handle OCR or verse detection logic
- Backend handles all processing and external API calls
- Keep architecture simple and modular (no overengineering)
