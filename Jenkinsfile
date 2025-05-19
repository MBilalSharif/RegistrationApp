pipeline {
    agent any

    environment {
        // Set compose project name as a variable
        COMPOSE_PROJECT_NAME = 'jenkins-taskflow'
    }

    stages {
        stage('Clone Repository') {
            steps {
                git(
                    branch: 'main', 
                    url: 'https://github.com/MBilalSharif/RegistrationApp.git',
                    
                )
            }
        }

        stage('Build with Docker Compose') {
            steps {
                script {
                    // Always stop old containers first (avoid conflicts)
                    sh 'docker-compose -p ${COMPOSE_PROJECT_NAME} down || true'
                    
                    // Build and start containers
                    sh 'docker-compose -p ${COMPOSE_PROJECT_NAME} up --build -d'
                }
            }
        }
    }

    post {
        always {
            echo "Cleaning up after build..."
            sh 'docker-compose -p ${COMPOSE_PROJECT_NAME} down || true'
        }
    }
}
