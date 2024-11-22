# Whale Next

This is the next version of BAID's Whale Cafe. Built with Next.js.

## Get Started

To run in production:

* Clone this repository.
* `npm install`.
* We can use `pm2` to run the process. `npm install -g pm2`.
* Copy `.env.example` to `.env` and fill in the necessary values.
* Run `prisma migrate deploy` to deploy the database.
* Run `npm run build` to build for production.
* Run `pm2 start --name=whale npm -- start` to start.

To run in development:

* Clone this repository.
* Run
  [WebArtistryBAID](https://github.com/WebArtistryBAID)/
  [**baid-onelogin**](https://github.com/WebArtistryBAID/baid-onelogin)
  and create an OAuth2 app. Set `http://your-host/login/authorize`
  as a redirect URI. Allow the scopes `basic`, `phone`, and `sms`.
* `npm install`.
* Copy `.env.example` to `.env` and fill in the necessary values.

| Name                     | Description                                                                                                  |
|--------------------------|--------------------------------------------------------------------------------------------------------------|
| `DATABASE_URL`           | The database URL to use. Must be PostgreSQL.                                                                 |
| `HOST`                   | The full URL on which this service is running on, no trailing slash.                                         |
| `UPLOAD_PATH`            | The path in which to store uploaded files. In development, this is `public/uploads`                          |
| `UPLOAD_SERVE_PATH`      | The route on which uploaded files are served by your server (e.g. Nginx). In development, this is `uploads`. |
| `ONELOGIN_HOST`          | The full URL on which OneLogin is hosted, no trailing slash.                                                 |
| `ONELOGIN_CLIENT_ID`     | The client ID for the registered OneLogin app.                                                               |
| `ONELOGIN_CLIENT_SECRET` | The client secret for the registered OneLogin app.                                                           |
| `JWT_SECRET`             | The JWT secret key to use. You can generate one with `openssl rand -hex 32`.                                 |

* Run `prisma migrate deploy` to deploy the database.
* Start by running `npm run dev`.

## Settings

Settings are stored in the database as a key-value pair.

| Key           | Description                                       |
|---------------|---------------------------------------------------|
| `shop-open`   | `1` for ordering being open, and `0` for not.     |
| `total-quota` | The number of cups that can be ordered.           |
| `order-quota` | The number of cups that can be ordered per order. |

## Permissions

Some users have specific permissions that allow them to access more features. These include:

| Permission     | Description             |
|----------------|-------------------------|
| `admin.cms`    | Allows entering CMS.    |
| `admin.manage` | Allows managing orders. |

## Integrated Services

Project Whale is integrated with certain third-party service providers:

* OneLogin, for user authentication

## Contribution

To contribute, simply open a pull request.

## License

```
    Whale is BAID's Whale Cafe's ordering system.
    Copyright (C) 2024  Team WebArtistry

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
```
