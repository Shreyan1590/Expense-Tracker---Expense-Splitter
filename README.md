# ExpenseFlow - Expense Tracker and Splitter

A comprehensive expense tracking and bill splitting application built with React, TypeScript, and Firebase.

## Setup Instructions

### 1. Firebase Configuration

To fix the authentication errors, you need to set up your Firebase project:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Navigate to Project Settings (gear icon)
4. In the "Your apps" section, add a web app
5. Copy the Firebase configuration values

### 2. Environment Variables

Update the `.env` file in the root directory with your actual Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_actual_api_key_from_firebase
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_actual_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
VITE_FIREBASE_APP_ID=your_actual_app_id
```

### 3. Firebase Services Setup

Enable the following services in your Firebase project:

1. **Authentication**:
   - Go to Authentication > Sign-in method
   - Enable Email/Password
   - Enable Google (optional)

2. **Firestore Database**:
   - Go to Firestore Database
   - Create database in production mode
   - Deploy the security rules from `firestore.rules`

3. **Storage**:
   - Go to Storage
   - Get started with default settings
   - Deploy the security rules from `storage.rules`

### 4. Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 5. Deployment to Netlify

The project includes a `netlify.toml` configuration file for easy deployment:

1. Connect your repository to Netlify
2. Set environment variables in Netlify dashboard:
   - Go to Site settings > Environment variables
   - Add all `VITE_FIREBASE_*` variables with your actual values
3. Deploy automatically triggers on push to main branch

## Project Structure

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Cloud Firestore
- **Storage**: Firebase Storage
- **Deployment**: Netlify

## Features

- User authentication (email/password, Google)
- Personal expense tracking
- Bill splitting with groups
- Real-time data synchronization
- Responsive design
- Progressive Web App capabilities