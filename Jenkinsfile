pipeline {
    agent any

    environment {
        // Project settings
        COMPOSE_PROJECT_NAME = 'jenkins-taskflow'
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'  // Explicit file path
    }

    stages {
        stage('Clone Repository') {
            steps {
                git(
                    branch: 'main',
                    url: 'https://github.com/MBilalSharif/RegistrationApp.git',
                    credentialsId: 'github-credentials'  // Add if private repo
                )
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    // Build images first to catch early errors
                    sh """
                        cd \$WORKSPACE
                        docker-compose -p ${COMPOSE_PROJECT_NAME} -f ${DOCKER_COMPOSE_FILE} build
                    """
                }
            }
        }

        stage('Deploy Containers') {
            steps {
                script {
                    sh """
                        cd \$WORKSPACE
                        # Stop existing containers if any
                        docker-compose -p ${COMPOSE_PROJECT_NAME} -f ${DOCKER_COMPOSE_FILE} down --remove-orphans || true
                        
                        # Start containers with proper cleanup on failure
                        docker-compose -p ${COMPOSE_PROJECT_NAME} -f ${DOCKER_COMPOSE_FILE} up -d || {
                            echo "Failed to start containers"
                            docker-compose -p ${COMPOSE_PROJECT_NAME} -f ${DOCKER_COMPOSE_FILE} logs
                            exit 1
                        }
                        
                        # Verify containers are healthy
                        sleep 10  # Wait for initialization
                        docker-compose -p ${COMPOSE_PROJECT_NAME} ps | grep -v 'Up (healthy)' && {
                            echo "Some containers failed to start healthy"
                            docker-compose -p ${COMPOSE_PROJECT_NAME} logs
                            exit 1
                        }
                    """
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                script {
                    // Test frontend accessibility
                    sh """
                        curl -I http://localhost:80 || {
                            echo "Frontend not responding on port 80"
                            exit 1
                        }
                        
                        # Test backend API
                        curl -I http://localhost:5000 || {
                            echo "Backend not responding on port 5000"
                            exit 1
                        }
                    """
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline execution completed"
            script {
                // Capture logs even if pipeline fails
                sh """
                    docker-compose -p ${COMPOSE_PROJECT_NAME} -f ${DOCKER_COMPOSE_FILE} logs --no-color > docker-logs.txt || true
                    cat docker-logs.txt
                """
            }
        }
        cleanup {
            // Always attempt cleanup
            sh """
                docker-compose -p ${COMPOSE_PROJECT_NAME} -f ${DOCKER_COMPOSE_FILE} down --remove-orphans || true
            """
        }
    }
}
