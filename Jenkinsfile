pipeline {
    agent any
    stages {
        // Stage 1: Fetch code from GitHub
        stage('Checkout') {
            steps {
                git(
                    url: 'https://github.com/MBilalSharif/RegistrationApp',
                    credentialsId: 'your-github-credential-id',
                    branch: 'main'
                )
            }
        }
        // Stage 2: Build & Run Docker containers
        stage('Build with Docker') {
            steps {
                script {
                    // Build and run using docker-compose
                    sh 'docker-compose -p my_jenkins_project -f docker-compose.yml up -d --build'
                }
            }
        }
    }
}
