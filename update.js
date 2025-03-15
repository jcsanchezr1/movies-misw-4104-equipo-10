/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
const execShPromise = require("exec-sh").promise;

let fs = require("fs");

const projects = [
  { name: "MISW4104_202412_E01" },
  /*{ name: "MISW4104_202412_E02" },
  { name: "MISW4104_202412_E03" },
  { name: "MISW4104_202412_E04" },
  { name: "MISW4104_202412_E05" },
  { name: "MISW4104_202412_E06" },
  { name: "MISW4104_202412_E07" },
  { name: "MISW4104_202412_E08" },
  { name: "MISW4104_202412_E09" },
  { name: "MISW4104_202412_E10" },
  { name: "MISW4104_202412_E11" },
  { name: "MISW4104_202412_E12" },
  { name: "MISW4104_202412_E13" },
  { name: "MISW4104_202412_E14" },
  { name: "MISW4104_202412_E15" },
  { name: "MISW4104_202412_E16" },
  { name: "MISW4104_202412_E17" },
  { name: "MISW4104_202412_E18" },
  { name: "MISW4104_202412_E19" },
  { name: "MISW4104_202412_E20" },
  { name: "MISW4104_202412_E21" },
  { name: "MISW4104_202412_E22" },
  { name: "MISW4104_202412_E23" },
  { name: "MISW4104_202412_E24" },
  { name: "MISW4104_202412_E25" },
  { name: "MISW4104_202412_E26" },*/
];

/*const config  = {
  organization: "Uniandes-isis2603",
  gitKey: "de5cd571-10da-4034-8ba8-af99beef4b14",
  sonarServer: "sonar-isis2603",
  jenkinsServer: "jenkins-isis2603",
};*/

const config = {
  organization: "MISW-4104-Web",
  gitKey: "43771338-0057-4a96-ae03-93ee5419d871",
  sonarServer: "sonar-misovirtual",
  jenkinsServer: "jenkins-misovirtual",
};

const createRepos = async () => {
  let out;
  try {
    for (const project of projects) {
      const jenkinsFile = getJenkinsFile(project.name);
      const sonarFile = getSonarFile(project.name);
      const readmeFile = getReadmeFile(project.name);

      fs.writeFileSync("Jenkinsfile", jenkinsFile);
      fs.writeFileSync("sonar-project.properties", sonarFile);
      fs.writeFileSync("README.md", readmeFile);

      let command0 = `git remote rm origin`;
      let command1 = `git add .`;
      let command2 = "git commit -m Add_initial_files";

      let command3 = `hub create -p ${config.organization}/${project.name}`;
      let command4 = `git push origin master`;

      console.log("Deleting remote");
      out = await execShPromise(command0, true);

      console.log("Adding files");
      out = await execShPromise(command1, true);

      console.log("Commiting files");
      out = await execShPromise(command2, true);

      console.log("Creating repo: ", project.name);
      out = await execShPromise(command3, true);

      console.log("Push");
      out = await execShPromise(command4, true);
    }
  } catch (e) {
    console.log("Error: ", e);
    console.log("Stderr: ", e.stderr);
    console.log("Stdout: ", e.stdout);
    return e;
  }
  console.log("out: ", out.stdout, out.stderr);
};

createRepos();

function getReadmeFile(repo) {
  const content = `# Enlaces
  - [Jenkins](http://157.253.238.75:8080/${config.jenkinsServer}/)
  - [Sonar](http://157.253.238.75:8080/${config.sonarServer}/)`;
  return content;
}

function getSonarFile(repo) {
  const content = `sonar.host.url=http://157.253.238.75:8080/${config.sonarServer}/
  sonar.projectKey=${repo}:sonar
  sonar.projectName=${repo}
  sonar.projectVersion=1.0
  sonar.sources=src
  sonar.test=src
  sonar.test.inclusions=**/*.spec.ts
  sonar.exclusions=**/*.module.ts, **/utils/**
  sonar.javascript.lcov.reportPaths=coverage/front/lcov.info
  sonar.testExecutionReportPaths=reports/ut_report.xml`;
  return content;
}

function getJenkinsFile(repo) {
  const content = `pipeline {
    agent any
    environment {
       GIT_REPO = '${repo}'
       GIT_CREDENTIAL_ID = '${config.gitKey}'
       SONARQUBE_URL = 'http://172.24.100.52:8082/${config.sonarServer}'
    }
    stages {
       stage('Checkout') {
          steps {
             git branch: 'master',
                credentialsId: env.GIT_CREDENTIAL_ID,
                url: 'https://github.com/${config.organization}/' + env.GIT_REPO
          }
       }
       stage('GitInspector') {
         steps {
            withCredentials([usernamePassword(credentialsId: env.GIT_CREDENTIAL_ID, passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
               sh 'mkdir -p code-analyzer-report'
               sh """ curl --request POST --url https://code-analyzer.virtual.uniandes.edu.co/analyze --header "Content-Type: application/json" --data '{"repo_url":"git@github.com:${config.organization}/\${GIT_REPO}.git", "access_token": "\${GIT_PASSWORD}" }' > code-analyzer-report/index.html """
            }
            publishHTML (target: [
               allowMissing: false,
               alwaysLinkToLastBuild: false,
               keepAll: true,
               reportDir: 'code-analyzer-report',
               reportFiles: 'index.html',
               reportName: "GitInspector"
            ])
         }
       }
       stage('Build') {
          // Build app
          steps {
             script {
                docker.image('citools-isis2603:latest').inside('-u root') {
                   sh '''
                      CYPRESS_INSTALL_BINARY=0 npm install
                      npm i -s
                      npm i typescript@5.4.2
                      ng build
                   '''
                }
             }
          }
       }
      stage('Test') {
          steps {
             script {
                docker.image('citools-isis2603:latest').inside('-u root') {
                  sh '''
                    ng test --watch=false --code-coverage true
                    npm run sonar
                  '''
                }
             }
          }
       }
       stage('Static Analysis') {
          // Run static analysis
          steps {
             sh '''
                docker run --rm -u root -e SONAR_HOST_URL=\${SONARQUBE_URL} -v \${WORKSPACE}:/usr/src sonarsource/sonar-scanner-cli:4.3
             '''
          }
       }
    }
    post {
      always {
        cleanWs()
        deleteDir()
        dir("\${env.GIT_REPO}@tmp") {
          deleteDir()
        }
      }
   }
  }
  `;
  return content;
}