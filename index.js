const fs = require(`fs`)
const util = require(`util`)
const inquirer = require(`inquirer`)
const moment = require(`moment`)
const axios = require(`axios`)


const writeFileSync = util.promisify(fs.writeFile)

const questions = [
 
    {
        name: `name`,
        type: `input`,
        message: `What is your name?`,
        validate: async input => {
            if (input === null || input === ` ` || input === `  ` || input === `   ` || input.length < 3) {
               return `Enter a Name`
            }
            return true
         }
    },
    {
        name: `githubName`,
        type: `input`,
        message: `Please enter your GitHub username:`,
        validate: async input => {
            if (input === null || input === ` ` || input === `  ` || input === `   ` || input.length < 3) {
               return `Not a valid entry)`
            }
            return true
         }
    },
    {
        name: `title`,
        type: `input`,
        message: `What is the name of your project?`,
        default: `Untitled`,
    },
    {
        name: `description`,
        type: `input`,
        message: `description of your project:`,
        default: `N/A`,
     
    },
    {
        name: `installation`,
        type: `input`,
        message: `How is your application installed?`,
        default: `N/A`,
  
    },
    {
        name: `usage`,
        type: `input`,
        message: `How is your application used?`,
        default: `N/A`,
   
    },
    {
        name: `license`,
        type: `input`,
        message: `Which license(s) will you be assigning to this project?`,
        default: `N/A`,
     
    },
    {
        name: `contributing`,
        type: `input`,
        message: `Who else contributed to this project?`,
        default: `N/A`,
       
    },
]
const askUser = () => {
    return inquirer.prompt(questions)
}
const generateREADME = (a, gitPhotoURL, gitEmail, gitMainURL) => {
    if (gitEmail === undefined || gitEmail === null) {
        gitEmail = `[no email found]`
    }
    if (a.installation === undefined) {
        a.installation = `[Enter installation information here]`
    }
    if (a.description === undefined) {
        a.description = `[Enter project description here]`
    }
    if (a.usage === undefined) {
        a.usage = `[Enter how project is to be used here]`
    }
    if (a.contributing === undefined) {
        a.contributing = `[Enter other contributors here]`
    }
    if (a.license === undefined) {
        a.license = `[Enter licenses used here]`
    }

    let socialBadge = `https://img.shields.io/github/followers/${a.githubName}?style=social`
    return `# ${a.title}
    
A Project by: ${a.name} (GitHub: @${a.githubName}) [![User Followers](${socialBadge})](${gitMainURL+`?tab=followers`})
[![GitHub Avatar](${gitPhotoURL})](${gitMainURL})
My email address: ${gitEmail}
### Description
* ${a.description}
### Installation
* ${a.installation}
### Usage
* ${a.usage}
### License
* ${a.license}
Contributors
* ${a.name} and ${a.contributing}
`
}

async function renderNewFile() {
    try {
        let filename = `./files/README-` + moment().format(`YYYYMMDDhhmmss`) + `.md`
        let gitPhotoURL, gitEmail, gitMainURL

        const answers = await askUser()             

        let userURL = `https://api.github.com/users/${answers.githubName}`
        let repoURL = `https://api.github.com/users/${answers.githubName}/repos?sort=created&direction=desc&per_page=100`

     
        await axios.get(userURL).then(res => {
   
            gitPhotoURL = res.data.avatar_url      
            gitEmail = res.data.email               
            gitMainURL = res.data.html_url         
        })
      

        const readmeText = generateREADME(answers, gitPhotoURL, gitEmail, gitMainURL)          
        await writeFileSync(filename, readmeText)                                
        
        console.log(`Thank you ~ File created (${filename}).`)

    } catch (err) {
        console.log(err)
    }
}

renderNewFile()

module.exports = {
    askUser: askUser,
    generateREADME: generateREADME,
    questions:questions,

}