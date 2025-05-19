pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/MBilalSharif/RegistrationApp'
            }
        }

        stage('Build with Docker Compose') {
            steps {
                sh 'cd $WORKSPACE && docker-compose -p jenkins-taskflow -f docker-compose.yml up --build -d'
            }
        }
    }
}
