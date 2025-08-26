
# Narrativ

**The next-generation publishing platform for thinkers, creators, and storytellers.**






Narrativ is where ideas turn into movements. Whether you're writing a personal story, sharing expert insights, or building your brand — Narrativ lets you own your voice, shape your story, and lead the conversation.

##  Live Demo

**[Visit Narrativ Platform →](https://narrativio.netlify.app/)**

##  Features

- ** Rich Text Editor** - Write and format your stories with a powerful, intuitive editor
- ** Author Profiles** - Build your personal brand with customizable author pages  
- ** Responsive Design** - Beautiful reading experience across all devices
- ** Content Discovery** - Explore trending stories and discover new voices
- ** Fast Performance** - Optimized loading times and smooth interactions
- ** Modern UI** - Clean, professional interface inspired by Medium and Substack
- ** Reading Experience** - Distraction-free reading with typography optimized for long-form content

## Built With

- **[React](https://reactjs.org/)** - Frontend framework for building user interfaces
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework for styling
- **[Appwrite](https://appwrite.io/)** - Backend-as-a-Service for authentication and database
- **[Netlify](https://netlify.com/)** - Deployment and hosting platform

## Getting Started

### Prerequisites

- Node.js (v16.0 or higher)
- npm or yarn package manager
- Appwrite account for backend services

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TRrajputDEV/narrativ.git
   cd narrativ
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Appwrite configuration:
   ```env
   REACT_APP_APPWRITE_URL=your_appwrite_endpoint
   REACT_APP_APPWRITE_PROJECT_ID=your_project_id
   REACT_APP_APPWRITE_DATABASE_ID=your_database_id
   REACT_APP_APPWRITE_COLLECTION_ID=your_collection_id
   ```

4. **Start development server**
   ```bash
   npm start
   # or
   yarn start
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000` to see the application.

##  Project Structure

```
narrativ/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Header/
│   │   ├── PostCard/
│   │   ├── AuthorProfile/
│   │   └── Editor/
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Write.jsx
│   │   ├── Profile.jsx
│   │   └── Post.jsx
│   ├── services/
│   │   └── appwrite.js
│   ├── styles/
│   │   └── globals.css
│   ├── utils/
│   └── App.js
├── package.json
└── README.md
```

##  Design Philosophy

Narrativ focuses on **content-first design** with:
- Clean typography for optimal reading experience
- Minimalist interface that puts stories front and center
- Responsive layouts that work seamlessly on all devices
- Intuitive navigation that doesn't distract from content

##  Deployment

The application is automatically deployed to Netlify on every push to the main branch.

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   ```bash
   netlify deploy --prod --dir=build
   ```

## Usage

### For Writers
1. **Sign up** for a Narrativ account
2. **Create your profile** with bio and social links
3. **Start writing** using the rich text editor
4. **Publish** your story and share with the community

### For Readers
1. **Browse** featured stories on the homepage
2. **Follow** your favorite authors
3. **Engage** with stories through comments and reactions
4. **Discover** new content through tags and recommendations

##  Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Tushar Tanwar**
- GitHub: [@TRrajputDEV](https://github.com/TRrajputDEV)
- LinkedIn: [Tushar Tanwar](https://www.linkedin.com/in/tushar-tanwar-a9316a299/)
- Email: tushartanwar183@gmail.com

## Acknowledgments

- Inspired by Medium, Substack, and other publishing platforms
- Built with modern web technologies and best practices
- Special thanks to the open-source community for amazing tools and libraries

***

**Ready to share your story? [Start writing on Narrativ →](https://narrativio.netlify.app/)**
