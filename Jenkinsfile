pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                    docker build -t miniweather-frontend-service .
                """
            }
        }

        stage('Stop Old Container') {
            steps {
                sh """
                    docker rm -f miniweather-frontend || true
                """
            }
        }

        stage('Run New Container') {
            steps {
                withCredentials([string(credentialsId: 'miniweather-frontend-api-url', variable: 'NEXT_PUBLIC_API_BASE_URL')]) {
                    sh """
                        docker run -d \
                            --restart=always \
                            --name miniweather-frontend \
                            --restart=always \
                            -e NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL \
                            -p 9002:3000 \
                            miniweather-frontend-service
                    """
                }
            }
        }
    }

    post {
        success {
            echo '🚀 Deployment successful!'
        }
        failure {
            echo '❌ Deployment failed. Check logs.'
        }
    }
}
