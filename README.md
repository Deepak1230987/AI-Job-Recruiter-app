# 🤖 Intervu.AI - AI-Powered Interview Platform

**Intervu.AI** is a cutting-edge AI-powered interview platform that revolutionizes the recruitment process by automating candidate interviews, generating personalized questions, and providing comprehensive feedback analysis. Built with modern web technologies, it offers a seamless experience for both recruiters and candidates.

![Intervu.AI Platform](./public/landing.jpg)

## ✨ Features

### 🎯 Core Functionality

- **AI-Generated Interview Questions**: Automatically create tailored interview questions based on job descriptions and requirements
- **Voice-Powered Interviews**: Real-time voice interactions using Vapi AI for natural conversation flow
- **Multi-Type Interview Support**: Technical, Behavioral, Experience-based, Problem Solving, and Leadership interviews
- **Smart Question Customization**: Edit, add, or regenerate questions before conducting interviews
- **Real-Time Interview Conduct**: Live voice-based interviews with timer and controls
- **Interview Link Sharing**: Generate and share interview links via email, WhatsApp, or other platforms

### 📊 Interview Management

- **Dashboard Overview**: Comprehensive dashboard for managing all interviews
- **Recent Interviews Tracking**: View and manage previously conducted interviews
- **Interview Drafts**: Save interview setups as drafts for future use
- **Dynamic Duration Control**: Flexible interview timing (15min, 30min, 45min, 60min+)
- **Progress Tracking**: Step-by-step interview creation with progress indicators
- **AI-Powered Feedback Analysis**: Comprehensive candidate evaluation and scoring


### 🛠️ Technical Features

- **Modern UI/UX**: Beautiful, responsive design with dark/light mode support
- **Real-time Authentication**: Secure user authentication and session management
- **Database Integration**: Robust data management with Supabase
- **Audio/Video Support**: High-quality audio processing and recording
- **Mobile Responsive**: Optimized for all device sizes
- **Performance Optimized**: Fast loading and smooth user experience

## 🚀 Technology Stack

### Frontend

- **Next.js 15.3.4** - React framework with App Router
- **React 19** - Latest React version with concurrent features
- **TailwindCSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **React Hook Form** - Performant form handling
- **Zod** - TypeScript-first schema validation

### Backend & Services

- **Supabase** - Backend-as-a-Service (Database, Auth, Real-time)
- **OpenAI GPT-4** - AI model for question generation
- **Vapi AI** - Voice AI for conducting interviews
- **OpenRouter** - AI model routing and management

### Additional Libraries

- **Axios** - HTTP client for API requests
- **UUID** - Unique identifier generation
- **Sonner** - Beautiful toast notifications
- **Class Variance Authority** - CSS class utilities

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase account and project
- OpenRouter API key
- Vapi AI API key

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Services
OPENROUTER_API_KEY=your_openrouter_api_key
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_api_key

# Application
NEXT_PUBLIC_HOST_URL=http://localhost:3000
```

### Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/recruite_ai.git
   cd recruite_ai
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up Supabase Database:**

   Create the following table in your Supabase project:

   ```sql
   CREATE TABLE interviews (
     id SERIAL PRIMARY KEY,
     interview_id VARCHAR UNIQUE NOT NULL,
     jobPosition VARCHAR NOT NULL,
     jobDescription TEXT NOT NULL,
     duration VARCHAR NOT NULL,
     interviewTypes TEXT[] NOT NULL,
     questionList JSONB NOT NULL,
     user_email VARCHAR NOT NULL,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );

   -- Future table for feedback (coming soon)
   CREATE TABLE interview_feedback (
     id SERIAL PRIMARY KEY,
     interview_id VARCHAR REFERENCES interviews(interview_id),
     candidate_name VARCHAR NOT NULL,
     overall_score INTEGER,
     technical_score INTEGER,
     communication_score INTEGER,
     problem_solving_score INTEGER,
     detailed_feedback JSONB,
     recommendations TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

4. **Configure Authentication:**

   - Enable Email/Password authentication in Supabase
   - Set up row-level security policies as needed

5. **Run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 Usage

### For Recruiters

1. **Create Account**: Sign up and log into the platform
2. **Set Up Interview**:
   - Navigate to Dashboard
   - Click "Create New Interview"
   - Fill in job details, description, and duration
   - Select interview types (Technical, Behavioral, etc.)
3. **Customize Questions**: Review and edit AI-generated questions
4. **Share Interview Link**: Copy and share the interview link with candidates
5. **Monitor Progress**: Track interview status from the dashboard

### For Candidates

1. **Access Interview**: Click on the provided interview link
2. **Enter Details**: Provide your full name
3. **Review Instructions**: Read the interview guidelines
4. **Start Interview**: Begin the voice-powered interview session
5. **Complete Assessment**: Answer questions naturally via voice
6. **Receive Feedback**: Get comprehensive feedback and results (coming soon)

## 📁 Project Structure

```
recruite_ai/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   └── login/                # Login page
│   ├── (main)/                   # Main application routes
│   │   ├── dashboard/            # Dashboard and interview creation
│   │   │   ├── create-interview/ # Interview creation flow
│   │   │   └── _components/      # Dashboard components
│   │   └── _components/          # Shared main components
│   ├── api/                      # API routes
│   │   └── ai-model/             # AI question generation endpoint
│   ├── contexts/                 # React contexts
│   ├── interview/                # Interview conduct routes
│   │   └── [interviewId]/        # Dynamic interview pages
│   └── globals.css               # Global styles
├── components/                   # Reusable UI components
│   └── ui/                       # Shadcn/ui components
├── constants/                    # Application constants
├── hooks/                        # Custom React hooks
├── lib/                          # Utility functions
├── public/                       # Static assets
└── services/                     # External service configurations
```

## 🔮 Upcoming Features

### AI-Powered Feedback System

- **Comprehensive Analysis**: Detailed evaluation of candidate responses
- **Multi-Dimensional Scoring**: Technical skills, communication, problem-solving assessment
- **Personalized Recommendations**: Actionable feedback for both candidates and recruiters
- **Performance Benchmarking**: Compare candidates against industry standards
- **Automated Report Generation**: Professional PDF reports with insights

### Advanced Analytics

- **Interview Performance Metrics**: Success rates, completion times, score distributions
- **Candidate Journey Tracking**: Full recruitment funnel analytics
- **Question Effectiveness Analysis**: Identify the most revealing interview questions
- **Recruiter Insights**: Personal recruiting performance and improvement suggestions

### Integration & Automation

- **ATS Integration**: Connect with popular Applicant Tracking Systems
- **Calendar Scheduling**: Automated interview scheduling
- **Bulk Interview Management**: Handle multiple candidates simultaneously
- **API Access**: Full API for custom integrations

## 🤝 Contributing

We welcome contributions to Intervu.AI! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/recruite_ai/issues) page
2. Create a new issue with detailed description
3. Join our community discussions


## 🌟 Acknowledgments

- **OpenAI** for providing powerful language models
- **Vapi AI** for voice interaction capabilities
- **Supabase** for backend infrastructure
- **Vercel** for hosting and deployment
- **Radix UI** for accessible component primitives
- **TailwindCSS** for styling framework

---

<div align="center">
  <p>Built with ❤️ by the Intervu.AI</p>
  <p>© 2025 Intervu.AI. All rights reserved.</p>
</div>
