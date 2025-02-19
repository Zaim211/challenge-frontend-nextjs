# Photo Authentication and Liking App

## Description

This project implements an application that allows users to authenticate, view images, and like photos. The application is built with **Next.js** and uses the **Unsplash API** for fetching images and a **LevelDB** database for storing data. Users can authenticate, see images, and like photos. Liked photos are tracked and indicated with an icon.

## Features

- **Authentication:**
  - Users can authenticate with the following credentials:
    - `muser1/mpassword1` (login success)
    - `muser2/mpassword2` (login success)
    - `muser3/mpassword3` (this account is blocked and will show an error message)
  - Any invalid login credentials will display the message: `Informations de connexion invalides`.

- **Photo Listing:**
  - Displays images fetched from the [Unsplash API](https://unsplash.com/developers).
  - Implements **pagination** or **infinite scrolling** for seamless image loading.

- **Like Functionality:**
  - Users can like or unlike photos.
  - If a photo is already liked, the like icon will be updated to reflect the status.

## Setup

### Prerequisites

- **Node.js** (v16 or above)
- **LevelDB** (for database storage)
- **Unsplash API key** (required for fetching images)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Zaim211/challenge-frontend-nextjs.git
