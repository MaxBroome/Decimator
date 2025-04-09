# how to run a decimator instance
this tutorial will help you run your own decimator processing instance. if your instance is public-facing, we highly recommend that you also [protect it from abuse](/docs/protect-an-instance.md) using turnstile or api keys or both.

## using docker compose and package from github (recommended)
to run the decimator docker package, you need to have `docker` and `docker-compose` installed and configured.

if you need help with installing docker, follow *only the first step* of these tutorials by digitalocean:
- [how to install docker](https://www.digitalocean.com/community/tutorial-collections/how-to-install-and-use-docker)
- [how to install docker compose](https://www.digitalocean.com/community/tutorial-collections/how-to-install-docker-compose)

## how to run a decimator docker package:
1. create a folder for decimator config file, something like this:
    ```sh
    mkdir decimator
    ```

2. go to decimator folder, and create a docker compose config file:
    ```sh
    cd decimator && nano docker-compose.yml
    ```
    i'm using `nano` in this example, it may not be available in your distro. you can use any other text editor.

3. copy and paste the [sample config from here](examples/docker-compose.example.yml) and edit it to your needs.
    make sure to replace default URLs with your own or decimator won't work correctly.

4. finally, start the decimator container (from decimator directory):
    ```sh
    docker compose up -d
    ```

if you want your instance to support services that require authentication to view public content, create `cookies.json` file in the same directory as `docker-compose.yml`. example cookies file [can be found here](examples/cookies.example.json).

decimator package will update automatically thanks to watchtower.

it's highly recommended to use a reverse proxy (such as nginx) if you want your instance to face the public internet. look up tutorials online.

## run decimator api outside of docker (useful for local development)
requirements:
- node.js >= 18
- git
- pnpm

1. clone the repo: `git clone https://github.com/imputnet/decimator`.
2. go to api/src directory: `cd decimator/api/src`.
3. install dependencies: `pnpm install`.
4. create `.env` file in the same directory.
5. add needed environment variables to `.env` file. only `API_URL` is required to run decimator.
    - if you don't know what api url to use for local development, use `http://localhost:9000/`.
6. run decimator: `pnpm start`.

### ubuntu 22.04 workaround
`nscd` needs to be installed and running so that the `ffmpeg-static` binary can resolve DNS ([#101](https://github.com/imputnet/decimator/issues/101#issuecomment-1494822258)):

```bash
sudo apt install nscd
sudo service nscd start
```

## list of environment variables
[this section has moved](/docs/api-env-variables.md) to a dedicated document that is way easier to understand and maintain. go check it out!
