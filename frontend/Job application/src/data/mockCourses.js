export const MOCK_COURSES = {
  'fullstack': {
    _id: 'fullstack',
    title: 'Full Stack Web Development',
    description: 'Master the MERN stack and build scalable web applications from scratch.',
    difficulty: 'Beginner',
    modules: [
      {
        _id: 'm1', title: 'Module 1: Internet & HTML5 Fundamentals',
        lessons: [
          { _id: 'l1', title: 'How the Internet Works', videoUrl: 'https://www.youtube.com/embed/zOjov-2OZ0E?start=10', durationMinutes: 15 },
          { _id: 'l2', title: 'HTML5 Semantic Tags & Forms', videoUrl: 'https://www.youtube.com/embed/qz0aGYrrlhU?start=50', durationMinutes: 25 },
        ]
      },
      {
        _id: 'm2', title: 'Module 2: Advanced CSS3 & Flexbox/Grid',
        lessons: [
          { _id: 'l3', title: 'CSS Box Model & Selectors', videoUrl: 'https://www.youtube.com/embed/1Rs2ND1ryYc?start=20', durationMinutes: 20 },
          { _id: 'l4', title: 'Mastering Flexbox & CSS Grid', videoUrl: 'https://www.youtube.com/embed/1Rs2ND1ryYc?start=80', durationMinutes: 35 },
          { _id: 'l5', title: 'Responsive Design & Media Queries', videoUrl: 'https://www.youtube.com/embed/1Rs2ND1ryYc?start=140', durationMinutes: 30 },
        ]
      },
      {
        _id: 'm3', title: 'Module 3: JavaScript Programming',
        lessons: [
          { _id: 'l6', title: 'Variables, Loops & Functions', videoUrl: 'https://www.youtube.com/embed/PkZNo7MFNFg?start=100', durationMinutes: 40 },
          { _id: 'l7', title: 'Arrays, Objects & ES6 Features', videoUrl: 'https://www.youtube.com/embed/PkZNo7MFNFg?start=300', durationMinutes: 45 },
          { _id: 'l8', title: 'DOM Manipulation & Events', videoUrl: 'https://www.youtube.com/embed/PkZNo7MFNFg?start=500', durationMinutes: 50 },
        ]
      },
      {
        _id: 'm4', title: 'Module 4: React.js Fundamentals',
        lessons: [
          { _id: 'l9', title: 'Components & JSX', videoUrl: 'https://www.youtube.com/embed/bMknfKXIFA8', durationMinutes: 35 },
          { _id: 'l10', title: 'State & Props', videoUrl: 'https://www.youtube.com/embed/O6P86uwfdR0', durationMinutes: 40 },
        ]
      },
      {
        _id: 'm5', title: 'Module 5: React Hooks & Routing',
        lessons: [
          { _id: 'l11', title: 'useEffect & Data Fetching', videoUrl: 'https://www.youtube.com/embed/0ZJgIjIuY7U', durationMinutes: 45 },
          { _id: 'l12', title: 'React Router DOM v6', videoUrl: 'https://www.youtube.com/embed/59IXY5IDrBA', durationMinutes: 30 },
        ]
      },
      {
        _id: 'm6', title: 'Module 6: Node.js Basics',
        lessons: [
          { _id: 'l13', title: 'Node.js Architecture & V8', videoUrl: 'https://www.youtube.com/embed/Oe421EPjeBE?start=60', durationMinutes: 25 },
          { _id: 'l14', title: 'NPM & Core Modules', videoUrl: 'https://www.youtube.com/embed/Oe421EPjeBE?start=200', durationMinutes: 30 },
        ]
      },
      {
        _id: 'm7', title: 'Module 7: Express.js REST APIs',
        lessons: [
          { _id: 'l15', title: 'Building your first API', videoUrl: 'https://www.youtube.com/embed/pKd0Rpw7O48', durationMinutes: 40 },
          { _id: 'l16', title: 'Middleware & Error Handling', videoUrl: 'https://www.youtube.com/embed/pKd0Rpw7O48?start=300', durationMinutes: 35 },
        ]
      },
      {
        _id: 'm8', title: 'Module 8: MongoDB & Mongoose',
        lessons: [
          { _id: 'l17', title: 'NoSQL Databases & MongoDB Atlas', videoUrl: 'https://www.youtube.com/embed/ZqqiJAcRzeU', durationMinutes: 30 },
          { _id: 'l18', title: 'Mongoose Schemas & Models', videoUrl: 'https://www.youtube.com/embed/ZqqiJAcRzeU?start=400', durationMinutes: 45 },
        ]
      },
      {
        _id: 'm9', title: 'Module 9: Authentication & JWT',
        lessons: [
          { _id: 'l19', title: 'Password Hashing & Bcrypt', videoUrl: 'https://www.youtube.com/embed/mbsmsi7l3r4', durationMinutes: 35 },
          { _id: 'l20', title: 'JSON Web Tokens (JWT) & Cookies', videoUrl: 'https://www.youtube.com/embed/mbsmsi7l3r4?start=500', durationMinutes: 50 },
        ]
      },
      {
        _id: 'm10', title: 'Module 10: State Management (Redux/Context)',
        lessons: [
          { _id: 'l21', title: 'Context API', videoUrl: 'https://www.youtube.com/embed/5LrDIWkK_Bc', durationMinutes: 25 },
          { _id: 'l22', title: 'Redux Toolkit Basics', videoUrl: 'https://www.youtube.com/embed/bbkBuqC1rU4', durationMinutes: 40 },
        ]
      },
      {
        _id: 'm11', title: 'Module 11: Deployment (AWS/Vercel)',
        lessons: [
          { _id: 'l23', title: 'Deploying React to Vercel/Netlify', videoUrl: 'https://www.youtube.com/embed/2hM5viLMJpA', durationMinutes: 20 },
          { _id: 'l24', title: 'Deploying Node to AWS/Render', videoUrl: 'https://www.youtube.com/embed/l134cBAJCuc', durationMinutes: 35 },
        ]
      },
      {
        _id: 'm12', title: 'Module 12: Capstone Project',
        lessons: [
          { _id: 'l25', title: 'Project Planning & Architecture', videoUrl: 'https://www.youtube.com/embed/aido1kIf7mQ', durationMinutes: 30 },
          { _id: 'l26', title: 'Building an E-Commerce Clone', videoUrl: 'https://www.youtube.com/embed/aido1kIf7mQ?start=600', durationMinutes: 120 },
        ]
      }
    ]
  },
  'dsa': {
    _id: 'dsa',
    title: 'Data Structures & Algorithms',
    description: 'Crack FAANG Interviews by mastering core DSA concepts.',
    difficulty: 'Intermediate',
    modules: [
      {
        _id: 'm1', title: 'Arrays & Two Pointers',
        lessons: [
          { _id: 'l1', title: 'Array Fundamentals', videoUrl: 'https://www.youtube.com/embed/8hly31xKli0?start=60', durationMinutes: 20 },
          { _id: 'l2', title: 'Two Sum & Container With Most Water', videoUrl: 'https://www.youtube.com/embed/KLlXCFG5TnA', durationMinutes: 22 },
          { _id: 'l3', title: 'Sliding Window Pattern', videoUrl: 'https://www.youtube.com/embed/MK-NZ4hN7rs', durationMinutes: 35 },
        ]
      },
      {
        _id: 'm2', title: 'Linked Lists',
        lessons: [
          { _id: 'l4', title: 'Singly Linked Lists', videoUrl: 'https://www.youtube.com/embed/Hj_rA0dhr2I', durationMinutes: 25 },
          { _id: 'l5', title: 'Reverse a Linked List & Fast/Slow Pointers', videoUrl: 'https://www.youtube.com/embed/G0_I-ZF0S38', durationMinutes: 30 },
        ]
      },
      {
        _id: 'm3', title: 'Stacks & Queues',
        lessons: [
          { _id: 'l6', title: 'Stack Implementation & Valid Parentheses', videoUrl: 'https://www.youtube.com/embed/I5lq6sCuABE', durationMinutes: 25 },
          { _id: 'l7', title: 'Monotonic Stack', videoUrl: 'https://www.youtube.com/embed/Dq_ObZwTY_Q', durationMinutes: 35 },
        ]
      },
      {
        _id: 'm4', title: 'Binary Trees',
        lessons: [
          { _id: 'l8', title: 'Tree Traversals (In/Pre/Post Order)', videoUrl: 'https://www.youtube.com/embed/fAAZixR11s', durationMinutes: 20 },
          { _id: 'l9', title: 'Maximum Depth & Level Order Traversal', videoUrl: 'https://www.youtube.com/embed/hTM3phVI6YQ', durationMinutes: 35 },
        ]
      },
      {
        _id: 'm5', title: 'Graphs & BFS/DFS',
        lessons: [
          { _id: 'l10', title: 'Graph Representations', videoUrl: 'https://www.youtube.com/embed/tWVWeAqZ0WU', durationMinutes: 30 },
          { _id: 'l11', title: 'Number of Islands (Matrix DFS)', videoUrl: 'https://www.youtube.com/embed/pV2kpPD66nE', durationMinutes: 40 },
        ]
      },
      {
        _id: 'm6', title: 'Dynamic Programming',
        lessons: [
          { _id: 'l12', title: 'Climbing Stairs & Memoization', videoUrl: 'https://www.youtube.com/embed/Y0lT9Fck7qI', durationMinutes: 18 },
          { _id: 'l13', title: '0/1 Knapsack Problem', videoUrl: 'https://www.youtube.com/embed/xCbYmUPvc2Q', durationMinutes: 40 },
        ]
      },
      {
        _id: 'm7', title: 'Tries & Advanced Data Structures',
        lessons: [
          { _id: 'l14', title: 'Implement Trie (Prefix Tree)', videoUrl: 'https://www.youtube.com/embed/oobqoCJlHA0', durationMinutes: 30 },
          { _id: 'l15', title: 'Disjoint Set / Union Find', videoUrl: 'https://www.youtube.com/embed/wU6udHRIkcc', durationMinutes: 45 },
        ]
      }
    ]
  },
  'datascience': {
    _id: 'datascience',
    title: 'Data Science & Machine Learning',
    description: 'Python, Pandas, and Scikit-learn for modern Data Science.',
    difficulty: 'Intermediate',
    modules: [
      {
        _id: 'm1', title: 'Module 1: Python for Data Science',
        lessons: [
          { _id: 'l1', title: 'Python Basics Crash Course', videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw?start=60', durationMinutes: 45 },
          { _id: 'l2', title: 'NumPy Arrays & Matrices', videoUrl: 'https://www.youtube.com/embed/QUT1VHiLmmI', durationMinutes: 35 },
        ]
      },
      {
        _id: 'm2', title: 'Module 2: Data Wrangling with Pandas',
        lessons: [
          { _id: 'l3', title: 'Introduction to Pandas DataFrames', videoUrl: 'https://www.youtube.com/embed/vmEHCJofslg', durationMinutes: 25 },
          { _id: 'l4', title: 'Data Cleaning & Preprocessing', videoUrl: 'https://www.youtube.com/embed/KdjPExIqV0o', durationMinutes: 30 },
        ]
      },
      {
        _id: 'm3', title: 'Module 3: Data Visualization',
        lessons: [
          { _id: 'l5', title: 'Matplotlib Basics', videoUrl: 'https://www.youtube.com/embed/3Xc3CA655Ls', durationMinutes: 20 },
          { _id: 'l6', title: 'Advanced Seaborn Visuals', videoUrl: 'https://www.youtube.com/embed/GcXcSZ0gQps', durationMinutes: 30 },
        ]
      },
      {
        _id: 'm4', title: 'Module 4: Machine Learning Fundamentals',
        lessons: [
          { _id: 'l7', title: 'Supervised vs Unsupervised Learning', videoUrl: 'https://www.youtube.com/embed/7ArmgS8NvWQ', durationMinutes: 25 },
          { _id: 'l8', title: 'Linear & Logistic Regression', videoUrl: 'https://www.youtube.com/embed/yIYKR4sgzI8', durationMinutes: 40 },
        ]
      }
    ]
  },
  'backend': {
    _id: 'backend',
    title: 'Backend Engineering',
    description: 'Deep dive into scalable backend systems, microservices, and databases.',
    difficulty: 'Advanced',
    modules: [
      {
        _id: 'm1', title: 'Node.js & Go Basics',
        lessons: [
          { _id: 'l1', title: 'Advanced Node Streams & Events', videoUrl: 'https://www.youtube.com/embed/Oe421EPjeBE?start=400', durationMinutes: 35 },
          { _id: 'l2', title: 'Introduction to Golang', videoUrl: 'https://www.youtube.com/embed/YS4e4q9oBaU', durationMinutes: 45 },
        ]
      },
      {
        _id: 'm2', title: 'Databases & SQL',
        lessons: [
          { _id: 'l3', title: 'PostgreSQL Relational Design', videoUrl: 'https://www.youtube.com/embed/qw--VYLpxG4', durationMinutes: 50 },
          { _id: 'l4', title: 'Redis & Caching Strategies', videoUrl: 'https://www.youtube.com/embed/jgpVdJB2sKQ', durationMinutes: 30 },
        ]
      },
      {
        _id: 'm3', title: 'Microservices & Message Queues',
        lessons: [
          { _id: 'l5', title: 'Monolith vs Microservices', videoUrl: 'https://www.youtube.com/embed/CpbTeJGMlsM', durationMinutes: 20 },
          { _id: 'l6', title: 'RabbitMQ & Kafka Integration', videoUrl: 'https://www.youtube.com/embed/xJ8w6A0lBaw', durationMinutes: 35 },
        ]
      }
    ]
  },
  'devops': {
    _id: 'devops',
    title: 'DevOps & Cloud Engineering',
    description: 'Master Docker, Kubernetes, and CI/CD pipelines.',
    difficulty: 'Advanced',
    modules: [
      {
        _id: 'm1', title: 'Linux & Bash Scripting',
        lessons: [
          { _id: 'l1', title: 'Linux Commands for DevOps', videoUrl: 'https://www.youtube.com/embed/v_1aLND-qZk', durationMinutes: 30 },
        ]
      },
      {
        _id: 'm2', title: 'Containerization (Docker)',
        lessons: [
          { _id: 'l2', title: 'Docker in 100 Seconds', videoUrl: 'https://www.youtube.com/embed/Gjnup-PuquQ', durationMinutes: 10 },
          { _id: 'l3', title: 'Writing Dockerfiles & Docker Compose', videoUrl: 'https://www.youtube.com/embed/pTFZFxd4hOI', durationMinutes: 25 },
        ]
      },
      {
        _id: 'm3', title: 'CI/CD Pipelines',
        lessons: [
          { _id: 'l4', title: 'GitHub Actions Basics', videoUrl: 'https://www.youtube.com/embed/R8_veQiYBjI', durationMinutes: 30 },
          { _id: 'l5', title: 'Jenkins Pipeline Configuration', videoUrl: 'https://www.youtube.com/embed/FX322RVNGj4', durationMinutes: 40 },
        ]
      },
      {
        _id: 'm4', title: 'Kubernetes & AWS',
        lessons: [
          { _id: 'l6', title: 'K8s Architecture Explained', videoUrl: 'https://www.youtube.com/embed/X48VuDVv0do', durationMinutes: 35 },
          { _id: 'l7', title: 'AWS EC2, S3, & IAM', videoUrl: 'https://www.youtube.com/embed/a9__D53WsUs', durationMinutes: 50 },
        ]
      }
    ]
  },
  'systemdesign': {
    _id: 'systemdesign',
    title: 'System Design Masterclass',
    description: 'Design WhatsApp, Netflix, and Uber at scale.',
    difficulty: 'Advanced',
    modules: [
      {
        _id: 'm1', title: 'High Level Design (HLD)',
        lessons: [
          { _id: 'l1', title: 'System Design Interview Fundamentals', videoUrl: 'https://www.youtube.com/embed/m8Icp_Cid5o', durationMinutes: 40 },
          { _id: 'l2', title: 'Load Balancing & Consistent Hashing', videoUrl: 'https://www.youtube.com/embed/zaRkONvyGr8', durationMinutes: 30 },
        ]
      },
      {
        _id: 'm2', title: 'Case Studies',
        lessons: [
          { _id: 'l3', title: 'Design Netflix / YouTube', videoUrl: 'https://www.youtube.com/embed/lqGEsuMWXA8', durationMinutes: 50 },
          { _id: 'l4', title: 'Design WhatsApp / Chat Application', videoUrl: 'https://www.youtube.com/embed/vvhC64hQZMk', durationMinutes: 45 },
          { _id: 'l5', title: 'Design Uber / Lyft', videoUrl: 'https://www.youtube.com/embed/umWABit-wbk', durationMinutes: 55 },
        ]
      }
    ]
  }
};
