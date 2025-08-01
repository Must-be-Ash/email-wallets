# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 14 waitlist application template that integrates with Notion as a CMS, Resend for email delivery, and Upstash Redis for rate limiting. The app allows users to sign up for a waitlist, stores their information in a Notion database, and sends welcome emails.

## Development Commands

```bash
# Install dependencies (uses bun)
bun install

# Run development server
bun dev
# or
npm run dev

# Build for production
bun run build
# or  
npm run build

# Start production server
bun start
# or
npm start

# Run linting
bun run lint
# or
npm run lint

# Run email development server (for testing email templates)
bun email
# or
npm run email
```

## Architecture

### API Routes
- `/api/notion` - Creates new entries in the Notion database with user name and email
- `/api/mail` - Sends welcome emails using Resend and handles rate limiting (2 requests per minute per IP)

### Key Components
- `components/form.tsx` - Main signup form with name/email inputs and submission handling
- `emails/index.tsx` - React Email template for welcome emails
- `app/page.tsx` - Landing page with form integration
- `app/layout.tsx` - Root layout with dark theme, analytics, and toast notifications

### State Management
The application uses React state for form handling. Form submission triggers both Notion database creation and email sending sequentially.

### External Services Integration
- **Notion**: Uses `@notionhq/client` to create database entries with Email (email type), Name (title type), and Wallet Address (rich_text type) properties  
- **Resend**: Sends HTML emails rendered from React Email components
- **MongoDB**: Database for rate limiting (2 requests per minute per IP) and duplicate email prevention
- **CDP Embedded Wallets**: Provides email-based wallet authentication and EVM address generation

### Duplicate Prevention System
- **Double-check mechanism**: Both Notion and MongoDB are checked for existing emails before allowing new entries
- **Email uniqueness**: Each email can only be added to the waitlist once
- **Error handling**: Users get friendly feedback if they try to register an email that's already on the waitlist
- **Data consistency**: MongoDB stores backup records with Notion entry IDs for data integrity

### Environment Variables Required
```
NOTION_SECRET=""
NOTION_DB=""
RESEND_API_KEY=""
MONGODB_URI=""
NEXT_PUBLIC_CDP_PROJECT_ID=""
```

### CDP Embedded Wallet Integration
- **Wallet Authentication**: Users authenticate using their email via CDP embedded wallets
- **Wallet Address Collection**: Each user gets an associated EVM wallet address stored in Notion
- **CDP Configuration**: Set up in `app/layout.tsx` with CDPReactProvider wrapping the application
- **Hooks Used**: `useSignInWithEmail`, `useIsSignedIn`, `useEvmAddress` from `@coinbase/cdp-hooks`

#### CORS Configuration Required
Before testing, configure CORS at https://portal.cdp.coinbase.com/products/embedded-wallets/cors:
- Development: `http://localhost:3000`
- Production: Your deployed domain

### UI Framework
- **Tailwind CSS** for styling
- **shadcn/ui** components for form inputs and buttons
- **Framer Motion** for animations
- **Sonner** for toast notifications
- **Lucide React** and **React Icons** for iconography