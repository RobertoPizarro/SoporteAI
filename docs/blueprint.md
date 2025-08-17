# **App Name**: SoporteAI Frontend Prototype

## Core Features:

- Main Layout & Header: Implement the main layout with header navigation ('Inicio', 'Nueva Solicitud', 'Mis Solicitudes') and a user profile section.
- Home Page: Show a personalized greeting (e.g., "Hello, Juan Pérez") and a call-to-action button ("Start New Conversation"). Add a FAQ section with expandable questions (accordion style): clicking a question reveals its answer below. Below the FAQ section, show a list of open requests. Each request should display basic information (ticket number, subject, status). When a request is clicked, the UI simulates navigation to the “My Requests” page, showing: Left panel: Request details (ticket number, subject, application/area, creation date, status). Right panel: The chatbot interface with predefined sample messages. This is a static frontend only; no backend or real data handling.
- New Request Form (New Request Page): The page is divided into two panels: Before creating a ticket: Left panel: A form with fields for Subject (brief description) and Application/Area (dropdown), plus a “Create Request” button. Right panel: A placeholder message (“We are preparing your request. Please wait for confirmation to start chatting.”). After clicking “Create Request”: Left panel: Shows ticket details (static UI): ticket number, subject, application/area, creation date, status. Right panel: Displays the chat interface with the Support AI Assistant, containing predefined sample messages. Again, this is a UI simulation only, no backend logic.
- Request List (My Requests Page): Display a list of all requests created by the user with key details: Ticket Number, Subject, Status (e.g., “In Progress”, “Resolved”), and Last Updated timestamp. Include UI options for sorting and filtering requests.
- Request Details & Chatbot UI: Show request details (ticket number, subject, application/area, creation date, status). On the right, display the chatbot interface with predefined messages simulating interaction.
- Login Page: Provide fields for Corporate Email and Password, and a “Log In” button that navigates to the Home Page. Include a “Forgot your password?” link (non-functional). ➡️ Header on Login Page: Only shows the SoporteAI logo, the text “SoporteAI”, and a “Welcome” message — no tabs and no username.

## Style Guidelines:

- Primary color: Soft blue (#5B86E5) to convey trust and reliability.
- Background color: Light gray (#F5F7FA) for a clean and modern interface.
- Accent color: Teal (#26A69A) for interactive elements and call-to-action buttons, providing a sense of action.
- Body and headline font: 'PT Sans' (sans-serif) for a clear and readable experience. 'PT Sans' is used both in the headlines and in the body.
- Use minimalist line icons to represent categories and actions. Icons should be in the primary color.
- Use a card-based layout to display information in a structured manner, especially for 'Preguntas Frecuentes' and 'Solicitudes abiertas'.
- Subtle transitions and animations when opening/closing the FAQ accordions or when submitting a new request to provide feedback to the user.