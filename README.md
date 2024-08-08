![Spotiplay WebPage Layout](quiz/static/quiz/images/Spotiplay%20WebPage%20Layout.png)

# SpotiPlay

## Project Overview

SpotiPlay is a dynamic web-based quiz game that utilizes the Spotify API to generate personalized quizzes based on each user’s listening history and preferences. This project delivers a unique and engaging way to challenge users' knowledge of their favorite songs and artists, deepening their connection with their own musical journey.

## Features

- **User Authentication with Spotify:** Utilizes Spotify's API to facilitate secure and personalized login, tailoring the quiz experience directly to each user's music profile.

- **Quiz Generation:** Creates personalized and customizable quizzes by generating questions from a user's Spotify listening history, testing knowledge of their favorite tracks and artists based on individual music preferences.

- **Leaderboards:** Enhance competition by tracking and displaying users' quiz scores on dynamic leaderboards, fostering a competitive spirit and encouraging user engagement.

- **Responsive Design:** Fully responsive interface, ensuring a seamless experience across various devices including smartphones, tablets, and desktop computers.



## Tech Stack

**Frontend:** JavaScript, CSS, HTML

**Backend:** Python, Django

**Database:** PostreSQL, SQLite

## Spotify API Integration for SpotiPlay

SpotiPlay utilizes the Spotify API to authenticate users and fetch personalized music data for generating quizzes. The app follows the Authorization Code Flow to obtain access tokens, which are then used to access Spotify resources on behalf of the user. Below is a summary of how this process works in the app:

### Authorization Code Flow

1. **User Authorization**: 
   - The app requests authorization from the user by redirecting them to Spotify's authorization endpoint with necessary parameters such as `client_id`, `response_type`, `redirect_uri`, and optional scopes.
   - The user logs in to their Spotify account and grants permission to the app to access their data.

2. **Authorization Response**:
   - After the user grants permission, they are redirected back to the app with an authorization code.
   - If the authorization is successful, the response includes a `code` parameter; otherwise, it includes an `error`.

3. **Exchange Code for Access Token**:
   - The app exchanges the authorization code for an access token by sending a POST request to Spotify's token endpoint.
   - The request includes the `grant_type`, `code`, `redirect_uri`, and appropriate headers for authentication.

4. **Access Token Response**:
   - On success, Spotify returns an access token, which is then used to make API requests to fetch user data.

### Integration with SpotiPlay

- **User Registration and Data Storage**:
  - After successful authentication, the app checks if the user exists in the database. If not, the user is added to store future quiz scores and preferences.

- **Quiz Generation**:
  - Once the quiz customization is done, the app uses the access token to call the Spotify API and fetch the user's top tracks based on selected parameters (e.g., time period).
  - The fetched songs are used to generate the quiz, allowing users to test their knowledge based on their listening history.

### Reference

