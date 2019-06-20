# Personal telegram bot
---
 

Forked from [telegram-bot-youtube-dl](https://github.com/idanya/telegram-youtube-dl)

- [Setting up](#setting-up)
- [Install](#install)
- [Usage](#usage)
  - [Run types](#run-types)
- [Bot commands](#bot-commands)
- [Testing](#testing)
- [Docker](#docker)
## Setting up
Before you can run a Telegram bot, you have to create it and get it's API token. To do that, open Telegram and talk to 
[@Botfather](https://t.me/botfather) (it's a bot of course). 

## Install
`npm install`

## Usage
The app needs `TELEGRAM_TOKEN` and `RCLONE_REMOTE` environment variable to work. Make sure you set it up via `export TELEGRAM_TOKEN=<token>` or inline with the `npm run` command.  

### Run types
`npm run dev` - use ts-node. </br>
`npm run start` - use node to run transpiled code from dist folder. use this if everything already transpilied.</br> 
`npm run prod` - tranpile the code and run `start`.

## Bot commands
`/start` - welcome message </br>
`/help` - help message </br>

`/audio <video url>` - This will download the audio format of the video and send it to the requesting user. 

`/list directory` - This will list remote rclone directory using `rclone ls` 
`/link filepath` - This will generate a link to download the file 

## Testing
`npm test` - run all tests </br>

## Docker
After building the Dockerfile (`npm run build-image`), run with your token as ENV variable.

```shell
docker run --rm -d --name telegrambot \
 -e TELEGRAM_TOKEN={{token}} \ 
 -e TELEGRAM_TOKEN={{token}} \
telegram-personal-bot

```