pipeline {
    agent any

    environment {
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

        stage('Build Docker Images') {
            steps {
                script {
                    sh """
                        cd \$WORKSPACE
                        docker-compose -p ${COMPOSE_PROJECT_NAME} build
                    """
                }
            }
        }

        stage('Deploy Containers') {
            steps {
                script {
                    sh """
                        cd \$WORKSPACE
                        docker-compose -p ${COMPOSE_PROJECT_NAME} down --remove-orphans || true
                        docker-compose -p ${COMPOSE_PROJECT_NAME} up -d
                        sleep 10
                        docker-compose -p ${COMPOSE_PROJECT_NAME} ps | grep 'Exit' && {
                            echo "Container startup failed"
                            exit 1
                        }
                    """
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                script {
                    sh """
                        curl -I http://localhost:80 || {
                            echo "Frontend not responding"
                            exit 1
                        }
                        curl -I http://localhost:5000 || {
                            echo "Backend not responding"
                            exit 1
                        }
                    """
                }
            }
        }
    }
}
