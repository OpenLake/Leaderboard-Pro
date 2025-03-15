project-root/
├── .github/                          # GitHub-specific configuration files
│   ├── ISSUE_TEMPLATE/               # Templates for reporting issues
│   ├── CONTRIBUTING.md               # Guidelines for contributing to the project
│   ├── DIRECTORY.md                  # Documentation for the directory structure
│   └── pull_request_template.md       # Template for pull requests
│
├── api/                               # Backend API using Django and Django REST framework
│   ├── leaderboard/                   # Leaderboard application within the API
│   │   ├── admin.py                    # Django admin panel configurations
│   │   ├── asgi.py                     # ASGI configuration for handling async requests
│   │   ├── celery.py                   # Celery configuration for background tasks
│   │   ├── settings.py                  # Django project settings
│   │   ├── urls.py                      # URL routing for the API
│   │   ├── friends.py                   # API logic for managing friends
│   │   ├── models.py                    # Database models for the application
│   │   ├── root.py                      # Main entry point for backend logic
│   │   ├── serializers.py               # Serializers for converting models to JSON
│   │   ├── tests.py                     # Unit tests for the API
│   │   ├── users.py                     # API logic for user management
│   │   ├── views.py                     # Views handling HTTP requests
│   │   └── wsgi.py                      # WSGI configuration for deploying the app
│   │
│   ├── .env                            # Environment variables (ignored in version control)
│   ├── .gitignore                      # Ignore specific files from Git tracking
│   ├── manage.py                       # Django management script
│   ├── vercel.json                     # Vercel deployment configuration
│   ├── Makefile                        # Automates project build and setup tasks
│   └── requirements.txt                 # Python dependencies
│
├── app/                                # Frontend application
│   ├── package.json                    # JavaScript package dependencies
│   ├── public/                          # Static assets like images, favicon, etc.
│   ├── .env                             # Environment variables for frontend
│   ├── .gitignore                       # Ignore frontend-specific files from Git tracking
│   ├── README.md                        # Documentation for the frontend
│   ├── src/                             # Source code for the frontend
│   │   ├── components/                  # Reusable UI components
│   │   │   └── discussion-forum/        # Components related to the discussion forum
│   │   ├── Context/                     # React Context API for global state management
│   │   ├── firebase/                    # Firebase configurations and utilities
│   │   ├── hooks/                       # Custom React hooks
│   │   ├── icons/                       # Icon assets for UI
│   │   ├── utils/                       # Utility functions for the app
│   │   ├── App.js                       # Main application component
│   │   └── index.js                     # Entry point for the React app
│
├── .gitignore                          # Ignore unnecessary files from Git tracking
├── Dockerfile                          # Docker container configuration
├── Makefile                            # Build automation script
├── README.md                           # Main project documentation
└── package.json                        # Project dependencies for Node.js