![Spotify Authorization Code Flow Diagram](https://developer.spotify.com/images/documentation/web-api/auth-code-flow.png)

This process ensures that SpotiPlay provides a personalized quiz experience tailored to each user's unique music tastes and preferences.
## Distinctiveness and Complexity

SpotiPlay sets itself apart by going beyond the usual course projects through its integration with external APIs and enhanced user interaction features:

  - **Integration with Spotify**: Instead of relying on static data, SpotiPlay leverages the Spotify API to access real-time data. This allows users to take quizzes that are personalized to their unique music listening habits, making the experience both engaging and adaptive.

  - **OAuth Authentication**: With OAuth 2.0, SpotiPlay securely connects users to Spotify, handling access and refresh tokens smoothly. This setup ensures that users have seamless access to their personalized data throughout their sessions, maintaining security and data integrity.

  - **Real-time Data Usage**: By leveraging OAuth tokens, SpotiPlay fetches user-specific data from Spotify to create quizzes that reflect the most up-to-date preferences and listening history. Each session is fresh and tailored to the user, providing a unique experience every time.

  - **Quiz Customization**: Users have the freedom to personalize their quizzes by selecting options such as the fetched time period for the song selection catalogue, quiz time limit, snippet duration for each song, and quiz format (multiple choice or open-ended). This level of customization makes each quiz journey engaging and tailored to the user's preferences.

  - **Music Selection Process**: The backend pulls the top 50 songs from a user’s listening history over a chosen time period and randomizes them for quiz questions. This straightforward method ensures that the quiz content is relevant and reflective of the user’s recent interactions with Spotify.

  - **Interactive User Interface**: SpotiPlay’s frontend leverages JavaScript to create an interactive and fluid experience. Based on the options chosen in the quiz customization, users receive immediate feedback on their quiz answers without any page reloads, enhancing engagement and ensuring a seamless experience.

  - **Scoring System**: The app includes a scoring system that rewards users based on how quickly they answer each question. Faster responses earn more points, adding a competitive edge and encouraging quick thinking. Scores are updated in the leaderboard, allowing users to compare their performance with others.

  - **Page Structure**: SpotiPlay features a comprehensive page structure, including a welcome page, quiz page, leaderboard page, and profile page. The welcome page introduces users to the app, the quiz page offers customizable quiz experiences, the leaderboard page displays high scores, and the profile page provides user-specific data and settings.

In summary, SpotiPlay goes beyond the course's typical boundaries by integrating real-time data and offering a dynamic user experience, demonstrating a sophisticated approach to interactive web applications.
## File Structure Overview

### SpotiPlay Project Directory (`spotiplay/`)

- `settings/`: Configuration for different environments (base, development, production).
- `urls.py`: Root URL configurations for the application.
- `wsgi.py`: Entry-point for WSGI-compatible web servers.
- `asgi.py`: Entry-point for ASGI-compatible web servers.

### Quiz Application Directory (`quiz/`)

- `migrations/`: Database migrations files.
- `static/quiz/`: 
  - `css/`: Stylesheets for the quiz.
  - `js/`: JavaScript files for frontend logic.
  - `images/`: Image files.
- `templates/quiz/`: HTML templates for the quiz.
- `models.py`: Database models.
- `views.py`: Request handling and response rendering.
- `urls.py`: URL configurations for the quiz app.

### Other Important Files

- `manage.py`: Django project management utility.
- `requirements.txt`: Python dependencies.
- `.gitignore`: Files and directories ignored by Git.

## How to Run

Clone the project

```powershell
  git clone https://github.com/bonjourmontreal/spotiplay
```

Go to the project directory

```powershell
  cd spotiplay
```

Install dependencies

```powershell
  pip install -r requirements.txt
```

**Create a Spotify App**: To enable Spotify API calls used for authentication and quiz data fetching, you must first create a Spotify app. Detailed instructions are provided in the [Create Spotify App](#create-spotify-app) section.


**Set up your environment:** Ensure you have configured your `.env` file with the required Spotify API credentials and any other necessary settings. Refer to the [Environment Setup](#environment-setup) section below for detailed instructions.


Run the development server

```powershell
  python manage.py runserver
```


## Create Spotify App

- **Access the Spotify Developer Dashboard**: Navigate to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/) and sign in with your Spotify account.

- **Create a New App**:
   - Click on **Create an App**.
   - Provide a name and description for your application.
   - Agree to the terms and conditions, then select **Create**.

- **Configure Your App**:
   - Once your app dashboard opens, select **Edit Settings**.
   - Under the **Redirect URIs** section, add the appropriate  URI: 
        - Developement (recommended): `http://localhost:8000/spotify/callback`
        - Production: `https://<your_production_base_url>/spotify/callback`
   - Save your changes.

For additional guidance, refer to the [official Spotify for Developers documentation](https://developer.spotify.com/documentation/web-api/).

## Environment Setup

To run the SpotiPlay application, create a `.env` file in the project's root directory (`spotiplay/`). This file contains essential environment variables to toggle between development and production settings and to select your database preference.

Key variables for the `.env` file are listed below. Essential settings include Spotify API credentials for basic functionality. Additional variables enable database customization and environment configuration.


### Spotify Authentication Variable

These are necessary for connecting to the Spotify API. Replace the placeholders with your actual Spotify credentials found in your Spotify App.

```ini
SOCIAL_AUTH_SPOTIFY_KEY=<your_spotify_key>
SOCIAL_AUTH_SPOTIFY_SECRET=<your_spotify_secret>
```

### Development Environment Variables

Use these settings for local development. The provided default Django Secret Key should be replaced with a new one for enhanced security. Refer to the [Generate Security Key](#generate-security-key) section for instructions on creating a new key.

```ini
DEV_BASE_URL=http://localhost:8000
DEV_SECRET_KEY='<your_development_secret_key>' 
USE_SQLITE=True # Set to True to use SQLite, or False to use PostgreSQL
```

#### Database Configuration
SQLite is the default database configuration. If PostgreSQL is preferred, set `USE_SQLITE=False` and configure the PostgreSQL development environment variables as follows:

```ini
LOCAL_DB_NAME=<your_local_db_name>
LOCAL_DB_USER=<your_local_db_user>
LOCAL_DB_PASSWORD=<your_local_db_password>
LOCAL_DB_HOST=localhost
LOCAL_DB_PORT=<your_local_db_port>
```

### Production Environment Variables
These settings are used when deploying your application on a production server, like Render. These values should be set on the hosting platform.

```ini
DJANGO_SETTINGS_MODULE=spotiplay.settings.prod

PROD_BASE_URL=<your_production_base_url>
PROD_SECRET_KEY='<your_production_secret_key>'

RENDER_DB_NAME=<your_render_db_name>
RENDER_DB_USER=<your_render_db_user>
RENDER_DB_PASSWORD=<your_render_db_password>
RENDER_DB_HOST=<your_render_db_host>
RENDER_DB_PORT=<your_render_db_port>

DATABASE_URL=postgresql://<your_render_db_user>:<your_render_db_password>@<your_render_db_host>/<your_render_db_name>
```

## Additional Information


### Generate secret key

You can generate a secure Django secret key using Python:

```python
import secrets

# Generate a 50-character secret key
secret_key = secrets.token_urlsafe(50)
print("Your new secret key is:", secret_key)
```

This script creates a 50-character URL-safe string, ideal for use as a Django secret key.


### Important Considerations

- **User Access:** Only users added to the User Management tab on the Spotify for Developers page can fetch their quiz data. The user's name and email (associated with their Spotify account) are required, with a maximum of 25 users allowed access.

- **Quota Restrictions:** Spotify prohibits quizzes, games, or challenges from obtaining an extended quota (beyond 25 users), limiting apps like this to 'Development Mode'.

This application is developed for educational purposes as part of the CS50 Web Programming course's final project.



## Demo


### Youtube Demo:

[![Watch the video](https://img.youtube.com/vi/PgaatV_6GjY/0.jpg)](https://youtu.be/PgaatV_6GjY)

